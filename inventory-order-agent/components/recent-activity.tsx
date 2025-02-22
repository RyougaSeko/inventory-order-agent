import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function RecentActivity() {
  const activities = [
    { action: "Image analyzed", item: "Inventory snapshot", timestamp: "2025-02-22 13:45" },
    { action: "Low stock detected", item: "Eggs", timestamp: "2025-02-22 13:46" },
    { action: "Purchase approval requested", item: "Eggs", timestamp: "2025-02-22 13:47" },
    { action: "Purchase approved", item: "Milk", timestamp: "2025-02-22 13:30" },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {activities.map((activity, index) => (
          <div key={index} className="mb-2">
            <span className="font-semibold">{activity.action}:</span> {activity.item}
            <div className="text-sm text-gray-500">{activity.timestamp}</div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

