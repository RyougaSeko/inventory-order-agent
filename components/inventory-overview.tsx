import { InventoryItemName, maxQuantities, reorderPoints } from "@/app/page";
import { InventoryItem } from "./inventory-analysis";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export function InventoryOverview({ items }: { items?: InventoryItem[] }) {
  const getStatus = (
    name: InventoryItemName,
    quantity: number
  ): "Sufficient" | "Low" => {
    return quantity <= reorderPoints[name] ? "Low" : "Sufficient";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Inventory Overview</CardTitle>
      </CardHeader>
      <CardContent>
        {items?.map((item) => (
          <div key={item.name} className="mb-4">
            <div className="flex justify-between mb-1">
              <span>{item.name}</span>
              <span
                className={
                  getStatus(item.name, item.quantity) === "Low"
                    ? "text-red-500"
                    : "text-green-500"
                }
              >
                {getStatus(item.name, item.quantity)}
              </span>
            </div>
            <Progress
              value={(item.quantity / maxQuantities[item.name]) * 100}
            />
            <div className="text-sm text-gray-500 mt-1">
              {item.quantity}/{maxQuantities[item.name]}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
