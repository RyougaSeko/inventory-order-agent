import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export function InventoryOverview() {
  const inventoryItems = [
    { name: "Chicken Breast", quantity: 50, maxQuantity: 100, status: "Sufficient" },
    { name: "Tomatoes", quantity: 30, maxQuantity: 50, status: "Sufficient" },
    { name: "Spaghetti Pasta", quantity: 100, maxQuantity: 150, status: "Sufficient" },
    { name: "Olive Oil", quantity: 10, maxQuantity: 30, status: "Low" },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Inventory Overview</CardTitle>
      </CardHeader>
      <CardContent>
        {inventoryItems.map((item) => (
          <div key={item.name} className="mb-4">
            <div className="flex justify-between mb-1">
              <span>{item.name}</span>
              <span className={item.status === "Low" ? "text-red-500" : "text-green-500"}>{item.status}</span>
            </div>
            <Progress value={(item.quantity / item.maxQuantity) * 100} />
            <div className="text-sm text-gray-500 mt-1">
              {item.quantity}/{item.maxQuantity}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

