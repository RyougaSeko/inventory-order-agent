"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function PurchaseApproval() {
  const [pendingApprovals, setPendingApprovals] = useState([
    { id: 1, item: "Eggs", quantity: 10, unit: "cases" },
    { id: 2, item: "Milk", quantity: 20, unit: "gallons" },
    { id: 3, item: "Olive Oil", quantity: 15, unit: "gallons" },
  ])

  const handleApprove = (id: number) => {
    // Here you would typically send an API request to approve the purchase
    setPendingApprovals(pendingApprovals.filter((approval) => approval.id !== id))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Purchase Approvals</CardTitle>
      </CardHeader>
      <CardContent>
        {pendingApprovals.map((approval) => (
          <div key={approval.id} className="flex items-center justify-between mb-4">
            <span>
              {approval.item}: {approval.quantity} {approval.unit}
            </span>
            <Button onClick={() => handleApprove(approval.id)}>Approve</Button>
          </div>
        ))}
        {pendingApprovals.length === 0 && <p>No pending approvals</p>}
      </CardContent>
    </Card>
  )
}

