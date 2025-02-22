"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, Loader2, ShoppingCart } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { getOrderPromptTemplate, getFirstMessage } from "@/config/order-call-config";

interface Supplier {
  id: string;
  name: string;
  price: number;
  deliveryDays: number;
}

interface InventoryItem {
  name: string;
  current: number;
  max: number;
  status: "Sufficient" | "Low";
  supplier?: Supplier;
  suggestedOrderQuantity?: number;
  quantity: number;
  unit: string;
}

interface AnalysisResultsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: InventoryItem[];
}

export function AnalysisResults({
  open,
  onOpenChange,
  items,
}: AnalysisResultsProps) {
  const [orderQuantities, setOrderQuantities] = useState<
    Record<string, number>
  >({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [ordered, setOrdered] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Reset states when the dialog opens
    if (open) {
      setOrderQuantities({});
      setLoading({});
      setOrdered({});
    }
  }, [open]);

  const handleOrder = async (itemName: string) => {
    setLoading((prev) => ({ ...prev, [itemName]: true }));
    
    try {
      // Find the item being ordered
      const item = items.find((i) => i.name === itemName);
      if (!item || !item.supplier) {
        throw new Error("Item or supplier information not found");
      }

      const orderDetails = {
        prompt: getOrderPromptTemplate(
          item.name,
          orderQuantities[item.name] || item.suggestedOrderQuantity || 0,
          item.unit,
          item.supplier.name
        ),
        first_message: getFirstMessage(),
        number: process.env.NEXT_PUBLIC_OUTBOUND_PHONE,
      };

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

      setLoading((prev) => ({ ...prev, [itemName]: false }));
      setOrdered((prev) => ({ ...prev, [itemName]: true }));

      // Show success toast
      toast.success("Order Placed", {
        description: `Successfully placed order for ${itemName}`,
      });

      // Check if all low stock items have been ordered
      const allLowStockOrdered = items
        .filter((item) => item.status === "Low")
        .every((item) => ordered[item.name] || item.name === itemName);

      if (allLowStockOrdered) {
        // Close the dialog after a short delay to show the "Ordered" state
        setTimeout(() => {
          onOpenChange(false);
          toast.success("All Orders Complete", {
            description: "Successfully placed all pending orders",
          });
        }, 1000);
      }
    } catch (error) {
      console.error("Error placing order:", error);
      setLoading((prev) => ({ ...prev, [itemName]: false }));
      toast.error("Failed to place order", {
        description: "Please try again later",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] w-[95vw] max-h-[90vh] overflow-y-auto px-4 md:px-6">
        <DialogHeader>
          <DialogTitle className="text-xl md:text-2xl font-bold">
            Inventory Overview
          </DialogTitle>
        </DialogHeader>
        <div className="py-2 md:py-4 space-y-6 md:space-y-8">
          {items.map((item) => (
            <div key={item.name} className="space-y-2 touch-manipulation">
              <div className="flex justify-between items-center">
                <span className="text-base md:text-lg font-medium">
                  {item.name}
                </span>
                <span
                  className={`${
                    item.status === "Low" ? "text-red-500" : "text-green-500"
                  } font-medium`}
                >
                  {item.status}
                </span>
              </div>
              <div className="h-3 md:h-4 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-black transition-all duration-300"
                  style={{ width: `${(item.current / item.max) * 100}%` }}
                />
              </div>
              <div className="text-sm md:text-base text-gray-600">
                {item.quantity} {item.unit}
              </div>

              {item.status === "Low" && item.supplier && (
                <div className="mt-3 md:mt-4 space-y-3 md:space-y-4 bg-gray-50 p-3 md:p-4 rounded-lg shadow-sm">
                  <h3 className="font-semibold text-base md:text-lg">
                    Suggested Order
                  </h3>
                  <div className="space-y-2">
                    <div className="text-sm md:text-base text-gray-600">
                      Supplier: {item.supplier.name}
                    </div>
                    <div className="text-sm md:text-base text-gray-600">
                      Price: ${item.supplier.price}/unit
                    </div>
                    <div className="text-sm md:text-base text-gray-600">
                      Estimated Delivery: {item.supplier.deliveryDays} days
                    </div>
                    <Input
                      type="number"
                      className="text-base md:text-lg h-12 md:h-14"
                      placeholder="Quantity"
                      value={
                        orderQuantities[item.name] ||
                        item.suggestedOrderQuantity ||
                        ""
                      }
                      onChange={(e) =>
                        setOrderQuantities((prev) => ({
                          ...prev,
                          [item.name]: Number.parseInt(e.target.value),
                        }))
                      }
                      min="1"
                    />
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                    <div className="text-base md:text-lg font-medium text-gray-800">
                      Total: $
                      {item.supplier.price *
                        (orderQuantities[item.name] ||
                          item.suggestedOrderQuantity ||
                          0)}
                    </div>
                    <Button
                      onClick={() => handleOrder(item.name)}
                      disabled={loading[item.name] || ordered[item.name]}
                      className="w-full md:w-auto min-h-[3rem] text-base md:text-lg px-6 bg-green-600 hover:bg-green-700 text-white transition-colors disabled:bg-green-200"
                    >
                      {loading[item.name] ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 md:h-6 md:w-6 animate-spin" />
                          Processing
                        </>
                      ) : ordered[item.name] ? (
                        <>
                          <Check className="mr-2 h-5 w-5 md:h-6 md:w-6" />
                          Ordered
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="mr-2 h-5 w-5 md:h-6 md:w-6" />
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
        <Button
          onClick={() => onOpenChange(false)}
          variant="outline"
          className="w-full md:w-auto min-h-[3rem] text-base md:text-lg mt-4 border-2 hover:bg-gray-100 transition-colors"
        >
          Close
        </Button>
      </DialogContent>
    </Dialog>
  );
}
