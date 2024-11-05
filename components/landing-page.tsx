'use client'

import * as React from "react"
import Link from "next/link"
import { ArrowRight, ChevronRight, Star } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"

export function LandingPageComponent() {
  React.useEffect(() => {
    // Smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';

    // Optimize for Core Web Vitals
    const imgs = document.querySelectorAll('img');
    if ('loading' in HTMLImageElement.prototype) {
      imgs.forEach(img => {
        img.loading = 'lazy';
      });
    } else {
      // Fallback for browsers that don't support lazy loading
      import('lazysizes').then(lazySizes => {
        lazySizes.init();
      });
    }

    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#3A0CA3] to-[#7209B7] text-white font-inter">
      <header className="sticky top-0 z-50 w-full border-b bg-[#560BAD]/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="flex items-center space-x-4">
            <svg
              className="text-[#4CC9F0]"
              fill="none"
              height="24"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              width="24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 5v14" />
              <path d="M5 12h14" />
            </svg>
            <span className="text-xl font-bold">TradeBotAI</span>
          </div>
          <nav className="flex items-center space-x-6 ml-6">
            <Link className="text-sm font-medium hover:text-[#4CC9F0] transition-colors" href="#dashboard">
              Dashboard
            </Link>
            <Link 
              className="text-sm font-medium hover:text-[#4CC9F0] transition-colors" 
              href="/bot-builder"
            >
              Bot Builder
            </Link>
            <Link className="text-sm font-medium hover:text-[#4CC9F0] transition-colors" href="#analytics">
              Analytics
            </Link>
            <Link className="text-sm font-medium hover:text-[#4CC9F0] transition-colors" href="#settings">
              Settings
            </Link>
          </nav>
          <div className="flex items-center space-x-4 ml-auto">
            <Button variant="outline" className="hidden md:inline-flex bg-[#4361EE] hover:bg-[#4361EE]/90 text-white border-[#4CC9F0]">
              Connect Wallet
            </Button>
            <Button className="bg-[#F72585] hover:bg-[#F72585]/90 text-white">Get Started</Button>
          </div>
        </div>
      </header>

      <main>
        <section className="py-20 bg-[#1A1B41]">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Automate Your Trading with Ease: Build, Deploy & Monitor</h1>
            <p className="text-xl mb-8 text-gray-300 max-w-2xl mx-auto">
              Create powerful trading bots without coding. Deploy on multiple chains, monitor performance, and optimize your
              strategies in real-time.
            </p>
            <Button className="bg-[#F72585] hover:bg-[#F72585]/90 text-white text-lg px-8 py-3">
              Connect Wallet
              <ArrowRight className="ml-2" />
            </Button>
            <div className="mt-12">
              <img
                alt="Trading Bot Dashboard"
                className="rounded-lg shadow-2xl border border-gray-700 mx-auto"
                height="600"
                src="/placeholder.svg"
                style={{
                  aspectRatio: "800/600",
                  objectFit: "cover",
                }}
                width="800"
              />
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">Trading Automation Made Simple and Secure</h2>
            <div className="flex justify-center mb-8">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="text-[#4CC9F0] w-8 h-8" />
              ))}
            </div>
            <blockquote className="text-xl italic mb-8 max-w-2xl mx-auto">
              "TradeBotAI has revolutionized my trading strategy. It's incredibly easy to use and the results speak for
              themselves!"
            </blockquote>
            <p className="text-gray-400">- Sarah K., Crypto Trader</p>
          </div>
        </section>

        <section id="features" className="py-20">
          <div className="container mx-auto px-4">
            <Card className="mb-20">
              <CardHeader>
                <CardTitle className="text-3xl font-bold">Create and Customize Trading Bots in Minutes</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col md:flex-row items-center">
                <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8">
                  <ul className="space-y-4">
                    <li className="flex items-center">
                      <ChevronRight className="text-[#4CC9F0] mr-2" />
                      <span>No-code setup for easy bot creation</span>
                    </li>
                    <li className="flex items-center">
                      <ChevronRight className="text-[#4CC9F0] mr-2" />
                      <span>Real-time market analysis integration</span>
                    </li>
                  </ul>
                </div>
                <div className="md:w-1/2">
                  <img
                    alt="Bot Builder Interface"
                    className="rounded-lg shadow-xl border border-gray-700"
                    height="400"
                    src="/placeholder.svg"
                    style={{
                      aspectRatio: "600/400",
                      objectFit: "cover",
                    }}
                    width="600"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="mb-20">
              <CardHeader>
                <CardTitle className="text-3xl font-bold">Monitor Performance with Real-Time Analytics</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col md:flex-row-reverse items-center">
                <div className="md:w-1/2 mb-8 md:mb-0 md:pl-8">
                  <ul className="space-y-4">
                    <li className="flex items-center">
                      <ChevronRight className="text-[#4CC9F0] mr-2" />
                      <span>Comprehensive Profit/Loss metrics</span>
                    </li>
                    <li className="flex items-center">
                      <ChevronRight className="text-[#4CC9F0] mr-2" />
                      <span>Detailed trade success rate analysis</span>
                    </li>
                  </ul>
                </div>
                <div className="md:w-1/2">
                  <img
                    alt="Analytics Dashboard"
                    className="rounded-lg shadow-xl border border-gray-700"
                    height="400"
                    src="/placeholder.svg"
                    style={{
                      aspectRatio: "600/400",
                      objectFit: "cover",
                    }}
                    width="600"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-3xl font-bold">Deploy on Solana and EVM Chains</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col md:flex-row items-center">
                <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8">
                  <ul className="space-y-4">
                    <li className="flex items-center">
                      <ChevronRight className="text-[#4CC9F0] mr-2" />
                      <span>Multi-chain support for diverse strategies</span>
                    </li>
                    <li className="flex items-center">
                      <ChevronRight className="text-[#4CC9F0] mr-2" />
                      <span>Seamless transactions across blockchains</span>
                    </li>
                  </ul>
                </div>
                <div className="md:w-1/2">
                  <img
                    alt="Cross-Chain Deployment Options"
                    className="rounded-lg shadow-xl border border-gray-700"
                    height="400"
                    src="/placeholder.svg"
                    style={{
                      aspectRatio: "600/400",
                      objectFit: "cover",
                    }}
                    width="600"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section id="analytics" className="py-20 bg-[#560BAD]/50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Comprehensive Insights and Reporting</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <Card className="bg-[#3A0CA3] border-[#4895EF]">
                <CardHeader>
                  <CardTitle>In-depth Reporting</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">Gain valuable insights with detailed performance reports and analytics.</p>
                </CardContent>
              </Card>
              <Card className="bg-[#3A0CA3] border-[#4895EF]">
                <CardHeader>
                  <CardTitle>Trade History</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">Access complete historical data of all your bot's trading activities.</p>
                </CardContent>
              </Card>
              <Card className="bg-[#3A0CA3] border-[#4895EF]">
                <CardHeader>
                  <CardTitle>Actionable Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">Receive AI-powered recommendations to optimize your trading strategies.</p>
                </CardContent>
              </Card>
            </div>
            <img
              alt="Full Analytics Dashboard"
              className="rounded-lg shadow-2xl border border-gray-700 w-full"
              height="400"
              src="/placeholder.svg"
              style={{
                aspectRatio: "1200/400",
                objectFit: "cover",
              }}
              width="1200"
            />
          </div>
        </section>

        <section className="py-20 bg-[#3F37C9]">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="md:w-1/2 mb-8 md:mb-0">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#1A1B41]">Get Started with Automated Trading</h2>
                <Button className="bg-[#1A1B41] text-white hover:bg-[#1A1B41]/90 text-lg px-8 py-3">Sign Up Free</Button>
              </div>
              <div className="md:w-1/2">
                <img
                  alt="Dashboard Preview"
                  className="rounded-lg shadow-xl"
                  height="300"
                  src="/placeholder.svg"
                  style={{
                    aspectRatio: "400/300",
                    objectFit: "cover",
                  }}
                  width="400"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Seamless Integrations with Top Exchanges</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
              {["Binance", "Coinbase", "Kraken", "FTX"].map((exchange) => (
                <Card key={exchange} className="bg-[#1A1B41]">
                  <CardContent className="flex items-center justify-center p-6">
                    <span className="text-xl font-semibold">{exchange}</span>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-semibold mb-4">Integration Benefits</h3>
              <ul className="space-y-2 text-gray-300">
                <li>Instant connectivity to major exchanges</li>
                <li>Secure transaction execution</li>
                <li>Real-time data synchronization</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="py-20 bg-[#1A1B41]">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="md:w-1/2 mb-8 md:mb-0">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Start Your Free Trial Today</h2>
                <div className="space-y-4">
                  <Button className="w-full md:w-auto bg-[#9D5CFF]   hover:bg-[#9D5CFF]/90 text-white text-lg px-8 py-3">
                    Get Started
                  </Button>
                  <Button className="w-full md:w-auto" variant="outline">
                    Contact Us for a Demo
                  </Button>
                </div>
              </div>
              <div className="md:w-1/2">
                <img
                  alt="Trading Bot Dashboard Preview"
                  className="rounded-lg shadow-xl border border-gray-700"
                  height="300"
                  src="/placeholder.svg"
                  style={{
                    aspectRatio: "400/300",
                    objectFit: "cover",
                  }}
                  width="400"
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-[#3A0CA3] py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <svg
                  className="text-[#4CC9F0]"
                  fill="none"
                  height="24"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 5v14" />
                  <path d="M5 12h14" />
                </svg>
                <span className="text-xl font-bold">TradeBotAI</span>
              </div>
              <p className="text-sm text-gray-400">Automate your trading with AI-powered bots</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link className="hover:text-[#4CC9F0]" href="#">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link className="hover:text-[#4CC9F0]" href="#">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link className="hover:text-[#4CC9F0]" href="#">
                    Resources
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link className="hover:text-[#4CC9F0]" href="#">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link className="hover:text-[#4CC9F0]" href="#">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link className="hover:text-[#4CC9F0]" href="#">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link className="hover:text-[#4CC9F0]" href="#">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link className="hover:text-[#4CC9F0]" href="#">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link className="hover:text-[#4CC9F0]" href="#">
                    Cookie Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <Separator className="my-8 bg-gray-700" />
          <div className="text-center text-sm text-gray-400">
            <p>&copy; 2024 TradeBotAI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}