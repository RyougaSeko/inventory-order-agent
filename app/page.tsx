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

export default function Dashboard() {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-8">
        Inventory Management Dashboard
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <InventoryAnalysis onAnalysisComplete={setInventoryItems} />
        <InventoryOverview items={inventoryItems} />
        <LowStockAlerts />
        <PurchaseApproval />
        <RecentActivity />
      </div>
    </div>
  );
}
