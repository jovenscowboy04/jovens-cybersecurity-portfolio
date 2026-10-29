(() => {
  const SESSION_KEY = 'jovensAuthSession';
  const LOG_KEY = 'jovensSecurityLogs';
  const PROFILE_KEY = 'jovensDemoProfile';
  const CONTENT_KEY = 'jovensDemoContent';

  function getSession() {
    const raw = sessionStorage.getItem(SESSION_KEY) || localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    try {
      const session = JSON.parse(raw);
      return session && session.authenticated ? session : null;
    } catch {
      return null;
    }
  }

  function addLog(message, type = 'info') {
    const logs = JSON.parse(localStorage.getItem(LOG_KEY) || '[]');
    logs.unshift({ time: new Date().toLocaleString(), message, type });
    localStorage.setItem(LOG_KEY, JSON.stringify(logs.slice(0, 25)));
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>'"]/g, (ch) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
    }[ch]));
  }

  document.addEventListener('DOMContentLoaded', () => {
    const session = getSession();
    if (!session) {
      window.location.replace('login.html');
      return;
    }

    const roleChip = document.getElementById('account-role');
    const nameNode = document.getElementById('account-name');
    const emailNode = document.getElementById('account-email');
    const loginTimeNode = document.getElementById('account-login-time');
    const userPanel = document.getElementById('regular-user-panel');
    const adminPanel = document.getElementById('admin-panel');
    const authzMessage = document.getElementById('authorization-message');
    const logout = document.getElementById('logout-btn');

    if (nameNode) nameNode.textContent = session.name;
    if (emailNode) emailNode.textContent = session.email;
    if (loginTimeNode) loginTimeNode.textContent = new Date(session.loginTime).toLocaleString();
    if (roleChip) {
      roleChip.textContent = session.role === 'admin' ? 'Administrator' : 'Regular User';
      roleChip.dataset.role = session.role;
    }

    if (userPanel) userPanel.hidden = false;
    if (adminPanel) adminPanel.hidden = session.role !== 'admin';
    if (authzMessage) {
      authzMessage.textContent = session.role === 'admin'
        ? 'Administrator access enabled.'
        : 'Standard account access.';
    }

    // Regular user profile editing demo
    const profileForm = document.getElementById('profile-form');
    const displayName = document.getElementById('profile-display-name');
    const bio = document.getElementById('profile-bio');
    const profileStatus = document.getElementById('profile-status');
    const savedProfile = JSON.parse(localStorage.getItem(PROFILE_KEY) || '{}');
    if (displayName) displayName.value = savedProfile.displayName || session.name;
    if (bio) bio.value = savedProfile.bio || 'IT student interested in technology, cybersecurity, and software projects.';

    profileForm?.addEventListener('submit', (event) => {
      event.preventDefault();
      const next = {
        displayName: displayName.value.trim().slice(0, 60),
        bio: bio.value.trim().slice(0, 220)
      };
      localStorage.setItem(PROFILE_KEY, JSON.stringify(next));
      addLog(`${session.name} edited the regular-user profile.`, 'info');
      profileStatus.textContent = 'Profile changes saved for this browser.';
    });

    // Admin-only controls
    const usersTable = document.getElementById('demo-users-body');
    if (usersTable && session.role === 'admin') {
      const users = [
        { name: 'Jovens Vilbrun', email: 'vilbrunj@kean.edu', role: 'Regular User', status: 'Active' },
        { name: 'Jovens Admin', email: 'jovensadmin.demo.com', role: 'Administrator', status: 'Active' }
      ];
      usersTable.innerHTML = users.map((user) => `
        <tr>
          <td>${escapeHtml(user.name)}</td>
          <td>${escapeHtml(user.email)}</td>
          <td>${escapeHtml(user.role)}</td>
          <td><span class="account-status-dot"></span>${escapeHtml(user.status)}</td>
        </tr>
      `).join('');
    }

    const logList = document.getElementById('security-log-list');
    if (logList && session.role === 'admin') {
      const logs = JSON.parse(localStorage.getItem(LOG_KEY) || '[]');
      logList.innerHTML = (logs.length ? logs : [{ time: 'No events yet', message: 'Security events will appear here.', type: 'info' }])
        .slice(0, 8)
        .map((log) => `<li><time>${escapeHtml(log.time)}</time><span>${escapeHtml(log.message)}</span></li>`)
        .join('');
    }

    const contentForm = document.getElementById('content-form');
    const contentHeadline = document.getElementById('content-headline');
    const contentStatus = document.getElementById('content-status');
    const savedContent = JSON.parse(localStorage.getItem(CONTENT_KEY) || '{}');
    if (contentHeadline) contentHeadline.value = savedContent.headline || 'Hi, I’m Jovens.';

    contentForm?.addEventListener('submit', (event) => {
      event.preventDefault();
      if (session.role !== 'admin') return;
      const value = contentHeadline.value.trim().slice(0, 80);
      localStorage.setItem(CONTENT_KEY, JSON.stringify({ headline: value }));
      addLog('Administrator updated demo website content.', 'success');
      contentStatus.textContent = 'Website content saved.';
    });

    logout?.addEventListener('click', () => {
      addLog(`${session.name} logged out.`, 'info');
      sessionStorage.removeItem(SESSION_KEY);
      localStorage.removeItem(SESSION_KEY);
      window.location.href = 'login.html';
    });
  });
})();
