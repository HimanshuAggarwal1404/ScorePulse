import { css } from "styled-components";

// Glass: translucent, blurred, with a bright top edge where light catches it.
export const glass = css`
  background: var(--glass);
  backdrop-filter: blur(var(--blur)) saturate(170%);
  -webkit-backdrop-filter: blur(var(--blur)) saturate(170%);
  border: 1px solid var(--border);
  box-shadow: inset 0 1px 0 var(--glass-highlight), var(--shadow);
`;

// Pressable: feedback on pointer-down, not on release.
export const pressable = css`
  cursor: pointer;
  transition: transform var(--press) var(--ease), background-color var(--quick) var(--ease),
    border-color var(--quick) var(--ease), box-shadow var(--quick) var(--ease);
  &:active {
    transform: scale(0.975);
  }
`;

export const initials = (name = "") =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
