/**
 * Cybersecurity & IT Personal Portfolio - main.js
 * Jovens Vilbrun - Kean University Senior
 * Gotham/Cyber Command Center interactivity, typewriter engine, ambient canvas, & UI utilities.
 */

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // 1. Mobile Navigation Drawer Toggle
  // ==========================================
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (event) => {
      if (!navToggle.contains(event.target) && !navLinks.contains(event.target) && navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ==========================================
  // 2. Dynamic Year in Footer
  // ==========================================
  const yearSpan = document.getElementById('current-year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // ==========================================
  // 3. Hero Subtitle Typewriter Effect
  // ==========================================
  const typewriterElement = document.getElementById('typewriter-text');
  if (typewriterElement) {
    const roles = [
      'Cybersecurity Specialist',
      'SOC Analyst Aspirant',
      'Systems & Network Defender',
      'IT Senior @ Kean University'
    ];
    let roleIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    const typeSpeed = 80;
    const deleteSpeed = 40;
    const holdTime = 2200;

    function handleTypewriter() {
      const currentText = roles[roleIdx];

      if (isDeleting) {
        charIdx--;
        typewriterElement.textContent = currentText.substring(0, charIdx);
      } else {
        charIdx++;
        typewriterElement.textContent = currentText.substring(0, charIdx);
      }

      if (!isDeleting && charIdx === currentText.length) {
        // Full word typed; pause then backspace
        setTimeout(() => {
          isDeleting = true;
          handleTypewriter();
        }, holdTime);
        return;
      } else if (isDeleting && charIdx === 0) {
        // Fully erased; advance to next role
        isDeleting = false;
        roleIdx = (roleIdx + 1) % roles.length;
        setTimeout(handleTypewriter, 300);
        return;
      }

      const nextSpeed = isDeleting ? deleteSpeed : typeSpeed;
      setTimeout(handleTypewriter, nextSpeed);
    }

    setTimeout(handleTypewriter, 600);
  }

  // ==========================================
  // 4. Batcomputer Interactive Command Center Terminal
  // ==========================================
  const terminalCmd = document.getElementById('terminal-cmd');
  const terminalOutput = document.getElementById('terminal-output');
  const terminalChips = document.querySelectorAll('.bat-chip-btn');
  const terminalWindow = document.querySelector('.bat-terminal');

  if (terminalCmd && terminalOutput) {
    const terminalCommands = [
      {
        cmd: 'whoami',
        output: `
          <div class="term-output-item"><span class="term-output-key">Name:</span><span class="term-output-val highlight">Jovens Vilbrun</span></div>
          <div class="term-output-item"><span class="term-output-key">School:</span><span class="term-output-val">Kean University</span></div>
          <div class="term-output-item"><span class="term-output-key">Major:</span><span class="term-output-val">Information Technology</span></div>
          <div class="term-output-item"><span class="term-output-key">Year:</span><span class="term-output-val highlight">Senior (Graduating 2027)</span></div>
          <div class="term-output-item"><span class="term-output-key">Focus:</span><span class="term-output-val crimson">Cybersecurity</span></div>
        `
      },
      {
        cmd: 'skills --list',
        output: `
          <div class="term-output-item"><span class="term-output-key">Core Languages:</span><span class="term-output-val">Python, Java, SQL, HTML5, CSS3, JavaScript</span></div>
          <div class="term-output-item"><span class="term-output-key">Cybersecurity:</span><span class="term-output-val highlight">Phishing Recognition, Network Security, IDS/IPS</span></div>
          <div class="term-output-item"><span class="term-output-key">Platforms/Tools:</span><span class="term-output-val">Linux, Git, MySQL Workbench, Android Studio, VS Code</span></div>
          <div class="term-output-item"><span class="term-output-key">Security Habits:</span><span class="term-output-val">Password Manager, MFA Enforcement, OSINT Defense</span></div>
        `
      },
      {
        cmd: 'projects --show',
        output: `
          <div class="term-output-item"><span class="term-output-key">[01] Web Security:</span><span class="term-output-val highlight">Phishing Awareness Web Application</span></div>
          <div class="term-output-item"><span class="term-output-key">[02] Mobile App:</span><span class="term-output-val">Budget Buddy (Android Studio / Java / SQLite)</span></div>
          <div class="term-output-item"><span class="term-output-key">[03] Database:</span><span class="term-output-val">MySQL Relational DB & Employee Records Management</span></div>
          <div class="term-output-item"><span class="term-output-key">Status:</span><span class="term-output-val highlight">Verified &bull; Ready for Evaluation</span></div>
        `
      },
      {
        cmd: 'career_goal',
        output: `
          <div class="term-output-item"><span class="term-output-key">Target Careers:</span><span class="term-output-val highlight">Cybersecurity Analyst &bull; SOC Analyst</span></div>
          <div class="term-output-item"><span class="term-output-key">Primary Mission:</span><span class="term-output-val">Protect enterprise systems, monitor threats, and mitigate attacks</span></div>
          <div class="term-output-item"><span class="term-output-key">Next Milestone:</span><span class="term-output-val crimson">CompTIA Security+ Certification</span></div>
          <div class="term-output-item"><span class="term-output-key">Career Readiness:</span><span class="term-output-val highlight">Actively seeking full-time IT/Cybersecurity opportunities</span></div>
        `
      },
      {
        cmd: 'security_focus --active',
        output: `
          <div class="term-output-item"><span class="term-output-key">Core Pillar 01:</span><span class="term-output-val">Phishing Prevention & User Education Simulation</span></div>
          <div class="term-output-item"><span class="term-output-key">Core Pillar 02:</span><span class="term-output-val highlight">Network Defense & Traffic Packet Analysis</span></div>
          <div class="term-output-item"><span class="term-output-key">Core Pillar 03:</span><span class="term-output-val">Privacy Protection & Zero Sensitive PII Exposure</span></div>
          <div class="term-output-item"><span class="term-output-key">Status:</span><span class="term-output-val highlight">[DEFENSE PROTOCOLS ARMED]</span></div>
        `
      }
    ];

    let currentCmdIndex = 0;
    let autoRotateTimer = null;
    let isPaused = false;

    function renderCommand(index) {
      const target = terminalCommands[index];
      if (!target) return;

      // Update active chip UI
      terminalChips.forEach((chip) => {
        if (chip.getAttribute('data-cmd') === target.cmd) {
          chip.classList.add('active');
        } else {
          chip.classList.remove('active');
        }
      });

      // Type the command string
      terminalCmd.textContent = '';
      let charI = 0;
      const cmdStr = target.cmd;

      function typeChar() {
        if (charI < cmdStr.length) {
          terminalCmd.textContent += cmdStr.charAt(charI);
          charI++;
          setTimeout(typeChar, 45);
        } else {
          // Finished typing; display formatted output with a subtle fade
          terminalOutput.style.opacity = '0';
          setTimeout(() => {
            terminalOutput.innerHTML = target.output;
            terminalOutput.style.transition = 'opacity 0.25s ease';
            terminalOutput.style.opacity = '1';
          }, 60);
        }
      }

      typeChar();
    }

    function scheduleNextCommand() {
      clearTimeout(autoRotateTimer);
      autoRotateTimer = setTimeout(() => {
        if (!isPaused) {
          currentCmdIndex = (currentCmdIndex + 1) % terminalCommands.length;
          renderCommand(currentCmdIndex);
        }
        scheduleNextCommand();
      }, 4800);
    }

    // Initial render
    renderCommand(0);
    scheduleNextCommand();

    // Hover pauses auto-rotation so user can read comfortably
    if (terminalWindow) {
      terminalWindow.addEventListener('mouseenter', () => { isPaused = true; });
      terminalWindow.addEventListener('mouseleave', () => { isPaused = false; });
    }

    // Manual click on command chips
    terminalChips.forEach((chip) => {
      chip.addEventListener('click', () => {
        const cmdName = chip.getAttribute('data-cmd');
        const matchIdx = terminalCommands.findIndex((c) => c.cmd === cmdName);
        if (matchIdx !== -1) {
          currentCmdIndex = matchIdx;
          renderCommand(currentCmdIndex);
          scheduleNextCommand(); // reset timer
        }
      });
    });
  }

  // ==========================================
  // 5. Gotham Ambient Atmospheric Canvas (Mist & Light Rain Drift)
  // ==========================================
  const canvas = document.getElementById('gotham-ambient-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const particles = [];
    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.6 + 0.4,
        speedY: Math.random() * 0.85 + 0.35,
        speedX: (Math.random() - 0.5) * 0.25,
        opacity: Math.random() * 0.35 + 0.12,
        color: Math.random() > 0.4 ? 'rgba(56, 189, 248, ' : 'rgba(255, 255, 255, '
      });
    }

    function resizeCanvas() {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', resizeCanvas);

    let animationId = null;
    function animateParticles() {
      if (document.hidden) {
        animationId = requestAnimationFrame(animateParticles);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.y += p.speedY;
        p.x += p.speedX;

        if (p.y > height) {
          p.y = -10;
          p.x = Math.random() * width;
        }
        if (p.x > width) p.x = 0;
        if (p.x < 0) p.x = width;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color + p.opacity + ')';
        ctx.fill();
      }

      animationId = requestAnimationFrame(animateParticles);
    }

    animationId = requestAnimationFrame(animateParticles);
  }

  // ==========================================
  // 6. Interactive Project Modals (Travel Guide, Budget Buddy & Lava Leap)
  // ==========================================
  const modalOverlay = document.getElementById('project-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalBody = document.getElementById('modal-body');
  const modalClose = document.getElementById('modal-close');

  const projectModalData = {
    travelGuide: {
      title: 'Travel Destination Guide',
      badge: 'Web Design &bull; HTML / CSS',
      content: `
        <div style="margin-bottom: 1.25rem;">
          <p style="color: #cbd5e1; line-height: 1.7;">
            <strong>Travel Destination Guide</strong> is a website I built with HTML and CSS to help visitors explore places around the world. Each destination has its own page with a photo gallery, a sample itinerary, attractions to visit, and a budget table for planning the trip. I designed the site to make comparing destinations and finding trip ideas easy.
          </p>
        </div>
        <div style="background: rgba(13, 20, 32, 0.7); border: 1px solid rgba(0, 229, 255, 0.2); border-radius: 12px; padding: 1.25rem; margin-bottom: 1.5rem;">
          <h4 style="color: var(--accent-cyan); font-size: 0.95rem; margin-bottom: 0.6rem; text-transform: uppercase; font-family: var(--font-mono);">Website Features</h4>
          <ul style="margin-left: 1.25rem; color: #cbd5e1; line-height: 1.6; font-size: 0.92rem;">
            <li><strong>Destination Pages:</strong> Separate pages make it easy to explore and compare different places.</li>
            <li><strong>Photo Galleries:</strong> Visual galleries help visitors get a feel for each destination.</li>
            <li><strong>Sample Itineraries:</strong> Suggested plans give visitors ideas for organizing their trip.</li>
            <li><strong>Attractions:</strong> Each page highlights places and activities worth visiting.</li>
            <li><strong>Budget Tables:</strong> Simple planning tables help visitors estimate trip costs.</li>
          </ul>
        </div>
        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
          <span class="tech-tag-pill">HTML5</span>
          <span class="tech-tag-pill">CSS3</span>
          <span class="tech-tag-pill">Responsive Design</span>
          <span class="tech-tag-pill">Photo Gallery</span>
          <span class="tech-tag-pill">Travel Planning</span>
        </div>
      `
    },
    budgetBuddy: {
      title: 'Budget Buddy — Personal Finance Android App',
      badge: 'Mobile App &bull; Java / Android Studio',
      content: `
        <div style="margin-bottom: 1.25rem;">
          <p style="color: #cbd5e1; line-height: 1.7;">
            <strong>Budget Buddy</strong> is an Android application designed to give users intuitive control over their personal finances. Developed in Java using Android Studio, the app empowers students and young professionals to manage expenses effortlessly, categorize spending, and stay within customized monthly budgets.
          </p>
        </div>
        <div style="background: rgba(13, 20, 32, 0.7); border: 1px solid rgba(0, 229, 255, 0.2); border-radius: 12px; padding: 1.25rem; margin-bottom: 1.5rem;">
          <h4 style="color: var(--accent-cyan); font-size: 0.95rem; margin-bottom: 0.6rem; text-transform: uppercase; font-family: var(--font-mono);">Key Capabilities & Architecture</h4>
          <ul style="margin-left: 1.25rem; color: #cbd5e1; line-height: 1.6; font-size: 0.92rem;">
            <li><strong>Expense Categorization:</strong> Organize transactions into customizable categories (Food, Tuition, Utilities, Entertainment).</li>
            <li><strong>Monthly Limit Enforcer:</strong> Visual alert meters showing spending velocity against predefined thresholds.</li>
            <li><strong>Data Persistence:</strong> Secure local SQLite storage ensuring financial data remains private on the user's device.</li>
            <li><strong>Analytical Summaries:</strong> Clean dashboard breakdowns showing where monthly income flows.</li>
          </ul>
        </div>
        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
          <span class="tech-tag-pill">Java</span>
          <span class="tech-tag-pill">Android Studio</span>
          <span class="tech-tag-pill">SQLite</span>
          <span class="tech-tag-pill">Material UI</span>
          <span class="tech-tag-pill">Mobile Architecture</span>
        </div>
      `
    },
    lavaLeap: {
      title: 'Lava Leap',
      badge: 'Android Studio &bull; 2D Mobile Game',
      content: `
        <div style="margin-bottom: 1.25rem;">
          <p style="color: #cbd5e1; line-height: 1.7;">
            <strong>Lava Leap</strong> is a 2D mobile game I created in Android Studio. Players jump across moving platforms while lava rises beneath them, collecting coins and trying to survive as long as possible. The game gets harder over time, making each run more challenging.
          </p>
        </div>
        <div style="background: rgba(13, 20, 32, 0.7); border: 1px solid rgba(0, 229, 255, 0.2); border-radius: 12px; padding: 1.25rem; margin-bottom: 1.5rem;">
          <h4 style="color: var(--accent-cyan); font-size: 0.95rem; margin-bottom: 0.6rem; text-transform: uppercase; font-family: var(--font-mono);">Game Features</h4>
          <ul style="margin-left: 1.25rem; color: #cbd5e1; line-height: 1.6; font-size: 0.92rem;">
            <li><strong>Moving Platforms:</strong> Players time their jumps across platforms while staying above the rising lava.</li>
            <li><strong>Increasing Difficulty:</strong> The challenge becomes harder the longer the player survives.</li>
            <li><strong>Coin Collection:</strong> Players collect coins during each run while navigating the level.</li>
            <li><strong>Power-Ups:</strong> Helpful power-ups create more variety and strategy during gameplay.</li>
            <li><strong>High-Score System:</strong> Each run gives players another chance to beat their personal best.</li>
          </ul>
        </div>
        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
          <span class="tech-tag-pill">Java</span>
          <span class="tech-tag-pill">Android Studio</span>
          <span class="tech-tag-pill">2D Mobile Game</span>
          <span class="tech-tag-pill">Power-Ups</span>
          <span class="tech-tag-pill">High Score</span>
        </div>
      `
    }
  };

  document.querySelectorAll('.open-project-modal-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const projKey = btn.getAttribute('data-project');
      const data = projectModalData[projKey];
      if (data && modalOverlay && modalTitle && modalBody) {
        modalTitle.textContent = data.title;
        modalBody.innerHTML = data.content;
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  function closeModal() {
    if (modalOverlay) {
      modalOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('active')) {
      closeModal();
    }
  });

  // ==========================================
  // 7. Scroll-Triggered Reveal Animations
  // ==========================================
  const scrollElements = document.querySelectorAll('.reveal-on-scroll');
  if ('IntersectionObserver' in window && scrollElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    scrollElements.forEach((el) => revealObserver.observe(el));
  } else {
    scrollElements.forEach((el) => el.classList.add('revealed'));
  }
});

// ==========================================
// Lava Leap Mini Demo — portfolio browser game
// ==========================================
(() => {
  const openBtn = document.getElementById('open-lava-demo');
  const overlay = document.getElementById('lava-demo-modal');
  const closeBtn = document.getElementById('lava-demo-close');
  const canvas = document.getElementById('lava-game-canvas');
  const startBtn = document.getElementById('lava-start-btn');
  const restartBtn = document.getElementById('lava-restart-btn');
  const leftBtn = document.getElementById('lava-left-btn');
  const rightBtn = document.getElementById('lava-right-btn');
  const message = document.getElementById('lava-game-message');
  const scoreEl = document.getElementById('lava-score');
  const coinsEl = document.getElementById('lava-coins');
  const bestEl = document.getElementById('lava-best');

  if (!openBtn || !overlay || !canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const W = canvas.width;
  const H = canvas.height;
  let raf = 0;
  let running = false;
  let last = 0;
  let score = 0;
  let coins = 0;
  let best = Number(localStorage.getItem('lavaLeapDemoBest') || 0);
  let elapsed = 0;
  let lavaY = H - 25;
  let keys = { left: false, right: false };

  const player = { x: 80, y: 285, w: 26, h: 34, vx: 0, vy: 0 };
  let platforms = [];
  let coinItems = [];

  if (bestEl) bestEl.textContent = String(best);

  function resetWorld() {
    score = 0;
    coins = 0;
    elapsed = 0;
    lavaY = H - 24;
    player.x = 78;
    player.y = 285;
    player.vx = 0;
    player.vy = -7.6;
    platforms = [
      { x: 35, y: 350, w: 125, h: 14, dx: 0 },
      { x: 205, y: 305, w: 100, h: 14, dx: 0.45 },
      { x: 360, y: 255, w: 110, h: 14, dx: -0.55 },
      { x: 530, y: 210, w: 105, h: 14, dx: 0.62 },
      { x: 650, y: 155, w: 78, h: 14, dx: -0.4 }
    ];
    coinItems = [
      { x: 245, y: 275, r: 7, taken: false },
      { x: 412, y: 225, r: 7, taken: false },
      { x: 575, y: 180, r: 7, taken: false },
      { x: 686, y: 125, r: 7, taken: false }
    ];
    updateHud();
    draw();
  }

  function updateHud() {
    if (scoreEl) scoreEl.textContent = String(Math.floor(score));
    if (coinsEl) coinsEl.textContent = String(coins);
    if (bestEl) bestEl.textContent = String(best);
  }

  function startGame() {
    cancelAnimationFrame(raf);
    resetWorld();
    running = true;
    last = performance.now();
    if (message) message.classList.add('hidden');
    raf = requestAnimationFrame(loop);
  }

  function stopGame(text) {
    running = false;
    cancelAnimationFrame(raf);
    const finalScore = Math.floor(score);
    if (finalScore > best) {
      best = finalScore;
      localStorage.setItem('lavaLeapDemoBest', String(best));
    }
    updateHud();
    if (message) {
      message.classList.remove('hidden');
      message.innerHTML = `
        <strong>${text}</strong>
        <span>Score: ${finalScore} &nbsp;•&nbsp; Coins: ${coins} &nbsp;•&nbsp; Best: ${best}</span>
        <button id="lava-play-again-btn" type="button" class="btn-gotham-primary">Play Again</button>
      `;
      const again = document.getElementById('lava-play-again-btn');
      if (again) again.addEventListener('click', startGame, { once: true });
    }
  }

  function loop(now) {
    if (!running) return;
    const dt = Math.min(32, now - last) / 16.6667;
    last = now;
    elapsed += dt;
    update(dt);
    draw();
    raf = requestAnimationFrame(loop);
  }

  function update(dt) {
    const accel = 0.48 * dt;
    const maxSpeed = 4.6;
    if (keys.left) player.vx -= accel;
    if (keys.right) player.vx += accel;
    if (!keys.left && !keys.right) player.vx *= Math.pow(0.82, dt);
    player.vx = Math.max(-maxSpeed, Math.min(maxSpeed, player.vx));

    player.vy += 0.42 * dt;
    const oldBottom = player.y + player.h;
    player.x += player.vx * dt;
    player.y += player.vy * dt;

    if (player.x < 0) { player.x = 0; player.vx *= -0.3; }
    if (player.x + player.w > W) { player.x = W - player.w; player.vx *= -0.3; }

    platforms.forEach((p) => {
      p.x += p.dx * dt * (1 + Math.min(elapsed / 900, 0.8));
      if (p.x < 6 || p.x + p.w > W - 6) p.dx *= -1;
      if (player.vy > 0 &&
          oldBottom <= p.y + 4 &&
          player.y + player.h >= p.y &&
          player.x + player.w > p.x &&
          player.x < p.x + p.w) {
        player.y = p.y - player.h;
        player.vy = -8.2;
        score += 12;
      }
    });

    coinItems.forEach((c) => {
      if (c.taken) return;
      const cx = player.x + player.w / 2;
      const cy = player.y + player.h / 2;
      if (Math.hypot(cx - c.x, cy - c.y) < 23) {
        c.taken = true;
        coins += 1;
        score += 75;
      }
    });

    const riseSpeed = 0.015 + Math.min(elapsed / 35000, 0.035);
    lavaY -= riseSpeed * dt * 16;
    score += 0.12 * dt;
    updateHud();

    if (player.y + player.h >= lavaY || player.y > H + 60) {
      stopGame('The lava caught you!');
    } else if (coinItems.every((c) => c.taken)) {
      stopGame('All coins collected!');
    }
  }

  function roundRect(x, y, w, h, r) {
    const rr = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + rr, y);
    ctx.arcTo(x + w, y, x + w, y + h, rr);
    ctx.arcTo(x + w, y + h, x, y + h, rr);
    ctx.arcTo(x, y + h, x, y, rr);
    ctx.arcTo(x, y, x + w, y, rr);
    ctx.closePath();
  }

  function draw() {
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, '#071827');
    grad.addColorStop(1, '#111827');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // skyline
    ctx.fillStyle = 'rgba(5,10,18,0.92)';
    for (let i = 0; i < 16; i++) {
      const bw = 42 + (i % 3) * 12;
      const bh = 48 + ((i * 31) % 95);
      const bx = i * 52;
      ctx.fillRect(bx, 120 - bh + 100, bw, bh + 70);
    }

    // subtle grid
    ctx.strokeStyle = 'rgba(34,211,238,0.055)';
    ctx.lineWidth = 1;
    for (let x = 0; x <= W; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
    for (let y = 0; y <= H; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

    // platforms
    platforms.forEach((p, idx) => {
      const pg = ctx.createLinearGradient(p.x, p.y, p.x + p.w, p.y + p.h);
      pg.addColorStop(0, idx % 2 ? '#22d3ee' : '#8b5cf6');
      pg.addColorStop(1, '#1e293b');
      ctx.fillStyle = pg;
      roundRect(p.x, p.y, p.w, p.h, 6);
      ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.18)';
      ctx.fillRect(p.x + 8, p.y + 3, Math.max(10, p.w - 16), 2);
    });

    // coins
    coinItems.forEach((c) => {
      if (c.taken) return;
      ctx.beginPath();
      ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
      ctx.fillStyle = '#fbbf24';
      ctx.shadowColor = '#f59e0b';
      ctx.shadowBlur = 14;
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.strokeStyle = '#fde68a';
      ctx.stroke();
    });

    // player
    ctx.fillStyle = '#e2e8f0';
    roundRect(player.x, player.y, player.w, player.h, 7);
    ctx.fill();
    ctx.fillStyle = '#22d3ee';
    ctx.fillRect(player.x + 5, player.y + 7, 5, 5);
    ctx.fillRect(player.x + 16, player.y + 7, 5, 5);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(player.x + 7, player.y + 23, 12, 3);

    // lava
    const lg = ctx.createLinearGradient(0, lavaY, 0, H);
    lg.addColorStop(0, '#fb923c');
    lg.addColorStop(0.2, '#ef4444');
    lg.addColorStop(1, '#7f1d1d');
    ctx.fillStyle = lg;
    ctx.fillRect(0, lavaY, W, H - lavaY);
    ctx.fillStyle = 'rgba(255,237,213,0.9)';
    for (let x = 0; x < W; x += 36) {
      ctx.beginPath();
      ctx.arc(x + ((elapsed * 0.7) % 18), lavaY + Math.sin((x + elapsed * 3) * 0.03) * 3, 5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function setKey(side, active) { keys[side] = active; }

  window.addEventListener('keydown', (e) => {
    if (!overlay.classList.contains('active')) return;
    const tag = document.activeElement && document.activeElement.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA') return;
    if (e.key === 'ArrowLeft' || e.key.toLowerCase() === 'a') { e.preventDefault(); setKey('left', true); }
    if (e.key === 'ArrowRight' || e.key.toLowerCase() === 'd') { e.preventDefault(); setKey('right', true); }
  });
  window.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft' || e.key.toLowerCase() === 'a') setKey('left', false);
    if (e.key === 'ArrowRight' || e.key.toLowerCase() === 'd') setKey('right', false);
  });

  function bindHold(button, side) {
    if (!button) return;
    const on = (e) => { e.preventDefault(); setKey(side, true); };
    const off = (e) => { e.preventDefault(); setKey(side, false); };
    button.addEventListener('pointerdown', on);
    button.addEventListener('pointerup', off);
    button.addEventListener('pointercancel', off);
    button.addEventListener('pointerleave', off);
  }
  bindHold(leftBtn, 'left');
  bindHold(rightBtn, 'right');

  openBtn.addEventListener('click', () => {
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    resetWorld();
  });
  function closeDemo() {
    running = false;
    cancelAnimationFrame(raf);
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    keys.left = keys.right = false;
  }
  if (closeBtn) closeBtn.addEventListener('click', closeDemo);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeDemo(); });
  if (startBtn) startBtn.addEventListener('click', startGame);
  if (restartBtn) restartBtn.addEventListener('click', startGame);

  resetWorld();
})();
