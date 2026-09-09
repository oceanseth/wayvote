/**
 * Inline stroke icons. Replaces the emoji that previously stood in for
 * iconography — emoji render inconsistently per-platform and read as informal.
 * Paths are 24x24, 1.5 stroke, currentColor, so they inherit type colour.
 */

const paths = {
  scale: (
    <>
      <path d="M12 4v16" />
      <path d="M5 7h14" />
      <path d="M5 7 1.5 15h7z" />
      <path d="M19 7l-3.5 8h7z" />
      <path d="M8 20h8" />
    </>
  ),
  sliders: (
    <>
      <path d="M5 21V14M5 10V3M12 21v-9M12 8V3M19 21v-5M19 12V3" />
      <path d="M2.5 14h5M9.5 12h5M16.5 16h5" />
    </>
  ),
  eye: (
    <>
      <path d="M2 12s3.5-6.5 10-6.5S22 12 22 12s-3.5 6.5-10 6.5S2 12 2 12Z" />
      <circle cx="12" cy="12" r="2.75" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3 4.5 6v6c0 4.4 3 8 7.5 9 4.5-1 7.5-4.6 7.5-9V6Z" />
      <path d="m9 12 2.25 2.25L15.5 10" />
    </>
  ),
  alert: (
    <>
      <path d="M12 4.5 2.75 20h18.5Z" />
      <path d="M12 10v4.25" />
      <path d="M12 17.25h.01" />
    </>
  ),
  lock: (
    <>
      <rect x="4" y="10.5" width="16" height="10.5" rx="2" />
      <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
    </>
  ),
  currency: (
    <>
      <rect x="2.5" y="6" width="19" height="12" rx="2" />
      <circle cx="12" cy="12" r="2.5" />
      <path d="M6 12h.01M18 12h.01" />
    </>
  ),
  chip: (
    <>
      <rect x="7" y="7" width="10" height="10" rx="2" />
      <path d="M10 3v4M14 3v4M10 17v4M14 17v4M3 10h4M3 14h4M17 10h4M17 14h4" />
    </>
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="12" cy="12" r="0.75" fill="currentColor" />
    </>
  ),
  layers: (
    <>
      <path d="m12 3 8.5 4.5L12 12 3.5 7.5Z" />
      <path d="m3.5 12.5 8.5 4.5 8.5-4.5" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8" r="3.25" />
      <path d="M2.75 19.5a6.25 6.25 0 0 1 12.5 0" />
      <path d="M16 5.2a3.25 3.25 0 0 1 0 5.6" />
      <path d="M17.5 14.2a6.25 6.25 0 0 1 3.75 5.3" />
    </>
  ),
  mail: (
    <>
      <rect x="2.5" y="5" width="19" height="14" rx="2" />
      <path d="m3.5 6.5 8.5 6 8.5-6" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="8.75" />
      <path d="M3.25 12h17.5" />
      <path d="M12 3.25c2.4 2.6 3.6 5.6 3.6 8.75s-1.2 6.15-3.6 8.75c-2.4-2.6-3.6-5.6-3.6-8.75S9.6 5.85 12 3.25Z" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.75" />
      <path d="M12 7v5.25l3.25 2" />
    </>
  ),
  code: (
    <>
      <path d="m8.5 8-4.5 4 4.5 4" />
      <path d="m15.5 8 4.5 4-4.5 4" />
      <path d="m13.5 5-3 14" />
    </>
  ),
  play: (
    <>
      <circle cx="12" cy="12" r="8.75" />
      <path d="M10.25 8.75 15.5 12l-5.25 3.25Z" />
    </>
  ),
  arrowRight: (
    <>
      <path d="M4.5 12h15" />
      <path d="m13.5 6 6 6-6 6" />
    </>
  ),
  check: <path d="m5 12.5 4.5 4.5L19 7" />,
  quote: (
    <path
      d="M9.5 5.5C6.5 7 5 9.6 5 13.3V19h6.2v-6.4H8.4c.1-1.9.8-3.3 2.1-4.2Zm9.6 0C16.1 7 14.6 9.6 14.6 13.3V19H21v-6.4h-3.1c.1-1.9.8-3.3 2.1-4.2Z"
      fill="currentColor"
      stroke="none"
    />
  ),
}

const Icon = ({ name, size = 24, className = '', ...rest }) => {
  const d = paths[name]
  if (!d) return null

  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {d}
    </svg>
  )
}

export default Icon
