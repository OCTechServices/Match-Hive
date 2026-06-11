// SVG logo — hollow diamond with globe inside + "Match-Hive" wordmark
// No image file needed. Swap this component when a brand file is ready.

export default function NavLogo() {
  return (
    <span className="flex items-center gap-2.5 select-none">
      {/* Icon: hollow diamond + globe */}
      <svg
        width="32"
        height="32"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Hollow rhombus / diamond */}
        <path
          d="M20 3 L37 20 L20 37 L3 20 Z"
          stroke="#4ade80"
          strokeWidth="2.2"
          strokeLinejoin="round"
        />
        {/* Globe circle */}
        <circle cx="20" cy="20" r="7.5" stroke="#4ade80" strokeWidth="1.6" />
        {/* Globe equator */}
        <line x1="12.5" y1="20" x2="27.5" y2="20" stroke="#4ade80" strokeWidth="1" />
        {/* Globe meridian */}
        <line x1="20" y1="12.5" x2="20" y2="27.5" stroke="#4ade80" strokeWidth="1" />
        {/* Globe arc — suggests a sphere */}
        <path
          d="M12.5 20 Q16 15 20 20 Q24 25 27.5 20"
          stroke="#4ade80"
          strokeWidth="1"
          strokeLinecap="round"
        />
      </svg>

      {/* Wordmark */}
      <span className="font-bold text-base text-white tracking-tight leading-none">
        Match<span className="text-green-400">-Hive</span>
      </span>
    </span>
  )
}
