// גלריה מתחלפת + הגדלת תמונה (Lightbox)
(function () {
  var slides = document.querySelectorAll('.slide');
  var dots = document.querySelectorAll('.dot');
  var carousel = document.querySelector('.carousel');
  var box = document.getElementById('lightbox');
  var big = document.getElementById('lb-img');
  var current = 0;
  var timer = null;
  var DELAY = 5000; // כמה מילישניות כל תמונה מוצגת (5000 = 5 שניות)
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // מעבר לתמונה מספר i
  function goTo(i) {
    current = (i + slides.length) % slides.length; // אחרי האחרונה חוזרים לראשונה
    slides.forEach(function (s, n) { s.classList.toggle('is-active', n === current); });
    dots.forEach(function (d, n) { d.classList.toggle('is-active', n === current); });
  }

  // החלפה אוטומטית (לא פועלת למי שביקש פחות תנועה)
  function start() { if (!reduceMotion && !timer) timer = setInterval(function () { goTo(current + 1); }, DELAY); }
  function stop() { clearInterval(timer); timer = null; }

  carousel.querySelector('.c-prev').addEventListener('click', function () { goTo(current - 1); });
  carousel.querySelector('.c-next').addEventListener('click', function () { goTo(current + 1); });
  dots.forEach(function (d, n) { d.addEventListener('click', function () { goTo(n); }); });

  // עוצרים כשהעכבר מעל הגלריה או כשמשתמשים במקלדת
  carousel.addEventListener('mouseenter', stop);
  carousel.addEventListener('mouseleave', start);
  carousel.addEventListener('focusin', stop);
  carousel.addEventListener('focusout', start);

  // החלקה באצבע במובייל
  var x0 = null;
  carousel.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; stop(); }, { passive: true });
  carousel.addEventListener('touchend', function (e) {
    if (x0 !== null) {
      var dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 40) goTo(dx > 0 ? current + 1 : current - 1); // באתר מימין לשמאל, החלקה ימינה = הבאה
    }
    x0 = null; start();
  }, { passive: true });

  // ---- הגדלה ----
  var lbIndex = 0;
  function showBig(i) {
    lbIndex = (i + slides.length) % slides.length;
    var img = slides[lbIndex].querySelector('.fg');
    big.src = img.src;
    big.alt = img.alt;
  }
  slides.forEach(function (s, i) {
    s.addEventListener('click', function () { stop(); showBig(i); box.showModal(); });
  });
  box.addEventListener('close', function () { goTo(lbIndex); start(); });
  box.querySelector('.lb-close').addEventListener('click', function () { box.close(); });
  box.querySelector('.lb-prev').addEventListener('click', function () { showBig(lbIndex - 1); });
  box.querySelector('.lb-next').addEventListener('click', function () { showBig(lbIndex + 1); });
  box.addEventListener('click', function (e) { if (e.target === box) box.close(); });
  box.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') showBig(lbIndex - 1);
    if (e.key === 'ArrowLeft') showBig(lbIndex + 1);
  });

  start();
})();
