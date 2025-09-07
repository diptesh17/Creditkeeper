"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  TrendingUp,
  Users,
  ShoppingCart,
  BarChart3,
  Download,
  Search,
  Filter,
  Sun,
  Moon,
  Home,
  Plus,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

export default function HomePage() {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme")
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    const shouldBeDark = savedTheme === "dark" || (!savedTheme && prefersDark)

    setIsDark(shouldBeDark)
    document.documentElement.classList.toggle("dark", shouldBeDark)
  }, [])

  const toggleTheme = () => {
    const newTheme = !isDark
    setIsDark(newTheme)
    document.documentElement.classList.toggle("dark", newTheme)
    localStorage.setItem("theme", newTheme ? "dark" : "light")
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div>
              <h1 className="text-2xl font-bold text-primary">CreditKeeper</h1>
              <p className="text-sm text-muted-foreground">Smart Credit Management</p>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <nav className="hidden md:flex items-center gap-4">
              <Link href="/" className="p-2 hover:bg-accent rounded-lg transition-colors group relative" title="Home">
                <Home className="h-5 w-5" />
              </Link>
              <Link
                href="/dashboard"
                className="p-2 hover:bg-accent rounded-lg transition-colors group relative"
                title="Dashboard"
              >
                <BarChart3 className="h-5 w-5" />
              </Link>
              <Link
                href="/add"
                className="p-2 hover:bg-accent rounded-lg transition-colors group relative"
                title="Add Customer"
              >
                <Plus className="h-5 w-5" />
              </Link>
              <Link
                href="/download"
                className="p-2 hover:bg-accent rounded-lg transition-colors group relative"
                title="Export Data"
              >
                <Download className="h-5 w-5" />
              </Link>
            </nav>
            <Button variant="ghost" size="sm" onClick={toggleTheme} className="p-2">
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-8"
        >
          {/* Hero Section */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 dark:from-amber-950/20 dark:via-orange-950/20 dark:to-red-950/20 border border-amber-200/50 dark:border-amber-800/30">
            <div className="absolute inset-0 bg-[url('/modern-shop-interior-with-warm-lighting-and-organi.jpg')] bg-cover bg-center opacity-10"></div>
            <div className="relative px-8 py-12 lg:px-16 lg:py-20">
              <div className="max-w-4xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                  <div className="space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 dark:bg-amber-900/30 rounded-full text-sm font-medium text-amber-800 dark:text-amber-200">
                      <TrendingUp className="h-4 w-4" />
                      Smart Credit Management
                    </div>
                    <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
                      Welcome to{" "}
                      <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                        CreditKeeper
                      </span>
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                      The modern way to manage customer credit and track outstanding payments. Perfect for shop owners,
                      small businesses, and anyone who needs professional credit management.
                    </p>
                    <div className="flex flex-wrap gap-4">
                      <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm font-medium">Easy to Use</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-sm font-medium">Secure & Reliable</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span className="text-sm font-medium">Real-time Tracking</span>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Link href="/dashboard">
                        <Button size="lg" className="w-full sm:w-auto">
                          Get Started
                        </Button>
                      </Link>
                      <Link href="/add">
                        <Button variant="outline" size="lg" className="w-full sm:w-auto bg-transparent">
                          Add Customer
                        </Button>
                      </Link>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-400/20 to-orange-400/20 rounded-3xl blur-3xl"></div>
                    <div className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl p-8 border border-white/20 dark:border-gray-700/20 shadow-2xl">
                      <img
                        src="/modern-tablet-showing-financial-dashboard-with-cha.jpg"
                        alt="CreditKeeper Dashboard Preview"
                        className="w-full h-auto rounded-lg shadow-lg"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
              <CardContent className="pt-8 pb-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Customer Management</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                  Add and organize customers with ease. Keep track of all your clients in one centralized location.
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
              <CardContent className="pt-8 pb-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <ShoppingCart className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Item Tracking</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                  Record items with dates and costs. Never lose track of what was purchased and when.
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 md:col-span-2 lg:col-span-1">
              <CardContent className="pt-8 pb-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Payment Processing</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                  Record payments and automatically update outstanding balances with detailed history.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Analytics Preview */}
          <Card className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900/50 dark:to-gray-800/50 border-0">
            <CardContent className="pt-8 pb-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Everything You Need to Manage Credit
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Get insights into your business with comprehensive analytics and reporting
                </p>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <BarChart3 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Analytics</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Real-time insights</p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Download className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Export Data</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Backup & reports</p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Search className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Smart Search</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Find anything fast</p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Filter className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Advanced Filters</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Organize efficiently</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  )
}
