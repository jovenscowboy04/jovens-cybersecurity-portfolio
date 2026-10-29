# Jovens' Personal IT & Cybersecurity Website + CyberBot AI

A modern, responsive, 4-page personal portfolio and interactive AI assistant built for an introductory Information Technology and Cybersecurity course at Kean University.

## Project Structure

```
cybersecurity-portfolio/
├── index.html           # Page 1 — Home: Bio, key interests, interesting fact, CyberBot spotlight
├── about.html           # Page 2 — About Me: Education, skills matrix, hobbies, and privacy callout
├── technology.html      # Page 3 — My Technology Interests: Tools, packet analysis, career goals
├── cybersecurity.html   # Page 4 — My Cybersecurity Awareness: CIA Triad, password manager & MFA, IDS/IPS
├── css/
│   └── styles.css       # Dark cybersecurity theme, responsive layout, and chat widget styling
├── js/
│   ├── main.js          # Mobile navigation drawer toggle & dynamic copyright year
│   └── chatbot.js       # CyberBot engine (Google Gemini API + local offline knowledge base)
└── README.md            # This documentation file
```

## How to View the Website

You can view the website in any browser without needing to install any server or build tools:
1. Open Windows File Explorer and navigate to:
   `C:\Users\Joven\.gemini\antigravity\scratch\cybersecurity-portfolio\`
2. Double-click **`index.html`** to open the site in Google Chrome, Edge, or Firefox.
3. Use the navigation links at the top or buttons on each page to browse through all 4 pages.

## 🤖 Using CyberBot AI (Two Modes)

CyberBot is accessible via the homepage spotlight section or the **`💬 Ask CyberBot`** button in the bottom right of every page:

1. **Local Knowledge Mode (Default, No Setup Required)**:
   - Works immediately offline.
   - Answers questions about Jovens (Kean University, Senior, PC building, Manchester United, Miami Heat, lifting/gym, favorite RPG & multiplayer games, drawing/painting), CIA Triad, and security habits.

2. **Google Gemini Live AI Mode (Full Generative Intelligence)**:
   - Gives CyberBot the exact same reasoning, coding, and conversational power as Google Gemini / Antigravity.
   - Click the **⚙️ Settings icon** at the top of the chat window.
   - Paste a free Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey) and click **Save**.
   - Your key is saved strictly in your browser's private `localStorage` and never shared.
   - CyberBot can now generate code in Python/C/JS, explain complex cybersecurity vulnerabilities, write essays, and answer any open-ended question with multi-turn memory!

## Privacy Compliance

In adherence with the assignment's cybersecurity privacy requirements:
- No sensitive Personally Identifiable Information (home address, phone number, passwords, student ID, SSN, banking info) is published on this site.
- The **About Me** page features a dedicated cybersecurity alert highlighting: *"Think carefully before sharing personal information online"* and explaining how Open Source Intelligence (OSINT) risks can be mitigated.

## Assignment Part 3 — AI Digital Person

The site now includes `digital-person.html` with the required class workflow:

**Upload Photo → Generate Digital Person → Talk to Digital Person → Ask Questions → Receive Answers**

### What works immediately
- Upload and preview a JPG/PNG/WEBP photo.
- Generate a local digital-avatar preview if the external AI endpoint is unavailable.
- Display the digital person on the page.
- Ask questions by typing.
- Use browser speech-to-text in supported browsers (Chrome/Edge work best).
- Receive text answers from the portfolio knowledge base (and Gemini when the existing Gemini key is connected).
- Hear answers with browser text-to-speech and a British-English voice when available.
- The avatar visibly animates while speaking.

### Enabling true AI image generation
A secure Netlify Function is included at `netlify/functions/generate-avatar.mjs`. It calls the OpenAI Images edit endpoint using an environment variable, so the API key is never exposed in browser JavaScript.

1. Deploy this project through a Netlify workflow that deploys Functions (Git-based deploy or Netlify CLI is recommended for Functions).
2. In Netlify, add an environment variable named `OPENAI_API_KEY`.
3. Redeploy the site.
4. Open `digital-person.html`, upload a photo, and press **Generate Digital Person**.

If the function is not configured, the page clearly switches to **LOCAL PREVIEW** rather than pretending an AI generation occurred.


## Assignment 5 – SQL Injection Lab
- `sql-injection-lab.html` compares vulnerable and secure SQL handling in a controlled simulation.
- Demonstrates input validation, parameterized queries, prepared statements, and secure database access.
- The page does not connect to or attack a real database.
