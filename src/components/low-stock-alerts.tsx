import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"

export function LowStockAlerts() {
  const lowStockItems = [
    { name: "Eggs", quantity: 2, unit: "cases", reorderPoint: 5 },
    { name: "Milk", quantity: 5, unit: "gallons", reorderPoint: 10 },
    { name: "Olive Oil", quantity: 10, unit: "gallons", reorderPoint: 15 },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Low Stock Alerts</CardTitle>
      </CardHeader>
      <CardContent>
        {lowStockItems.map((item) => (
          <div key={item.name} className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <AlertCircle className="text-red-500 mr-2" />
              <span>
                {item.name}: {item.quantity} {item.unit} remaining
              </span>
            </div>
            <span className="text-sm text-gray-500">
              Reorder at: {item.reorderPoint} {item.unit}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

