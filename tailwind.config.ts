
@tailwind base;
@tailwind components;
@tailwind utilities;

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* Color Palette Update */
:root {
  --dark-1: #121827;     /* Darker background */
  --dark-2: #1E2433;     /* Secondary background */
  --dark-3: #2C3444;     /* Tertiary background */
  --dark-4: #3A4354;     /* Quaternary background */
  --text-light: #F0F4FF; /* Light text color */
  --blue-1: #3B82F6;     /* Primary action color */
  --text-dark: #FFFFFF;  /* White text */
}

/* ======== Updated stream css overrides ======== */
.str-video__call-stats {
  max-width: 500px;
  position: relative;
  background-color: var(--dark-1);
  color: var(--text-light);
}

.str-video__speaker-layout__wrapper {
  max-height: 700px;
  background-color: var(--dark-1);
}

.str-video__participant-details {
  color: var(--text-light);
  background-color: var(--dark-1);
}

.str-video__menu-container {
  color: var(--text-light);
  background-color: var(--dark-1);
}

.str-video__notification {
  color: var(--text-light);
  background-color: var(--dark-1);
}

.str-video__participant-list {
  background-color: var(--dark-2);
  padding: 10px;
  border-radius: 10px;
  color: var(--text-light);
  height: 100%;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.2);
}

.str-video__call-controls__button {
  height: 40px;
  background-color: var(--blue-1);
  color: var(--text-dark);
}

.str-video__call-controls__button:hover {
  background-color: #2563EB; /* Slightly darker blue */
}

/* Glassmorphism effects */
.glassmorphism {
  background: rgba(30, 36, 51, 0.9);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  border: 1px solid rgba(59, 130, 246, 0.3);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  color: var(--text-light);
}

.glassmorphism2 {
  background: rgba(30, 36, 51, 0.95);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(59, 130, 246, 0.3);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  color: var(--text-light);
}

/* Clerk class overrides */
.cl-userButtonPopoverActionButtonIcon {
  color: var(--blue-1);
}

.cl-logoBox {
  height: 40px;
}

.cl-dividerLine {
  background: var(--dark-3);
  height: 2px;
}

.cl-socialButtonsIconButton {
  border: 3px solid var(--blue-1);
  background-color: var(--dark-1);
  color: var(--text-light);
}

.cl-internal-wkkub3 {
  color: var(--blue-1);
}

.cl-userButtonPopoverActionButton {
  color: var(--text-light);
  background-color: var(--dark-1);
}

.cl-userButtonPopoverActionButton:hover {
  background-color: var(--dark-3);
  color: var(--text-light);
}

/* ======== New styles for the main UI elements ======== */
body {
  background-color: var(--dark-1);
  color: var(--text-light);
}

.sidebar {
  background-color: var(--dark-2);
  color: var(--text-light);
}

.main-content {
  background-color: var(--dark-1);
  color: var(--text-light);
}

.time-display {
  color: var(--text-light);
}

.upcoming-meeting {
  background-color: var(--dark-3);
  color: var(--text-light);
}

.navigation-item {
  color: var(--text-light);
}

.navigation-item:hover {
  background-color: var(--dark-4);
  color: var(--text-light);
}

.navigation-item.active {
  background-color: var(--blue-1);
  color: var(--text-dark);
}

/* ======== Animation ======== */
.show-block {
  width: 100%;
  max-width: 350px;
  display: block;
  animation: show 0.7s forwards linear;
}

@keyframes show {
  0% {
    animation-timing-function: ease-in;
    width: 0%;
  }
  100% {
    animation-timing-function: ease-in;
    width: 100%;
  }
}

/* ======== Utility Classes ======== */
@layer utilities {
  .flex-center {
    @apply flex justify-center items-center;
  }

  .flex-between {
    @apply flex justify-between items-center;
  }
}
