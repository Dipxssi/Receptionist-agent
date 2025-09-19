#  Receptionist AI AGENT

## Overview
This project implements a **Domain-Specific AI Intake Agent** using the [OpenMic API](https://docs.openmic.ai/).  
The agent acts as a **Receptionist**  and demonstrates:  
- **Pre-call webhooks** (fetch data before the call)  
- **In-call function calls** (fetch details dynamically during the call)  
- **Post-call webhooks** (log and process call summaries after the call)  

---

## Objective
-  An intake agent that interacts naturally with users.  
- Integrate **OpenMic API** with **custom webhooks**.  
- Support **Bot CRUD operations** via UI.  
- Demonstrate **call flows** (pre-call, in-call, post-call).  

---

## Features
- 🔹 **Bot Management**: Create, update, delete, and list bots.  
- 🔹 **Webhook Support**:  
  - Pre-call: Returns visitor info.  
  - In-call: Fetches dynamic details using custom function calls.  
  - Post-call: Stores summaries, transcripts, and follow-up actions.  
-  **Logs & History**: Displays call metadata, transcripts, and API call results.  


---

## Tech Stack
- **Frontend**: Next.js / React  
- **Backend**: Node.js (Express routes)  
- **API Integration**: OpenMic API  
- **Tools**: ngrok (for exposing local endpoints)  

---

## 🔗 Webhook & Function Flow
### Pre-Call Webhook
- Returns visitor info before the call.  
  

### In-Call Function Call
- Agent requests an ID ( Employee Name).  
- Fetches details in real time via API.  

### Post-Call Webhook
- Logs transcript, call summary, and metadata.  
- Example: Follow-up request  

---

##  Setup & Installation
```bash
# Clone repository
git clone https://github.com/Dipxssi/Receptionist-agent
cd Receptionist-agent

# Install dependencies
npm install

# Run development server
npm run dev
```

Expose local endpoints with **ngrok**:
```bash
ngrok http 3000
```
  

---
  
###  Receptionist Agent
- **Pre-call**: Returns visitor details.  
- **In-call**: Finds employee location by name.  
- **Post-call**: Logs visit details.  

---




