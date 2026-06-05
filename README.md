# ACTO SuperAgent — Life Sciences AI Field Rep Assistant

A full-stack AI agent demo built to showcase the exact capabilities of an ACTO AX Engineer role.
Built with FastAPI + React + Anthropic Claude.

## What It Does

Simulates an ACTO SuperAgent — an AI assistant for pharma field reps (MSLs / Sales Reps) during HCP calls.

**5 active skills with live routing:**
- 💊 **Drug Information** — approved indications, mechanism of action, clinical data
- 🗣️ **Objection Handling** — evidence-based responses to physician pushback
- 🗄️ **CRM Action** — Veeva/Salesforce logging and next best action suggestions
- 🛡️ **Compliance Guard** — off-label promotion detection, FDA 21 CFR Part 11 awareness
- 📋 **HCP Profile** — KOL context, engagement history, interaction preferences

**Agent architecture features:**
- Structured JSON output from Claude (skill + reasoning + response + crm_action + compliance_flag)
- Expandable agent reasoning panel on every response
- Streaming endpoint (SSE) available at `/chat/stream`
- Token usage tracking
- Pydantic validation on all inputs
- Full conversation history maintained client-side

---

## Project Structure

```
acto-superagent/
├── backend/
│   ├── main.py              # FastAPI app, /chat and /chat/stream endpoints
│   ├── requirements.txt
│   └── .env.example         # Copy to .env and add your API key
├── frontend/
│   ├── src/
│   │   ├── App.jsx          # Main layout and state management
│   │   ├── config.js        # Skill metadata, quick prompts, HCP data
│   │   ├── hooks/useApi.js  # API communication layer
│   │   └── components/
│   │       ├── Sidebar.jsx  # Skill panel, HCP card, quick prompts
│   │       └── Message.jsx  # User/Agent/System message components
│   ├── index.html
│   ├── vite.config.js       # Proxies /api → localhost:8000
│   └── package.json
└── README.md
```

---

## Setup

### 1. Get your Anthropic API key
Go to https://console.anthropic.com and copy your API key.

### 2. Backend setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate        # Mac/Linux
# OR
venv\Scripts\activate           # Windows

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env
# Open .env and paste your Anthropic API key
```

### 3. Frontend setup

```bash
cd frontend
npm install
```

---

## Running the App

Open **two terminals** in VS Code:

**Terminal 1 — Backend:**
```bash
cd backend
source venv/bin/activate   # or venv\Scripts\activate on Windows
uvicorn main:app --reload --port 8000
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
```

Open http://localhost:5173 in your browser.

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| POST | `/chat` | Full response (returns parsed JSON) |
| POST | `/chat/stream` | Streaming response (SSE) |

### Example request body
```json
{
  "messages": [
    { "role": "user", "content": "What are the approved indications for Keytruda?" }
  ]
}
```

### Example response
```json
{
  "success": true,
  "data": {
    "skill": "Drug Information",
    "reasoning": "Query is about approved FDA indications — routing to Drug Information skill.",
    "response": "Keytruda (pembrolizumab) is approved for 30+ indications...",
    "crm_action": "Log drug inquiry: Keytruda indications discussed.",
    "compliance_flag": null
  },
  "usage": { "input_tokens": 412, "output_tokens": 98 }
}
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| LLM | Anthropic Claude (claude-opus-4-5) |
| Backend | Python, FastAPI, Uvicorn |
| Validation | Pydantic v2 |
| Frontend | React 18, Vite |
| API client | Fetch API with SSE streaming |
| Styling | CSS-in-JS (inline styles + CSS variables) |

---

## Built By
Rachit Raj — built as a demo for the ACTO AX Engineer role.
