/**
 * WayVote logomark: a balance scale set in a rounded seal. Reads as
 * institutional rather than product-y, and matches /favicon.svg.
 */
const Mark = ({ size = 32, className = '' }) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 64 64"
    role="img"
    aria-label="WayVote"
    focusable="false"
  >
    <rect width="64" height="64" rx="10" fill="currentColor" />
    <g
      fill="none"
      stroke="var(--mark-glyph, #ffffff)"
      strokeWidth="3.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M32 15v34" />
      <path d="M17 22h30" />
      <path d="M17 22 11 38h12z" />
      <path d="M47 22 41 38h12z" />
      <path d="M25 49h14" />
    </g>
  </svg>
)

export default Mark
