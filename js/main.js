// תפריט עליון, גלריה מתחלפת והגדלת תמונה (Lightbox)
(function () {
  var root = document.documentElement;

  // ---------- תפריט (במובייל נפתח בלחיצה על שלושת הקווים) ----------
  var toggle = document.querySelector('.menu-toggle');
  var menu = document.getElementById('menu');
  function closeMenu() { menu.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); }
  toggle.addEventListener('click', function () {
    var open = menu.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  menu.addEventListener('click', function (e) { if (e.target.tagName === 'A') closeMenu(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });

  // ---------- גלריה מתחלפת ----------
  var carousel = document.querySelector('.carousel');
  var stage = carousel.querySelector('.stage');
  var slides = carousel.querySelectorAll('.slide');
  var dots = carousel.querySelectorAll('.dot');
  var pauseBtn = carousel.querySelector('.c-pause');
  var current = 0, timer = null, hovering = false, userPaused = false;
  var DELAY = 5000; // כמה מילישניות כל תמונה מוצגת (5000 = 5 שניות)
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  // גובה המסגרת לפי יחס התמונה (ולא יותר מ-80% מגובה המסך), כך שדבר לא נחתך
  function fit() {
    var s = slides[current];
    var h = stage.clientWidth * (+s.dataset.h) / (+s.dataset.w);
    stage.style.height = Math.min(h, window.innerHeight * 0.8) + 'px';
  }

  function goTo(i) {
    current = (i + slides.length) % slides.length; // אחרי האחרונה חוזרים לראשונה
    slides.forEach(function (s, n) {
      s.classList.toggle('is-active', n === current);
      s.inert = n !== current; // תמונות שלא מוצגות לא נכנסות לניווט במקלדת
    });
    dots.forEach(function (d, n) { d.classList.toggle('is-active', n === current); });
    fit();
  }

  function canPlay() {
    return !userPaused && !hovering && !reduceMotion.matches && !root.classList.contains('a11y-nomotion');
  }
  function stop() { clearInterval(timer); timer = null; }
  function start() {
    stop();
    if (canPlay()) timer = setInterval(function () { goTo(current + 1); }, DELAY);
  }

  carousel.querySelector('.c-prev').addEventListener('click', function () { goTo(current - 1); });
  carousel.querySelector('.c-next').addEventListener('click', function () { goTo(current + 1); });
  dots.forEach(function (d, n) { d.addEventListener('click', function () { goTo(n); }); });

  pauseBtn.addEventListener('click', function () {
    userPaused = !userPaused;
    pauseBtn.setAttribute('aria-pressed', userPaused ? 'true' : 'false');
    pauseBtn.textContent = userPaused ? '▶' : '❚❚';
    pauseBtn.setAttribute('aria-label', userPaused ? 'המשך החלפה אוטומטית' : 'עצירת ההחלפה האוטומטית');
    start();
  });

  carousel.addEventListener('mouseenter', function () { hovering = true; start(); });
  carousel.addEventListener('mouseleave', function () { hovering = false; start(); });
  carousel.addEventListener('focusin', function () { hovering = true; start(); });
  carousel.addEventListener('focusout', function () { hovering = false; start(); });
  window.addEventListener('resize', fit);
  window.addEventListener('a11ychange', start); // כפתור הנגישות עצר/הפעיל תנועה

  // החלקה באצבע במובייל (באתר מימין לשמאל, החלקה ימינה = התמונה הבאה)
  var x0 = null;
  carousel.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
  carousel.addEventListener('touchend', function (e) {
    if (x0 === null) return;
    var dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 40) goTo(dx > 0 ? current + 1 : current - 1);
    x0 = null;
  }, { passive: true });

  // ---------- הגדלה ----------
  var box = document.getElementById('lightbox');
  var big = document.getElementById('lb-img');
  var lbIndex = 0;
  function showBig(i) {
    lbIndex = (i + slides.length) % slides.length;
    var img = slides[lbIndex].querySelector('.fg');
    big.src = img.src;
    big.alt = img.alt;
  }
  slides.forEach(function (s, i) {
    s.addEventListener('click', function () { hovering = true; start(); showBig(i); box.showModal(); });
  });
  box.addEventListener('close', function () { hovering = false; goTo(lbIndex); start(); });
  box.querySelector('.lb-close').addEventListener('click', function () { box.close(); });
  box.querySelector('.lb-prev').addEventListener('click', function () { showBig(lbIndex - 1); });
  box.querySelector('.lb-next').addEventListener('click', function () { showBig(lbIndex + 1); });
  box.addEventListener('click', function (e) { if (e.target === box) box.close(); });
  box.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') showBig(lbIndex - 1);
    if (e.key === 'ArrowLeft') showBig(lbIndex + 1);
  });

  goTo(0);
  start();
})();
