"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Check, Loader2, ShoppingCart } from "lucide-react"
import { Input } from "@/components/ui/input"

interface Supplier {
  id: string
  name: string
  price: number
  deliveryDays: number
}

interface InventoryItem {
  name: string
  current: number
  max: number
  status: "Sufficient" | "Low"
  supplier?: Supplier
  suggestedOrderQuantity?: number
}

interface AnalysisResultsProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  items: InventoryItem[]
}

export function AnalysisResults({ open, onOpenChange, items }: AnalysisResultsProps) {
  const [orderQuantities, setOrderQuantities] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState<Record<string, boolean>>({})
  const [ordered, setOrdered] = useState<Record<string, boolean>>({})

  useEffect(() => {
    // Reset states when the dialog opens
    if (open) {
      setOrderQuantities({})
      setLoading({})
      setOrdered({})
    }
  }, [open])

  const handleOrder = async (itemName: string) => {
    setLoading((prev) => ({ ...prev, [itemName]: true }))
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setLoading((prev) => ({ ...prev, [itemName]: false }))
    setOrdered((prev) => ({ ...prev, [itemName]: true }))

    // Check if all low stock items have been ordered
    const allLowStockOrdered = items
      .filter((item) => item.status === "Low")
      .every((item) => ordered[item.name] || item.name === itemName)

    if (allLowStockOrdered) {
      // Close the dialog after a short delay to show the "Ordered" state
      setTimeout(() => onOpenChange(false), 1000)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Inventory Overview</DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-8">
          {items.map((item) => (
            <div key={item.name} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-lg">{item.name}</span>
                <span className={item.status === "Low" ? "text-red-500" : "text-green-500"}>{item.status}</span>
              </div>
              <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-black" style={{ width: `${(item.current / item.max) * 100}%` }} />
              </div>
              <div className="text-gray-600">
                {item.current}/{item.max}
              </div>

              {item.status === "Low" && item.supplier && (
                <div className="mt-4 space-y-4 bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold">Suggested Order</h3>
                  <div className="space-y-2">
                    <div className="text-sm text-gray-600">Supplier: {item.supplier.name}</div>
                    <div className="text-sm text-gray-600">Price: ${item.supplier.price}/unit</div>
                    <div className="text-sm text-gray-600">Estimated Delivery: {item.supplier.deliveryDays} days</div>
                    <Input
                      type="number"
                      placeholder="Quantity"
                      value={orderQuantities[item.name] || item.suggestedOrderQuantity || ""}
                      onChange={(e) =>
                        setOrderQuantities((prev) => ({
                          ...prev,
                          [item.name]: Number.parseInt(e.target.value),
                        }))
                      }
                      min="1"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      Total: ${item.supplier.price * (orderQuantities[item.name] || item.suggestedOrderQuantity || 0)}
                    </div>
                    <Button
                      onClick={() => handleOrder(item.name)}
                      disabled={loading[item.name] || ordered[item.name]}
                      className="w-full mt-2 py-6 text-lg"
                    >
                      {loading[item.name] ? (
                        <>
                          <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                          Processing
                        </>
                      ) : ordered[item.name] ? (
                        <>
                          <Check className="mr-2 h-6 w-6" />
                          Ordered
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="mr-2 h-6 w-6" />
                          Place Order
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        <Button onClick={() => onOpenChange(false)}>Close</Button>
      </DialogContent>
    </Dialog>
  )
}

