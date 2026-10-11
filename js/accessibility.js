// כפתור נגישות: הגדלת טקסט, ניגודיות, הדגשת קישורים, עצירת תנועה.
// ההגדרות נשמרות בדפדפן של המבקר, כך שיישארו גם בביקור הבא.
(function () {
  var root = document.documentElement;
  var KEY = 'inbal-a11y';
  var SIZES = [100, 112, 125, 140];            // אחוזי גודל הטקסט
  var state = { size: 0, contrast: false, links: false, motion: false };

  try { var saved = JSON.parse(localStorage.getItem(KEY)); if (saved) state = Object.assign(state, saved); } catch (e) {}

  var toggle = document.querySelector('.a11y-toggle');
  var panel = document.getElementById('a11y-panel');

  function apply() {
    root.style.fontSize = SIZES[state.size] + '%';
    root.classList.toggle('a11y-contrast', state.contrast);
    root.classList.toggle('a11y-links', state.links);
    root.classList.toggle('a11y-nomotion', state.motion);
    panel.querySelector('[data-act="contrast"]').setAttribute('aria-pressed', state.contrast);
    panel.querySelector('[data-act="links"]').setAttribute('aria-pressed', state.links);
    panel.querySelector('[data-act="motion"]').setAttribute('aria-pressed', state.motion);
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {}
    window.dispatchEvent(new Event('a11ychange'));
  }

  function setOpen(open) {
    panel.hidden = !open;
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  toggle.addEventListener('click', function () { setOpen(panel.hidden); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !panel.hidden) { setOpen(false); toggle.focus(); } });
  document.addEventListener('click', function (e) { if (!panel.hidden && !e.target.closest('.a11y')) setOpen(false); });

  panel.addEventListener('click', function (e) {
    var act = e.target.getAttribute('data-act');
    if (!act) return;
    if (act === 'bigger') state.size = Math.min(SIZES.length - 1, state.size + 1);
    if (act === 'smaller') state.size = Math.max(0, state.size - 1);
    if (act === 'contrast') state.contrast = !state.contrast;
    if (act === 'links') state.links = !state.links;
    if (act === 'motion') state.motion = !state.motion;
    if (act === 'reset') state = { size: 0, contrast: false, links: false, motion: false };
    apply();
  });

  apply();
})();
