/**
 * Jovens Vilbrun - Portfolio Knowledge Base & Intent Matching Engine
 * 
 * Provides verified portfolio information, cybersecurity fundamentals,
 * navigation intents, and theme commands for the Jovens AI AI assistant.
 */

const PORTFOLIO_KNOWLEDGE = {
  profile: {
    name: "Jovens Vilbrun",
    title: "Cybersecurity & Information Technology Specialist",
    university: "Kean University",
    status: "Senior Undergraduate",
    degree: "B.S. in Information Technology",
    concentration: "Cybersecurity",
    location: "Elizabeth, New Jersey",
    bio: "Jovens Vilbrun is an IT Senior at Kean University concentrating in Cybersecurity. He is passionate about defensive security, SOC operations, network protection, and building secure web applications that protect everyday users.",
    careerGoals: "Interested in starting a career as a Cybersecurity Analyst or SOC Analyst, while also remaining open to a full-time IT role that builds practical experience and technical skills.",
    interests: [
      "Cybersecurity",
      "Networking",
      "Linux",
      "Programming",
      "Phishing Awareness",
      "Web Development",
      "Computer Hardware"
    ]
  },

  coursework: [
    "Virtual & Augmented Reality",
    "Game Design & Development",
    "Mobile Application Development",
    "IT Database Management Systems",
    "IT Project Management",
    "IT Data Structures",
    "Network Technology",
    "Computer Programming",
    "Computer Systems",
    "Digital Circuits & Systems"
  ],

  skills: {
    security: [
      "Cybersecurity Fundamentals",
      "Phishing Awareness",
      "Access Control & Risk Awareness",
      "Networking Fundamentals",
      "Security-focused Web Projects"
    ],
    technical: [
      "Python",
      "Java",
      "HTML & CSS",
      "MySQL / SQL",
      "Git",
      "Linux Command Line"
    ],
    systems: [
      "Windows",
      "macOS",
      "Linux in VirtualBox",
      "TCP/IP, IP Addressing & DNS",
      "VS Code",
      "Android Studio",
      "Unity",
      "Roblox Studio"
    ]
  },

  projects: [
    {
      title: "Travel Destination Guide",
      status: "HTML & CSS Web Design Project",
      objective: "Help visitors explore and compare destinations around the world using dedicated destination pages with visual and practical trip-planning information.",
      technologies: ["HTML", "CSS", "Responsive Web Design"],
      deliverables: ["Destination pages", "Photo galleries", "Sample itineraries", "Attraction guides", "Budget planning tables"]
    },
    {
      title: "Budget Buddy",
      status: "Android Application Project",
      objective: "Help users organize expenses by category, work with a monthly spending limit, reset data, and review a summary of their budget.",
      technologies: ["Java", "Android Studio", "SharedPreferences"],
      deliverables: ["Expense categories", "Monthly limit", "Reset function", "Stored preferences", "Summary screen"]
    },
    {
      title: "Lava Leap",
      status: "Android Studio 2D Mobile Game",
      objective: "A 2D mobile game where players jump across moving platforms while lava rises beneath them, collect coins, use power-ups, and try to survive long enough to beat their personal high score.",
      technologies: ["Java", "Android Studio", "2D Game Development"],
      deliverables: ["Moving platform gameplay", "Rising lava hazard", "Coin collection", "Increasing difficulty", "Power-ups", "High-score system"]
    }
  ],

  cyberConcepts: {
    ciaTriad: {
      title: "The CIA Triad",
      explanation: "The cornerstone of information security consisting of Confidentiality (preventing unauthorized access through encryption, access control, and least privilege), Integrity (maintaining data accuracy and preventing tampering through hashing, digital signatures, and checksums), and Availability (ensuring authorized users have timely access through redundancy, backups, and DDoS mitigation)."
    },
    defenseInDepth: {
      title: "Defense in Depth",
      explanation: "A layered defensive architecture ensuring that if one security barrier is breached (such as perimeter firewalls), subsequent controls (endpoint detection, network segmentation, strong authentication, and user awareness) prevent total compromise."
    },
    phishing: {
      title: "Phishing Recognition & Defense",
      explanation: "Phishing relies on social engineering and deceptive cues. Always inspect the exact sender domain (not just display name), look for artificial urgency, hover over hyperlinks to inspect destination URLs, check for mismatched SSL/TLS certificates, and never enter credentials on links received unexpectedly."
    },
    passwordsMfa: {
      title: "Authentication & MFA",
      explanation: "Strong authentication requires multi-factor authentication (MFA/2FA) utilizing at least two distinct factors: something you know (passphrase), something you have (authenticator app or security key), or something you are (biometrics). Use password managers and avoid reusing credentials across accounts."
    },
    malware: {
      title: "Malware Defense",
      explanation: "Defending against ransomware, trojans, worms, and spyware requires continuous OS patching, principle of least privilege, disabling macro execution by default, deploying endpoint protection (EDR), and maintaining immutable offline backups."
    },
    zeroTrust: {
      title: "Zero Trust Architecture",
      explanation: "The security model based on the principle of 'Never Trust, Always Verify'. Every access request—regardless of whether it originates inside or outside the network perimeter—must be authenticated, authorized, and continuously validated before access is granted."
    }
  },

  pages: {
    home: {
      url: "index.html",
      title: "Home / Overview",
      description: "Executive summary of Jovens' cybersecurity portfolio, core specializations, featured projects, and contact points."
    },
    about: {
      url: "about.html",
      title: "About Jovens Vilbrun",
      description: "Academic background at Kean University, completed coursework, career goals, technical skill matrix, and personal philosophy."
    },
    technology: {
      url: "technology.html",
      title: "Technology & Security Principles",
      description: "In-depth explorations of modern technology, ethical computing, defensive security systems, and industry perspectives."
    },
    cybersecurity: {
      url: "cybersecurity.html",
      title: "Cybersecurity Specialization & Project Proposal",
      description: "Cybersecurity awareness, defense fundamentals, threat mitigation, and the Phishing Awareness web application proposal."
    },
    threatModel: {
      url: "threat-model.html",
      title: "Assignment 2 - Website Threat Model",
      description: "A STRIDE-based threat model covering the website architecture, trust boundaries, assets, risks, and mitigations for the portfolio and Jovens AI."
    },
    phishingML: {
      url: "phishing-ml-project.html",
      title: "Computer Security Kaggle Project - Phishing URL Detection",
      description: "A machine-learning security project using a Kaggle phishing URL dataset, EDA, preprocessing, Logistic Regression, Random Forest, evaluation metrics, feature importance, and security interpretation."
    },
    assignment6: {
      url: "assignment6.html",
      title: "Assignment 6 - XSS Security & AI Research",
      description: "A controlled XSS security lab plus a research-oriented phishing detection experiment comparing a baseline Logistic Regression model with imbalance-aware improved methods."
    },
    sqlInjectionLab: {
      url: "sql-injection-lab.html",
      title: "Assignment 5 - SQL Injection Lab",
      description: "A controlled educational comparison of vulnerable and secure SQL handling using input validation, parameterized queries, prepared statements, and secure database access."
    }
  }
};

/**
 * Intelligent intent matching for the Jovens AI assistant
 * Returns { answer, action, actionData, category }
 */
function findPortfolioAnswer(rawQuery) {
  if (!rawQuery || typeof rawQuery !== "string") {
    return {
      answer: "I am ready to assist. You can ask me about Jovens' background, coursework, cybersecurity projects, or tell me to change the site theme!",
      category: "prompt"
    };
  }

  const query = rawQuery.trim().toLowerCase();

  // 1. Check for Navigation Intents
  if (/\b(go to|take me to|navigate to|open|show me|visit|switch to)\b.*(home|main|overview)/i.test(query) || query === "home") {
    return {
      answer: "Navigating to the Home page...",
      action: "navigate",
      actionData: { url: "index.html", pageName: "Home" },
      category: "navigation"
    };
  }

  if (/\b(go to|take me to|navigate to|open|show me|visit|switch to)\b.*(about|bio|background|who is jovens|education)/i.test(query) || query === "about" || query === "about me") {
    return {
      answer: "Navigating to the About Me page...",
      action: "navigate",
      actionData: { url: "about.html", pageName: "About Me" },
      category: "navigation"
    };
  }

  if (/\b(go to|take me to|navigate to|open|show me|visit|switch to)\b.*(tech|technology|systems|principles|questions)/i.test(query) || query === "technology" || query === "tech") {
    return {
      answer: "Navigating to the Technology page...",
      action: "navigate",
      actionData: { url: "technology.html", pageName: "Technology" },
      category: "navigation"
    };
  }

  if (/\b(go to|take me to|navigate to|open|show me|visit|switch to)\b.*(cyber|cybersecurity|security|project|phishing)/i.test(query) || query === "cybersecurity" || query === "cyber") {
    return {
      answer: "Navigating to the Cybersecurity page...",
      action: "navigate",
      actionData: { url: "cybersecurity.html", pageName: "Cybersecurity" },
      category: "navigation"
    };
  }

  if (/\b(go to|take me to|navigate to|open|show me|visit|switch to)\b.*(threat model|threat-model|stride|assignment 2)/i.test(query) || query === "threat model" || query === "stride") {
    return {
      answer: "Navigating to the Threat Model page...",
      action: "navigate",
      actionData: { url: "threat-model.html", pageName: "Threat Model" },
      category: "navigation"
    };
  }


  if (/\b(go to|take me to|navigate to|open|show me|visit|switch to)\b.*(secure architecture|web architecture|assignment 3|architecture)/i.test(query) || query === "secure architecture" || query === "assignment 3") {
    return {
      answer: "Opening Jovens' **Secure Web Architecture** page.",
      action: "navigate",
      actionData: { url: "secure-architecture.html", pageName: "Secure Web Architecture" },
      category: "navigation"
    };
  }

  if (/\b(secure web architecture|secure architecture|assignment 3|frontend|web server|application layer|session management|input validation)\b/i.test(query)) {
    return {
      answer: "Jovens' **Secure Web Architecture** page explains a proposed secure design for the portfolio and Jovens AI. It covers the frontend, Netlify web hosting, a backend/application layer, database, authentication, authorization, HTTPS encryption, secure sessions, and input validation. The page also explains how each security control protects the system.",
      category: "secure-architecture"
    };
  }

  if (/\b(threat model|stride|threat modeling|assignment 2|security threats)\b/i.test(query)) {
    return {
      answer: "Jovens' **Threat Model** uses the **STRIDE** framework to analyze the portfolio and Jovens AI. It documents the system architecture, trust boundaries, important assets, and threats including XSS, API-key exposure, prompt injection, unauthorized modification, information leakage, denial of service, voice privacy, and malicious commands. Each threat includes a risk level and mitigation strategy. You can open the full page from the navigation bar.",
      category: "threat-model"
    };
  }


  if (/\b(go to|take me to|navigate to|open|show me|visit|switch to)\b.*(phishing ml|machine learning project|kaggle project|phishing project)/i.test(query) || query === "phishing ml" || query === "kaggle project") {
    return {
      answer: "Opening Jovens' **Phishing URL Detection ML Project** page.",
      action: "navigate",
      actionData: { url: "phishing-ml-project.html", pageName: "Phishing ML Project" },
      category: "navigation"
    };
  }

  if (/\b(phishing ml|machine learning|logistic regression|random forest|kaggle dataset|phishing url detection|roc-auc|confusion matrix)\b/i.test(query)) {
    return {
      answer: "Jovens' **Phishing URL Detection** project analyzes 160,064 Kaggle URL records using EDA, preprocessing, Logistic Regression, and Random Forest. The page reports precision, recall, F1-score, ROC-AUC, confusion matrices, false-positive/false-negative meaning, feature importance, and an important limitation: the dataset contains unusually strong class-separation patterns, so perfect test scores should not be assumed to represent real-world performance.",
      category: "phishing-ml"
    };
  }


  if (/\b(go to|take me to|navigate to|open|show me|visit|switch to)\b.*(assignment 6|xss lab|xss security|ai research|research experiment)/i.test(query) || query === "assignment 6" || query === "xss lab") {
    return {
      answer: "Opening Jovens' **Assignment 6: XSS Security & AI Research** page.",
      action: "navigate",
      actionData: { url: "assignment6.html", pageName: "Assignment 6" },
      category: "navigation"
    };
  }

  if (/\b(assignment 6|cross-site scripting|xss|output encoding|research baseline|research improvement|ablation)\b/i.test(query)) {
    return {
      answer: "Jovens' **Assignment 6** combines two security research components. The XSS section safely demonstrates input validation, output encoding, and secure handling of user-generated content without executing submitted code. The AI research section uses the phishing URL dataset to compare a simple Logistic Regression baseline with expanded, class-balanced Logistic Regression and Random Forest methods under the same stratified test split. It also includes an ablation test and discusses why strong dataset signals limit real-world generalization.",
      category: "assignment6"
    };
  }

  if (/\b(go to|take me to|navigate to|open|show me|visit|switch to)\b.*(sql injection|sql lab|injection lab|assignment 5)/i.test(query) || query === "sql injection lab" || query === "assignment 5") {
    return {
      answer: "Opening Jovens' **SQL Injection Lab** page.",
      action: "navigate",
      actionData: { url: "sql-injection-lab.html", pageName: "SQL Injection Lab" },
      category: "navigation"
    };
  }

  if (/\b(sql injection|parameterized quer(y|ies)|prepared statement|secure database access|assignment 5)\b/i.test(query)) {
    return {
      answer: "Jovens' **SQL Injection Lab** compares a vulnerable query-building pattern with a secure implementation. The lab demonstrates input validation, parameterized queries, prepared statements, and least-privilege database access in a controlled simulation that does not connect to a real database.",
      category: "sql-injection-lab"
    };
  }

  // 2. Check for Theme Control Intents
  const themeMatches = [
    { pattern: /\b(theme.*(matrix|green|terminal|hacker)|(matrix|green).*theme)\b/i, theme: "matrix", name: "Matrix Hacker Green" },
    { pattern: /\b(theme.*(purple|neon purple|cyberpunk|synthwave)|(purple).*theme)\b/i, theme: "purple", name: "Cyberpunk Purple" },
    { pattern: /\b(theme.*(red|alert|crimson|danger)|(red|alert|crimson).*theme)\b/i, theme: "red-alert", name: "Red Alert Emergency" },
    { pattern: /\b(theme.*(ice|arctic|frost|cyan|light blue)|(ice|arctic|frost).*theme)\b/i, theme: "ice", name: "Arctic Ice Cyber" },
    { pattern: /\b(theme.*(gold|amber|yellow|batman gold)|(gold|amber).*theme)\b/i, theme: "gold", name: "Gotham Gold Luxury" },
    { pattern: /\b(theme.*(gotham|default|blue|original|reset|standard)|(gotham|default|blue).*theme)\b/i, theme: "gotham", name: "Gotham Night (Default)" }
  ];

  for (const tm of themeMatches) {
    if (tm.pattern.test(query) || query === `make it ${tm.theme}` || query === `set theme to ${tm.theme}`) {
      return {
        answer: `Applied the **${tm.name}** theme across the Batcomputer terminal. You can switch to any other theme anytime!`,
        action: "change_theme",
        actionData: { theme: tm.theme, name: tm.name },
        category: "theme"
      };
    }
  }

  // 3. Knowledge Matching: Identity & Background
  if (/\b(who (is|are)|tell me about (jovens|yourself|him)|who made this|who created|portfolio owner)\b/i.test(query)) {
    return {
      answer: `**${PORTFOLIO_KNOWLEDGE.profile.name}** is a senior undergraduate Information Technology student at **${PORTFOLIO_KNOWLEDGE.profile.university}** concentrating in **${PORTFOLIO_KNOWLEDGE.profile.concentration}**, based in ${PORTFOLIO_KNOWLEDGE.profile.location}.\n\nHe is building skills in cybersecurity, networking, Linux, programming, and user awareness through coursework and hands-on projects.`,
      category: "profile"
    };
  }

  // University & Education
  if (/\b(school|university|college|kean|degree|major|concentration|education|senior|graduation)\b/i.test(query)) {
    return {
      answer: `Jovens attends **${PORTFOLIO_KNOWLEDGE.profile.university}** as a **${PORTFOLIO_KNOWLEDGE.profile.status}** pursuing a **${PORTFOLIO_KNOWLEDGE.profile.degree}** with a concentration in **${PORTFOLIO_KNOWLEDGE.profile.concentration}**.\n\nHis academic curriculum blends hands-on networking, programming, data structures, and computer security principles.`,
      category: "education"
    };
  }

  // Coursework
  if (/\b(course|courses|class|classes|coursework|subjects|studies)\b/i.test(query)) {
    const list = PORTFOLIO_KNOWLEDGE.coursework.map(c => `• ${c}`).join("\n");
    return {
      answer: `Here is the relevant coursework completed & ongoing by Jovens Vilbrun at Kean University:\n\n${list}\n\nThese courses build a foundation spanning software engineering, system architecture, database security, and network administration.`,
      category: "coursework"
    };
  }

  // Career Goals & Aspirations
  if (/\b(career|job|goal|aspirations|future|work|role|soc|analyst|hire)\b/i.test(query)) {
    return {
      answer: `Jovens is targeting roles in **Cyber Defense**, specifically:\n\n• **Security Operations Center (SOC) Analyst** (Tier 1 / Tier 2)\n• **Incident Responder & Threat Triage Specialist**\n• **Information Security Associate / Defensive Engineer**\n\nHe is passionate about monitoring real-time telemetry, analyzing anomalous traffic, investigating security alerts, and hardening systems.`,
      category: "career"
    };
  }

  // Skills & Technologies
  if (/\b(skill|skills|technologies|tools|languages|python|javascript|linux|wireshark|sql|powershell|bash)\b/i.test(query)) {
    const secList = PORTFOLIO_KNOWLEDGE.skills.security.map(s => `• ${s}`).join("\n");
    const techList = PORTFOLIO_KNOWLEDGE.skills.technical.map(s => `• ${s}`).join("\n");
    const sysList = PORTFOLIO_KNOWLEDGE.skills.systems.map(s => `• ${s}`).join("\n");
    return {
      answer: `Here is a summary of Jovens' core skill sets:\n\n**Cybersecurity & Defense:**\n${secList}\n\n**Languages & Development:**\n${techList}\n\n**Systems & Networking:**\n${sysList}`,
      category: "skills"
    };
  }

  // Projects & Proposals
  if (/\b(travel|destination|travel guide|itinerary|trip|budget table)\b/i.test(query)) {
    const proj = PORTFOLIO_KNOWLEDGE.projects[0];
    return {
      answer: `**${proj.title}** is Jovens' HTML and CSS travel website.\n\n• **Purpose:** ${proj.objective}\n• **Features:** ${proj.deliverables.join(", ")}\n• **Technologies:** ${proj.technologies.join(", ")}`,
      category: "projects"
    };
  }

  if (/\b(project|projects|capstone|web app|application|game)\b/i.test(query)) {
    const items = PORTFOLIO_KNOWLEDGE.projects.map(p => `• **${p.title}** — ${p.objective}`).join("\n");
    return {
      answer: `Jovens' featured projects include:\n\n${items}`,
      category: "projects"
    };
  }

  // CIA Triad
  if (/\b(cia|triad|confidentiality|integrity|availability)\b/i.test(query)) {
    return {
      answer: `**${PORTFOLIO_KNOWLEDGE.cyberConcepts.ciaTriad.title}:**\n${PORTFOLIO_KNOWLEDGE.cyberConcepts.ciaTriad.explanation}`,
      category: "concepts"
    };
  }

  // Phishing Recognition
  if (/\b(phishing|scam|suspicious email|fake link|social engineering|spoof)\b/i.test(query)) {
    return {
      answer: `**${PORTFOLIO_KNOWLEDGE.cyberConcepts.phishing.title}:**\n${PORTFOLIO_KNOWLEDGE.cyberConcepts.phishing.explanation}`,
      category: "concepts"
    };
  }

  // Passwords & MFA
  if (/\b(password|passwords|mfa|2fa|authentication|credential)\b/i.test(query)) {
    return {
      answer: `**${PORTFOLIO_KNOWLEDGE.cyberConcepts.passwordsMfa.title}:**\n${PORTFOLIO_KNOWLEDGE.cyberConcepts.passwordsMfa.explanation}`,
      category: "concepts"
    };
  }

  // Malware & Ransomware
  if (/\b(malware|virus|ransomware|trojan|worm|spyware)\b/i.test(query)) {
    return {
      answer: `**${PORTFOLIO_KNOWLEDGE.cyberConcepts.malware.title}:**\n${PORTFOLIO_KNOWLEDGE.cyberConcepts.malware.explanation}`,
      category: "concepts"
    };
  }

  // Zero Trust & Network Security
  if (/\b(zero trust|network security|firewall|wireshark|defense in depth)\b/i.test(query)) {
    return {
      answer: `**${PORTFOLIO_KNOWLEDGE.cyberConcepts.zeroTrust.title}:**\n${PORTFOLIO_KNOWLEDGE.cyberConcepts.zeroTrust.explanation}\n\nPaired with **${PORTFOLIO_KNOWLEDGE.cyberConcepts.defenseInDepth.title}**:\n${PORTFOLIO_KNOWLEDGE.cyberConcepts.defenseInDepth.explanation}`,
      category: "concepts"
    };
  }

  // Contact Info
  if (/\b(contact|email|reach|hire|linkedin|github|location|address)\b/i.test(query)) {
    return {
      answer: `You can connect with Jovens Vilbrun through:\n\n• **Location:** ${PORTFOLIO_KNOWLEDGE.profile.location}\n• **Institution:** ${PORTFOLIO_KNOWLEDGE.profile.university}\n• **Quick Action:** Use the Contact form on the [Home](index.html) page or connect on [LinkedIn](https://linkedin.com) and [GitHub](https://github.com).`,
      category: "contact"
    };
  }

  // Batman / Gotham Theme inquiries
  if (/\b(batman|gotham|dark knight|batcomputer|theme)\b/i.test(query)) {
    return {
      answer: `This website features a high-tech Cyber-Gotham Operations aesthetic inspired by the Batcomputer and modern defensive SOCs. It provides 6 responsive theme colorways! Try telling me:\n\n• *"Change theme to Matrix"*\n• *"Make it Purple"*\n• *"Set theme to Red Alert"*\n• *"Switch to Ice theme"*\n• *"Use Gold theme"*\n• *"Reset to Gotham default"*`,
      category: "theme"
    };
  }


  // AI Digital Person
  if (/\b(go to|take me to|navigate to|open|show me|visit|switch to)\b.*(digital person|ai avatar|avatar generator|part 3)/i.test(query) || query === "digital person" || query === "ai digital person") {
    return {
      answer: "Opening the AI Digital Person page, where you can upload a photo, generate an avatar, talk to it, ask questions, and receive spoken answers.",
      action: "navigate",
      actionData: { url: "digital-person.html", pageName: "AI Digital Person" },
      category: "digital-person"
    };
  }

  if (/\b(ai digital person|digital person|avatar generator|upload photo|generate avatar|part 3)\b/i.test(query)) {
    return {
      answer: "The **AI Digital Person** page demonstrates the required workflow: **Upload Photo → Generate Digital Person → Talk → Ask Questions → Receive Answers**. It supports photo upload, AI-avatar generation when the secure image endpoint is configured, speech-to-text, local/Gemini question answering, and spoken responses.",
      category: "digital-person"
    };
  }
  // 4. Default Local Knowledge Fallback
  return {
    answer: `I don't have that specific detail in Jovens' local portfolio knowledge base yet, but I can help you with:\n\n• **Jovens' Background & Career Goals** (Senior at Kean University concentrating in Cybersecurity)\n• **Relevant Coursework & Skills** (Networking, Python, Security Labs)\n• **Featured Projects** (Travel Destination Guide, Budget Buddy, and Lava Leap)\n• **Cybersecurity Fundamentals** (CIA Triad, Zero Trust, Malware prevention)\n• **Website Control** (Change themes or navigate to any page)\n\n*(Tip: If an external AI endpoint is connected, general web and threat intelligence queries can also be routed!)*`,
    category: "fallback"
  };
}

// Export for module or browser environments
if (typeof module !== "undefined" && module.exports) {
  module.exports = { PORTFOLIO_KNOWLEDGE, findPortfolioAnswer };
}


// Browser globals for Jovens AI integration
if (typeof window !== "undefined") {
  window.PORTFOLIO_KNOWLEDGE = PORTFOLIO_KNOWLEDGE;
  window.findPortfolioAnswer = findPortfolioAnswer;
}


// Login page knowledge
window.PORTFOLIO_LOGIN_INFO = {
  page: "login.html",
  purpose: "A secure authentication demo page showing how login would fit into the portfolio's proposed web architecture.",
  note: "The current static portfolio does not use a real authentication backend or store passwords."
};
