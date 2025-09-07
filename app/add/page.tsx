"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Plus, Sun, Moon, Users, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface Customer {
  id: string
  name: string
  items: any[]
}

export default function AddCustomerPage() {
  const [newCustomerName, setNewCustomerName] = useState("")
  const [isDark, setIsDark] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

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

  const addCustomer = async () => {
    if (!newCustomerName.trim()) return

    setIsLoading(true)

    const newCustomer: Customer = {
      id: Date.now().toString(),
      name: newCustomerName.trim(),
      items: [],
    }

    // Get existing customers from localStorage
    const savedCustomers = localStorage.getItem("creditkeeper-customers")
    const customers = savedCustomers ? JSON.parse(savedCustomers) : []

    // Add new customer
    const updatedCustomers = [...customers, newCustomer]
    localStorage.setItem("creditkeeper-customers", JSON.stringify(updatedCustomers))

    // Simulate loading for better UX
    await new Promise((resolve) => setTimeout(resolve, 500))

    setIsLoading(false)
    setNewCustomerName("")

    // Redirect to dashboard
    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="p-2">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <Link href="/">
                <h1 className="text-2xl font-bold text-primary cursor-pointer hover:text-primary/80 transition-colors">
                  CreditKeeper
                </h1>
              </Link>
              <p className="text-sm text-muted-foreground">Add Customer</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
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
          className="max-w-2xl mx-auto space-y-6"
        >
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-foreground">Add New Customer</h2>
            <p className="text-muted-foreground">
              Start tracking credit for a new customer by adding their details below.
            </p>
          </div>

          <Card className="bg-gradient-to-br from-card to-card/50">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="customerName" className="text-sm font-medium text-foreground">
                  Customer Name *
                </label>
                <Input
                  id="customerName"
                  placeholder="Enter customer name"
                  value={newCustomerName}
                  onChange={(e) => setNewCustomerName(e.target.value)}
                  className="text-lg py-3"
                  onKeyPress={(e) => e.key === "Enter" && addCustomer()}
                  disabled={isLoading}
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={addCustomer}
                  disabled={!newCustomerName.trim() || isLoading}
                  className="flex-1 py-3 text-lg"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Adding Customer...
                    </>
                  ) : (
                    <>
                      <Plus className="h-5 w-5 mr-2" />
                      Add Customer
                    </>
                  )}
                </Button>
                <Link href="/dashboard">
                  <Button variant="outline" className="flex-1 py-3 text-lg w-full bg-transparent">
                    Cancel
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200/50 dark:border-blue-800/30">
            <CardContent className="pt-6">
              <div className="text-center space-y-2">
                <h3 className="font-semibold text-blue-900 dark:text-blue-100">Quick Tip</h3>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  After adding a customer, you can immediately start tracking their purchases and payments. Each item
                  will be recorded with a date for better organization.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  )
}
