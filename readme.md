# T&C Summarizer

A browser extension that reads Terms & Conditions and Privacy Policies so you don't have to — because nobody actually reads them, and you might have sold a kidney by mistake.

## What it does

Paste any T&C or Privacy Policy page, click **Analyze**, and get back:

- A **safety rating** from 1 (dangerous) to 10 (excellent)
- A plain-English **summary** of what you're agreeing to
- A list of **flags** ranked by severity — data sharing, policy changes, deletion rights, and more

## Tech stack

- **Extension** — Manifest V3, Chrome + Firefox compatible
- **Backend** — FastAPI deployed on Render
- **AI** — Google Gemini 2.5 Flash for policy analysis

## Project structure

```
T-Csummarizer/
├── extension/
│   ├── manifest.json
│   ├── popup.html
│   ├── popup.js
│   ├── background.js
│   ├── content.js
│   └── icons/
└── server/
    ├── main.py
    ├── requirements.txt
    └── runtime.txt
```

## Installation

### Load the extension locally

1. Clone the repo
2. Go to `chrome://extensions`
3. Enable **Developer mode**
4. Click **Load unpacked** and select the `extension/` folder

### Run the backend locally

```bash
cd server
pip install -r requirements.txt
```

Create a `.env` file:

```
G_API_KEY=your_gemini_api_key
```

Start the server:

```bash
uvicorn main:app --reload
```

Then update `API_URL` in `background.js` to `http://localhost:8000/analyze`.and update it in the host_permissions in `manifest.json`

## Usage

1. Navigate to any Terms & Conditions or Privacy Policy page
2. Click the extension icon
3. Hit **Analyze this page**
4. Read the summary — it takes 5 seconds, not 45 minutes

> Note: The backend runs on Render's free tier. First request after inactivity may take up to 50 seconds to wake up.

## API

**POST** `/analyze`

Request:
```json
{ "text": "full policy text here" }
```

Response:
```json
{
  "rating": 7,
  "rating_label": "Good",
  "summary": "Plain English summary of the policy...",
  "critical_flags": [
    {
      "severity": "high",
      "title": "Third-party data sharing",
      "detail": "Your data may be shared with advertising partners."
    }
  ]
}
```

## Why I built this

Companies write T&C documents in a way that guarantees nobody reads them. You just scroll to the bottom and agree. This extension gives you a fighting chance to know what you're actually signing — before you accidentally sell a kidney.


this project done as a side project in free time to refresh json js APIs fetching and web stuff overall with help from AI (claude) in the front end mockups and polishing html css at the end