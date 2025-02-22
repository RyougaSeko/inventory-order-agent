"use client";

import { reorderPoints } from "@/app/page";
import { InventoryItem } from "@/components/inventory-analysis";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";

interface PurchaseApprovalProps {
  items: InventoryItem[];
  onApprove: (message: string, item: string) => void;
}

export function PurchaseApproval({
  items,

  onApprove,
}: PurchaseApprovalProps) {
  const [pendingApprovals, setPendingApprovals] = useState<
    Array<{
      id: number;
      item: string;
      quantity: number;
      unit: string;
      currentStock: number;
      reorderPoint: number;
    }>
  >([]);

  useEffect(() => {
    setPendingApprovals(
      items
        .filter((item) => {
          const reorderPoint = reorderPoints[item.name];
          return item.quantity <= reorderPoint;
        })
        .map((item) => ({
          id: item.item_id,
          item: item.name,
          quantity: item.quantity,
          unit: item.unit,
          currentStock: item.quantity,
          reorderPoint: reorderPoints[item.name],
        }))
    );
  }, [items, reorderPoints]);

  const handleApprove = (id: number) => {
    const approval = pendingApprovals.find((a) => a.id === id);
    if (approval) {
      onApprove("Purchase approved", approval.item);
      setPendingApprovals(
        pendingApprovals.filter((approval) => approval.id !== id)
      );
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Purchase Approvals</CardTitle>
      </CardHeader>
      <CardContent>
        {pendingApprovals.length > 0 ? (
          pendingApprovals.map((approval) => (
            <div
              key={approval.id}
              className="flex items-center justify-between mb-4"
            >
              <div className="flex items-center">
                <AlertCircle className="text-red-500 mr-2" />
                <span>
                  {approval.item}: {approval.currentStock} {approval.unit}{" "}
                  remaining
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500">
                  Reorder at: {approval.reorderPoint} {approval.unit}
                </span>
                <Button onClick={() => handleApprove(approval.id)}>
                  Approve
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-green-600">No pending approvals</div>
        )}
      </CardContent>
    </Card>
  );
}
