import { formatCurrency } from "@/lib/utils";

interface StatsProps {
  stats: {
    totalOrders: number;
    totalRevenue: number;
    totalProducts: number;
    totalCustomers: number;
    lowStockProducts: number;
  }
}

export default function StatsOverview({ stats }: StatsProps) {
  const statCards = [
    {
      title: "Total Orders",
      value: stats.totalOrders.toString(),
      icon: "shopping_cart",
      colorClass: "bg-blue-500"
    },
    {
      title: "Revenue",
      value: formatCurrency(stats.totalRevenue),
      icon: "payments",
      colorClass: "bg-green-500"
    },
    {
      title: "Products",
      value: stats.totalProducts.toString(),
      icon: "inventory_2",
      colorClass: "bg-amber-500"
    },
    {
      title: "Customers",
      value: stats.totalCustomers.toString(),
      icon: "group",
      colorClass: "bg-purple-500"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((card, index) => (
        <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="flex items-center">
            <div className={`${card.colorClass} p-4 text-white`}>
              <span className="material-symbols-outlined text-3xl">{card.icon}</span>
            </div>
            <div className="p-4">
              <p className="text-sm text-gray-500">{card.title}</p>
              <p className="text-xl font-bold">{card.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}