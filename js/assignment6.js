(function () {
  const input = document.getElementById('xss-input');
  const unsafeCode = document.getElementById('xss-unsafe-code');
  const safeCode = document.getElementById('xss-safe-code');
  const risk = document.getElementById('xss-risk-result');
  const preview = document.getElementById('xss-safe-preview');
  const analyze = document.getElementById('xss-analyze');
  if (!input || !unsafeCode || !safeCode || !risk || !preview || !analyze) return;

  const presets = {
    normal: 'Welcome to my portfolio!',
    html: '<b>Great portfolio!</b>',
    script: '<script>alert("demo")<\/script>'
  };

  function encodeHtml(value) {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function looksSuspicious(value) {
    return /<\/?[a-z][^>]*>|javascript\s*:|on[a-z]+\s*=|<script\b/i.test(value);
  }

  function render() {
    const value = input.value.slice(0, 500);
    unsafeCode.textContent = '<div class="comment">' + value + '</div>';
    safeCode.textContent = encodeHtml(value);
    preview.textContent = value;

    if (!value.trim()) {
      risk.textContent = 'Validation result: empty input should be rejected when a comment is required.';
      risk.className = 'a6-result warning';
    } else if (looksSuspicious(value)) {
      risk.textContent = 'Validation result: HTML/script-like tokens were detected. A field that expects plain text should reject or sanitize this input.';
      risk.className = 'a6-result danger';
    } else {
      risk.textContent = 'Validation result: the input looks like normal plain text, but direct HTML insertion would still be an unsafe design.';
      risk.className = 'a6-result warning';
    }
  }

  document.querySelectorAll('[data-xss-preset]').forEach((button) => {
    button.addEventListener('click', () => {
      input.value = presets[button.dataset.xssPreset] || '';
      render();
    });
  });

  analyze.addEventListener('click', render);
  render();
})();
