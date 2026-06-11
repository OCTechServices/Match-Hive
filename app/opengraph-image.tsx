import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Match-Hive — FIFA World Cup 2026 Watch Parties'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(160deg, #0d2117 0%, #080f0b 60%)',
          fontFamily: 'sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background glow */}
        <div
          style={{
            position: 'absolute',
            width: 600,
            height: 600,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(74,222,128,0.08) 0%, transparent 70%)',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />

        {/* Logo icon — diamond + globe SVG */}
        <svg
          width="72"
          height="72"
          viewBox="0 0 40 40"
          fill="none"
          style={{ marginBottom: 20 }}
        >
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

        {/* Wordmark */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            fontSize: 72,
            fontWeight: 700,
            letterSpacing: '-2px',
            color: '#ffffff',
            marginBottom: 20,
          }}
        >
          Match
          <span style={{ color: '#4ade80' }}>-Hive</span>
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 26,
            color: 'rgba(255,255,255,0.5)',
            letterSpacing: '0.5px',
            marginBottom: 40,
          }}
        >
          FIFA World Cup 2026 Watch Parties
        </div>

        {/* Pills */}
        <div style={{ display: 'flex', gap: 16 }}>
          {['Find Venues', 'Team Schedules', 'Live Bracket'].map((label) => (
            <div
              key={label}
              style={{
                background: 'rgba(74,222,128,0.1)',
                border: '1px solid rgba(74,222,128,0.3)',
                borderRadius: 999,
                padding: '10px 24px',
                fontSize: 18,
                color: '#4ade80',
                fontWeight: 600,
              }}
            >
              {label}
            </div>
          ))}
        </div>

        {/* Bottom date strip */}
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            fontSize: 16,
            color: 'rgba(255,255,255,0.2)',
            letterSpacing: '2px',
            textTransform: 'uppercase',
          }}
        >
          June 11 – July 19, 2026
        </div>
      </div>
    ),
    { ...size }
  )
}
