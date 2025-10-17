import os
import json
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
# --- LLM and Vector Imports ---
from google import genai
from google.genai.errors import APIError
from sentence_transformers import SentenceTransformer
import numpy as np
from typing import List

# --- Database Imports ---
from pymongo import MongoClient
# Change ConnectionError to ConnectionFailure:
from pymongo.errors import ConnectionFailure as MongoConnectionError, ServerSelectionTimeoutError 
from bson.objectid import ObjectId
from backend.mock_legal_data import LEGAL_DATA # Import the mock data

# 1. Initialization and Configuration
load_dotenv()
app = FastAPI(title="ResQ-Her Backend API (Complete)")
# --- ADD CORS MIDDLEWARE HERE ---
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://172.16.0.2:3000",
    "http://localhost:8000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods (GET, POST, etc.)
    allow_headers=["*"],
)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
MONGO_ENDPOINT = os.getenv("MONGO_ENDPOINT")

# Global Database and Model Clients
mongo_client: MongoClient = None
db = None
embedding_model = None # The model for RAG

if not GEMINI_API_KEY:
    print("FATAL ERROR: GEMINI_API_KEY not found. AI endpoints will fail.")

# 2. Database Connection Handlers
@app.on_event("startup")
def startup_db_client():
    """Connects to MongoDB Atlas and loads the embedding model."""
    global mongo_client, db, embedding_model
    
    # 2a. MongoDB Connection
    if not MONGO_ENDPOINT:
        print("FATAL ERROR: MONGO_ENDPOINT not found. Database will be inaccessible.")
    else:
        try:
            mongo_client = MongoClient(MONGO_ENDPOINT)
            db = mongo_client.get_database("resqher_db")
            db.command('ping')
            print("INFO: Successfully connected to MongoDB Atlas!")
        except (MongoConnectionError, ServerSelectionTimeoutError, Exception) as e:
            print(f"FATAL ERROR: Could not connect to MongoDB Atlas. Error: {e}")
            mongo_client = None
            db = None

    # 2b. Load Embedding Model (Open-Source for Zero Cost)
    try:
        # Using a small, efficient model suitable for RAG on CPU
        model_name = 'all-MiniLM-L6-v2'
        embedding_model = SentenceTransformer(model_name)
        print(f"INFO: Successfully loaded embedding model: {model_name}")
    except Exception as e:
        print(f"FATAL ERROR: Could not load SentenceTransformer model. Error: {e}")
        embedding_model = None


@app.on_event("shutdown")
def shutdown_db_client():
    """Closes the MongoDB connection."""
    if mongo_client:
        mongo_client.close()
        print("INFO: MongoDB client closed.")

# 3. Data Models
class UserInput(BaseModel):
    keywords: str

class ExpandedMessage(BaseModel):
    expanded_text: str
    model_used: str

class LawBotRequest(BaseModel):
    question: str

class LawBotResponse(BaseModel):
    answer: str
    sources: List[str]


# 4. Utility Endpoint: Load Legal Data into DB
@app.post("/api/load_legal_data")
def load_legal_data_endpoint():
    """Converts mock legal data into vectors and loads them into MongoDB."""
    global db, embedding_model
    if db is None or embedding_model is None:
        raise HTTPException(status_code=500, detail="Database or Embedding Model not available.")

    try:
        # Create embeddings for all legal data chunks
        text_chunks = LEGAL_DATA
        embeddings = embedding_model.encode(text_chunks, convert_to_numpy=True)
        
        # Prepare documents for MongoDB (text + vector)
        documents = []
        for text, embedding in zip(text_chunks, embeddings):
            documents.append({
                "text": text,
                "embedding": embedding.tolist() # Convert numpy array to list for BSON storage
            })

        # Clear existing data and insert new data
        db.legal_knowledge.delete_many({})
        result = db.legal_knowledge.insert_many(documents)

        # NOTE: For production, you must manually create a Vector Index in MongoDB Atlas!
        # This code only inserts the data. The index creation must be done via the Atlas GUI.

        return {"message": f"Successfully loaded {len(result.inserted_ids)} legal documents.", 
                "note": "A Vector Search Index must be manually configured in MongoDB Atlas."}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Data loading failed: {e}")

# 5. Endpoint 1: Text Expansion (Your working endpoint)
@app.post("/api/expand_message", response_model=ExpandedMessage)
async def expand_message_endpoint(data: UserInput):
    """Takes urgent keywords and expands them into a full, coherent distress message."""
    if not GEMINI_API_KEY:
        raise HTTPException(status_code=500, detail="Server misconfiguration: AI API key is missing.")
        
    try:
        client = genai.Client(api_key=GEMINI_API_KEY)
        
        prompt = (
            "You are an urgent safety assistant. The user is in a high-stress situation "
            "and can only provide short keywords. Expand these keywords into a single, "
            "formal, and detailed distress message suitable for alerting authorities. "
            "Do NOT add any greetings, sign-offs, or questions. The response must be "
            "ONLY the expanded message text. Keywords: " + data.keywords
        )

        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt
        )
        
        return ExpandedMessage(
            expanded_text=response.text.strip(),
            model_used='gemini-2.5-flash'
        )

    except APIError as e:
        raise HTTPException(status_code=500, detail=f"AI API Error: {e}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {e}")


# 6. Endpoint 2: Law Bot (RAG Implementation)
@app.post("/api/law_bot", response_model=LawBotResponse)
async def law_bot_endpoint(request: LawBotRequest):
    """
    Answers legal questions by performing RAG:
    1. Embeds the user question.
    2. Searches MongoDB for relevant legal context.
    3. Uses Gemini to synthesize an answer based on the context.
    """
    global db, embedding_model, GEMINI_API_KEY

    if db is None or embedding_model is None or GEMINI_API_KEY is None:
        raise HTTPException(status_code=500, detail="Law Bot prerequisites (DB/Model/API Key) are not met.")

    try:
        # --- RAG STEP 1: EMBED THE QUERY ---
        query_vector = embedding_model.encode(request.question, convert_to_numpy=True).tolist()

        # --- RAG STEP 2: MOCK VECTOR SEARCH (REPLACE WITH REAL ATLAS SEARCH LATER) ---
        # NOTE: For now, this performs a simple linear scan since real Vector Search 
        # requires a separate API call or the Atlas Index to be set up. 
        # For a full RAG test, you would use MongoDB Atlas Vector Search API here.
        
        # We'll use a simple filter for demonstration purposes.
        # In a real app, you would define your Atlas search index (e.g., "vector_index")
        # and use the aggregation pipeline: $vectorSearch...
        
        # Simulating search by fetching the first 2 documents as context
        relevant_docs = db.legal_knowledge.find().limit(2) 
        
        context_list = [doc['text'] for doc in relevant_docs]
        context_str = "\n---\n".join(context_list)
        
        if not context_str:
             context_str = "No specific legal data found in the knowledge base."


        # --- RAG STEP 3: GENERATE ANSWER WITH CONTEXT ---
        client = genai.Client(api_key=GEMINI_API_KEY)
        
        system_prompt = (
            "You are a helpful and legal-focused AI assistant for women's rights. "
            "Use ONLY the following context to answer the user's question. "
            "If the answer is not in the context, state that clearly."
        )

        user_prompt = f"Context:\n---\n{context_str}\n---\nUser Question: {request.question}"

        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=[user_prompt],
            config={"system_instruction": system_prompt}
        )
        
        return LawBotResponse(
            answer=response.text.strip(),
            sources=context_list # Return the context as sources
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Law Bot query failed: {e}")

# 7. Simple Root Endpoint
@app.get("/")
def read_root():
    return {"status": "ResQ-Her Backend running successfully", "api_version": "v1"}

# NOTE: The missing piece for the Law Bot is the actual vector search index on MongoDB Atlas.
# Once this code is running, the next step is to log into Atlas and configure that index!