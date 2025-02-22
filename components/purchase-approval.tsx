"use client";

import { reorderPoints, InventoryItem } from "@/types/inventory";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { getOrderPromptTemplate, getFirstMessage } from "@/config/order-call-config";
import { toast } from "sonner";

// Extend the InventoryItem interface to include supplier
interface ExtendedInventoryItem extends InventoryItem {
  supplier?: {
    name: string
  };
}

interface PurchaseApprovalProps {
  items: ExtendedInventoryItem[];
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
  const [loading, setLoading] = useState<Record<number, boolean>>({});

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

  const handleApprove = async (id: number) => {
    setLoading((prev) => ({ ...prev, [id]: true }));
    const approval = pendingApprovals.find((a) => a.id === id);
    
    if (approval) {
      try {
        // Use dummy supplier data instead of looking for it
        const dummySupplier = {
          name: "Fresh Farm Foods"
        };

        const orderDetails = {
          prompt: getOrderPromptTemplate(
            approval.item,
            approval.reorderPoint - approval.currentStock,
            approval.unit,
            dummySupplier.name
          ),
          first_message: getFirstMessage(),
          number: process.env.NEXT_PUBLIC_OUTBOUND_PHONE,
        };

        console.log(orderDetails);
        console.log(process.env.NEXT_PUBLIC_OUTBOUND_CALL_ENDPOINT);

        // Make the API request to the outbound-call endpoint
        const response = await fetch(process.env.NEXT_PUBLIC_OUTBOUND_CALL_ENDPOINT!, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(orderDetails),
        });

        if (!response.ok) {
          throw new Error("Failed to initiate call");
        }

        onApprove("Purchase approved and order placed", approval.item);
        setPendingApprovals(
          pendingApprovals.filter((approval) => approval.id !== id)
        );
        toast.success("Order Placed", {
          description: `Successfully placed order for ${approval.item}`,
        });
      } catch (error) {
        console.error("Error placing order:", error);
        toast.error("Failed to place order", {
          description: "Please try again later",
        });
      } finally {
        setLoading((prev) => ({ ...prev, [id]: false }));
      }
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
                <Button 
                  onClick={() => handleApprove(approval.id)}
                  disabled={loading[approval.id]}
                >
                  {loading[approval.id] ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing
                    </>
                  ) : (
                    "Approve"
                  )}
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
