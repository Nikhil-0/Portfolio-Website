// ---------------------------------------------------------------------------
// JS mirror of src/styles/motion.css's tokens.
//
// Motion (the animation library) takes durations in seconds and an easing
// array, not CSS custom properties, so the values in motion.css can't be
// read directly by JSX animation props. These constants exist so the two
// files stay in sync by convention instead of by luck — change a duration or
// easing curve, change it in BOTH files.
// ---------------------------------------------------------------------------

// Seconds, mirroring motion.css's --dur-state (180ms).
export const DUR_STATE = 0.18;
// Seconds, mirroring motion.css's --dur-transition (260ms).
export const DUR_TRANSITION = 0.26;
// Seconds, mirroring motion.css's --dur-reveal (400ms).
export const DUR_REVEAL = 0.4;

// Mirrors motion.css's --ease-out cubic-bezier(0.22, 1, 0.36, 1).
export const EASE_OUT = [0.22, 1, 0.36, 1];
