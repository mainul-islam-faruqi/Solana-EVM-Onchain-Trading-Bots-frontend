'use client'

import * as React from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export function LandingPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-b from-darkest to-dark text-lightest">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-accent to-error">
            No-Code Trading Bot Builder
          </h1>
          <p className="text-xl text-light/80 max-w-2xl mx-auto">
            Create and manage automated trading strategies across multiple blockchains without writing a single line of code.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <Image
              src="/dashboard-preview.png"
              alt="Bot Builder Dashboard"
              width={600}
              height={400}
              className="rounded-lg shadow-2xl"
              priority
            />
          </div>
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-[#4CC9F0]">
              Build Your Trading Bot in Minutes
            </h2>
            <ul className="space-y-4 text-lg">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-[#4CC9F0] rounded-full mr-3"></span>
                Drag-and-drop interface
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-[#4CC9F0] rounded-full mr-3"></span>
                Multiple blockchain support
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-[#4CC9F0] rounded-full mr-3"></span>
                Real-time market data
              </li>
            </ul>
            <Button
              className="bg-[#4CC9F0] text-white hover:bg-[#4CC9F0]/90 px-8 py-3 text-lg"
              onClick={() => router.push('/bot-builder')}
            >
              Start Building
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}