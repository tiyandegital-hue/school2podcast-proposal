/* School2Podcast concept demo — site behaviour.
   No libraries. Everything degrades without JS (content is visible by default). */
'use strict';

/* ONE swappable constant: the business name. Applied to all [data-site] spans. */
var SITE_NAME = 'School2Podcast';

document.documentElement.classList.add('js');

function $(sel, ctx) { return (ctx || document).querySelector(sel); }
function $all(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }

function fmt(s) {
  s = Math.max(0, Math.floor(s));
  var m = Math.floor(s / 60), r = s % 60;
  return (m < 10 ? '0' + m : '' + m) + ':' + (r < 10 ? '0' + r : '' + r);
}

/* ---------- brand constant ---------- */
$all('[data-site]').forEach(function (el) { el.textContent = SITE_NAME; });
var yearEl = $('#year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ---------- mobile menu ---------- */
var menuBtn = $('#menuBtn'), navLinks = $('#navLinks');
if (menuBtn && navLinks) {
  menuBtn.addEventListener('click', function () {
    var open = navLinks.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    document.body.classList.toggle('locked', open);
  });
  $all('a', navLinks).forEach(function (a) {
    a.addEventListener('click', function () {
      navLinks.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('locked');
    });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && navLinks.classList.contains('open')) {
      navLinks.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('locked');
      menuBtn.focus();
    }
  });
}

/* ---------- entrances: masked line-rise + scroll reveals ---------- */
$all('.mask-line').forEach(function (el, i) {
  setTimeout(function () { el.classList.add('in'); }, 120 + i * 110);
});
if ('IntersectionObserver' in window) {
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) {
        var el = en.target;
        var d = parseInt(el.getAttribute('data-delay') || '0', 10);
        setTimeout(function () { el.classList.add('in'); }, d);
        io.unobserve(el);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  $all('.reveal').forEach(function (el) { io.observe(el); });
} else {
  $all('.reveal').forEach(function (el) { el.classList.add('in'); });
}

/* ---------- demo player: shared state across main console + mini player ---------- */
var player = { playing: false, elapsed: 0, duration: 1920, timer: null };

function buildWaveform(box, bars) {
  if (!box) return;
  box.innerHTML = '';
  for (var i = 0; i < (bars || 40); i++) {
    var s = document.createElement('span');
    var h = 12 + Math.round(Math.abs(Math.sin(i * 0.7) * 0.6 + Math.sin(i * 1.9 + 1.3) * 0.4) * 84);
    s.style.setProperty('--h', h + '%');
    s.style.animationDelay = (-(i * 0.07)).toFixed(2) + 's';
    s.style.animationDuration = (0.9 + (i % 5) * 0.08).toFixed(2) + 's';
    box.appendChild(s);
  }
}

function renderPlayer() {
  $all('[data-player-ui]').forEach(function (root) {
    var fill = $('.progress-fill', root);
    var cur = $('.js-time-cur', root);
    if (fill) fill.style.width = (player.elapsed / player.duration * 100).toFixed(2) + '%';
    if (cur) cur.textContent = fmt(player.elapsed);
    var slider = $('.progress-track', root);
    if (slider) slider.setAttribute('aria-valuenow', Math.round(player.elapsed));
  });
  $all('.console').forEach(function (c) { c.classList.toggle('playing', player.playing); });
  $all('.play-btn').forEach(function (b) {
    b.setAttribute('aria-pressed', player.playing ? 'true' : 'false');
    b.setAttribute('aria-label', player.playing ? 'Pause preview' : 'Play preview');
  });
}

function tick() {
  player.elapsed += 1;
  if (player.elapsed >= player.duration) { player.elapsed = 0; }
  renderPlayer();
}

function togglePlay() {
  player.playing = !player.playing;
  if (player.playing) { player.timer = setInterval(tick, 1000); }
  else { clearInterval(player.timer); }
  renderPlayer();
}

$all('[data-player-ui]').forEach(function (root) {
  buildWaveform($('.waveform', root), 40);
  var dur = parseInt(root.getAttribute('data-duration') || '1920', 10);
  if (!isNaN(dur) && dur > 0) player.duration = dur;
  var btn = $('.play-btn', root);
  if (btn) btn.addEventListener('click', togglePlay);
  var track = $('.progress-track', root);
  if (track) {
    track.addEventListener('click', function (e) {
      var r = track.getBoundingClientRect();
      var ratio = (e.clientX - r.left) / r.width;
      player.elapsed = Math.round(ratio * player.duration);
      renderPlayer();
    });
    track.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { player.elapsed = Math.min(player.duration, player.elapsed + 10); renderPlayer(); e.preventDefault(); }
      if (e.key === 'ArrowLeft') { player.elapsed = Math.max(0, player.elapsed - 10); renderPlayer(); e.preventDefault(); }
    });
  }
});
renderPlayer();

/* ---------- sticky mini player: appears when the hero console scrolls away ---------- */
var mini = $('#miniPlayer'), heroConsole = $('#consoleMain');
if (mini && heroConsole && 'IntersectionObserver' in window) {
  var mio = new IntersectionObserver(function (entries) {
    var vis = entries[0].isIntersecting;
    mini.classList.toggle('show', !vis);
    mini.setAttribute('aria-hidden', vis ? 'true' : 'false');
  }, { threshold: 0.15 });
  mio.observe(heroConsole);
  var mpTitle = $('.mp-title', mini), mpTime = $('.mp-time', mini);
  var mpBtn = $('.play-btn', mini);
  if (mpTitle) mpTitle.textContent = heroConsole.getAttribute('data-title') || SITE_NAME;
  if (mpBtn) mpBtn.addEventListener('click', togglePlay);
  setInterval(function () { if (mpTime) mpTime.textContent = fmt(player.elapsed); }, 1000);
}

/* ---------- episodes: topic filter + search ---------- */
var chips = $all('.chip[data-filter]'), cards = $all('.ep-card[data-topic]'), search = $('#epSearch'), none = $('#noResults');
var activeFilter = 'all';
function applyFilter() {
  var q = search ? search.value.trim().toLowerCase() : '';
  var shown = 0;
  cards.forEach(function (card) {
    var topicOk = activeFilter === 'all' || card.getAttribute('data-topic') === activeFilter;
    var title = ($('h3', card) ? $('h3', card).textContent : '').toLowerCase();
    var ok = topicOk && (!q || title.indexOf(q) !== -1);
    card.style.display = ok ? '' : 'none';
    if (ok) shown++;
  });
  if (none) none.classList.toggle('show', shown === 0);
}
chips.forEach(function (chip) {
  chip.addEventListener('click', function () {
    chips.forEach(function (c) { c.setAttribute('aria-pressed', 'false'); });
    chip.setAttribute('aria-pressed', 'true');
    activeFilter = chip.getAttribute('data-filter');
    applyFilter();
  });
});
if (search) search.addEventListener('input', applyFilter);

/* ---------- copy link ---------- */
$all('[data-copy]').forEach(function (btn) {
  btn.addEventListener('click', function () {
    var url = btn.getAttribute('data-copy') || window.location.href;
    function done() {
      var label = btn.querySelector('span') || btn;
      var orig = label.textContent;
      label.textContent = 'Copied!';
      setTimeout(function () { label.textContent = orig; }, 1600);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(done, done);
    } else {
      var ta = document.createElement('textarea');
      ta.value = url; document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); } catch (e) {}
      document.body.removeChild(ta); done();
    }
  });
});

/* ---------- demo forms: simulate submission, show thank-you ---------- */
$all('form[data-demo-form]').forEach(function (form) {
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }
    var name = ($('#fName', form) || {}).value || 'there';
    var wrap = document.createElement('div');
    wrap.className = 'form-success';
    wrap.setAttribute('role', 'status');
    wrap.innerHTML = '<h3>Thanks, ' + name.replace(/[<>&"]/g, '') + '.</h3>' +
      '<p style="margin:0">This is a concept-demo form — nothing was sent anywhere. ' +
      'In the real build, your message would land in the show\u2019s inbox and you\u2019d get a reply within a couple of days.</p>';
    form.replaceWith(wrap);
  });
});
