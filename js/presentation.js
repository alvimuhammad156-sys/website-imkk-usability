const slideDefinitions = [
  { id: 'definisi', title: 'Apa itu usability?', kira: 'Usability membantu pengguna mencapai tujuan secara efektif, efisien, dan memuaskan dalam konteks penggunaan.' },
  { id: 'pentingnya', title: 'Mengapa usability penting?', kira: 'Usability mengurangi hambatan dan kesalahan, sekaligus membantu pengguna menyelesaikan tugas.' },
  { id: 'atribut', title: 'Lima atribut usability', kira: 'Nielsen mengidentifikasi lima atribut: learnability, efficiency, memorability, errors, dan satisfaction.' },
  { id: 'langkah', title: 'Usability Engineering', kira: 'Prosesnya iteratif: pahami pengguna, rancang solusi, evaluasi, lalu perbaiki.' },
  { id: 'pengukuran', title: 'Metode pengukuran', kira: 'Pilih metode evaluasi sesuai pertanyaan yang ingin dijawab.' },
  { id: 'siklus', title: 'Usability Lifecycle', kira: 'Usability dipertimbangkan sebelum desain, selama desain, dan setelah produk dirilis.' },
  { id: 'experience', title: 'Experience Design', kira: 'Amati feedback, affordance, dan hierarchy dalam pengalaman website ini.' },
  { id: 'ringkasan', title: 'Ringkasan', kira: 'Usability membantu pengguna mencapai tujuan secara efektif, efisien, dan memuaskan.' }
];
const fontLevels = [80, 90, 100, 110, 120, 130, 140];
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

const controls = document.getElementById('presentation-toolbar');
const intro = document.getElementById('presentation-intro');
const count = document.getElementById('presentation-count');
const title = document.getElementById('presentation-title');
const progress = controls?.querySelector('[role="progressbar"]');
const progressFill = document.getElementById('presentation-progress-fill');
const fullscreenButton = controls?.querySelector('[data-presentation-fullscreen]');
const guideWidget = document.getElementById('guide-widget');
const guideWidgetParent = guideWidget?.parentNode;
const guideWidgetNextSibling = guideWidget?.nextSibling;
const quickNav = document.getElementById('quick-nav');
const quickNavParent = quickNav?.parentNode;
const quickNavNextSibling = quickNav?.nextSibling;
const highContrastButton = document.getElementById('high-contrast-toggle');
const highContrastParent = highContrastButton?.parentNode;
const highContrastNextSibling = highContrastButton?.nextSibling;
const presentationActions = controls?.querySelector('.presentation-actions');

const slides = slideDefinitions
  .map((definition) => ({ ...definition, element: document.getElementById(definition.id) }))
  .filter((slide) => slide.element);

let presentationActive = false;
let currentIndex = 0;
let fontIndex = fontLevels.indexOf(100);
let introTimer = 0;
let toolbarIdleTimer = 0;
let keepPresentationOnFullscreenExit = false;
let entryControl = null;

function revealToolbar() {
  if (!controls || !presentationActive) return;
  window.clearTimeout(toolbarIdleTimer);
  controls.classList.remove('is-idle');
  toolbarIdleTimer = window.setTimeout(() => {
    if (!controls.matches(':focus-within')) controls.classList.add('is-idle');
  }, 4800);
}

function setFontLevel(index) {
  fontIndex = Math.max(0, Math.min(fontLevels.length - 1, index));
  const factor = fontLevels[fontIndex] / 100;
  const compact = window.matchMedia('(max-width: 720px)').matches;
  const base = compact
    ? { title: 42, subheading: 23, body: 18, highlight: 22, label: 14 }
    : { title: 64, subheading: 32, body: 24, highlight: 30, label: 19 };
  Object.entries(base).forEach(([name, size]) => {
    document.body.style.setProperty(`--presentation-${name}`, `${Math.round(size * factor)}px`);
  });
  const resetButton = controls?.querySelector('[data-presentation-font-reset]');
  if (resetButton) resetButton.textContent = `${fontLevels[fontIndex]}%`;
  controls?.querySelector('[data-presentation-font-down]')?.toggleAttribute('disabled', fontIndex === 0);
  controls?.querySelector('[data-presentation-font-up]')?.toggleAttribute('disabled', fontIndex === fontLevels.length - 1);
}

function updateSlide(index, { guide = true, focus = false } = {}) {
  if (!slides.length) return;
  currentIndex = Math.max(0, Math.min(slides.length - 1, index));
  const activeSlide = slides[currentIndex];

  slides.forEach((slide, slideIndex) => {
    const isActive = slideIndex === currentIndex;
    slide.element.classList.toggle('is-presentation-slide', presentationActive && isActive);
    if (presentationActive && isActive) {
      slide.element.setAttribute('tabindex', '-1');
      slide.element.setAttribute('aria-current', 'step');
      slide.element.scrollTop = 0;
    } else {
      slide.element.removeAttribute('tabindex');
      slide.element.removeAttribute('aria-current');
    }
  });

  if (count) count.textContent = `${String(currentIndex + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
  if (title) title.textContent = activeSlide.title;
  if (progress) progress.setAttribute('aria-valuenow', String(currentIndex + 1));
  if (progressFill) progressFill.style.width = `${((currentIndex + 1) / slides.length) * 100}%`;
  if (focus) activeSlide.element.focus({ preventScroll: true });
  controls?.querySelector('[data-presentation-prev]')?.toggleAttribute('disabled', currentIndex === 0);
  controls?.querySelector('[data-presentation-next]')?.toggleAttribute('disabled', currentIndex === slides.length - 1);

  if (guide && presentationActive) {
    const robot = window.usabilityRobot;
    robot?.setContext(activeSlide.id);
    robot?.explain(activeSlide.element, activeSlide.kira);
  }
}

function showIntro() {
  if (!intro) return;
  window.clearTimeout(introTimer);
  intro.hidden = false;
  requestAnimationFrame(() => intro.classList.add('is-visible'));
  introTimer = window.setTimeout(hideIntro, 5200);
}

function hideIntro() {
  if (!intro) return;
  window.clearTimeout(introTimer);
  intro.classList.remove('is-visible');
  window.setTimeout(() => { if (!intro.classList.contains('is-visible')) intro.hidden = true; }, reducedMotion.matches ? 0 : 180);
}

function enterPresentation(source = null) {
  if (presentationActive || !slides.length) return;
  presentationActive = true;
  entryControl = source;
  document.body.classList.add('presentation-mode');
  if (controls) controls.hidden = false;
  revealToolbar();
  guideWidget?.classList.add('is-presenting');
  if (guideWidget) document.body.append(guideWidget);
  if (quickNav) {
    quickNav.classList.add('is-presentation-quick-nav');
    document.body.append(quickNav);
  }
  if (highContrastButton && presentationActions) presentationActions.prepend(highContrastButton);
  if (highContrastButton) highContrastButton.textContent = highContrastButton.getAttribute('aria-pressed') === 'true' ? '◑' : '◐';
  window.usabilityRobot?.hideMessage();
  setFontLevel(fontIndex);
  updateSlide(0);
  slides[0].element.focus({ preventScroll: true });
  showIntro();

  const requestFullscreen = document.documentElement.requestFullscreen;
  if (typeof requestFullscreen === 'function' && !document.fullscreenElement) {
    try {
      const request = requestFullscreen.call(document.documentElement);
      request?.catch(() => { /* Presentation layout remains active if fullscreen is denied. */ });
    } catch { /* Fullscreen is optional; keep the in-page presentation mode. */ }
  }
}

function exitPresentation({ fromFullscreenChange = false } = {}) {
  if (!presentationActive) return;
  presentationActive = false;
  document.body.classList.remove('presentation-mode');
  if (controls) controls.hidden = true;
  window.clearTimeout(toolbarIdleTimer);
  controls?.classList.remove('is-idle');
  hideIntro();
  window.usabilityRobot?.hideMessage();
  slides.forEach((slide) => {
    slide.element.classList.remove('is-presentation-slide');
    slide.element.removeAttribute('tabindex');
    slide.element.removeAttribute('aria-current');
  });
  guideWidget?.classList.remove('is-presenting');
  if (guideWidget && guideWidgetParent) {
    guideWidgetParent.insertBefore(guideWidget, guideWidgetNextSibling?.parentNode === guideWidgetParent ? guideWidgetNextSibling : null);
  }
  quickNav?.classList.remove('is-presentation-quick-nav');
  if (quickNav && quickNavParent) quickNavParent.insertBefore(quickNav, quickNavNextSibling?.parentNode === quickNavParent ? quickNavNextSibling : null);
  if (highContrastButton && highContrastParent) highContrastParent.insertBefore(highContrastButton, highContrastNextSibling?.parentNode === highContrastParent ? highContrastNextSibling : null);
  if (highContrastButton) highContrastButton.textContent = highContrastButton.getAttribute('aria-pressed') === 'true' ? '◑ High Contrast' : '◐ High Contrast';
  if (!fromFullscreenChange && document.fullscreenElement) {
    try {
      const exit = document.exitFullscreen?.();
      exit?.catch(() => {});
    } catch { /* Browser may already be leaving fullscreen. */ }
  }
  entryControl?.focus?.({ preventScroll: true });
  entryControl = null;
}

document.addEventListener('imkk:go-to-slide', (event) => {
  if (!presentationActive) return;
  const index = slides.findIndex((slide) => slide.id === event.detail?.id);
  if (index >= 0) updateSlide(index, { focus: true });
});

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    try {
      const request = document.documentElement.requestFullscreen?.();
      request?.catch(() => { /* Keep presentation mode if fullscreen is unavailable. */ });
    } catch { /* Fullscreen is optional. */ }
    return;
  }
  keepPresentationOnFullscreenExit = true;
  try {
    const exit = document.exitFullscreen?.();
    exit?.catch(() => { keepPresentationOnFullscreenExit = false; });
  } catch {
    keepPresentationOnFullscreenExit = false;
  }
}

function isTypingTarget(target) {
  return target instanceof HTMLElement && Boolean(target.closest('input, textarea, select, [contenteditable="true"], [role="textbox"], [role="tablist"]'));
}

function handleShortcut(event) {
  if (!presentationActive) return;
  revealToolbar();
  if (isTypingTarget(event.target)) return;
  if (event.key === 'Escape') {
    event.preventDefault();
    exitPresentation();
  } else if (event.key === 'ArrowRight') {
    event.preventDefault();
    updateSlide(currentIndex + 1);
  } else if (event.key === 'ArrowLeft') {
    event.preventDefault();
    updateSlide(currentIndex - 1);
  } else if (event.key === '+' || event.key === '=') {
    event.preventDefault();
    setFontLevel(fontIndex + 1);
  } else if (event.key === '-') {
    event.preventDefault();
    setFontLevel(fontIndex - 1);
  } else if (event.key === '0') {
    event.preventDefault();
    setFontLevel(fontLevels.indexOf(100));
  } else if (event.key.toLowerCase() === 'f') {
    event.preventDefault();
    toggleFullscreen();
  }
}

document.querySelectorAll('[data-presentation-start]').forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    enterPresentation(link);
  });
});

controls?.querySelector('[data-presentation-prev]')?.addEventListener('click', () => updateSlide(currentIndex - 1));
controls?.querySelector('[data-presentation-next]')?.addEventListener('click', () => updateSlide(currentIndex + 1));
controls?.querySelector('[data-presentation-font-down]')?.addEventListener('click', () => setFontLevel(fontIndex - 1));
controls?.querySelector('[data-presentation-font-up]')?.addEventListener('click', () => setFontLevel(fontIndex + 1));
controls?.querySelector('[data-presentation-font-reset]')?.addEventListener('click', () => setFontLevel(fontLevels.indexOf(100)));
fullscreenButton?.addEventListener('click', toggleFullscreen);
controls?.querySelector('[data-presentation-exit]')?.addEventListener('click', () => exitPresentation());
intro?.querySelector('[data-presentation-intro-close]')?.addEventListener('click', hideIntro);
window.addEventListener('keydown', handleShortcut);
window.addEventListener('pointermove', revealToolbar, { passive: true });
controls?.addEventListener('pointerdown', revealToolbar);
controls?.addEventListener('focusin', revealToolbar);
controls?.addEventListener('focusout', () => { if (presentationActive) revealToolbar(); });
window.addEventListener('resize', () => { if (presentationActive) setFontLevel(fontIndex); }, { passive: true });
window.addEventListener('kira:ready', () => { if (presentationActive) updateSlide(currentIndex); });

document.addEventListener('fullscreenchange', () => {
  const isFullscreen = Boolean(document.fullscreenElement);
  if (fullscreenButton) {
    fullscreenButton.setAttribute('aria-label', isFullscreen ? 'Keluar dari fullscreen' : 'Masuk ke fullscreen');
    fullscreenButton.title = isFullscreen ? 'Keluar dari fullscreen' : 'Fullscreen';
  }
  if (!isFullscreen && presentationActive && !keepPresentationOnFullscreenExit) {
    exitPresentation({ fromFullscreenChange: true });
  }
  keepPresentationOnFullscreenExit = false;
});

document.addEventListener('visibilitychange', () => {
  if (document.hidden && presentationActive) hideIntro();
});

