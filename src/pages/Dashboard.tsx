import { useEffect, useState } from 'react';
import { Users, Package, Activity, TrendingUp, ArrowUpRight, ShieldCheck, ChevronRight } from 'lucide-react';
import { Card } from '../components/common/Card';
import { dashboardService } from '../services/dashboardService';
import type { DashboardMetrics } from '../types';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/authHooks';
import { ROUTES } from '../constants/routes';

export default function Dashboard() {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await dashboardService.getMetrics();
        setMetrics(data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const stats = [
    { 
      name: 'Total Employees', 
      value: (metrics?.totalEmployees ?? 0).toString(), 
      icon: Users, 
      color: 'from-blue-500 to-indigo-600', 
      trend: '+4.2%', 
      service: 'User Service' 
    },
    { 
      name: 'Active Employees', 
      value: (metrics?.activeEmployees ?? 0).toString(), 
      icon: Activity, 
      color: 'from-emerald-500 to-teal-600', 
      trend: '94.8%', 
      service: 'User Service' 
    },
    { 
      name: 'Total Products', 
      value: (metrics?.totalProducts ?? 0).toString(), 
      icon: Package, 
      color: 'from-purple-500 to-violet-600', 
      trend: '+12.1%', 
      service: 'Product Service' 
    },
    { 
      name: 'System Health', 
      value: metrics?.systemHealth ?? '99.9%', 
      icon: TrendingUp, 
      color: 'from-amber-500 to-orange-600', 
      trend: 'Optimal', 
      service: 'ALB Gateway' 
    },
  ];

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="relative">
          <div className="h-12 w-12 rounded-full border-4 border-slate-200 border-t-blue-600 animate-spin"></div>
          <div className="mt-4 text-xs font-semibold text-slate-500 tracking-wider uppercase">Loading Microservices...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-8 text-white shadow-xl border border-slate-800">
        <div className="absolute right-0 top-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-blue-400 uppercase tracking-widest mb-2">
              <ShieldCheck className="h-4 w-4" /> Enterprise Microservices Architecture
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-white">
              Welcome back, {user?.name || 'User'} 👋
            </h2>
            <p className="mt-2 text-slate-300 text-sm max-w-xl leading-relaxed">
              Your ALB is routing incoming requests across ECS container tasks for the User Service and Product Service seamlessly.
            </p>
          </div>
          <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/10 self-start md:self-auto">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <div className="text-left">
              <p className="text-xs font-bold text-white">AWS ALB Gateway</p>
              <p className="text-[11px] text-emerald-300 font-medium">Path-Based Routing Active</p>
            </div>
          </div>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.name} className="hover:-translate-y-1 transition-all duration-300 border border-slate-200/80">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div className={`p-3 rounded-2xl bg-gradient-to-br ${stat.color} text-white shadow-md shadow-blue-500/10`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="inline-flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                    <ArrowUpRight className="h-3 w-3 mr-0.5" />
                    {stat.trend}
                  </span>
                </div>
                <div className="mt-4">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{stat.service}</span>
                  <dd className="text-3xl font-extrabold text-slate-900 mt-1 tracking-tight">{stat.value}</dd>
                  <dt className="text-xs font-semibold text-slate-500 mt-1">{stat.name}</dt>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Two Column Section for Recent Activity */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Recent Employees */}
        <Card className="flex flex-col">
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4.5 bg-slate-50/50">
            <div>
              <h3 className="text-base font-bold text-slate-900">Recent Employees</h3>
              <p className="text-xs text-slate-500">Fetched via GET /api/users</p>
            </div>
            <Link to={ROUTES.EMPLOYEES} className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors">
              View All <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <ul className="divide-y divide-slate-100 flex-1">
            {metrics?.recentEmployees.map((employee) => (
              <li key={employee.id} className="px-6 py-4 hover:bg-slate-50/60 transition-colors flex items-center justify-between">
                <div className="flex items-center space-x-3.5">
                  <div className="h-10 w-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 font-bold text-sm shadow-xs">
                    {employee.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{employee.name}</p>
                    <p className="text-xs text-slate-500 font-medium">{employee.department} • {employee.email}</p>
                  </div>
                </div>
                <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold ${
                  employee.status === 'Active' 
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60' 
                    : 'bg-slate-100 text-slate-600 border border-slate-200'
                }`}>
                  <span className={`h-1.5 w-1.5 rounded-full mr-1.5 ${employee.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                  {employee.status}
                </span>
              </li>
            ))}
            {(!metrics || metrics.recentEmployees.length === 0) && (
              <li className="px-6 py-12 text-center text-sm font-medium text-slate-400">
                No employee records found.
              </li>
            )}
          </ul>
        </Card>

        {/* Recent Products */}
        <Card className="flex flex-col">
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4.5 bg-slate-50/50">
            <div>
              <h3 className="text-base font-bold text-slate-900">Recent Products</h3>
              <p className="text-xs text-slate-500">Fetched via GET /api/products</p>
            </div>
            <Link to={ROUTES.PRODUCTS} className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors">
              View All <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <ul className="divide-y divide-slate-100 flex-1">
            {metrics?.recentProducts.map((product) => (
              <li key={product.id} className="px-6 py-4 hover:bg-slate-50/60 transition-colors flex items-center justify-between">
                <div className="flex items-center space-x-3.5">
                  <div className="h-10 w-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm shadow-xs">
                    {product.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{product.name}</p>
                    <p className="text-xs text-slate-500 font-medium">${Number(product.price).toFixed(2)} • Qty: {product.quantity}</p>
                  </div>
                </div>
                <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold ${
                  product.status === 'In Stock' 
                    ? 'bg-blue-50 text-blue-700 border border-blue-200/60' 
                    : 'bg-rose-50 text-rose-700 border border-rose-200/60'
                }`}>
                  <span className={`h-1.5 w-1.5 rounded-full mr-1.5 ${product.status === 'In Stock' ? 'bg-blue-500' : 'bg-rose-500'}`}></span>
                  {product.status}
                </span>
              </li>
            ))}
            {(!metrics || metrics.recentProducts.length === 0) && (
              <li className="px-6 py-12 text-center text-sm font-medium text-slate-400">
                No product records found.
              </li>
            )}
          </ul>
        </Card>
      </div>
    </div>
  );
}
