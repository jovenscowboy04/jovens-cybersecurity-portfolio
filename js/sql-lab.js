(() => {
  const input = document.getElementById('sql-lab-input');
  const runBtn = document.getElementById('sql-lab-run');
  const vulnerableQuery = document.getElementById('vulnerable-query');
  const vulnerableResult = document.getElementById('vulnerable-result');
  const secureQuery = document.getElementById('secure-query');
  const secureParams = document.getElementById('secure-params');
  const secureResult = document.getElementById('secure-result');
  const presets = document.querySelectorAll('[data-sql-preset]');
  if (!input || !runBtn) return;

  const allowed = /^[a-zA-Z0-9@._-]{1,60}$/;

  function escapeForDisplay(value) {
    return value.replace(/\\/g, '\\\\').replace(/'/g, "''");
  }

  function render() {
    const raw = input.value.trim();
    const display = raw || '(empty input)';

    // Educational display only: nothing on this page is sent to or executed by a database.
    vulnerableQuery.textContent = `SELECT id, username, role FROM users WHERE username = '${display}';`;

    const suspicious = /['";]|--|\/\*|\*\//.test(raw) || /\bor\b|\bunion\b|\bselect\b|\bdrop\b/i.test(raw);
    if (!raw) {
      vulnerableResult.className = 'sql-lab-status neutral';
      vulnerableResult.textContent = 'Enter a value to compare the two implementations.';
    } else if (suspicious) {
      vulnerableResult.className = 'sql-lab-status danger';
      vulnerableResult.textContent = 'Risk detected: raw input changes the SQL command structure when concatenated directly.';
    } else {
      vulnerableResult.className = 'sql-lab-status warning';
      vulnerableResult.textContent = 'This input looks normal, but direct string concatenation is still an unsafe design.';
    }

    secureQuery.textContent = 'SELECT id, username, role FROM users WHERE username = ?;';
    secureParams.textContent = raw ? JSON.stringify([raw]) : '[]';

    if (!raw) {
      secureResult.className = 'sql-lab-status neutral';
      secureResult.textContent = 'Waiting for input.';
    } else if (!allowed.test(raw)) {
      secureResult.className = 'sql-lab-status secure';
      secureResult.textContent = 'Input rejected by validation before database access. The prepared statement would still keep data separate from SQL code.';
    } else {
      secureResult.className = 'sql-lab-status secure';
      secureResult.textContent = 'Input accepted. The value is bound as a parameter, so it is treated as data rather than executable SQL.';
    }
  }

  runBtn.addEventListener('click', render);
  input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') render();
  });
  presets.forEach((button) => {
    button.addEventListener('click', () => {
      input.value = button.dataset.sqlPreset || '';
      render();
      input.focus();
    });
  });
  render();
})();
