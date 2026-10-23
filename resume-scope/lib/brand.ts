/*
  JS mirror of the CSS design tokens for the few places CSS variables
  cannot reach (generated social images). tests/design-system.test.ts
  fails if these drift from app/globals.css.
*/
export const BRAND = {
  background: "#212842",
  surface: "#2A3250",
  border: "#424C6E",
  cream: "#F0E7D5",
  muted: "#A8ABBA",
} as const;
