# 🛡️ ResQ-Her: A Silent Shield, A Strong Voice.

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/annu12340/Haven/blob/main/LICENSE)
[![Built with Next.js](https://img.shields.io/badge/Built%20with-Next.js-000000.svg)](https://nextjs.org/)
[![Built with FastAPI](https://img.shields.io/badge/Built%20with-FastAPI-009688.svg)](https://fastapi.tiangolo.com/)
[![Powered by MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248.svg)](https://www.mongodb.com/atlas)

**ResQ-Her is an AI-powered solution empowering women in abusive situations with discreet help, mental health support, and legal guidance.**

### 🌟 Inspiration

Imagine a person trapped in silence, enduring daily fear and abuse, unable to seek help because their every digital move is monitored. Globally, 1 in 3 women experiences violence in her lifetime, and abusers often control and monitor digital communications, cutting off safe avenues for help.

**ResQ-Her** is an innovative AI solution designed to break this silence by providing three crucial, discreet pathways to safety, support, and legal empowerment—without the risk of exposure.

---

### 💡 Core Solutions

#### **1. Discreet SOS Messaging via Steganography**

When making a direct call or sending a text is too dangerous, ResQ-Her provides a covert communication channel.

* **How it Works:** The app uses an LLM (powered by AWS Bedrock) to expand simple keywords (e.g., "help, scared, locked in") into a complete distress message. This message is then encoded using **steganography**—hidden within an innocent-looking AI-generated image (like a flower or landscape).
* **Safety:** The user shares the visually harmless image on social media. Our system monitors specific channels, decodes the hidden message, and alerts authorities with the structured, prioritized details of the emergency.

#### **2. AI Avatar for Mental Health Support**

Over 80% of women facing abuse are at a higher risk of mental health issues. ResQ-Her provides a confidential, non-judgmental space for emotional recovery.

* **24/7 Confidentiality:** A compassionate, 3D-rendered AI avatar provides immediate mental health support, personalized coping strategies, and relevant resources, ensuring a safe space without the fear of judgment or being overheard.
* **Tailored to Survivors:** The AI is trained to address the unique psychological needs associated with intimate partner violence and trauma.

#### **3. Law Bot with Knowledge of Legal Rights**

Only a fraction of survivors have access to formal legal support. Our Law Bot provides immediate, confidential counsel.

* **Custom Knowledge Base:** The bot is trained on the Indian constitution and other legal documents, stored as vector embeddings in **MongoDB Atlas Vector Search**.
* **Instant Guidance:** Users can ask questions about abuse cases, custody, or property claims, gaining the legal knowledge and confidence to advocate for their rights.

---

### ⚙️ Technical Deep Dive

| Feature | Technologies & Models | Function |
| :--- | :--- | :--- |
| **Backend & API** | Python, FastAPI, Pymongo | Core server logic and API endpoints (e.g., `/encode`, `/decode`, `/text-generation`). |
| **Database & Vector** | MongoDB Atlas Search | Stores user data, distress messages, and acts as the **Vector Store** for the Law Bot's legal knowledge base. |
| **Frontend** | Next.js, TypeScript, Tailwind CSS | High-performance, responsive UI and rendering of the 3D AI Avatar (using GLTF). |
| **AI / LLM** | AWS Bedrock (Titan Text G1), Groq (Gemma) | Powers message expansion, culprit matching (using vector embeddings/cosine similarity), and generates empathetic support poems. |
| **Deployment** | Vercel (Frontend), Render (Backend) | CI/CD and hosting solutions. |

---

### 🚀 Getting Started

Follow these steps to set up and run ResQ-Her locally.

#### **Prerequisites**

* A MongoDB Atlas Cluster
* AWS Configurations (Access Key, Secret Key, Region) for Bedrock and S3
* Groq API Key (for fast inference)
* Clerk Key (for authentication)
* Elevenlabs Key (for text-to-speech)

#### **1. Backend Setup**

1.  **Activate Virtual Environment:**
    ```bash
    python -m venv .venv
    .\.venv\Scripts\Activate # (on Windows)
    # or `source .venv/bin/activate` (on Linux/macOS)
    ```
2.  **Install Dependencies:**
    ```bash
    pip install -r backend/requirements.txt
    ```
3.  **Create `.env` File:**
    ```
    MONGO_ENDPOINT=
    AWS_ACCESS_KEY_ID=
    AWS_SECRET_ACCESS_KEY=
    AWS_REGION=
    S3_BUCKET_NAME=
    GROQ_API_TOKEN=
    ```
4.  **Run the Server:**
    ```bash
    fastapi dev backend/main.py 
    # or uvicorn backend.main:app --reload
    ```
    (View endpoints at `http://127.0.0.1:8000/docs`)

#### **2. Frontend Setup**

1.  **Install Packages:**
    ```bash
    npm install
    ```
2.  **Create `.env.local` File:**
    ```
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
    CLERK_SECRET_KEY=
    NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
    NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
    ```
3.  **Start the Application:**
    ```bash
    npm run dev
    ```
    (Access the app at `http://localhost:3000/`)
