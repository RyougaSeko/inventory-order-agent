import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { InventoryItem } from "./inventory-analysis";
import { reorderPoints } from "@/types/inventory";

export function LowStockAlerts({ items }: { items: InventoryItem[] }) {
  const lowStockItems = items
    .filter((item) => {
      const reorderPoint = reorderPoints[item.name];
      return item.quantity <= reorderPoint;
    })
    .map((item) => ({
      ...item,
      reorderPoint: reorderPoints[item.name],
    }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Low Stock Alerts</CardTitle>
      </CardHeader>
      <CardContent>
        {lowStockItems.length > 0 ? (
          lowStockItems.map((item) => (
            <div
              key={item.name}
              className="flex items-center justify-between mb-4"
            >
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
          ))
        ) : (
          <div className="text-green-600">All stock levels are sufficient</div>
        )}
      </CardContent>
    </Card>
  );
}
