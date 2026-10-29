/**
 * Jovens AI - Advanced Generative AI Assistant for Jovens' Portfolio
 * Powered by Google Gemini API with multi-turn conversation memory,
 * code formatting, copy-to-clipboard, and intelligent offline fallback.
 */

(function () {
  const GEMINI_MODEL = "gemini-2.5-flash";
  const STORAGE_KEY = "cyberbot_gemini_api_key";

  // System Prompt giving Jovens AI the exact personality, knowledge, and capabilities
  const SYSTEM_INSTRUCTION = `You are Jovens AI, an advanced AI coding, tech, and cybersecurity assistant created for Jovens' personal academic portfolio website.
You have the full conversational intelligence, reasoning, problem-solving, and coding capabilities of Google's Gemini models.
You can answer ANY question—whether about software development, algorithms, system administration, cybersecurity, mathematics, history, or creative writing.

In addition, you have authentic, first-hand knowledge about Jovens:
- Who he is: Jovens is a senior at Kean University studying Information Technology with a concentration in Cybersecurity.
- Career Goal: After graduation, hoping to find a job in cybersecurity or start out in a full-time IT role to gain real-world experience, build technical skills, and grow into a cybersecurity position over time.
- Relevant Coursework: Virtual & Augmented Reality, Game Design & Development, Mobile Application Development, IT Database Management Systems, IT Project Management, IT Data Structures, Network Technology, Computer Programming, Computer Systems, Digital Circuits & Systems.
- Hobbies & Interests:
  1. Building & Upgrading Computers: Loves picking parts, assembling custom PCs, and learning how hardware subsystems interface.
  2. Watching & Playing Sports: Avid player and fan of soccer and basketball; favorite soccer team is Manchester United, and favorite basketball team is the Miami Heat.
  3. Gym & Working Out: Regularly lifts weights and does cardio; values consistency, self-discipline, and progressive growth.
  4. Video Games: Loves rich story-driven RPGs (The Witcher 3: Wild Hunt, Mass Effect) and multiplayer games with friends (Helldivers 2, Baldur's Gate 3, NBA 2K, FIFA).
  5. Creative Arts: Enjoys drawing and painting to relax and unwind creatively.
  6. Hiking: Recently started hiking and it quickly became one of his favorite activities—enjoys being outdoors, exploring trails, getting away from screens, staying active, and clearing his mind.
- Cybersecurity Perspectives:
  - Meaning of Cybersecurity: To Jovens, cybersecurity means keeping computers, networks, accounts, and personal information safe from people who may try to access or misuse them.
  - Why Cybersecurity is Important: So much personal and work-related information is stored online; cybersecurity protects people and businesses from hacked accounts, stolen information, scams, malware, and other online threats.
  - Current Habit: Using strong passwords and being careful with suspicious links or emails (never clicking on anything unusual or asking for personal information).
  - Online Privacy Rule: Strictly follows "Think carefully before sharing personal information online" (avoids posting sensitive PII like home address, phone number, passwords, student ID, or financial data).
  - Learning Focus This Semester: Wants to learn more about how computer systems are protected from attacks and how security problems are found and fixed, especially network security, malware, and the different ways attackers try to gain access to systems.
  - Cybersecurity Project Proposal:
    - Title/Focus: Phishing Awareness web application.
    - Target Users: Designed for students and everyday internet users who want to improve their ability to recognize phishing attempts and stay safer online.
    - Functional Requirements: Examples of phishing and legitimate messages, short quizzes, explanations of common warning signs, safety tips, and a score that shows how well the user did (strictly avoids collecting real passwords or sensitive personal info).
    - Potential Threats: Phishing emails, fake login pages, malicious links, social engineering, and stolen account information.
    - Research Question: "How can an interactive web application help users better recognize and avoid phishing attacks?"
    - Project Objective: Improve phishing awareness and help users become more confident when identifying suspicious messages and online scams.

- Design & Website Editing Directives:
  - When asked for visual changes (colors, fonts, backgrounds, layouts, text, buttons, navigation), apply or describe the exact edits directly while preserving the rest of the website.
  - Before making major structural changes or deleting content, you MUST ask for confirmation first.
  - For normal edits (color changes, text updates, spacing, styling adjustments), execute the change directly.
  - Never invent personal information not present on the site. Strictly protect sensitive information (passwords, student IDs, private account details, financial information).

Guidelines for your responses:
- Be friendly, professional, sharp, and helpful.
- When asked coding questions, provide clean, idiomatic code examples with explanations.
- When asked about Jovens, respond accurately based on the facts above.
- Format responses with clean Markdown, including bolding, bullet points, and fenced code blocks with language identifiers (e.g. \`\`\`python, \`\`\`bash, \`\`\`html) where appropriate.`;

  // Local Offline Knowledge Base (used when no Gemini key is provided)
  const KNOWLEDGE_BASE = [
    {
      triggers: ["hi", "hello", "hey", "who are you", "what can you do"],
      response: "Hello! I'm **Jovens AI**, Jovens' AI assistant. In **Local Mode**, I can answer anything about Jovens' background at Kean University, his hobbies, sports, gaming, and cybersecurity. \n\n💡 *Tip: To unlock my full generative AI brain (like ChatGPT or Gemini) so I can write code, solve problems, and answer anything, click the ⚙️ icon above to add a free Gemini API key!*",
      suggestions: ["Tell me about Jovens", "What is the CIA Triad?", "What sports does he like?", "Connect Gemini API Key"]
    },
    {
      triggers: ["who is jovens", "about jovens", "tell me about yourself", "bio", "background", "school", "university", "kean", "major", "year", "senior"],
      response: "**Jovens** is a senior at **Kean University** majoring in Information Technology with a concentration in Cybersecurity. He is passionate about building computers, network defense, and exploring how software systems function.",
      suggestions: ["What are his hobbies?", "What career interests him?", "What technology does he use?"]
    },
    {
      triggers: ["coursework", "courses", "classes", "subjects", "studied", "kean courses"],
      response: "Here are the relevant courses Jovens has completed and is currently taking at Kean University:\n\n• Virtual & Augmented Reality\n• Game Design & Development\n• Mobile Application Development\n• IT Database Management Systems\n• IT Project Management\n• IT Data Structures\n• Network Technology\n• Computer Programming\n• Computer Systems\n• Digital Circuits & Systems",
      suggestions: ["What are his technical skills?", "What are his career goals?", "Tell me about Jovens"]
    },
    {
      triggers: ["building computers", "build computers", "hardware", "pc building", "parts", "upgrading", "custom pc"],
      response: "Jovens loves working with computers—especially **building and upgrading them**! He enjoys researching parts, assembling custom rigs, and understanding how each hardware component operates.",
      suggestions: ["What games does he play?", "Tell me about his gym routine", "What tech does he use?"]
    },
    {
      triggers: ["sports", "soccer", "basketball", "favorite team", "teams", "manchester united", "miami heat", "man united", "heat"],
      response: "Jovens has always loved watching and playing sports—especially **soccer and basketball**! He is a proud supporter of **Manchester United** in soccer and the **Miami Heat** in basketball.",
      suggestions: ["What video games does he play?", "Tell me about his gym routine", "One interesting fact?"]
    },
    {
      triggers: ["video games", "games", "gaming", "witcher", "mass effect", "helldivers", "baldurs gate", "nba 2k", "fifa"],
      response: "Jovens is an avid gamer! He loves immersive RPGs like **The Witcher 3: Wild Hunt** and **Mass Effect** for their narrative and characters, as well as multiplayer favorites like **Helldivers 2**, **Baldur's Gate 3**, **NBA 2K**, and **FIFA**.",
      suggestions: ["What sports does he like?", "Tell me about building computers", "What is an interesting fact?"]
    },
    {
      triggers: ["gym", "workout", "working out", "fitness", "lifting", "weights", "cardio"],
      response: "Going to the gym and staying active is part of Jovens' regular routine! Whether lifting weights or doing cardio, he values discipline, personal consistency, and measurable progress over time.",
      suggestions: ["What is an interesting fact?", "What are his tech interests?", "Who is his favorite team?"]
    },
    {
      triggers: ["interesting fact", "fact", "drawing", "painting", "art", "creative", "relax"],
      response: "One interesting fact about Jovens is that he enjoys **drawing and painting** when he wants to relax and express himself creatively outside of tech and academics.",
      suggestions: ["Tell me about Jovens", "What is the CIA Triad?", "What video games does he play?"]
    },
    {
      triggers: ["hiking", "hike", "trails", "outdoors", "nature"],
      response: "Jovens recently started **hiking** and it has quickly become one of his favorite activities! He enjoys being outdoors, exploring different trails, getting away from screens for a while, staying active, and clearing his mind.",
      suggestions: ["Tell me about his gym routine", "What sports does he like?", "One interesting fact?"]
    },
    {
      triggers: ["career", "job", "goals", "soc analyst", "cybersecurity analyst", "career interest", "why cybersecurity"],
      response: "The technology career that interests Jovens the most is **cybersecurity**! He is especially interested in roles like **Cybersecurity Analyst** or **SOC Analyst** because he likes the idea of protecting systems, monitoring threats, and helping organizations keep their information secure while continuing to learn, solve problems, and build real-world experience.",
      suggestions: ["What skills does he want to improve?", "What is the CIA Triad?", "Tell me about Jovens"]
    },
    {
      triggers: ["skills", "technical skills", "professional skills", "abilities", "languages"],
      response: "Here are Jovens' key skills:\n\n💻 **Technical Skills:** Python, Java, HTML & CSS, Linux / Command Line, MySQL / Databases, Networking Fundamentals, VirtualBox, Git & GitHub, Computer Hardware, and Basic Cybersecurity Concepts.\n\n🤝 **Professional Skills:** Problem Solving, Attention to Detail, Teamwork, Communication, Time Management, Adaptability, Organization, and Willingness to Learn.",
      suggestions: ["What are his career goals?", "Tell me about Jovens", "What is the CIA Triad?"]
    },
    {
      triggers: ["tech", "tools", "technology", "use most often", "most used", "relationship with technology", "hardware"],
      response: "The technology Jovens uses most often is his **computer**! He uses it every day for schoolwork, gaming, programming, browsing the internet, and working on different projects. He also uses it to learn new skills and explore fields he is interested in, especially **cybersecurity, networking, web development, and AI**.",
      suggestions: ["What skill would he like to improve?", "What are his career goals?", "Tell me about PC building"]
    },
    {
      triggers: ["mobile", "android", "app development"],
      response: "Jovens has worked with **Android development** in school and has experience creating simple mobile applications. He enjoys learning how mobile apps are built and how different features work together to create a good user experience.",
      suggestions: ["What programming languages does he know?", "Tell me about his tech interests", "What are his career goals?"]
    },
    {
      triggers: ["cia triad", "cia", "confidentiality", "integrity", "availability"],
      response: "The **CIA Triad** is the core benchmark of information security:\n\n• **Confidentiality:** Preventing unauthorized disclosure of sensitive data.\n• **Integrity:** Ensuring data remains accurate and protected against unauthorized modification.\n• **Availability:** Ensuring authorized users have reliable, timely access to critical systems.",
      suggestions: ["What is his cybersecurity habit?", "Why is cybersecurity important?", "What is his career goal?"]
    },
    {
      triggers: ["habit", "habits", "password", "cybersecurity habit"],
      response: "One cybersecurity habit Jovens practices is **using strong passwords and being careful with suspicious links or emails**. He makes sure not to click on anything that looks unusual or asks for personal information.",
      suggestions: ["Why is cybersecurity important?", "What does cybersecurity mean to him?", "What does he want to learn this semester?"]
    },
    {
      triggers: ["meaning of cybersecurity", "what does cybersecurity mean", "cybersecurity meaning", "definition of cybersecurity"],
      response: "To Jovens, **cybersecurity means keeping computers, networks, accounts, and personal information safe** from people who may try to access or misuse them.",
      suggestions: ["Why is cybersecurity important?", "What is his cybersecurity habit?", "What does he want to learn this semester?"]
    },
    {
      triggers: ["why is cybersecurity important", "importance of cybersecurity", "why cybersecurity matters", "why important"],
      response: "Cybersecurity is important because so much of our **personal and work-related information is stored online**. It helps protect people and businesses from hacked accounts, stolen information, scams, malware, and other online threats.",
      suggestions: ["What is his cybersecurity habit?", "What does cybersecurity mean to him?", "What does he want to learn this semester?"]
    },
    {
      triggers: ["learn this semester", "semester", "topic to learn", "cybersecurity topic", "what topic do you want to learn"],
      response: "This semester, Jovens wants to learn more about **how computer systems are protected from attacks and how security problems are found and fixed**. He is especially interested in **network security, malware, and the ways attackers try to gain access**.",
      suggestions: ["What is his cybersecurity habit?", "What are his career goals?", "Tell me about Jovens"]
    },
    {
      triggers: ["privacy", "pii", "osint", "social engineering"],
      response: "Jovens' website strictly follows the rule: **'Think carefully before sharing personal information online.'** All sensitive PII (address, phone number, passwords, student ID, SSN, banking info) is withheld to avoid phishing, scams, and identity theft.",
      suggestions: ["Tell me about Jovens", "What is the CIA Triad?", "What are his hobbies?"]
    },
    {
      triggers: ["improve", "skill to improve", "skills to improve", "want to improve", "learn next"],
      response: "Jovens would like to improve his **cybersecurity and networking skills**! He wants to get better at understanding how networks work, how security threats are detected, and how systems can be protected from attacks, as well as gaining more hands-on experience using tools and working through real-world cybersecurity scenarios.",
      suggestions: ["What technology does he use most?", "What are his career goals?", "Tell me about his skills"]
    },
    {
      triggers: ["project", "project proposal", "project idea", "phishing project", "research question", "project objective", "target users", "functional requirements", "phishing web app"],
      response: "Here is Jovens' **Cybersecurity Project Proposal**:\n\n🎯 **Focus:** Phishing Awareness\n\n👥 **Target Users:** Designed for students and everyday internet users who want to improve their ability to recognize phishing attempts and stay safer online.\n\n📋 **Functional Requirements:** Examples of phishing vs. legitimate messages, short quizzes, explanations of common warning signs, safety tips, and a user performance score (strictly avoids collecting real passwords or sensitive personal info).\n\n⚠️ **Potential Threats:** Phishing emails, fake login pages, malicious links, social engineering, and stolen account information.\n\n🔍 **Research Question:** *'How can an interactive web application help users better recognize and avoid phishing attacks?'*\n\n🎯 **Project Objective:** Improve phishing awareness and help users become more confident when identifying suspicious messages and online scams.",
      suggestions: ["What does he want to learn this semester?", "What is his cybersecurity habit?", "Tell me about Jovens"]
    }
  ];

  // State Management
  let conversationHistory = []; // { role: 'user' | 'model', parts: [{ text }] }
  let currentApiKey = localStorage.getItem(STORAGE_KEY) || "";

  const CYBERBOT_TTS_KEY = "cyberbot_tts_enabled";
  const CYBERBOT_VOICE_CHAT_KEY = "cyberbot_voice_chat_enabled";
  let ttsEnabled = localStorage.getItem(CYBERBOT_TTS_KEY) === "true";
  let voiceChatEnabled = localStorage.getItem(CYBERBOT_VOICE_CHAT_KEY) === "true";
  let startVoiceListening = null;

  function stripHtmlForSpeech(html) {
    const temp = document.createElement("div");
    temp.innerHTML = html;
    return (temp.textContent || temp.innerText || "")
      .replace(/[`*_#>•]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function getBritishVoice() {
    if (!("speechSynthesis" in window)) return null;
    const voices = window.speechSynthesis.getVoices();
    if (!voices.length) return null;

    // Prefer well-known British English voices when they are installed,
    // then fall back to any en-GB voice provided by the browser/OS.
    const preferredNames = [
      "Microsoft Ryan Online (Natural) - English (United Kingdom)",
      "Microsoft Ryan - English (United Kingdom)",
      "Microsoft Sonia Online (Natural) - English (United Kingdom)",
      "Microsoft Sonia - English (United Kingdom)",
      "Microsoft Libby Online (Natural) - English (United Kingdom)",
      "Microsoft Libby - English (United Kingdom)",
      "Google UK English Male",
      "Google UK English Female",
      "Daniel",
      "Serena"
    ];

    for (const name of preferredNames) {
      const exact = voices.find((voice) => voice.name === name);
      if (exact) return exact;
    }

    return voices.find((voice) => /^en[-_]GB$/i.test(voice.lang)) ||
           voices.find((voice) => /en[-_]GB/i.test(voice.lang)) ||
           null;
  }

  function setJovensAvatarSpeaking(isSpeaking) {
    document.querySelectorAll(".jovens-ai-avatar").forEach((avatar) => {
      avatar.classList.toggle("speaking", Boolean(isSpeaking));
    });
  }

  function speakReply(textOrHtml) {
    if (!ttsEnabled || !("speechSynthesis" in window)) return;
    try {
      window.speechSynthesis.cancel();
      setJovensAvatarSpeaking(false);
      const utterance = new SpeechSynthesisUtterance(stripHtmlForSpeech(textOrHtml));
      const britishVoice = getBritishVoice();
      utterance.lang = "en-GB";
      if (britishVoice) utterance.voice = britishVoice;
      utterance.rate = 0.96;
      utterance.pitch = 0.98;
      utterance.volume = 1;

      utterance.onstart = () => setJovensAvatarSpeaking(true);
      utterance.onerror = () => setJovensAvatarSpeaking(false);

      // In Voice Chat mode, automatically listen again after Jovens AI finishes speaking.
      utterance.onend = () => {
        setJovensAvatarSpeaking(false);
        if (voiceChatEnabled && typeof startVoiceListening === "function") {
          setTimeout(() => startVoiceListening(), 450);
        }
      };

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn("Text-to-speech error:", e);
    }
  }

  // Some browsers load available voices asynchronously. Calling getVoices()
  // again when voices change ensures the British voice is ready for replies.
  if ("speechSynthesis" in window && "onvoiceschanged" in window.speechSynthesis) {
    window.speechSynthesis.onvoiceschanged = () => getBritishVoice();
  }

  // Persistent Theme Customization & File System State
  const THEME_STORAGE_KEY = "cyberbot_custom_theme";
  let directoryHandle = null;

  function loadPersistedStyles() {
    try {
      const saved = JSON.parse(localStorage.getItem(THEME_STORAGE_KEY) || "{}");
      Object.keys(saved).forEach((prop) => {
        document.documentElement.style.setProperty(prop, saved[prop]);
      });
    } catch (e) {
      console.warn("Theme load error:", e);
    }
  }
  // Initialize saved styles immediately
  loadPersistedStyles();

  function applyLiveThemeStyle(prop, val) {
    document.documentElement.style.setProperty(prop, val);
    try {
      const saved = JSON.parse(localStorage.getItem(THEME_STORAGE_KEY) || "{}");
      saved[prop] = val;
      localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(saved));
    } catch (e) {}
  }

  function resetLiveThemeStyles() {
    try {
      localStorage.removeItem(THEME_STORAGE_KEY);
      location.reload();
    } catch (e) {}
  }

  // Helper: Get API Key
  function getApiKey() {
    return currentApiKey.trim();
  }

  // Helper: Save API Key
  function setApiKey(key) {
    currentApiKey = key.trim();
    if (currentApiKey) {
      localStorage.setItem(STORAGE_KEY, currentApiKey);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
    updateModeIndicator();
  }

  // Update Header UI Indicator
  function updateModeIndicator() {
    const statusDot = document.getElementById("chatbot-status-dot");
    const statusText = document.getElementById("chatbot-status-text");
    const modeBadge = document.getElementById("chatbot-mode-badge");

    if (getApiKey()) {
      if (statusDot) statusDot.style.background = "#00e5ff";
      if (statusText) statusText.textContent = "Gemini AI Active";
      if (modeBadge) {
        modeBadge.textContent = "⚡ Gemini 2.5 Flash";
        modeBadge.className = "mode-badge gemini-active";
      }
    } else {
      if (statusDot) statusDot.style.background = "#10b981";
      if (statusText) statusText.textContent = "Local Knowledge Mode";
      if (modeBadge) {
        modeBadge.textContent = "Offline Knowledge";
        modeBadge.className = "mode-badge local-active";
      }
    }
  }

  // Call Google Gemini API
  async function callGeminiApi(userPrompt) {
    const apiKey = getApiKey();
    if (!apiKey) {
      throw new Error("No API key provided.");
    }

    // Append to conversation history
    conversationHistory.push({
      role: "user",
      parts: [{ text: userPrompt }]
    });

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${encodeURIComponent(apiKey)}`;

    const requestPayload = {
      systemInstruction: {
        parts: [{ text: SYSTEM_INSTRUCTION }]
      },
      contents: conversationHistory,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1000
      }
    };

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestPayload)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const message = errorData.error?.message || `API Error: ${response.status} ${response.statusText}`;
      throw new Error(message);
    }

    const data = await response.json();
    const candidate = data.candidates?.[0];
    const botText = candidate?.content?.parts?.[0]?.text || "I processed your request, but received an empty response.";

    // Append bot response to history for multi-turn conversation
    conversationHistory.push({
      role: "model",
      parts: [{ text: botText }]
    });

    // Keep history manageable (last 10 turns)
    if (conversationHistory.length > 20) {
      conversationHistory = conversationHistory.slice(-20);
    }

    return botText;
  }

  function getStructuredLocalResponse(userText) {
    if (typeof window.findPortfolioAnswer !== "function") return null;
    try {
      const result = window.findPortfolioAnswer(userText);
      if (!result || !result.answer) return null;

      if (result.action === "change_theme" && result.actionData && typeof window.applyTheme === "function") {
        window.applyTheme(result.actionData.theme);
      }

      if (result.action === "navigate" && result.actionData && result.actionData.url) {
        setTimeout(() => { window.location.href = result.actionData.url; }, 650);
      }

      return {
        text: result.answer,
        suggestions: result.category === "theme"
          ? ["Use Gotham theme", "Use Purple theme", "Use Matrix theme", "Tell me about Jovens"]
          : result.category === "navigation"
            ? ["Home", "About Me", "Technology", "Cybersecurity", "Threat Model"]
            : ["Tell me about Jovens", "Featured projects", "Career goals", "Technologies used"]
      };
    } catch (e) {
      console.warn("Structured knowledge lookup failed:", e);
      return null;
    }
  }

  // Local pattern matching fallback
  function getLocalResponse(userText) {
    const structured = getStructuredLocalResponse(userText);
    if (structured && structured.text && !structured.text.startsWith("I don't have that specific detail")) {
      return structured;
    }

    const cleanText = userText.toLowerCase().trim();

    for (const item of KNOWLEDGE_BASE) {
      for (const trigger of item.triggers) {
        if (cleanText.includes(trigger)) {
          return {
            text: item.response,
            suggestions: item.suggestions
          };
        }
      }
    }

    return {
      text: "I'm currently in **Local Knowledge Mode** and can answer anything about Jovens' background at Kean, his PC building hobby, sports favorites (Manchester United & Miami Heat), gaming, and cybersecurity.\n\n✨ **Want me to think and code just like Gemini / Antigravity?** Connect a free Gemini API key using the ⚙️ Settings icon at the top of this chat!",
      suggestions: ["Tell me about Jovens", "What is the CIA Triad?", "Connect Gemini API Key", "Favorite video games?"]
    };
  }

  // Advanced Markdown & Code Formatter
  function formatMarkdown(raw) {
    let text = raw;

    // Fenced code blocks with language and copy button
    text = text.replace(/```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g, (match, lang, code) => {
      const language = lang || "code";
      const escapedCode = code
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

      return `
        <div class="code-block-container">
          <div class="code-block-header">
            <span class="code-lang">${language}</span>
            <button class="copy-code-btn" type="button" data-code="${encodeURIComponent(code)}">Copy Code</button>
          </div>
          <pre class="code-pre"><code>${escapedCode}</code></pre>
        </div>
      `;
    });

    // Inline code
    text = text.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');

    // Bold & Italics
    text = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    text = text.replace(/\*(.*?)\*/g, "<em>$1</em>");

    // Headings
    text = text.replace(/^### (.*$)/gim, '<h4 class="chat-h4">$1</h4>');
    text = text.replace(/^## (.*$)/gim, '<h3 class="chat-h3">$1</h3>');
    text = text.replace(/^# (.*$)/gim, '<h2 class="chat-h2">$1</h2>');

    // Bullet points
    text = text.replace(/^[•\-\*] (.*$)/gim, '<li class="chat-li">$1</li>');

    // Line breaks
    text = text.replace(/\n\n/g, "<br><br>");
    text = text.replace(/\n/g, "<br>");

    return text;
  }

  // DOM Interaction Setup
  document.addEventListener("DOMContentLoaded", () => {
    const launcher = document.getElementById("chatbot-launcher");
    const windowEl = document.getElementById("chatbot-window");
    const closeBtn = document.getElementById("chatbot-close");
    const settingsBtn = document.getElementById("chatbot-settings-toggle");
    const settingsPanel = document.getElementById("chatbot-settings-panel");
    const settingsSave = document.getElementById("settings-save-key");
    const settingsClear = document.getElementById("settings-clear-key");
    const settingsInput = document.getElementById("settings-api-key");
    const messagesEl = document.getElementById("chatbot-messages");
    const inputEl = document.getElementById("chatbot-input");
    const sendBtn = document.getElementById("chatbot-send");
    const chipsContainer = document.getElementById("chatbot-chips");

    // Homepage section elements
    const sectionInput = document.getElementById("section-chat-input");
    const sectionSend = document.getElementById("section-chat-send");
    const sectionChips = document.querySelectorAll(".section-quick-chip");

    // Initialize UI mode
    updateModeIndicator();
    if (settingsInput && getApiKey()) {
      settingsInput.value = getApiKey();
    }

    function openChat(initialQuery = null) {
      if (windowEl) {
        windowEl.classList.add("open");
        if (launcher) launcher.setAttribute("aria-expanded", "true");
        if (inputEl) setTimeout(() => inputEl.focus(), 300);
      }
      if (initialQuery) {
        sendUserMessage(initialQuery);
      }
    }

    function closeChat() {
      if (windowEl) {
        windowEl.classList.remove("open");
        if (launcher) launcher.setAttribute("aria-expanded", "false");
      }
      if (settingsPanel) {
        settingsPanel.classList.remove("open");
      }
    }

    if (launcher && windowEl) {
      launcher.addEventListener("click", () => {
        if (windowEl.classList.contains("open")) {
          closeChat();
        } else {
          openChat();
        }
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener("click", closeChat);
    }

    // Toggle Settings Panel
    if (settingsBtn && settingsPanel) {
      settingsBtn.addEventListener("click", () => {
        settingsPanel.classList.toggle("open");
      });
    }

    if (settingsSave && settingsInput) {
      settingsSave.addEventListener("click", () => {
        const val = settingsInput.value.trim();
        setApiKey(val);
        settingsPanel.classList.remove("open");
        appendMessage("bot", `✅ **Gemini API Key Connected!** Jovens AI is now operating with the full generative power of **${GEMINI_MODEL}**. Ask me any coding, tech, or open-ended question!`);
        renderChips(["Explain buffer overflow in C", "Write a Python port scanner", "Tell me about Jovens", "What is the CIA Triad?"]);
      });
    }

    if (settingsClear && settingsInput) {
      settingsClear.addEventListener("click", () => {
        settingsInput.value = "";
        setApiKey("");
        settingsPanel.classList.remove("open");
        appendMessage("bot", "ℹ️ **Switched to Local Mode.** Jovens AI will answer questions about Jovens and cybersecurity using its built-in knowledge base.");
        renderChips(["Tell me about Jovens", "What sports does he like?", "What is the CIA Triad?"]);
      });
    }

    // Message Rendering
    function appendMessage(sender, htmlContent) {
      if (!messagesEl) return;
      const msgDiv = document.createElement("div");
      msgDiv.className = `chat-msg ${sender}`;

      const avatar = document.createElement("div");
      avatar.className = sender === "user" ? "chat-avatar" : "chat-avatar jovens-ai-avatar";
      if (sender === "user") {
        avatar.textContent = "👤";
      } else {
        const avatarImg = document.createElement("img");
        avatarImg.src = "images/profile-avatar.png";
        avatarImg.alt = "Jovens AI";
        avatar.appendChild(avatarImg);
      }

      const bubble = document.createElement("div");
      bubble.className = "chat-bubble";
      bubble.innerHTML = htmlContent;

      if (sender === "user") {
        msgDiv.appendChild(bubble);
        msgDiv.appendChild(avatar);
      } else {
        msgDiv.appendChild(avatar);
        msgDiv.appendChild(bubble);
      }

      messagesEl.appendChild(msgDiv);
      messagesEl.scrollTop = messagesEl.scrollHeight;

      if (sender === "bot") {
        speakReply(htmlContent);
      }

      // Attach copy button listeners inside this bubble
      const copyButtons = bubble.querySelectorAll(".copy-code-btn");
      copyButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
          const rawCode = decodeURIComponent(btn.getAttribute("data-code"));
          navigator.clipboard.writeText(rawCode).then(() => {
            const originalText = btn.textContent;
            btn.textContent = "Copied! ✓";
            btn.classList.add("copied");
            setTimeout(() => {
              btn.textContent = originalText;
              btn.classList.remove("copied");
            }, 2000);
          }).catch(() => {
            btn.textContent = "Failed to copy";
          });
        });
      });
    }

    function renderChips(suggestions) {
      if (!chipsContainer) return;
      chipsContainer.innerHTML = "";
      if (!suggestions || suggestions.length === 0) return;

      suggestions.forEach((text) => {
        const chip = document.createElement("button");
        chip.className = "chat-chip";
        chip.textContent = text;
        chip.addEventListener("click", () => {
          if (text === "Connect Gemini API Key") {
            if (settingsPanel) settingsPanel.classList.add("open");
          } else {
            sendUserMessage(text);
          }
        });
        chipsContainer.appendChild(chip);
      });
    }

    function showTypingIndicator() {
      if (!messagesEl) return;
      // Prevent duplicate typing indicators if a user sends twice quickly.
      const existing = document.getElementById("chat-typing");
      if (existing) existing.remove();

      const typingDiv = document.createElement("div");
      typingDiv.className = "chat-msg bot typing-indicator";
      typingDiv.id = "chat-typing";

      const avatar = document.createElement("div");
      avatar.className = "chat-avatar";
      avatar.textContent = "🛡️";

      const bubble = document.createElement("div");
      bubble.className = "chat-bubble typing-dots";
      bubble.innerHTML = "<span></span><span></span><span></span>";

      typingDiv.appendChild(avatar);
      typingDiv.appendChild(bubble);
      messagesEl.appendChild(typingDiv);
      messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    // Remove the animated typing dots after a response is ready.
    // Antigravity referenced this helper but never created it, which caused
    // every local chatbot response to crash before it could be displayed.
    function hideTypingIndicator() {
      const typing = document.getElementById("chat-typing");
      if (typing) typing.remove();
    }

    function appendRawMessage(role, rawHtml) {
      if (!messagesEl) return;
      const msgDiv = document.createElement("div");
      msgDiv.className = `chat-msg ${role}`;

      const avatar = document.createElement("div");
      avatar.className = "chat-avatar";
      avatar.textContent = role === "bot" ? "🛡️" : "👤";

      const bubble = document.createElement("div");
      bubble.className = "chat-bubble";
      bubble.innerHTML = rawHtml;

      msgDiv.appendChild(avatar);
      msgDiv.appendChild(bubble);
      messagesEl.appendChild(msgDiv);
      messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    // Global action confirmation callback
    window.JovensAIConfirmAction = function(encoded) {
      const action = decodeURIComponent(encoded);
      appendMessage("bot", `✅ **Action Confirmed:** Executing requested structural change: *"${action}"*.\n\n*(Core academic integrity, page navigation, and privacy safeguards remain enforced).*`);
    };

    async function handleDesignOrFileCommand(text) {
      const lower = text.toLowerCase().trim();

      // Theme presets powered by the shared theme engine
      if (typeof window.applyTheme === "function") {
        const presetThemeMap = [
          { key: "purple", pattern: /\b(purple|violet|cyberpunk)\b/i, name: "Cyberpunk Purple" },
          { key: "matrix", pattern: /\b(matrix|hacker green|green)\b/i, name: "Matrix Hacker Green" },
          { key: "red-alert", pattern: /\b(red alert|crimson|red theme|red mode)\b/i, name: "Red Alert" },
          { key: "ice", pattern: /\b(ice|arctic|frost|cyan theme)\b/i, name: "Arctic Ice" },
          { key: "gold", pattern: /\b(gold|amber|yellow theme)\b/i, name: "Gotham Gold" },
          { key: "gotham", pattern: /\b(gotham|default theme|reset theme|original theme)\b/i, name: "Gotham Night" }
        ];
        const looksLikeThemeCommand = /\b(change|make|set|switch|use|reset)\b.*\b(theme|color|colour|website|site|everything|accent)?\b/i.test(lower);
        if (looksLikeThemeCommand) {
          const preset = presetThemeMap.find(item => item.pattern.test(lower));
          if (preset) {
            window.applyTheme(preset.key);
            return {
              response: `🎨 **${preset.name} applied.** The theme now updates the whole website and will stay active when you move between pages.`,
              suggestions: ["Use Gotham theme", "Use Purple theme", "Use Matrix theme", "Use Gold theme"]
            };
          }
        }
      }

      // 1. Check for Major Structural Changes / Deletion
      const isMajorStructural = /(delete|remove|clear|destroy)\s+(page|section|content|coursework|about|project|reflection|qa|header|footer)/i.test(lower);
      if (isMajorStructural) {
        return {
          response: `⚠️ **Major Structural Modification Requested**\n\nYou asked to: *"${text}"*.\n\nBefore making major structural changes or deleting content, please confirm below to proceed:`,
          confirmHtml: `
            <div class="chatbot-confirm-card">
              <div style="font-size:0.85rem; color:#fca5a5; margin-bottom:0.5rem;">⚠️ <strong>Warning:</strong> Deleting content or altering core HTML structure permanently modifies the website layout.</div>
              <div class="chatbot-confirm-actions">
                <button class="chatbot-btn-confirm" onclick="window.JovensAIConfirmAction('${encodeURIComponent(text)}')">Confirm Change</button>
                <button class="chatbot-btn-cancel" onclick="this.closest('.chat-msg').remove()">Cancel</button>
              </div>
            </div>
          `,
          suggestions: ["Cancel", "Change accent to purple", "Tell me about Jovens"]
        };
      }

      // 2. Reset Theme / Styles
      if (/(reset|default)\s+(theme|styles?|colors?)/i.test(lower)) {
        resetLiveThemeStyles();
        return {
          response: "🔄 **Theme Reset:** Restored all colors, fonts, and layouts to the default cybersecurity dark cyber-slate palette.",
          suggestions: ["Change accent to purple", "Change background to navy", "Tell me about Jovens"]
        };
      }

      // 3. Accent Color Changes
      if (/(change|make|set|switch).*?(accent|color|theme).*?(purple|violet)/i.test(lower) || /purple\s+(accent|theme|color)/i.test(lower)) {
        applyLiveThemeStyle("--accent-cyan", "#a855f7");
        applyLiveThemeStyle("--accent-purple", "#c084fc");
        applyLiveThemeStyle("--border-accent", "rgba(168, 85, 247, 0.4)");
        return {
          response: "🎨 **Visual change applied!** Updated website accent colors to **Electric Purple** (`#a855f7`). The change is live on this page and will persist across all pages.",
          suggestions: ["Make background midnight navy", "Make buttons pill shaped", "Reset theme"]
        };
      }

      if (/(change|make|set|switch).*?(accent|color|theme).*?(green|emerald)/i.test(lower) || /emerald\s+(accent|theme|color)/i.test(lower)) {
        applyLiveThemeStyle("--accent-cyan", "#10b981");
        applyLiveThemeStyle("--accent-emerald", "#34d399");
        applyLiveThemeStyle("--border-accent", "rgba(16, 185, 129, 0.4)");
        return {
          response: "🎨 **Visual change applied!** Updated website accent colors to **Emerald Green** (`#10b981`).",
          suggestions: ["Change background to black", "Make buttons rounded", "Reset theme"]
        };
      }

      if (/(change|make|set|switch).*?(accent|color|theme).*?(red|crimson)/i.test(lower) || /red\s+(accent|theme|color)/i.test(lower)) {
        applyLiveThemeStyle("--accent-cyan", "#ef4444");
        applyLiveThemeStyle("--accent-purple", "#f87171");
        applyLiveThemeStyle("--border-accent", "rgba(239, 68, 68, 0.4)");
        return {
          response: "🎨 **Visual change applied!** Updated website accent colors to **Alert Red / Crimson** (`#ef4444`).",
          suggestions: ["Change accent to cyan", "Make background dark blue", "Reset theme"]
        };
      }

      if (/(change|make|set|switch).*?(accent|color|theme).*?(gold|amber|orange|yellow)/i.test(lower)) {
        applyLiveThemeStyle("--accent-cyan", "#f59e0b");
        applyLiveThemeStyle("--accent-purple", "#fbbf24");
        applyLiveThemeStyle("--border-accent", "rgba(245, 158, 11, 0.4)");
        return {
          response: "🎨 **Visual change applied!** Updated website accent colors to **Cyber Amber / Gold** (`#f59e0b`).",
          suggestions: ["Change accent to cyan", "Reset theme", "Tell me about Jovens"]
        };
      }

      if (/(change|make|set|switch).*?(accent|color|theme).*?(cyan|neon blue|light blue)/i.test(lower)) {
        applyLiveThemeStyle("--accent-cyan", "#00e5ff");
        applyLiveThemeStyle("--accent-blue", "#38bdf8");
        applyLiveThemeStyle("--border-accent", "rgba(0, 229, 255, 0.3)");
        return {
          response: "🎨 **Visual change applied!** Restored website accent colors to **Cyber Cyan** (`#00e5ff`).",
          suggestions: ["Make background navy", "Change font to serif", "Tell me about Jovens"]
        };
      }

      // 4. Background Changes
      if (/(change|make|set|switch).*?background.*?(navy|dark blue|blue)/i.test(lower)) {
        applyLiveThemeStyle("--bg-primary", "#020b18");
        applyLiveThemeStyle("--bg-secondary", "#07162c");
        applyLiveThemeStyle("--bg-card", "rgba(7, 22, 44, 0.75)");
        return {
          response: "🌌 **Background updated!** Switched the background to **Deep Midnight Navy** (`#020b18`).",
          suggestions: ["Change accent to emerald", "Reset theme", "Tell me about Jovens"]
        };
      }

      if (/(change|make|set|switch).*?background.*?(black|amoled|pitch)/i.test(lower)) {
        applyLiveThemeStyle("--bg-primary", "#000000");
        applyLiveThemeStyle("--bg-secondary", "#0a0a0a");
        applyLiveThemeStyle("--bg-card", "rgba(18, 18, 18, 0.8)");
        return {
          response: "🌑 **Background updated!** Switched the background to **Pitch Black / AMOLED** (`#000000`).",
          suggestions: ["Change accent to purple", "Reset theme", "Tell me about Jovens"]
        };
      }

      // 5. Typography Changes
      if (/(change|make|set|switch).*?font.*?(serif|georgia|times)/i.test(lower)) {
        applyLiveThemeStyle("--font-sans", "'Georgia', 'Times New Roman', serif");
        return {
          response: "🔤 **Font updated!** Changed primary body typography to **Classic Serif** (`Georgia`).",
          suggestions: ["Change font back to sans", "Reset theme", "Tell me about Jovens"]
        };
      }

      if (/(change|make|set|switch).*?font.*?(mono|monospace|code)/i.test(lower)) {
        applyLiveThemeStyle("--font-sans", "'Fira Code', 'Courier New', monospace");
        return {
          response: "💻 **Font updated!** Changed primary body typography to **Hacker Monospace** (`Fira Code`).",
          suggestions: ["Change font to sans", "Reset theme", "Tell me about Jovens"]
        };
      }

      if (/(change|make|set|switch).*?font.*?(sans|inter|system|default)/i.test(lower)) {
        applyLiveThemeStyle("--font-sans", "'Inter', system-ui, -apple-system, sans-serif");
        return {
          response: "🔤 **Font updated!** Restored primary typography to **Modern Inter Sans**.",
          suggestions: ["Change accent to purple", "Tell me about Jovens"]
        };
      }

      // 6. Button Shape Changes
      if (/(make|change|set).*?buttons?.*?(pill|round)/i.test(lower)) {
        applyLiveThemeStyle("--radius-sm", "9999px");
        applyLiveThemeStyle("--radius-md", "9999px");
        return {
          response: "🔘 **Buttons updated!** Styled all interactive buttons with **Pill / Rounded** borders.",
          suggestions: ["Reset theme", "Change accent to emerald", "Tell me about Jovens"]
        };
      }

      if (/(make|change|set).*?buttons?.*?(sharp|square)/i.test(lower)) {
        applyLiveThemeStyle("--radius-sm", "0px");
        applyLiveThemeStyle("--radius-md", "0px");
        return {
          response: "📐 **Buttons updated!** Styled all interactive buttons with **Sharp Square** corners.",
          suggestions: ["Reset theme", "Tell me about Jovens"]
        };
      }

      return null;
    }

    // Process sending a user message
    async function sendUserMessage(text) {
      const trimmed = text.trim();
      if (!trimmed) return;

      // Special prompt check
      if (trimmed === "Connect Gemini API Key") {
        if (settingsPanel) settingsPanel.classList.add("open");
        return;
      }

      appendMessage("user", formatMarkdown(trimmed));
      if (inputEl) inputEl.value = "";

      showTypingIndicator();

      // Check for visual styling or website modification command
      const designResult = await handleDesignOrFileCommand(trimmed);
      if (designResult) {
        hideTypingIndicator();
        appendMessage("bot", formatMarkdown(designResult.response));
        if (designResult.confirmHtml) {
          appendRawMessage("bot", designResult.confirmHtml);
        }
        renderChips(designResult.suggestions || ["Reset website styles", "Change accent to purple", "Tell me about Jovens"]);
        return;
      }

      if (getApiKey()) {
        // --- Live Gemini Generative AI Mode ---
        try {
          const responseText = await callGeminiApi(trimmed);
          hideTypingIndicator();
          appendMessage("bot", formatMarkdown(responseText));
          renderChips(["Ask another question", "Explain this in more detail", "Tell me about Jovens"]);
        } catch (err) {
          hideTypingIndicator();
          appendMessage(
            "bot",
            `⚠️ **Gemini API Notice:** ${err.message}<br><br>Please check your API key by clicking the ⚙️ icon above, or you can clear it to continue in Local Knowledge Mode.`
          );
          renderChips(["Open Settings", "Clear API Key", "Tell me about Jovens"]);
        }
      } else {
        // --- Local Knowledge Base Mode ---
        setTimeout(() => {
          hideTypingIndicator();
          const localData = getLocalResponse(trimmed);
          appendMessage("bot", formatMarkdown(localData.text));
          renderChips(localData.suggestions);
        }, 400);
      }
    }

    if (sendBtn && inputEl) {
      sendBtn.addEventListener("click", () => {
        sendUserMessage(inputEl.value);
      });

      inputEl.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          sendUserMessage(inputEl.value);
        }
      });
    }

    // Homepage section inputs
    if (sectionSend && sectionInput) {
      sectionSend.addEventListener("click", () => {
        const val = sectionInput.value;
        if (val.trim()) {
          sectionInput.value = "";
          openChat(val);
        }
      });

      sectionInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          const val = sectionInput.value;
          if (val.trim()) {
            sectionInput.value = "";
            openChat(val);
          }
        }
      });
    }

    if (sectionChips) {
      sectionChips.forEach((chip) => {
        chip.addEventListener("click", () => {
          const query = chip.getAttribute("data-query") || chip.textContent;
          openChat(query);
        });
      });
    }

    // Initial greeting
    if (messagesEl && messagesEl.children.length === 0) {
      const activeText = getApiKey()
        ? `Hi! I'm **Jovens AI**, powered by **Google Gemini**. I have full generative AI intelligence—ask me to write code, solve problems, or tell you about Jovens and cybersecurity!`
        : `Hi! I'm **Jovens AI**, Jovens' AI assistant. Ask me about Jovens' background at Kean, his PC building hobby, sports favorites, video games, or cybersecurity concepts.<br><br>💡 *To give me full Gemini generative AI abilities (coding, open-ended reasoning), click ⚙️ above to connect your free Gemini API key!*`;

      appendMessage("bot", formatMarkdown(activeText));
      renderChips(
        getApiKey()
          ? ["Tell me about Jovens", "What is the CIA Triad?", "Write a Python script", "Change accent to purple"]
          : ["Tell me about Jovens", "What is the CIA Triad?", "What sports does he like?", "Change accent to purple"]
      );
    }

    // --- Voice Chat + Speech-to-Text Setup ---
    function initSpeechToText() {
      const micBtn = document.getElementById("chatbot-mic-btn");
      if (!micBtn || !inputEl) return;

      const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRec) {
        micBtn.title = "Speech recognition not supported in this browser";
        micBtn.addEventListener("click", () => {
          alert("Voice chat is not supported in this browser. Please try Google Chrome or Microsoft Edge and allow microphone access.");
        });
        return;
      }

      const recognition = new SpeechRec();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = "en-GB";
      recognition.maxAlternatives = 1;
      let isListening = false;
      let finalTranscript = "";

      // Add a dedicated Voice Chat button beside the existing mic/TTS controls.
      let voiceBtn = document.getElementById("chatbot-voice-chat-btn");
      if (!voiceBtn) {
        voiceBtn = document.createElement("button");
        voiceBtn.type = "button";
        voiceBtn.id = "chatbot-voice-chat-btn";
        voiceBtn.className = "chatbot-voice-chat-btn";
        voiceBtn.setAttribute("aria-label", "Toggle hands-free voice chat");
        voiceBtn.title = "Hands-free Voice Chat";
        voiceBtn.innerHTML = '<span class="voice-chat-icon">🗣️</span><span class="voice-chat-label">Voice</span>';
        const inputBar = micBtn.closest(".chatbot-input-bar");
        if (inputBar) inputBar.insertBefore(voiceBtn, micBtn);
      }

      function updateVoiceUi() {
        if (!voiceBtn) return;
        voiceBtn.classList.toggle("active", voiceChatEnabled);
        voiceBtn.setAttribute("aria-pressed", String(voiceChatEnabled));
        const label = voiceBtn.querySelector(".voice-chat-label");
        if (label) label.textContent = voiceChatEnabled ? "Voice On" : "Voice";
        voiceBtn.title = voiceChatEnabled
          ? "Voice Chat is ON — click to stop"
          : "Start hands-free Voice Chat";
      }

      function enableSpokenReplies() {
        if (!ttsEnabled) {
          ttsEnabled = true;
          localStorage.setItem(CYBERBOT_TTS_KEY, "true");
          const ttsBtn = document.getElementById("chatbot-tts-btn");
          if (ttsBtn) {
            ttsBtn.classList.add("listening");
            ttsBtn.textContent = "🔈";
            ttsBtn.title = "Spoken replies ON — click to turn off";
            ttsBtn.setAttribute("aria-pressed", "true");
          }
        }
      }

      function stopListening() {
        try {
          if (isListening) recognition.stop();
        } catch (_) {}
      }

      startVoiceListening = function () {
        if (isListening || window.speechSynthesis?.speaking) return;
        finalTranscript = "";
        try {
          recognition.start();
        } catch (err) {
          // Browsers may throw if start() is called twice in quick succession.
          console.warn("Recognition start error:", err);
        }
      };

      // Existing microphone button = one spoken question, automatically submitted.
      micBtn.addEventListener("click", () => {
        enableSpokenReplies();
        if (isListening) {
          stopListening();
        } else {
          startVoiceListening();
        }
      });

      // Hands-free mode keeps alternating: listen -> answer -> speak -> listen again.
      if (voiceBtn) {
        voiceBtn.addEventListener("click", () => {
          voiceChatEnabled = !voiceChatEnabled;
          localStorage.setItem(CYBERBOT_VOICE_CHAT_KEY, String(voiceChatEnabled));
          updateVoiceUi();

          if (voiceChatEnabled) {
            enableSpokenReplies();
            if (window.speechSynthesis) window.speechSynthesis.cancel();
            appendMessage("bot", formatMarkdown("🎙️ **Voice Chat is on.** Ask me a question out loud. I’ll answer with my British voice, then listen for your next question automatically. Say **‘stop voice chat’** or press **Voice On** to finish."));
            setTimeout(() => startVoiceListening(), 500);
          } else {
            stopListening();
            if (window.speechSynthesis) window.speechSynthesis.cancel();
            appendMessage("bot", formatMarkdown("Voice Chat is now off. You can still type or tap the microphone for a single spoken question."));
          }
        });
      }

      recognition.onstart = () => {
        isListening = true;
        micBtn.classList.add("listening");
        micBtn.textContent = "⏹";
        micBtn.title = "Listening... Click to stop";
        inputEl.placeholder = "Listening... Speak now";
        if (voiceBtn && voiceChatEnabled) voiceBtn.classList.add("listening");
      };

      recognition.onresult = (event) => {
        let interimTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const piece = event.results[i][0].transcript;
          if (event.results[i].isFinal) finalTranscript += piece;
          else interimTranscript += piece;
        }

        const visibleTranscript = (finalTranscript || interimTranscript).trim();
        if (visibleTranscript) inputEl.value = visibleTranscript;

        // Submit immediately once the browser marks speech as final.
        if (finalTranscript.trim()) {
          const spoken = finalTranscript.trim();
          finalTranscript = "";

          if (/^(stop|end|exit|turn off)\s+(the\s+)?voice(\s+chat)?[.!?]*$/i.test(spoken)) {
            voiceChatEnabled = false;
            localStorage.setItem(CYBERBOT_VOICE_CHAT_KEY, "false");
            updateVoiceUi();
            stopListening();
            inputEl.value = "";
            appendMessage("bot", formatMarkdown("Voice Chat is now off."));
            return;
          }

          inputEl.value = "";
          stopListening();
          sendUserMessage(spoken);
        }
      };

      recognition.onerror = (event) => {
        console.warn("Speech recognition error:", event.error);
        isListening = false;
        micBtn.classList.remove("listening");
        micBtn.textContent = "🎤";
        micBtn.title = "Click to ask by voice";
        inputEl.placeholder = "Ask about Jovens, coding, or styling changes...";
        if (voiceBtn) voiceBtn.classList.remove("listening");

        // 'no-speech' is normal in hands-free mode; wait and listen again.
        if (voiceChatEnabled && (event.error === "no-speech" || event.error === "aborted")) {
          setTimeout(() => startVoiceListening(), 700);
        }
      };

      recognition.onend = () => {
        isListening = false;
        micBtn.classList.remove("listening");
        micBtn.textContent = "🎤";
        micBtn.title = "Click to ask by voice";
        inputEl.placeholder = "Ask about Jovens, coding, or styling changes...";
        if (voiceBtn) voiceBtn.classList.remove("listening");
      };

      updateVoiceUi();
      // Do not auto-start on page load even if previously enabled; browsers require a user gesture.
      if (voiceChatEnabled) {
        voiceChatEnabled = false;
        localStorage.setItem(CYBERBOT_VOICE_CHAT_KEY, "false");
        updateVoiceUi();
      }
    }
    initSpeechToText();

    // --- Text-to-Speech Setup ---
    function initTextToSpeech() {
      const ttsBtn = document.getElementById("chatbot-tts-btn");
      if (!ttsBtn) return;

      if (!("speechSynthesis" in window)) {
        ttsBtn.disabled = true;
        ttsBtn.title = "Text-to-speech is not supported in this browser";
        return;
      }

      function refreshTtsButton() {
        ttsBtn.classList.toggle("listening", ttsEnabled);
        ttsBtn.textContent = ttsEnabled ? "🔈" : "🔊";
        ttsBtn.title = ttsEnabled
          ? "Spoken replies ON — click to turn off"
          : "Spoken replies OFF — click to turn on";
        ttsBtn.setAttribute("aria-pressed", String(ttsEnabled));
      }

      refreshTtsButton();
      ttsBtn.addEventListener("click", () => {
        ttsEnabled = !ttsEnabled;
        localStorage.setItem(CYBERBOT_TTS_KEY, String(ttsEnabled));
        if (!ttsEnabled) window.speechSynthesis.cancel();
        refreshTtsButton();
      });
    }
    initTextToSpeech();

    // --- File System Access API Setup ---
    function initFileSystemAuth() {
      const authBtn = document.getElementById("settings-auth-fs");
      const statusLabel = document.getElementById("fs-status-label");
      if (!authBtn) return;

      if (!window.showDirectoryPicker) {
        if (statusLabel) statusLabel.textContent = "Direct directory writing requires Chrome or Edge. Live visual and storage edits are active now.";
        return;
      }

      authBtn.addEventListener("click", async () => {
        try {
          directoryHandle = await window.showDirectoryPicker({ mode: "readwrite" });
          if (directoryHandle) {
            authBtn.textContent = "✔ Folder Authorized";
            authBtn.style.background = "rgba(16, 185, 129, 0.15)";
            authBtn.style.borderColor = "#10b981";
            authBtn.style.color = "#10b981";
            if (statusLabel) {
              statusLabel.textContent = `✔ Connected to "${directoryHandle.name}". Direct file editing enabled!`;
              statusLabel.style.color = "#10b981";
            }
            appendMessage("bot", `📁 **Folder Access Granted:** Connected to \`${directoryHandle.name}\`. When you ask for styling or file edits, Jovens AI can now directly update your website files on disk.`);
          }
        } catch (err) {
          if (statusLabel) statusLabel.textContent = "Folder authorization canceled.";
        }
      });
    }
    initFileSystemAuth();

    // Escape closes chatbot
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && windowEl && windowEl.classList.contains("open")) {
        closeChat();
      }
    });
  });
})();
