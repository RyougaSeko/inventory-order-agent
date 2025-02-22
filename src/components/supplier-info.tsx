import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function SupplierInfo() {
  const suppliers = [
    { name: "Fresh Farms Poultry", contact: "john@freshfarms.com" },
    { name: "Green Valley Farms", contact: "info@greenvalley.com" },
    { name: "Italian Imports Co.", contact: "orders@italianimports.com" },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Supplier Information</CardTitle>
      </CardHeader>
      <CardContent>
        {suppliers.map((supplier) => (
          <div key={supplier.name} className="mb-4">
            <h3 className="font-semibold">{supplier.name}</h3>
            <p>{supplier.contact}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

