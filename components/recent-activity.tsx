import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Activity {
  action: string;
  item: string;
  timestamp: string;
}

interface RecentActivityProps {
  activities: Activity[];
}

export function RecentActivity({ activities }: RecentActivityProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {[...activities]
          .sort(
            (a, b) =>
              new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          )
          .map((activity, index) => (
            <div key={index} className="mb-2">
              <span className="font-semibold">{activity.action}:</span>{" "}
              {activity.item}
              <div className="text-sm text-gray-500">{activity.timestamp}</div>
            </div>
          ))}
      </CardContent>
    </Card>
  );
}
