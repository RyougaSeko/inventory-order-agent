import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface InventoryItem {
  name: string;
  quantity: number;
  maxQuantity: number;
  status: "Sufficient" | "Low";
}

export function InventoryOverview({ items }: { items?: InventoryItem[] }) {
  const defaultItems: InventoryItem[] = [
    {
      name: "Tomatoes",
      quantity: 15,
      maxQuantity: 30,
      status: "Sufficient",
    },
    {
      name: "Cartons of milk",
      quantity: 7,
      maxQuantity: 8,
      status: "Sufficient",
    },
    {
      name: "Cartons of eggs",
      quantity: 12,
      maxQuantity: 24,
      status: "Sufficient",
    },
    {
      name: "Bags of rice",
      quantity: 6,
      maxQuantity: 10,
      status: "Sufficient",
    },
  ];
  const inventoryItems = items?.length ? items : defaultItems;

  // Create a map of default max quantities
  const defaultMaxQuantities = Object.fromEntries(
    defaultItems.map((item) => [item.name, item.maxQuantity])
  );

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
              <span
                className={
                  item.status === "Low" ? "text-red-500" : "text-green-500"
                }
              >
                {item.status}
              </span>
            </div>
            <Progress
              value={
                (item.quantity /
                  (defaultMaxQuantities[item.name] || item.maxQuantity)) *
                100
              }
            />
            <div className="text-sm text-gray-500 mt-1">
              {item.quantity}/
              {defaultMaxQuantities[item.name] || item.maxQuantity}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
