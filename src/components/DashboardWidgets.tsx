import React from 'react';
import { IndianRupee, ShoppingBag, Users, Package } from 'lucide-react';

interface MetricProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  bgIcon: string;
  textIcon: string;
}

function MetricCard({ title, value, icon, bgIcon, textIcon }: MetricProps) {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/60 rounded-3xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 flex items-center justify-between">
      <div>
        <span className="text-[11px] font-extrabold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 block">
          {title}
        </span>
        <h3 className="text-2xl font-black text-zinc-900 dark:text-white mt-1.5 tracking-tight">
          {value}
        </h3>
      </div>
      <div className={`p-3.5 rounded-2xl ${bgIcon} ${textIcon} flex items-center justify-center`}>
        {icon}
      </div>
    </div>
  );
}

interface DashboardWidgetsProps {
  metrics: {
    totalSales: number;
    ordersCount: number;
    usersCount: number;
    productsCount: number;
  } | null;
}

export default function DashboardWidgets({ metrics }: DashboardWidgetsProps) {
  const data = metrics || {
    totalSales: 0,
    ordersCount: 0,
    usersCount: 0,
    productsCount: 0,
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <MetricCard
        title="Total Revenue"
        value={`₹${data.totalSales.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
        icon={<IndianRupee className="h-5 w-5" />}
        bgIcon="bg-emerald-50 dark:bg-emerald-950/30"
        textIcon="text-emerald-500"
      />
      <MetricCard
        title="Total Orders"
        value={data.ordersCount}
        icon={<ShoppingBag className="h-5 w-5" />}
        bgIcon="bg-teal-50 dark:bg-teal-950/30"
        textIcon="text-teal-500"
      />
      <MetricCard
        title="Active Clients"
        value={data.usersCount}
        icon={<Users className="h-5 w-5" />}
        bgIcon="bg-indigo-50 dark:bg-indigo-950/30"
        textIcon="text-indigo-500"
      />
      <MetricCard
        title="Products Registered"
        value={data.productsCount}
        icon={<Package className="h-5 w-5" />}
        bgIcon="bg-amber-50 dark:bg-amber-950/30"
        textIcon="text-amber-500"
      />
    </div>
  );
}
