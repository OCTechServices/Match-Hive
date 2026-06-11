import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#080f0b',
        }}
      >
        <svg width="130" height="130" viewBox="0 0 40 40" fill="none">
          <path
            d="M20 3 L37 20 L20 37 L3 20 Z"
            stroke="#4ade80"
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
          <circle cx="20" cy="20" r="7.5" stroke="#4ade80" strokeWidth="1.6" />
          <line x1="12.5" y1="20" x2="27.5" y2="20" stroke="#4ade80" strokeWidth="1" />
          <line x1="20" y1="12.5" x2="20" y2="27.5" stroke="#4ade80" strokeWidth="1" />
          <path
            d="M12.5 20 Q16 15 20 20 Q24 25 27.5 20"
            stroke="#4ade80"
            strokeWidth="1"
            strokeLinecap="round"
          />
        </svg>
      </div>
    ),
    { ...size }
  )
}
