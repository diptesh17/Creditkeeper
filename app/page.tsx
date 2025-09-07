"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Plus,
  ArrowLeft,
  Trash2,
  Sun,
  Moon,
  IndianRupee,
  Calendar,
  Minus,
  TrendingUp,
  Users,
  ShoppingCart,
  Search,
  Download,
  BarChart3,
  Filter,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

interface Item {
  id: string
  name: string
  cost: number
  date: string
}

interface Customer {
  id: string
  name: string
  items: Item[]
}

interface PaymentHistory {
  id: string
  customerId: string
  amount: number
  date: string
}

const initialCustomers: Customer[] = []

export default function CreditTracker() {
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [newItemName, setNewItemName] = useState("")
  const [newItemCost, setNewItemCost] = useState("")
  const [newItemDate, setNewItemDate] = useState(new Date().toISOString().split("T")[0])
  const [newCustomerName, setNewCustomerName] = useState("")
  const [amountGiven, setAmountGiven] = useState("")
  const [isDark, setIsDark] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddCustomer, setShowAddCustomer] = useState(false)
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistory[]>([])
  const [showStats, setShowStats] = useState(false)
  const [filterAmount, setFilterAmount] = useState("")

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

  const calculateTotal = (items: Item[]) => {
    return items.reduce((total, item) => total + item.cost, 0)
  }

  const addCustomer = () => {
    if (!newCustomerName.trim()) return

    const newCustomer: Customer = {
      id: Date.now().toString(),
      name: newCustomerName.trim(),
      items: [],
    }

    setCustomers([...customers, newCustomer])
    setNewCustomerName("")
    setShowAddCustomer(false)
  }

  const addItem = () => {
    if (!selectedCustomer || !newItemName.trim() || !newItemCost.trim()) return

    const cost = Number.parseFloat(newItemCost)
    if (isNaN(cost) || cost <= 0) return

    const newItem: Item = {
      id: Date.now().toString(),
      name: newItemName.trim(),
      cost: cost,
      date: newItemDate,
    }

    const updatedCustomers = customers.map((customer) =>
      customer.id === selectedCustomer.id ? { ...customer, items: [...customer.items, newItem] } : customer,
    )

    setCustomers(updatedCustomers)
    setSelectedCustomer((prev) => (prev ? { ...prev, items: [...prev.items, newItem] } : null))
    setNewItemName("")
    setNewItemCost("")
    setNewItemDate(new Date().toISOString().split("T")[0])
  }

  const handlePayment = () => {
    if (!selectedCustomer || !amountGiven.trim()) return

    const payment = Number.parseFloat(amountGiven)
    if (isNaN(payment) || payment <= 0) return

    const paymentRecord: PaymentHistory = {
      id: Date.now().toString(),
      customerId: selectedCustomer.id,
      amount: payment,
      date: new Date().toISOString().split("T")[0],
    }
    setPaymentHistory([...paymentHistory, paymentRecord])

    let remainingPayment = payment
    const updatedItems = [...selectedCustomer.items]

    for (let i = 0; i < updatedItems.length && remainingPayment > 0; i++) {
      if (updatedItems[i].cost <= remainingPayment) {
        remainingPayment -= updatedItems[i].cost
        updatedItems.splice(i, 1)
        i--
      } else {
        updatedItems[i].cost -= remainingPayment
        remainingPayment = 0
      }
    }

    const updatedCustomers = customers.map((customer) =>
      customer.id === selectedCustomer.id ? { ...customer, items: updatedItems } : customer,
    )

    setCustomers(updatedCustomers)
    setSelectedCustomer((prev) => (prev ? { ...prev, items: updatedItems } : null))
    setAmountGiven("")
  }

  const deleteItem = (itemId: string) => {
    if (!selectedCustomer) return

    const updatedCustomers = customers.map((customer) =>
      customer.id === selectedCustomer.id
        ? { ...customer, items: customer.items.filter((item) => item.id !== itemId) }
        : customer,
    )

    setCustomers(updatedCustomers)
    setSelectedCustomer((prev) =>
      prev
        ? {
            ...prev,
            items: prev.items.filter((item) => item.id !== itemId),
          }
        : null,
    )
  }

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase())
    const total = calculateTotal(customer.items)
    const matchesFilter = filterAmount === "" || total >= Number.parseFloat(filterAmount)
    return matchesSearch && matchesFilter
  })

  const exportData = () => {
    const data = {
      customers,
      paymentHistory,
      exportDate: new Date().toISOString(),
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `creditkeeper-data-${new Date().toISOString().split("T")[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const getTotalOutstanding = () => {
    return customers.reduce((total, customer) => total + calculateTotal(customer.items), 0)
  }

  const getTotalPayments = () => {
    return paymentHistory.reduce((total, payment) => total + payment.amount, 0)
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {selectedCustomer && (
              <Button variant="ghost" size="sm" onClick={() => setSelectedCustomer(null)} className="p-2">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            )}
            <div>
              <h1 className="text-2xl font-bold text-primary">
                {selectedCustomer ? selectedCustomer.name : "CreditKeeper"}
              </h1>
              {!selectedCustomer && <p className="text-sm text-muted-foreground">Smart Credit Management</p>}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!selectedCustomer && (
              <>
                <Button variant="ghost" size="sm" onClick={() => setShowStats(!showStats)} className="p-2">
                  <BarChart3 className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="sm" onClick={exportData} className="p-2">
                  <Download className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setShowAddCustomer(!showAddCustomer)} className="p-2">
                  {showAddCustomer ? <X className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                </Button>
              </>
            )}
            <Button variant="ghost" size="sm" onClick={toggleTheme} className="p-2">
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <AnimatePresence mode="wait">
          {!selectedCustomer ? (
            <motion.div
              key="customer-list"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {showStats && customers.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="grid grid-cols-1 md:grid-cols-3 gap-4"
                >
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
                        <TrendingUp className="h-8 w-8 text-red-500 mx-auto mb-2" />
                        <div className="flex items-center justify-center gap-1 text-2xl font-bold text-red-500">
                          <IndianRupee className="h-6 w-6" />
                          {getTotalOutstanding()}
                        </div>
                        <p className="text-sm text-muted-foreground">Outstanding</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-gradient-to-r from-green-500/10 to-green-600/10 border-green-500/20">
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <Download className="h-8 w-8 text-green-500 mx-auto mb-2" />
                        <div className="flex items-center justify-center gap-1 text-2xl font-bold text-green-500">
                          <IndianRupee className="h-6 w-6" />
                          {getTotalPayments()}
                        </div>
                        <p className="text-sm text-muted-foreground">Total Collected</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {customers.length === 0 && (
                <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
                  <CardContent className="pt-6 pb-6">
                    <div className="text-center space-y-4">
                      <div className="flex justify-center gap-4 mb-4">
                        <div className="p-3 bg-primary/10 rounded-full">
                          <Users className="h-6 w-6 text-primary" />
                        </div>
                        <div className="p-3 bg-primary/10 rounded-full">
                          <ShoppingCart className="h-6 w-6 text-primary" />
                        </div>
                        <div className="p-3 bg-primary/10 rounded-full">
                          <TrendingUp className="h-6 w-6 text-primary" />
                        </div>
                      </div>
                      <h2 className="text-2xl font-bold text-foreground">Welcome to CreditKeeper</h2>
                      <p className="text-muted-foreground max-w-2xl mx-auto">
                        The smart way to manage customer credit and track outstanding payments. Perfect for shop owners,
                        small businesses, and anyone who needs to keep track of who owes what. Add customers, track
                        items, and manage payments with ease.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 text-sm">
                        <div className="flex items-center gap-2 justify-center">
                          <Users className="h-4 w-4 text-primary" />
                          <span>Manage Customers</span>
                        </div>
                        <div className="flex items-center gap-2 justify-center">
                          <ShoppingCart className="h-4 w-4 text-primary" />
                          <span>Track Items & Dates</span>
                        </div>
                        <div className="flex items-center gap-2 justify-center">
                          <TrendingUp className="h-4 w-4 text-primary" />
                          <span>Record Payments</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <AnimatePresence>
                {showAddCustomer && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Add New Customer</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex gap-4">
                          <Input
                            placeholder="Customer name"
                            value={newCustomerName}
                            onChange={(e) => setNewCustomerName(e.target.value)}
                            className="flex-1"
                            onKeyPress={(e) => e.key === "Enter" && addCustomer()}
                          />
                          <Button onClick={addCustomer} disabled={!newCustomerName.trim()}>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Customer
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>

              {customers.length > 0 && (
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search customers..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                      <div className="relative">
                        <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="number"
                          placeholder="Min amount"
                          value={filterAmount}
                          onChange={(e) => setFilterAmount(e.target.value)}
                          className="pl-10 w-full md:w-40"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {customers.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCustomers.map((customer) => {
                    const total = calculateTotal(customer.items)
                    return (
                      <motion.div key={customer.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Card
                          className="cursor-pointer hover:shadow-lg transition-all duration-200 bg-gradient-to-br from-card to-card/50"
                          onClick={() => setSelectedCustomer(customer)}
                        >
                          <CardHeader className="pb-3">
                            <CardTitle className="text-lg text-foreground">{customer.name}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-muted-foreground">
                                {customer.items.length} item{customer.items.length !== 1 ? "s" : ""}
                              </span>
                              <div className="flex items-center gap-1 text-lg font-semibold text-primary">
                                <IndianRupee className="h-4 w-4" />
                                {total}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    )
                  })}
                </div>
              )}

              {customers.length > 0 && filteredCustomers.length === 0 && (
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-center text-muted-foreground">
                      No customers found matching your search criteria.
                    </p>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="customer-detail"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-2">Total Amount</p>
                    <div className="flex items-center justify-center gap-2 text-3xl font-bold text-primary">
                      <IndianRupee className="h-8 w-8" />
                      {calculateTotal(selectedCustomer.items)}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Record Payment</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-4">
                    <Input
                      type="number"
                      placeholder="Amount given"
                      value={amountGiven}
                      onChange={(e) => setAmountGiven(e.target.value)}
                      min="0"
                      step="0.01"
                      className="flex-1"
                      onKeyPress={(e) => e.key === "Enter" && handlePayment()}
                    />
                    <Button onClick={handlePayment} disabled={!amountGiven.trim()} variant="outline">
                      <Minus className="h-4 w-4 mr-2" />
                      Record Payment
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Add New Item</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Input
                      placeholder="Item name"
                      value={newItemName}
                      onChange={(e) => setNewItemName(e.target.value)}
                      className="md:col-span-2"
                    />
                    <Input
                      type="number"
                      placeholder="Cost"
                      value={newItemCost}
                      onChange={(e) => setNewItemCost(e.target.value)}
                      min="0"
                      step="0.01"
                    />
                    <Input type="date" value={newItemDate} onChange={(e) => setNewItemDate(e.target.value)} />
                  </div>
                  <Button
                    onClick={addItem}
                    className="w-full md:w-auto"
                    disabled={!newItemName.trim() || !newItemCost.trim()}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Item
                  </Button>
                </CardContent>
              </Card>

              {paymentHistory.filter((p) => p.customerId === selectedCustomer.id).length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Payment History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {paymentHistory
                        .filter((p) => p.customerId === selectedCustomer.id)
                        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                        .slice(0, 5)
                        .map((payment) => (
                          <div
                            key={payment.id}
                            className="flex items-center justify-between py-2 border-b border-border/50 last:border-b-0"
                          >
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              {new Date(payment.date).toLocaleDateString("en-IN")}
                            </div>
                            <div className="flex items-center gap-1 font-medium text-green-600">
                              <Minus className="h-3 w-3" />
                              <IndianRupee className="h-3 w-3" />
                              {payment.amount}
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-foreground">Items</h3>
                {selectedCustomer.items.length === 0 ? (
                  <Card>
                    <CardContent className="pt-6">
                      <p className="text-center text-muted-foreground">
                        No items added yet. Add your first item above.
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <AnimatePresence>
                    {selectedCustomer.items.map((item) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Card className="hover:shadow-md transition-shadow duration-200">
                          <CardContent className="pt-4">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <h4 className="font-medium text-foreground">{item.name}</h4>
                                <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                                  <Calendar className="h-3 w-3" />
                                  {new Date(item.date).toLocaleDateString("en-IN")}
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1 font-semibold text-primary">
                                  <IndianRupee className="h-4 w-4" />
                                  {item.cost}
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => deleteItem(item.id)}
                                  className="text-destructive hover:text-destructive hover:bg-destructive/10 p-2"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}
