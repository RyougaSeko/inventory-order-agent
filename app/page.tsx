"use client";
import { useState } from "react";
import {
  InventoryAnalysis,
  InventoryItem,
} from "@/components/inventory-analysis";
import { InventoryOverview } from "@/components/inventory-overview";
import { LowStockAlerts } from "@/components/low-stock-alerts";
import { PurchaseApproval } from "@/components/purchase-approval";
import { RecentActivity } from "@/components/recent-activity";

export enum InventoryItemName {
  TOMATOES = "Tomatoes",
  CARTONS_OF_MILK = "Cartons of milk",
  CARTONS_OF_EGGS = "Cartons of eggs",
  BAGS_OF_RICE = "Bags of rice",
}

const defaultInventoryItems: InventoryItem[] = [
  {
    name: InventoryItemName.TOMATOES,
    quantity: 15,
    maxQuantity: 30,
    status: "Sufficient",
    item_id: 1,
    category: "Produce",
    unit: "pieces",
  },
  {
    name: InventoryItemName.CARTONS_OF_MILK,
    quantity: 7,
    maxQuantity: 8,
    status: "Sufficient",
    item_id: 2,
    category: "Dairy",
    unit: "cartons",
  },
  {
    name: InventoryItemName.CARTONS_OF_EGGS,
    quantity: 12,
    maxQuantity: 24,
    status: "Sufficient",
    item_id: 3,
    category: "Dairy",
    unit: "cartons",
  },
  {
    name: InventoryItemName.BAGS_OF_RICE,
    quantity: 6,
    maxQuantity: 10,
    status: "Sufficient",
    item_id: 4,
    category: "Grains",
    unit: "bags",
  },
];

export const maxQuantities: Record<InventoryItemName, number> = {
  [InventoryItemName.CARTONS_OF_MILK]: 8,
  [InventoryItemName.CARTONS_OF_EGGS]: 24,
  [InventoryItemName.BAGS_OF_RICE]: 10,
  [InventoryItemName.TOMATOES]: 30,
};

export const reorderPoints: Record<InventoryItemName, number> = {
  [InventoryItemName.CARTONS_OF_MILK]: 3,
  [InventoryItemName.CARTONS_OF_EGGS]: 4,
  [InventoryItemName.BAGS_OF_RICE]: 5,
  [InventoryItemName.TOMATOES]: 4,
};

export default function Dashboard() {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>(
    defaultInventoryItems
  );
  const [activities, setActivities] = useState([
    {
      action: "Image analyzed",
      item: "Inventory snapshot",
      timestamp: "2025-02-22 13:45",
    },
    {
      action: "Low stock detected",
      item: "Eggs",
      timestamp: "2025-02-22 13:46",
    },
    {
      action: "Purchase approval requested",
      item: "Eggs",
      timestamp: "2025-02-22 13:47",
    },
    {
      action: "Purchase approved",
      item: "Milk",
      timestamp: "2025-02-22 13:30",
    },
  ]);

  const addActivity = (action: string, item: string) => {
    const timestamp = new Date().toLocaleString();
    setActivities((prev) => {
      // Check if this exact activity already exists to prevent duplicates
      const exists = prev.some(
        (activity) =>
          activity.action === action &&
          activity.item === item &&
          activity.timestamp === timestamp
      );
      if (exists) return prev;
      return [...prev, { action, item, timestamp }];
    });
  };

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-8">Marina.ai</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <InventoryAnalysis onAnalysisComplete={setInventoryItems} />
        <InventoryOverview items={inventoryItems} />
        <LowStockAlerts items={inventoryItems} />
        <PurchaseApproval
          items={inventoryItems}
          onApprove={(action, item) => addActivity(action, item)}
        />
        <RecentActivity activities={activities} />
      </div>
    </div>
  );
}
