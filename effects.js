/* kylekramer.ai — interactive enhancements
   tilt · scroll reveal · neural hero · count-up stats · gorilla egg · dark mode */
(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- footer year ---- */
  var yr = document.getElementById('yr');
  if (yr) yr.textContent = new Date().getFullYear();

  /* ---- dark mode toggle (persisted) ---- */
  var root = document.documentElement;
  function setTheme(t) {
    if (t === 'dark') root.classList.add('dark'); else root.classList.remove('dark');
    try { localStorage.setItem('kk-theme', t); } catch (e) {}
    document.querySelectorAll('.theme-toggle').forEach(function (b) {
      b.setAttribute('aria-label', t === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    });
  }
  document.querySelectorAll('.theme-toggle').forEach(function (btn) {
    btn.addEventListener('click', function () {
      setTheme(root.classList.contains('dark') ? 'light' : 'dark');
    });
  });

  /* ---- count-up stats ---- */
  function animateCount(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var pre = el.getAttribute('data-prefix') || '';
    var suf = el.getAttribute('data-suffix') || '';
    if (reduce) { el.textContent = pre + target + suf; return; }
    var dur = 1400, start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = pre + Math.round(target * eased) + suf;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* ---- scroll reveal + trigger counters ---- */
  var revealTargets = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('in');
          en.target.querySelectorAll('.count[data-count]').forEach(function (c) {
            if (!c.dataset.done) { c.dataset.done = '1'; animateCount(c); }
          });
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12 });
    revealTargets.forEach(function (t) { io.observe(t); });
  } else {
    revealTargets.forEach(function (t) { t.classList.add('in'); });
    document.querySelectorAll('.count[data-count]').forEach(animateCount);
  }

  if (reduce) {
    revealTargets.forEach(function (t) { t.classList.add('in'); });
    document.querySelectorAll('.count[data-count]').forEach(animateCount);
  }

  /* ---- 3D tilt on book photo ---- */
  if (!reduce) {
    document.querySelectorAll('[data-tilt]').forEach(function (el) {
      var img = el.querySelector('.book-photo');
      var shine = el.querySelector('.tilt-shine');
      var MAX = 12;
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        if (img) img.style.transform = 'rotateX(' + ((0.5 - py) * MAX * 2) + 'deg) rotateY(' + ((px - 0.5) * MAX * 2) + 'deg) scale(1.03)';
        if (shine) { shine.style.setProperty('--mx', (px * 100) + '%'); shine.style.setProperty('--my', (py * 100) + '%'); }
      });
      el.addEventListener('mouseleave', function () { if (img) img.style.transform = 'rotateX(0deg) rotateY(0deg)'; });
    });
  }

  /* ---- neural-network hero canvas ---- */
  var canvas = document.getElementById('hero-canvas');
  if (canvas && !reduce) {
    var ctx = canvas.getContext('2d');
    var nodes = [], mouse = { x: -9999, y: -9999 }, W, H, raf;
    function size() {
      var r = canvas.parentElement.getBoundingClientRect();
      W = canvas.width = r.width; H = canvas.height = r.height;
      var count = Math.min(70, Math.floor(W / 18));
      nodes = [];
      for (var i = 0; i < count; i++) {
        nodes.push({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4 });
      }
    }
    function accent() { return root.classList.contains('dark') ? '199,154,82' : '176,132,64'; }
    function draw() {
      ctx.clearRect(0, 0, W, H);
      var c = accent();
      for (var i = 0; i < nodes.length; i++) {
        var n = nodes[i];
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > W) n.vx *= -1;
        if (n.y < 0 || n.y > H) n.vy *= -1;
        var dxm = n.x - mouse.x, dym = n.y - mouse.y, dm = Math.sqrt(dxm * dxm + dym * dym);
        if (dm < 140) { n.x += dxm / dm * 0.8; n.y += dym / dm * 0.8; }
        for (var j = i + 1; j < nodes.length; j++) {
          var m = nodes[j], dx = n.x - m.x, dy = n.y - m.y, d = Math.sqrt(dx * dx + dy * dy);
          if (d < 120) {
            ctx.strokeStyle = 'rgba(' + c + ',' + (0.18 * (1 - d / 120)) + ')';
            ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(n.x, n.y); ctx.lineTo(m.x, m.y); ctx.stroke();
          }
        }
        ctx.fillStyle = 'rgba(' + c + ',0.55)';
        ctx.beginPath(); ctx.arc(n.x, n.y, 1.8, 0, Math.PI * 2); ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    }
    window.addEventListener('resize', size);
    canvas.parentElement.addEventListener('mousemove', function (e) {
      var r = canvas.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
    });
    canvas.parentElement.addEventListener('mouseleave', function () { mouse.x = -9999; mouse.y = -9999; });
    size(); draw();
  }

  /* ---- gorilla easter egg (type "gorilla" or Konami code) ---- */
  var buf = '', konami = [38,38,40,40,37,39,37,39,66,65], kpos = 0;
  function gorilla() {
    if (document.getElementById('kk-gorilla')) return;
    var g = document.createElement('div');
    g.id = 'kk-gorilla';
    g.innerHTML = '<div class="kk-gorilla-emoji">🦍</div><div class="kk-gorilla-note">You saw the gorilla. Most people miss it. <a href="writing.html">Read why &rarr;</a></div>';
    document.body.appendChild(g);
    setTimeout(function () { g.classList.add('go'); }, 30);
    setTimeout(function () { g.classList.add('bye'); }, 6500);
    setTimeout(function () { if (g.parentNode) g.parentNode.removeChild(g); }, 7600);
  }
  window.addEventListener('keydown', function (e) {
    buf = (buf + (e.key || '')).toLowerCase().slice(-7);
    if (buf.indexOf('gorilla') > -1) { buf = ''; gorilla(); }
    if (e.keyCode === konami[kpos]) { kpos++; if (kpos === konami.length) { kpos = 0; gorilla(); } } else { kpos = 0; }
  });

  /* ---- Portfolio lightbox / slideshow ---- */
  var lb = document.getElementById('lightbox');
  if (lb) {
    var lbImg = document.getElementById('lbImg'),
        lbCap = document.getElementById('lbCap'),
        lbCount = document.getElementById('lbCount'),
        lbStage = document.getElementById('lbStage'),
        lbPrev = document.getElementById('lbPrev'),
        lbNext = document.getElementById('lbNext'),
        lbClose = document.getElementById('lbClose');
    var items = [], pos = 0;

    function parseGallery(str) {
      return str.split('||').map(function (e) {
        var parts = e.split('::');
        return { src: parts[0], cap: parts[1] || '' };
      });
    }
    function render() {
      var it = items[pos];
      lbStage.classList.remove('zoom');
      lbImg.src = it.src; lbImg.alt = it.cap;
      lbCap.textContent = it.cap;
      var multi = items.length > 1;
      lbCount.textContent = multi ? (pos + 1) + ' / ' + items.length : '';
      lbPrev.hidden = !multi; lbNext.hidden = !multi;
    }
    function open(gallery, start) {
      items = parseGallery(gallery); pos = start || 0;
      render();
      lb.classList.add('open'); lb.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
    function close() {
      lb.classList.remove('open'); lb.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
    function go(d) { pos = (pos + d + items.length) % items.length; render(); }

    document.querySelectorAll('.pf-cover[data-gallery]').forEach(function (el) {
      el.addEventListener('click', function (e) {
        e.preventDefault();
        open(el.getAttribute('data-gallery'), 0);
      });
    });
    lbPrev.addEventListener('click', function (e) { e.stopPropagation(); go(-1); });
    lbNext.addEventListener('click', function (e) { e.stopPropagation(); go(1); });
    lbClose.addEventListener('click', close);
    lbImg.addEventListener('click', function (e) { e.stopPropagation(); lbStage.classList.toggle('zoom'); });
    lb.addEventListener('click', function (e) { if (e.target === lb || e.target === lbStage) close(); });
    document.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowRight') go(1);
      else if (e.key === 'ArrowLeft') go(-1);
    });
  }

})();
