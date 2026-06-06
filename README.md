# ResQ-Her

ResQ-Her is a survivor-first safety platform designed for situations where asking for help has to be quiet, fast, and trusted. The product combines discreet SOS generation, steganography-ready alert packaging, mental health support flows, and legal guidance into one web/mobile-oriented system.

The project was built as a polished AI safety hub with a low-attention interface, practical emergency workflows, and privacy-sensitive design decisions.

## Product Highlights

- Silent SOS flow that expands short distress fragments into responder-ready alert language.
- Steganography-oriented message packaging for scenarios where direct communication may be unsafe.
- Care companion screen for calm, trauma-aware support prompts and guided coping flows.
- Legal rights assistant concept with source-aware answers for sensitive questions.
- Modern Next.js interface with focused emergency, support, and guidance screens.
- FastAPI backend foundation for AI routes, encoding/decoding utilities, and data workflows.

## Tech Stack

| Area | Tools |
| --- | --- |
| Frontend | Next.js, React, TypeScript, Tailwind CSS |
| Backend | Python, FastAPI, Pydantic |
| Data | MongoDB / vector-search-ready data layer |
| AI | LLM-assisted message expansion and support flows |
| Utilities | Steganography helpers, prompt utilities, logging |

## Repository Structure

```text
ResQ-Her/
|-- frontend/          # Next.js product interface
|-- backend/           # FastAPI app, schemas, AI utilities, data helpers
|-- LICENSE
`-- README.md
```

## Key Screens

- Dashboard overview for the safety operating system.
- Silent SOS builder for emergency signal generation.
- Legal rights bot for structured legal guidance.
- Care companion for emotional support and grounding prompts.

Screenshots for this project are showcased in my portfolio:

```text
https://rajtiwari0202.github.io/my_portfolio/
```

## Local Setup

### Backend

```bash
cd backend
python -m venv .venv
```

Windows:

```powershell
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn main:app --reload
```

macOS/Linux:

```bash
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

The API runs at:

```text
http://127.0.0.1:8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The web app runs at:

```text
http://localhost:3000
```

## Environment Variables

Create environment files for the services you run locally. Typical backend values include:

```env
MONGO_ENDPOINT=
GEMINI_API_KEY=
GROQ_API_KEY=
```

Frontend authentication/provider keys depend on the deployment target and can be configured through the Next.js environment system.

## Engineering Notes

- The product is intentionally calm and low-friction because emergency workflows should not feel like a complex dashboard.
- SOS generation is separated from message packaging so each part can be improved independently.
- The legal and care flows are designed as source-aware/supportive assistants rather than generic chat screens.
- Backend utilities are organized around reusable AI, embedding, common helper, and steganography modules.

## Portfolio Context

This project appears in my portfolio as a safety-tech case study focused on:

- Silent SOS flows
- AI-assisted support
- Legal guidance UX
- Privacy-sensitive product design

## Author

Raj Tiwari  
GitHub: https://github.com/Rajtiwari0202  
Portfolio: https://rajtiwari0202.github.io/my_portfolio/
