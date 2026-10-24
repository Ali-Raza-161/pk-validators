(function () {
  'use strict';
  var V = window.PKValidators;
  var D = window.PKDemoData;
  if (!V || !D) return;

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }
  function render(type, result) {
    var el = document.getElementById('result-' + type);
    if (!result) { el.className = 'result'; el.innerHTML = '<p class="muted">Result yahan nazar aayega.</p>'; return; }
    if (!result.valid) {
      el.className = 'result invalid';
      el.innerHTML = '<strong class="bad">✕ Invalid</strong><p>' + esc(result.error) + '</p>';
      return;
    }
    var lines = '<strong class="ok">✓ Valid</strong>';
    if (result.formatted) lines += '<p><strong>Formatted:</strong> <code>' + esc(result.formatted) + '</code></p>';
    if (result.operator) lines += '<p><strong>Operator:</strong> ' + esc(result.operator) + '</p>';
    if (result.genderHint) lines += '<p><strong>Gender:</strong> ' + esc(result.genderHint) + ' <small>(hint only, not verified)</small></p>';
    if (result.bankCode) lines += '<p><strong>Bank code:</strong> ' + esc(result.bankCode) + ' · <strong>Check digits:</strong> ' + esc(result.checkDigits) + '</p>';
    el.className = 'result valid';
    el.innerHTML = lines;
  }
  function run(type, mode) {
    var input = document.getElementById('input-' + type);
    var value = input.value;
    var result;
    if (type === 'cnic') result = V.validateCNIC(value);
    else if (type === 'mobile') result = V.validateMobile(value);
    else if (type === 'ntn') result = V.validateNTN(value);
    else result = V.validateIBAN(value);
    if (mode === 'format' && result.valid) {
      input.value = result.formatted;
    }
    if (mode === 'format' && !result.valid) {
      // Try a format-only pass so a plain 13-digit CNIC still formats.
      var formatted = null;
      if (type === 'cnic') formatted = V.formatCNIC(value);
      if (type === 'mobile') formatted = V.formatMobile(value);
      if (type === 'ntn') formatted = V.formatNTN(value);
      if (type === 'iban') formatted = V.formatIBAN(value);
      if (formatted) { input.value = formatted; render(type, result); return; }
    }
    render(type, result);
  }

  document.querySelectorAll('[data-action]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var action = btn.getAttribute('data-action');
      var type = btn.getAttribute('data-type');
      if (action === 'validate') run(type, 'validate');
      if (action === 'format') run(type, 'format');
      if (action === 'example') {
        document.getElementById('input-' + type).value = D.EXAMPLES[type].valid;
        run(type, 'validate');
      }
      if (action === 'snippet') {
        var pre = document.getElementById('snippet-' + type);
        pre.textContent = D.SNIPPETS[type];
        pre.classList.toggle('show');
        if (pre.classList.contains('show') && navigator.clipboard) {
          navigator.clipboard.writeText(D.SNIPPETS[type]).catch(function () {});
        }
      }
    });
  });

  // Live validation on typing (debounced lightly by input event itself).
  ['cnic', 'mobile', 'ntn', 'iban'].forEach(function (type) {
    document.getElementById('input-' + type).addEventListener('input', function () {
      if (this.value.trim().length >= 5) run(type, 'validate');
      else render(type, null);
    });
  });

  // Examples grid
  var grid = document.getElementById('example-grid');
  var titles = { cnic: 'CNIC', mobile: 'Mobile', ntn: 'NTN', iban: 'IBAN' };
  Object.keys(D.EXAMPLES).forEach(function (type) {
    var ex = D.EXAMPLES[type];
    var div = document.createElement('div');
    div.className = 'example-card';
    div.innerHTML = '<h3>' + titles[type] + '</h3>' +
      '<code>✓ ' + esc(ex.valid) + '</code><small>' + esc(ex.validNote) + '</small>' +
      '<button class="btn-ghost" data-fill="' + type + '" data-kind="valid">Try valid</button> ' +
      '<code>✕ ' + esc(ex.invalid) + '</code><small>' + esc(ex.invalidNote) + '</small>' +
      '<button class="btn-ghost" data-fill="' + type + '" data-kind="invalid">Try invalid</button>';
    grid.appendChild(div);
  });
  grid.querySelectorAll('[data-fill]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var type = btn.getAttribute('data-fill');
      var kind = btn.getAttribute('data-kind');
      document.getElementById('input-' + type).value = D.EXAMPLES[type][kind];
      document.getElementById('card-' + type).scrollIntoView({ behavior: 'smooth', block: 'center' });
      run(type, 'validate');
    });
  });

  // Operators grid
  var og = document.getElementById('operator-grid');
  D.OPERATORS.forEach(function (op) {
    var div = document.createElement('div');
    div.innerHTML = '<strong>' + esc(op.name) + '</strong><span>' + esc(op.prefixes) + '</span>';
    og.appendChild(div);
  });
})();
