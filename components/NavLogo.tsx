'use client'

import Image from 'next/image'
import { useState } from 'react'

export default function NavLogo() {
  const [imgError, setImgError] = useState(false)

  if (imgError) {
    return (
      <span className="font-bold text-base text-green-400 tracking-tight">
        ⚽ Match-Hive
      </span>
    )
  }

  return (
    <Image
      src="/logo.png"
      alt="Match-Hive"
      width={140}
      height={36}
      className="h-9 w-auto object-contain"
      onError={() => setImgError(true)}
      priority
    />
  )
}
