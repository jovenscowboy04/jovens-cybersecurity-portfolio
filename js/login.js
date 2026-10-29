(() => {
  const USERS = [
    {
      email: 'vilbrunj@kean.edu',
      password: '555153',
      role: 'user',
      name: 'Jovens Vilbrun'
    },
    {
      email: 'jovensadmin.demo.com',
      password: '555153',
      role: 'admin',
      name: 'Jovens Admin'
    }
  ];

  const SESSION_KEY = 'jovensAuthSession';
  const REMEMBER_KEY = 'jovensRememberedEmail';
  const LOG_KEY = 'jovensSecurityLogs';

  function addLog(message, type = 'info') {
    const logs = JSON.parse(localStorage.getItem(LOG_KEY) || '[]');
    logs.unshift({
      time: new Date().toLocaleString(),
      message,
      type
    });
    localStorage.setItem(LOG_KEY, JSON.stringify(logs.slice(0, 25)));
  }

  function saveSession(user, remember) {
    const session = {
      email: user.email,
      name: user.name,
      role: user.role,
      authenticated: true,
      loginTime: Date.now()
    };
    const target = remember ? localStorage : sessionStorage;
    target.setItem(SESSION_KEY, JSON.stringify(session));
    if (remember) {
      localStorage.setItem(REMEMBER_KEY, user.email);
    } else {
      localStorage.removeItem(REMEMBER_KEY);
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('login-form');
    const email = document.getElementById('login-email');
    const password = document.getElementById('login-password');
    const emailError = document.getElementById('email-error');
    const passwordError = document.getElementById('password-error');
    const status = document.getElementById('login-status');
    const toggle = document.getElementById('password-toggle');
    const guestBtn = document.getElementById('guest-btn');
    const forgot = document.getElementById('forgot-password');
    const remember = document.getElementById('remember-me');
    const userFill = document.getElementById('fill-user-demo');
    const adminFill = document.getElementById('fill-admin-demo');

    const rememberedEmail = localStorage.getItem(REMEMBER_KEY);
    if (rememberedEmail && email) {
      email.value = rememberedEmail;
      if (remember) remember.checked = true;
    }

    function fillCredentials(kind) {
      const account = USERS.find((item) => item.role === kind);
      if (!account || !email || !password) return;
      email.value = account.email;
      password.value = account.password;
      status.textContent = `${account.role === 'admin' ? 'Administrator' : 'Regular user'} demo credentials loaded.`;
      status.className = 'login-status info';
    }

    userFill?.addEventListener('click', () => fillCredentials('user'));
    adminFill?.addEventListener('click', () => fillCredentials('admin'));

    if (toggle && password) {
      toggle.addEventListener('click', () => {
        const showing = password.type === 'text';
        password.type = showing ? 'password' : 'text';
        toggle.textContent = showing ? 'Show' : 'Hide';
        toggle.setAttribute('aria-label', showing ? 'Show password' : 'Hide password');
      });
    }

    if (form) {
      form.addEventListener('submit', (event) => {
        event.preventDefault();
        emailError.textContent = '';
        passwordError.textContent = '';
        status.textContent = '';
        status.className = 'login-status';

        let valid = true;
        if (!email.value.trim()) {
          emailError.textContent = 'Enter your account email.';
          valid = false;
        }
        if (password.value.length < 6) {
          passwordError.textContent = 'Password must be at least 6 characters.';
          valid = false;
        }
        if (!valid) return;

        const account = USERS.find(
          (item) => item.email.toLowerCase() === email.value.trim().toLowerCase() && item.password === password.value
        );

        if (!account) {
          status.textContent = 'Email or password is incorrect.';
          status.classList.add('error');
          addLog(`Failed login attempt for ${email.value.trim() || 'unknown account'}`, 'warning');
          return;
        }

        saveSession(account, Boolean(remember?.checked));
        addLog(`${account.name} authenticated successfully as ${account.role}.`, 'success');
        status.textContent = 'Authentication successful. Opening your authorized dashboard…';
        status.classList.add('success');
        setTimeout(() => {
          window.location.href = 'account.html';
        }, 450);
      });
    }

    guestBtn?.addEventListener('click', () => {
      addLog('Guest entered the public portfolio.', 'info');
      window.location.href = 'index.html';
    });

    forgot?.addEventListener('click', (event) => {
      event.preventDefault();
      status.textContent = 'Password recovery is not connected on this portfolio site.';
      status.className = 'login-status info';
    });
  });
})();
