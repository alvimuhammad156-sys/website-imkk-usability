import { guideMessages } from './learning-data.js';
import { initLearningExperience } from './learning-interactions.js';

const robotReady = () => Boolean(window.usabilityRobot);

function greetLearner() {
  const storageKey = 'usability-engineering-kira-hero-welcome-v1';
  let hasVisited = false;
  try { hasVisited = localStorage.getItem(storageKey) === 'true'; } catch { /* Storage may be disabled; greeting still works for this visit. */ }
  const robot = window.usabilityRobot;
  if (!robot) return;
  if (document.body.classList.contains('presentation-mode')) {
    if (!hasVisited) {
      try { localStorage.setItem(storageKey, 'true'); } catch { /* Presentation remains available when storage is restricted. */ }
    }
    window.dispatchEvent(new CustomEvent('kira:ready'));
    return;
  }
  if (!hasVisited) {
    window.setTimeout(() => {
      if (!document.body.classList.contains('presentation-mode')) robot.welcome(guideMessages.welcome);
    }, 450);
    try { localStorage.setItem(storageKey, 'true'); } catch { /* Keep the guide usable without storage. */ }
  }
}

function waitForRobot(attempt = 0) {
  if (robotReady()) {
    greetLearner();
    return;
  }
  if (attempt < 20) window.setTimeout(() => waitForRobot(attempt + 1), 100);
}

initLearningExperience();
waitForRobot();
