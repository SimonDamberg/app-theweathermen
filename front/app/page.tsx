'use client';

import Image from 'next/image'
import { useEffect, useState } from 'react'

export default function Home() {

  const [isHealthy, setIsHealthy] = useState(false)

  // Do health check at localhost/8000 and set isHealthy to true if it succeeds
  useEffect(() => {
    fetch('http://localhost:8000/health')
      .then(res => res.json())
      .then((res) => {
        if (res.status === 'OK') {
          setIsHealthy(true)
        }
      })
  }, [])

  if (isHealthy) return <p>API connected!</p>
  return <p>API not connected!</p>
}
