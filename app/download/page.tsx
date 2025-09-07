"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Download, Sun, Moon, FileText, Calendar, Users, IndianRupee, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

interface Customer {
  id: string
  name: string
  items: any[]
}

interface PaymentHistory {
  id: string
  customerId: string
  amount: number
  date: string
}

export default function DownloadPage() {
  const [isDark, setIsDark] = useState(false)
  const [customers, setCustomers] = useState<Customer[]>([])
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistory[]>([])

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme")
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    const shouldBeDark = savedTheme === "dark" || (!savedTheme && prefersDark)

    setIsDark(shouldBeDark)
    document.documentElement.classList.toggle("dark", shouldBeDark)

    // Load data from localStorage
    const savedCustomers = localStorage.getItem("creditkeeper-customers")
    const savedPayments = localStorage.getItem("creditkeeper-payments")

    if (savedCustomers) {
      setCustomers(JSON.parse(savedCustomers))
    }
    if (savedPayments) {
      setPaymentHistory(JSON.parse(savedPayments))
    }
  }, [])

  const toggleTheme = () => {
    const newTheme = !isDark
    setIsDark(newTheme)
    document.documentElement.classList.toggle("dark", newTheme)
    localStorage.setItem("theme", newTheme ? "dark" : "light")
  }

  const exportData = () => {
    const data = {
      customers,
      paymentHistory,
      exportDate: new Date().toISOString(),
      totalCustomers: customers.length,
      totalOutstanding: customers.reduce(
        (total, customer) => total + customer.items.reduce((sum, item) => sum + item.cost, 0),
        0,
      ),
      totalPayments: paymentHistory.reduce((total, payment) => total + payment.amount, 0),
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `creditkeeper-data-${new Date().toISOString().split("T")[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const exportCSV = () => {
    let csvContent = "Customer Name,Item Name,Cost,Date,Status\n"

    customers.forEach((customer) => {
      if (customer.items.length === 0) {
        csvContent += `${customer.name},No items,0,N/A,No debt\n`
      } else {
        customer.items.forEach((item) => {
          csvContent += `${customer.name},${item.name},${item.cost},${item.date},Outstanding\n`
        })
      }
    })

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `creditkeeper-customers-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const getTotalOutstanding = () => {
    return customers.reduce((total, customer) => total + customer.items.reduce((sum, item) => sum + item.cost, 0), 0)
  }

  const getTotalPayments = () => {
    return paymentHistory.reduce((total, payment) => total + payment.amount, 0)
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
              <p className="text-sm text-muted-foreground">Export Data</p>
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
          className="max-w-4xl mx-auto space-y-6"
        >
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Download className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-foreground">Export Your Data</h2>
            <p className="text-muted-foreground">
              Download your customer data and payment history for backup or analysis.
            </p>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-gradient-to-r from-blue-500/10 to-blue-600/10 border-blue-500/20">
              <CardContent className="pt-6">
                <div className="text-center">
                  <Users className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-blue-500">{customers.length}</p>
                  <p className="text-sm text-muted-foreground">Total Customers</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-red-500/10 to-red-600/10 border-red-500/20">
              <CardContent className="pt-6">
                <div className="text-center">
                  <IndianRupee className="h-8 w-8 text-red-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-red-500">₹{getTotalOutstanding()}</p>
                  <p className="text-sm text-muted-foreground">Outstanding</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-green-500/10 to-green-600/10 border-green-500/20">
              <CardContent className="pt-6">
                <div className="text-center">
                  <IndianRupee className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-green-500">₹{getTotalPayments()}</p>
                  <p className="text-sm text-muted-foreground">Total Collected</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Export Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="hover:shadow-lg transition-all duration-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-500" />
                  Complete Data Export (JSON)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Export all your data including customers, items, payment history, and metadata in JSON format. Perfect
                  for backup and data migration.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Customer information</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Item details with dates</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Payment history</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Summary statistics</span>
                  </div>
                </div>
                <Button onClick={exportData} className="w-full" disabled={customers.length === 0}>
                  <Download className="h-4 w-4 mr-2" />
                  Download JSON
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-green-500" />
                  Customer Report (CSV)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Export customer data in CSV format for easy viewing in spreadsheet applications like Excel or Google
                  Sheets.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Customer names</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Item details and costs</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Purchase dates</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Payment status</span>
                  </div>
                </div>
                <Button
                  onClick={exportCSV}
                  variant="outline"
                  className="w-full bg-transparent"
                  disabled={customers.length === 0}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download CSV
                </Button>
              </CardContent>
            </Card>
          </div>

          {customers.length === 0 && (
            <Card className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-amber-200/50 dark:border-amber-800/30">
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <Calendar className="h-12 w-12 text-amber-500 mx-auto" />
                  <div>
                    <h3 className="font-semibold text-amber-900 dark:text-amber-100 mb-2">No Data to Export</h3>
                    <p className="text-sm text-amber-700 dark:text-amber-300 mb-4">
                      You haven't added any customers yet. Start by adding your first customer to begin tracking credit.
                    </p>
                    <Link href="/add">
                      <Button className="bg-amber-500 hover:bg-amber-600 text-white">Add First Customer</Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </main>
    </div>
  )
}
