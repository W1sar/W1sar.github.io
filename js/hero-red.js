/* Red de partículas del inicio: canvas 2D propio, sin librerías. Se pausa fuera de pantalla y respeta reduced-motion. */
(function () {
  var cv = document.getElementById("hero-red");
  if (!cv || !cv.getContext) return;
  var ctx = cv.getContext("2d");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var movil = window.matchMedia("(max-width: 767px)").matches;
  var W = 0, H = 0, dpr = 1, pts = [], visible = true, raf = 0;
  var mouse = { x: -9999, y: -9999 };
  var DIST = movil ? 110 : 140;

  function medir() {
    var r = cv.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = r.width; H = r.height;
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var n = Math.round((W * H) / (movil ? 26000 : 20000));
    n = Math.max(18, Math.min(n, movil ? 36 : 70));
    pts = [];
    for (var i = 0; i < n; i++) {
      pts.push({
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
        r: 0.7 + Math.random() * 0.9
      });
    }
  }

  function dibujar(mover) {
    ctx.clearRect(0, 0, W, H);
    var i, j, a, b, dx, dy, d;
    for (i = 0; i < pts.length; i++) {
      a = pts[i];
      if (mover) {
        a.x += a.vx; a.y += a.vy;
        if (a.x < -10) a.x = W + 10; else if (a.x > W + 10) a.x = -10;
        if (a.y < -10) a.y = H + 10; else if (a.y > H + 10) a.y = -10;
      }
      ctx.fillStyle = "rgba(244,244,240,.35)";
      ctx.beginPath(); ctx.arc(a.x, a.y, a.r, 0, 6.2832); ctx.fill();
      for (j = i + 1; j < pts.length; j++) {
        b = pts[j]; dx = a.x - b.x; dy = a.y - b.y; d = dx * dx + dy * dy;
        if (d < DIST * DIST) {
          ctx.strokeStyle = "rgba(244,244,240," + (0.11 * (1 - Math.sqrt(d) / DIST)).toFixed(3) + ")";
          ctx.lineWidth = 0.8;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }
      dx = a.x - mouse.x; dy = a.y - mouse.y; d = dx * dx + dy * dy;
      if (d < 160 * 160) {
        ctx.strokeStyle = "rgba(244,244,240," + (0.3 * (1 - Math.sqrt(d) / 160)).toFixed(3) + ")";
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
      }
    }
  }

  function loop() {
    if (!visible) { raf = 0; return; }
    dibujar(true);
    raf = requestAnimationFrame(loop);
  }
  function arrancar() { if (!raf && visible && !reduce) raf = requestAnimationFrame(loop); }

  medir();
  dibujar(false);
  if (reduce) { window.addEventListener("resize", function () { medir(); dibujar(false); }); return; }

  window.addEventListener("resize", function () { medir(); });
  if (!movil) {
    var hero = cv.parentNode;
    hero.addEventListener("pointermove", function (e) {
      var r = cv.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
    });
    hero.addEventListener("pointerleave", function () { mouse.x = mouse.y = -9999; });
  }
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (es) { visible = es[0].isIntersecting; if (visible) arrancar(); }, { threshold: 0 }).observe(cv);
  }
  document.addEventListener("visibilitychange", function () {
    visible = !document.hidden; if (visible) arrancar();
  });
  arrancar();
})();
