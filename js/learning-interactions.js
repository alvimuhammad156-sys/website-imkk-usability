import { attributes, guideMessages, lessonOrder, lifecyclePhases, methods, processSteps } from './learning-data.js';

const robot = () => window.usabilityRobot;
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
function readSessionFlag(key) { try { return sessionStorage.getItem(key) === 'true'; } catch { return false; } }
function writeSessionFlag(key) { try { sessionStorage.setItem(key, 'true'); } catch { /* Progress remains available when storage is restricted. */ } }

function announce(message, target = null) {
  robot()?.explain(target, message);
}

function initLearningProgress() {
  const progressBar = document.querySelector('.progress-track');
  const progressFill = document.getElementById('progress-fill');
  const progressLabel = document.getElementById('progress-label');
  const progressTitle = document.getElementById('progress-title');
  const progressFeedback = document.getElementById('progress-feedback');
  const lessonSections = lessonOrder.map((lesson) => document.getElementById(lesson.id)).filter(Boolean);
  const navLinks = [...document.querySelectorAll('.nav-link[href^="#"], .course-nav a[href^="#"], .quick-nav-menu a[href^="#"]')];
  const navSections = navLinks.map((link) => document.getElementById(link.getAttribute('href').slice(1))).filter(Boolean);
  const visibleSections = [...document.querySelectorAll('main > section[id]:not([hidden])')];
  const observedSections = [...new Set([...lessonSections, ...navSections, ...visibleSections])];
  const visitedLessons = new Set();
  if (!progressBar || !progressFill || !progressLabel || !progressTitle || !progressFeedback || !observedSections.length) return;

  progressLabel.textContent = `00 / ${String(lessonOrder.length).padStart(2, '0')}`;
  progressBar.setAttribute('aria-valuemax', String(lessonOrder.length));
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => { if (entry.isIntersecting) entry.target.classList.add('is-in-view'); });
    const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    robot()?.setContext(visible.target.id);
    const lessonIndex = lessonOrder.findIndex((lesson) => lesson.id === visible.target.id);
    if (lessonIndex >= 0) {
      const lesson = lessonOrder[lessonIndex];
      progressLabel.textContent = `${String(lessonIndex + 1).padStart(2, '0')} / ${String(lessonOrder.length).padStart(2, '0')}`;
      progressTitle.textContent = lesson.title;
      visitedLessons.add(lesson.id);
      progressFill.style.width = `${((lessonIndex + 1) / lessonOrder.length) * 100}%`;
      progressBar.setAttribute('aria-valuenow', String(lessonIndex + 1));
      progressFeedback.textContent = visitedLessons.size === lessonOrder.length
        ? 'SEMUA BAGIAN UTAMA SUDAH DIJELAJAHI'
        : `${visitedLessons.size} DARI ${lessonOrder.length} BAGIAN DIJELAJAHI`;
      if (visitedLessons.size === lessonOrder.length && !readSessionFlag('ue-path-complete')) {
        writeSessionFlag('ue-path-complete');
        window.setTimeout(() => announce('Bagus! Kamu sudah menjelajahi semua enam bagian materi utama. Berikutnya, lihat bagaimana desain pengalaman menerapkan prinsip yang sama.', visible.target), 450);
      }
    }
    const activeId = visible.target.id === 'demo-feedback' ? 'experience' : visible.target.id === 'glossary' ? 'ringkasan' : visible.target.id;
    navLinks.forEach((link) => {
      const targetId = link.getAttribute('href').slice(1);
      link.classList.toggle('active', targetId === activeId);
      if (targetId === activeId) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }, { rootMargin: '-22% 0px -58% 0px', threshold: [0, 0.15, 0.4] });
  observedSections.forEach((section) => sectionObserver.observe(section));

  const hero = document.querySelector('.hero');
  const guideWidget = document.getElementById('guide-widget');
  if (hero && guideWidget) {
    const dockObserver = new IntersectionObserver(([entry]) => {
      guideWidget.classList.toggle('is-docked', !entry.isIntersecting);
    }, { threshold: 0.08 });
    dockObserver.observe(hero);
  }
}

function initQuickNavAndDemo() {
  const quickNav = document.getElementById('quick-nav');
  const toggle = quickNav?.querySelector('.quick-nav-toggle');
  const menu = quickNav?.querySelector('.quick-nav-menu');
  const closeMenu = ({ restoreFocus = false } = {}) => {
    if (!toggle || !menu) return;
    menu.hidden = true;
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Buka daftar materi');
    if (restoreFocus) toggle.focus();
  };
  const focusSection = (section) => {
    const destination = section.querySelector('h1, h2, h3') ?? section;
    if (!destination.hasAttribute('tabindex')) destination.setAttribute('tabindex', '-1');
    destination.focus({ preventScroll: true });
  };

  toggle?.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Tutup daftar materi' : 'Buka daftar materi');
    menu.hidden = !open;
  });
  menu?.querySelectorAll('[data-quick-topic]').forEach((link) => link.addEventListener('click', (event) => {
    const id = link.dataset.quickTopic;
    const target = document.getElementById(id);
    if (!target) return;
    event.preventDefault();
    closeMenu();
    if (document.body.classList.contains('presentation-mode')) {
      document.dispatchEvent(new CustomEvent('imkk:go-to-slide', { detail: { id } }));
      return;
    }
    target.scrollIntoView({ behavior: prefersReducedMotion.matches ? 'auto' : 'smooth', block: 'start' });
    history.replaceState(null, '', `#${id}`);
    focusSection(target);
  }));
  document.addEventListener('pointerdown', (event) => {
    if (quickNav && !quickNav.contains(event.target)) closeMenu();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && toggle?.getAttribute('aria-expanded') === 'true') {
      event.stopImmediatePropagation();
      closeMenu({ restoreFocus: true });
    }
  }, true);

  document.querySelector('[data-demo-save]')?.addEventListener('click', (event) => {
    const status = document.getElementById('demo-save-status');
    if (status) status.hidden = false;
    window.usabilityRobot?.explain(event.currentTarget, 'Perhatikan feedback-nya. Pengguna langsung tahu apa yang terjadi.');
  });
}

function initHighContrast() {
  const button = document.getElementById('high-contrast-toggle');
  if (!button) return;
  let enabled = false;
  try { enabled = sessionStorage.getItem('imkk-high-contrast') === 'true'; } catch { /* Session preference is optional. */ }
  const setEnabled = (next) => {
    enabled = next;
    document.body.classList.toggle('high-contrast-mode', enabled);
    button.setAttribute('aria-pressed', String(enabled));
    const inPresentation = document.body.classList.contains('presentation-mode');
    button.textContent = inPresentation ? (enabled ? '◑' : '◐') : (enabled ? '◑ High Contrast' : '◐ High Contrast');
    button.title = enabled ? 'High Contrast aktif — optimalkan tampilan untuk proyektor' : 'High Contrast — optimalkan tampilan untuk proyektor';
    try { sessionStorage.setItem('imkk-high-contrast', String(enabled)); } catch { /* Keep the current-page state. */ }
  };
  setEnabled(enabled);
  button.addEventListener('click', () => setEnabled(!enabled));
}

function initAttributeCards() {
  const cards = [...document.querySelectorAll('[data-attribute]')];
  const detail = document.getElementById('attribute-detail');
  if (!cards.length || !detail) return;
  cards.forEach((card) => card.addEventListener('click', () => {
    const item = attributes[card.dataset.attribute];
    if (!item) return;
    cards.forEach((candidate) => {
      const selected = candidate === card;
      candidate.classList.toggle('is-selected', selected);
      candidate.setAttribute('aria-pressed', String(selected));
    });
    const number = card.querySelector('.attribute-index').textContent;
    detail.querySelector('.detail-label').textContent = `ATRIBUT TERPILIH · ${number}`;
    detail.querySelector('h3').textContent = item.title;
    detail.querySelector('.attribute-summary').textContent = item.summary;
    detail.querySelector('.detail-question span:last-child').textContent = item.evidence;
    announce(`Pilihan ${item.title}. ${item.message}`, card);
  }));
}

function initProcessSteps() {
  const buttons = [...document.querySelectorAll('[data-step]')];
  const title = document.getElementById('step-title');
  const label = document.getElementById('step-label');
  const copy = document.getElementById('step-copy');
  buttons.forEach((button) => button.addEventListener('click', () => {
    const index = Number(button.dataset.step);
    const step = processSteps[index];
    if (!step) return;
    buttons.forEach((candidate) => {
      const selected = candidate === button;
      candidate.classList.toggle('is-selected', selected);
      candidate.setAttribute('aria-pressed', String(selected));
    });
    label.textContent = `LANGKAH 0${index + 1}`;
    title.textContent = step.title;
    copy.textContent = step.copy;
    announce(step.message, button);
  }));
}

function initMethodTabs() {
  const tabs = [...document.querySelectorAll('[data-method]')];
  if (!tabs.length) return;
  const selectTab = (tab, moveFocus = false) => {
    tabs.forEach((candidate) => {
      const selected = candidate === tab;
      candidate.classList.toggle('is-active', selected);
      candidate.setAttribute('aria-selected', String(selected));
      candidate.tabIndex = selected ? 0 : -1;
      const panel = document.getElementById(candidate.getAttribute('aria-controls'));
      if (panel) panel.hidden = !selected;
    });
    if (moveFocus) tab.focus();
    announce(methods[tab.dataset.method]);
  };
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => selectTab(tab));
    tab.addEventListener('keydown', (event) => {
      let nextIndex = index;
      if (event.key === 'ArrowRight') nextIndex = (index + 1) % tabs.length;
      else if (event.key === 'ArrowLeft') nextIndex = (index - 1 + tabs.length) % tabs.length;
      else if (event.key === 'Home') nextIndex = 0;
      else if (event.key === 'End') nextIndex = tabs.length - 1;
      else return;
      event.preventDefault();
      selectTab(tabs[nextIndex], true);
    });
  });
}

function initLifecycle() {
  const buttons = [...document.querySelectorAll('[data-phase]')];
  const detail = document.getElementById('phase-detail');
  const label = document.getElementById('phase-label');
  buttons.forEach((button) => button.addEventListener('click', () => {
    const index = Number(button.dataset.phase);
    const phase = lifecyclePhases[index];
    if (!phase) return;
    buttons.forEach((candidate) => {
      const selected = candidate === button;
      candidate.classList.toggle('is-selected', selected);
      candidate.setAttribute('aria-pressed', String(selected));
    });
    label.textContent = `FASE 0${index + 1} · ${phase.title.toLocaleUpperCase('id-ID')}`;
    detail.textContent = phase.detail;
    announce(phase.message, button);
  }));
}

function initGuideActions() {
  document.querySelectorAll('[data-guide-section]').forEach((button) => button.addEventListener('click', () => {
    const lesson = lessonOrder.find((item) => item.id === button.dataset.guideSection);
    const message = lesson?.message ?? guideMessages.experience;
    announce(message, document.getElementById(button.dataset.guideSection) ?? button);
  }));
}

function initNavigationFeedback() {
  document.querySelectorAll('.nav-link[href^="#"], .course-nav a[href^="#"]').forEach((link) => link.addEventListener('click', () => {
    const lesson = lessonOrder.find((item) => item.id === link.hash.slice(1));
    if (lesson) announce(lesson.message, document.getElementById(lesson.id));
  }));
  if (prefersReducedMotion.matches) document.documentElement.classList.add('reduced-motion');
  prefersReducedMotion.addEventListener('change', (event) => document.documentElement.classList.toggle('reduced-motion', event.matches));
}

export function initLearningExperience() {
  initLearningProgress();
  initAttributeCards();
  initProcessSteps();
  initMethodTabs();
  initLifecycle();
  initGuideActions();
  initNavigationFeedback();
  initQuickNavAndDemo();
  initHighContrast();
}
