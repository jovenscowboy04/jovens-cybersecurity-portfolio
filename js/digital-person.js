(function () {
  const $ = (id) => document.getElementById(id);
  const fileInput = $('digital-photo-input');
  const preview = $('digital-upload-preview');
  const avatar = $('digital-avatar-image');
  const mouthLayer = $('digital-mouth-layer');
  const stage = $('digital-avatar-stage');
  const generateBtn = $('generate-digital-person');
  const status = $('digital-generation-status');
  const styleSelect = $('digital-style');
  const form = $('digital-question-form');
  const questionInput = $('digital-question');
  const conversation = $('digital-conversation');
  const talkBtn = $('digital-talk-btn');
  const listeningStatus = $('digital-listening-status');
  const speechToggle = $('digital-speech-toggle');
  const clearBtn = $('digital-clear-chat');
  const modeLabel = $('digital-avatar-mode');
  const stateBadge = $('digital-state-badge');
  const stateCopy = $('digital-state-copy');
  const liveStatus = $('digital-live-status');
  const connectionPill = $('digital-connection-pill');
  const voiceConversationBtn = $('digital-voice-conversation');
  const stopVoiceBtn = $('digital-stop-voice');
  const thinkingRow = $('digital-thinking-row');

  if (!fileInput || !preview || !avatar || !generateBtn || !stage) return;

  const GEMINI_MODEL = 'gemini-2.5-flash';
  const GEMINI_KEY_STORAGE = 'cyberbot_gemini_api_key';
  let uploadedDataUrl = null;
  let voiceEnabled = true;
  let isListening = false;
  let recognition = null;
  let handsFreeMode = false;
  let oneShotSpeech = false;
  let isSpeaking = false;
  let mouthTimer = null;
  let currentState = 'idle';
  const conversationMemory = [];

  const stateText = {
    idle: ['IDLE', 'Ready when you are. Start a voice conversation or type a message.'],
    listening: ['LISTENING', 'I’m listening. Ask your question naturally.'],
    thinking: ['THINKING', 'Working on your question…'],
    speaking: ['SPEAKING', 'Jovens AI is answering with the British voice.']
  };

  function setState(next) {
    currentState = next;
    stage.dataset.state = next;
    stage.classList.toggle('is-speaking', next === 'speaking');
    stage.classList.toggle('is-listening', next === 'listening');
    stage.classList.toggle('is-thinking', next === 'thinking');
    if (stateBadge) stateBadge.textContent = stateText[next]?.[0] || next.toUpperCase();
    if (stateCopy) stateCopy.textContent = stateText[next]?.[1] || '';
    if (liveStatus) {
      const strong = liveStatus.querySelector('strong');
      if (strong) strong.textContent = stateText[next]?.[0] || 'READY';
    }
  }

  function setStatus(message, type) {
    if (!status) return;
    status.textContent = message;
    status.className = 'digital-status' + (type ? ' ' + type : '');
  }

  function syncAvatarLayers(src) {
    if (mouthLayer) mouthLayer.src = src;
    document.querySelectorAll('.digital-message-avatar img, .digital-thinking-avatar img').forEach(img => { img.src = src; });
  }

  avatar.addEventListener('load', () => syncAvatarLayers(avatar.src));

  function addMessage(sender, text) {
    const el = document.createElement('div');
    el.className = 'digital-message ' + sender;
    if (sender === 'bot') {
      const avatarWrap = document.createElement('span');
      avatarWrap.className = 'digital-message-avatar';
      const img = document.createElement('img');
      img.src = avatar.src;
      img.alt = '';
      avatarWrap.appendChild(img);
      const body = document.createElement('div');
      const name = document.createElement('b');
      name.textContent = 'Jovens AI';
      const p = document.createElement('p');
      p.textContent = text;
      body.append(name, p);
      el.append(avatarWrap, body);
    } else {
      const body = document.createElement('div');
      const name = document.createElement('b');
      name.textContent = 'You';
      const p = document.createElement('p');
      p.textContent = text;
      body.append(name, p);
      el.appendChild(body);
    }
    conversation.appendChild(el);
    conversation.scrollTop = conversation.scrollHeight;
  }

  function getBritishVoice() {
    if (!('speechSynthesis' in window)) return null;
    const voices = window.speechSynthesis.getVoices();
    const preferred = ['Microsoft Ryan', 'Microsoft Sonia', 'Microsoft Libby', 'Google UK English Male', 'Google UK English Female', 'Daniel', 'Serena'];
    for (const name of preferred) {
      const voice = voices.find(v => v.name.toLowerCase().includes(name.toLowerCase()));
      if (voice) return voice;
    }
    return voices.find(v => /^en-GB/i.test(v.lang)) || voices.find(v => /^en/i.test(v.lang)) || null;
  }

  function startMouthMotion() {
    stopMouthMotion();
    let phase = 0;
    mouthTimer = window.setInterval(() => {
      phase += 1;
      const open = 1 + (0.025 + Math.random() * 0.055) * (phase % 2 ? 1 : .55);
      if (mouthLayer) {
        mouthLayer.style.transform = `scaleY(${open.toFixed(3)}) translateY(${(Math.random() * 1.8).toFixed(1)}px)`;
        mouthLayer.style.opacity = '1';
      }
    }, 105);
  }

  function stopMouthMotion() {
    if (mouthTimer) window.clearInterval(mouthTimer);
    mouthTimer = null;
    if (mouthLayer) {
      mouthLayer.style.transform = 'scaleY(1)';
      mouthLayer.style.opacity = '0';
    }
  }

  function speak(text) {
    return new Promise(resolve => {
      if (!voiceEnabled || !('speechSynthesis' in window)) {
        setState('idle');
        resolve();
        return;
      }
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-GB';
      utterance.rate = 0.96;
      utterance.pitch = 1.0;
      const voice = getBritishVoice();
      if (voice) utterance.voice = voice;
      utterance.onstart = () => {
        isSpeaking = true;
        setState('speaking');
        startMouthMotion();
        listeningStatus.textContent = 'Speaking…';
      };
      const finish = () => {
        isSpeaking = false;
        stopMouthMotion();
        setState('idle');
        listeningStatus.textContent = handsFreeMode ? 'Voice conversation active' : 'Ready';
        resolve();
      };
      utterance.onend = finish;
      utterance.onerror = finish;
      window.speechSynthesis.speak(utterance);
    });
  }

  function readFileAsDataUrl(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  function loadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  }

  async function compressForAi(dataUrl) {
    const img = await loadImage(dataUrl);
    const canvas = document.createElement('canvas');
    const size = 1024;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    const scale = Math.max(size / img.width, size / img.height);
    const w = img.width * scale;
    const h = img.height * scale;
    ctx.drawImage(img, (size - w) / 2, (size - h) / 2, w, h);
    return canvas.toDataURL('image/jpeg', 0.88);
  }

  async function createLocalPreview(dataUrl) {
    const img = await loadImage(dataUrl);
    const canvas = document.createElement('canvas');
    canvas.width = 768;
    canvas.height = 768;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(384, 310, 80, 384, 384, 520);
    grad.addColorStop(0, '#17375a');
    grad.addColorStop(0.55, '#071526');
    grad.addColorStop(1, '#020812');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 768, 768);
    const scale = Math.max(650 / img.width, 650 / img.height);
    const w = img.width * scale;
    const h = img.height * scale;
    ctx.save();
    ctx.beginPath();
    ctx.arc(384, 375, 285, 0, Math.PI * 2);
    ctx.clip();
    ctx.filter = 'contrast(1.08) saturate(1.08)';
    ctx.drawImage(img, (768 - w) / 2, (720 - h) / 2, w, h);
    ctx.restore();
    ctx.strokeStyle = '#00e5ff';
    ctx.lineWidth = 14;
    ctx.shadowColor = '#00e5ff';
    ctx.shadowBlur = 28;
    ctx.beginPath();
    ctx.arc(384, 375, 292, 0, Math.PI * 2);
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.fillStyle = 'rgba(255, 45, 104, .9)';
    ctx.fillRect(94, 650, 580, 4);
    ctx.fillStyle = '#7dd3fc';
    ctx.font = '700 24px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('DIGITAL PERSON • LOCAL PREVIEW', 384, 706);
    return canvas.toDataURL('image/png');
  }

  fileInput.addEventListener('change', async () => {
    const file = fileInput.files && fileInput.files[0];
    if (!file) return;
    if (!/^image\/(png|jpeg|webp)$/i.test(file.type)) {
      setStatus('Please choose a JPG, PNG, or WEBP image.', 'error');
      return;
    }
    if (file.size > 12 * 1024 * 1024) {
      setStatus('Please choose an image smaller than 12 MB.', 'error');
      return;
    }
    try {
      uploadedDataUrl = await readFileAsDataUrl(file);
      preview.src = uploadedDataUrl;
      setStatus('Photo uploaded. Ready to generate your digital person.', 'success');
      document.querySelectorAll('.digital-process span')[0]?.classList.add('complete');
    } catch (err) {
      setStatus('That image could not be read. Please try another file.', 'error');
    }
  });

  function buildPrompt(style) {
    const styleText = {
      cyber: 'a polished futuristic cyber-technology digital person portrait, cinematic blue and cyan interface lighting, professional and friendly, realistic face preserved',
      professional: 'a polished professional technology portfolio digital person portrait, clean studio lighting, subtle futuristic background, realistic face preserved',
      gotham: 'a dark cinematic Gotham-inspired technology digital person portrait, sophisticated navy and cyan lighting, subtle cyber operations atmosphere, realistic face preserved'
    }[style] || 'a polished futuristic technology digital person portrait';
    return `Transform this uploaded portrait into ${styleText}. Keep the same person recognizable and preserve facial identity, skin tone, hairstyle, and general expression. Head-and-shoulders composition, centered, suitable for an interactive AI avatar on a college technology portfolio. No text, logos, masks, or copyrighted characters.`;
  }

  generateBtn.addEventListener('click', async () => {
    if (!uploadedDataUrl) {
      setStatus('Upload a photo first.', 'error');
      fileInput.click();
      return;
    }
    generateBtn.disabled = true;
    generateBtn.textContent = 'Generating…';
    setStatus('Creating the digital person…', 'working');
    try {
      const aiInput = await compressForAi(uploadedDataUrl);
      const response = await fetch('/.netlify/functions/generate-avatar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: aiInput, prompt: buildPrompt(styleSelect.value) })
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.image) throw new Error(data.message || data.error || 'AI generator unavailable');
      avatar.src = data.image;
      syncAvatarLayers(data.image);
      modeLabel.textContent = 'READY • AI GENERATED';
      setStatus('AI digital person generated successfully.', 'success');
      document.querySelectorAll('.digital-process span')[1]?.classList.add('complete');
    } catch (err) {
      const localPreview = await createLocalPreview(uploadedDataUrl);
      avatar.src = localPreview;
      syncAvatarLayers(localPreview);
      modeLabel.textContent = 'READY • LOCAL PREVIEW';
      setStatus('AI generation is not configured on this deployment, so a clearly labeled local avatar preview was created.', 'warning');
      document.querySelectorAll('.digital-process span')[1]?.classList.add('complete');
    } finally {
      generateBtn.disabled = false;
      generateBtn.textContent = '✨ Generate Digital Person';
    }
  });

  function getGeminiKey() {
    try { return localStorage.getItem(GEMINI_KEY_STORAGE) || ''; } catch (_) { return ''; }
  }

  function updateConnectionPill() {
    const hasKey = !!getGeminiKey();
    if (connectionPill) {
      connectionPill.innerHTML = `<span></span>${hasKey ? 'AI CONNECTED' : 'LOCAL AI'}`;
      connectionPill.classList.toggle('connected', hasKey);
    }
    if (liveStatus) {
      const small = liveStatus.querySelector('small');
      if (small) small.textContent = hasKey ? 'Generative AI + voice available' : 'Voice + local knowledge available';
    }
  }

  async function askGemini(question) {
    const apiKey = getGeminiKey();
    if (!apiKey) return null;
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${encodeURIComponent(apiKey)}`;
    const recent = conversationMemory.slice(-8);
    const contents = recent.map(turn => ({ role: turn.role, parts: [{ text: turn.text }] }));
    contents.push({ role: 'user', parts: [{ text: question }] });
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: 'You are Jovens AI, the digital person on Jovens Vilbrun\'s technology portfolio. Be concise, friendly, natural, and accurate. Use portfolio information when available. You can explain Jovens\' projects, coursework, technology, cybersecurity work, and career goals. Do not claim to have performed actions you did not perform.' }] },
        contents,
        generationConfig: { temperature: 0.55, maxOutputTokens: 500 }
      })
    });
    if (!response.ok) return null;
    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.map(p => p.text || '').join('') || null;
  }

  function cleanAnswer(text) {
    return String(text || '')
      .replace(/\*\*/g, '')
      .replace(/\[[^\]]+\]\([^\)]+\)/g, match => match.replace(/\[|\]\([^\)]+\)/g, ''))
      .replace(/^[-•]\s*/gm, '• ')
      .trim();
  }

  function handleSiteCommand(question) {
    const q = question.toLowerCase().trim();
    const themeMap = { purple: 'purple', violet: 'purple', green: 'matrix', matrix: 'matrix', red: 'red-alert', ice: 'ice', blue: 'ice', gold: 'gold', gotham: 'gotham', default: 'gotham' };
    if (/change|switch|make|use/.test(q) && /theme|color|site|website/.test(q)) {
      for (const [word, theme] of Object.entries(themeMap)) {
        if (q.includes(word) && typeof window.applyTheme === 'function') {
          window.applyTheme(theme);
          return `Done. I changed the website theme to ${word}.`;
        }
      }
    }

    const routes = [
      [/\bhome\b/, 'index.html', 'Home'],
      [/about( me)?/, 'about.html', 'About Me'],
      [/technology/, 'technology.html', 'Technology'],
      [/cybersecurity/, 'cybersecurity.html', 'Cybersecurity'],
      [/threat model/, 'threat-model.html', 'Threat Model'],
      [/secure architecture|architecture/, 'secure-architecture.html', 'Secure Architecture'],
      [/sql injection|sql lab/, 'sql-injection-lab.html', 'SQL Injection Lab'],
      [/phishing( ml| machine learning)?/, 'phishing-ml-project.html', 'Phishing ML Project'],
      [/digital person|jovens ai/, 'digital-person.html', 'AI Digital Person'],
      [/login|sign in/, 'login.html', 'Login'],
      [/account/, 'account.html', 'Account']
    ];
    if (/open|go to|take me|show me|navigate/.test(q)) {
      for (const [pattern, url, name] of routes) {
        if (pattern.test(q)) {
          window.setTimeout(() => { window.location.href = url; }, 700);
          return `Opening the ${name} page for you.`;
        }
      }
      if (/projects?|lava leap|budget buddy|travel/.test(q)) {
        window.setTimeout(() => { window.location.href = 'index.html#featured-projects'; }, 700);
        return 'Opening the Featured Projects section for you.';
      }
    }
    return null;
  }

  async function answerQuestion(question) {
    const commandAnswer = handleSiteCommand(question);
    if (commandAnswer) return commandAnswer;

    let answer = null;
    if (typeof window.findPortfolioAnswer === 'function') {
      const local = window.findPortfolioAnswer(question);
      if (local && local.answer && local.category !== 'fallback') answer = local.answer;
    }
    if (!answer) answer = await askGemini(question);
    if (!answer && typeof window.findPortfolioAnswer === 'function') {
      const fallback = window.findPortfolioAnswer(question);
      answer = fallback?.answer || null;
    }
    return cleanAnswer(answer || 'I do not have an answer for that yet. Try asking about Jovens, his projects, technology, cybersecurity, or the pages on this portfolio.');
  }

  async function submitQuestion(question, fromVoice) {
    const cleaned = (question || '').trim();
    if (!cleaned) return;
    addMessage('user', cleaned);
    conversationMemory.push({ role: 'user', text: cleaned });
    questionInput.value = '';
    setState('thinking');
    listeningStatus.textContent = 'Thinking…';
    if (thinkingRow) thinkingRow.hidden = false;
    document.querySelectorAll('.digital-process span')[3]?.classList.add('complete');
    const answer = await answerQuestion(cleaned);
    if (thinkingRow) thinkingRow.hidden = true;
    addMessage('bot', answer);
    conversationMemory.push({ role: 'model', text: answer });
    document.querySelectorAll('.digital-process span')[4]?.classList.add('complete');
    listeningStatus.textContent = 'Answer received';
    await speak(answer);
    if (handsFreeMode && !isListening) {
      window.setTimeout(() => startRecognition(true), 450);
    } else if (!isSpeaking) {
      setState('idle');
    }
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    submitQuestion(questionInput.value, false);
  });

  document.querySelectorAll('[data-prompt]').forEach(btn => {
    btn.addEventListener('click', () => submitQuestion(btn.dataset.prompt || '', false));
  });

  const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (Recognition) {
    recognition = new Recognition();
    recognition.lang = 'en-US';
    recognition.interimResults = true;
    recognition.continuous = false;

    recognition.onstart = () => {
      isListening = true;
      setState('listening');
      talkBtn.classList.add('listening');
      listeningStatus.textContent = 'Listening…';
      document.querySelectorAll('.digital-process span')[2]?.classList.add('complete');
    };

    recognition.onresult = event => {
      let transcript = '';
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
        if (event.results[i].isFinal) finalTranscript += event.results[i][0].transcript;
      }
      questionInput.value = transcript.trim();
      if (finalTranscript.trim()) questionInput.dataset.finalVoice = finalTranscript.trim();
    };

    recognition.onend = () => {
      isListening = false;
      talkBtn.classList.remove('listening');
      const finalVoice = (questionInput.dataset.finalVoice || questionInput.value || '').trim();
      delete questionInput.dataset.finalVoice;
      if ((handsFreeMode || oneShotSpeech) && finalVoice) {
        oneShotSpeech = false;
        submitQuestion(finalVoice, true);
      } else if (handsFreeMode && !isSpeaking) {
        listeningStatus.textContent = 'Listening again…';
        window.setTimeout(() => startRecognition(true), 650);
      } else {
        oneShotSpeech = false;
        setState('idle');
        listeningStatus.textContent = finalVoice ? 'Speech converted to text' : 'Ready';
      }
    };

    recognition.onerror = event => {
      isListening = false;
      talkBtn.classList.remove('listening');
      oneShotSpeech = false;
      if (event.error === 'not-allowed') {
        handsFreeMode = false;
        updateVoiceButtons();
        listeningStatus.textContent = 'Microphone permission denied';
      } else if (event.error === 'no-speech' && handsFreeMode) {
        listeningStatus.textContent = 'No speech detected. Listening again…';
        window.setTimeout(() => startRecognition(true), 700);
      } else {
        listeningStatus.textContent = 'Voice input unavailable';
      }
      setState('idle');
    };
  } else {
    talkBtn.disabled = true;
    talkBtn.title = 'Speech recognition is not supported in this browser';
    voiceConversationBtn.disabled = true;
    listeningStatus.textContent = 'Voice input works best in Chrome or Edge';
  }

  function startRecognition(handsFree) {
    if (!recognition || isListening || isSpeaking) return;
    if (handsFree) handsFreeMode = true;
    try { recognition.start(); } catch (_) {}
    updateVoiceButtons();
  }

  function stopRecognition() {
    handsFreeMode = false;
    oneShotSpeech = false;
    if (recognition && isListening) {
      try { recognition.stop(); } catch (_) {}
    }
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    isSpeaking = false;
    stopMouthMotion();
    setState('idle');
    listeningStatus.textContent = 'Voice conversation stopped';
    updateVoiceButtons();
  }

  function updateVoiceButtons() {
    if (voiceConversationBtn) {
      voiceConversationBtn.classList.toggle('active', handsFreeMode);
      voiceConversationBtn.textContent = handsFreeMode ? '🎙 Voice Conversation Active' : '🎙 Start Voice Conversation';
      voiceConversationBtn.disabled = !Recognition;
    }
    if (stopVoiceBtn) stopVoiceBtn.disabled = !handsFreeMode && !isListening && !isSpeaking;
  }

  talkBtn.addEventListener('click', () => {
    if (!recognition) return;
    if (isListening) {
      recognition.stop();
    } else {
      oneShotSpeech = true;
      startRecognition(false);
    }
  });

  voiceConversationBtn.addEventListener('click', () => {
    if (handsFreeMode) stopRecognition();
    else startRecognition(true);
  });

  stopVoiceBtn.addEventListener('click', stopRecognition);

  speechToggle.addEventListener('click', () => {
    voiceEnabled = !voiceEnabled;
    speechToggle.classList.toggle('active', voiceEnabled);
    speechToggle.textContent = voiceEnabled ? '🔊 British Voice On' : '🔇 Voice Off';
    if (!voiceEnabled && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      isSpeaking = false;
      stopMouthMotion();
      setState('idle');
    }
  });

  clearBtn.addEventListener('click', () => {
    conversation.innerHTML = '<div class="digital-message bot"><span class="digital-message-avatar"><img src="' + avatar.src + '" alt=""></span><div><b>Jovens AI</b><p>Conversation cleared. Ask me another question whenever you are ready.</p></div></div>';
    conversationMemory.length = 0;
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    stopMouthMotion();
    setState('idle');
    listeningStatus.textContent = 'Ready';
  });

  if ('speechSynthesis' in window) window.speechSynthesis.onvoiceschanged = getBritishVoice;
  syncAvatarLayers(avatar.src);
  updateConnectionPill();
  updateVoiceButtons();
  setState('idle');
})();
