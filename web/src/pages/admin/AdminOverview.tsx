import React, { useState, useEffect } from 'react';
import { Card } from '../../components/Card';
import { Building2, Home, CalendarCheck, Users, TrendingUp, CheckCircle, XCircle } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import api from '../../services/api';
import { Loading } from '../../components/Loading';

export const AdminOverview: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get('/admin/data/dashboard');
        setData(response.data);
      } catch (error) {
        console.error('Failed to load dashboard data', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (isLoading) return <Loading />;

  const { totals, charts } = data || {};
  const COLORS = ['#10B981', '#F59E0B', '#EF4444', '#3B82F6'];

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard Overview</h1>
        <p className="text-grey-light">Welcome back, Admin</p>
      </div>
      
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="flex items-center gap-4 border-l-4 border-primary">
          <div className="p-3 bg-primary/10 rounded-lg">
            <Building2 className="text-primary" size={24} />
          </div>
          <div>
            <p className="text-grey-light text-sm">Total Projects</p>
            <p className="text-2xl font-bold text-white">{totals?.totalProjects || 0}</p>
          </div>
        </Card>
        
        <Card className="flex items-center gap-4 border-l-4 border-blue-500">
          <div className="p-3 bg-blue-500/10 rounded-lg">
            <Home className="text-blue-500" size={24} />
          </div>
          <div>
            <p className="text-grey-light text-sm">Total Properties</p>
            <p className="text-2xl font-bold text-white">{totals?.totalProperties || 0}</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4 border-l-4 border-green-500">
          <div className="p-3 bg-green-500/10 rounded-lg">
            <CheckCircle className="text-green-500" size={24} />
          </div>
          <div>
            <p className="text-grey-light text-sm">Available Properties</p>
            <p className="text-2xl font-bold text-white">{totals?.availableProperties || 0}</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4 border-l-4 border-yellow-500">
          <div className="p-3 bg-yellow-500/10 rounded-lg">
            <XCircle className="text-yellow-500" size={24} />
          </div>
          <div>
            <p className="text-grey-light text-sm">Booked Properties</p>
            <p className="text-2xl font-bold text-white">{totals?.bookedProperties || 0}</p>
          </div>
        </Card>

      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Available Properties List */}
        <Card className="lg:col-span-2 mt-8">
          <h2 className="text-xl font-bold text-white mb-6">Available & Booked Properties</h2>
          {data?.availablePropertiesList && data.availablePropertiesList.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-grey-dark text-grey-light text-sm">
                    <th className="pb-3 px-4">Project</th>
                    <th className="pb-3 px-4">Property Name</th>
                    <th className="pb-3 px-4">Type</th>
                    <th className="pb-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data.availablePropertiesList.map((prop: any) => (
                    <tr key={prop.id} className="border-b border-dark-lighter hover:bg-dark-lighter/50">
                      <td className="py-4 px-4 font-semibold text-white">{prop.projectName}</td>
                      <td className="py-4 px-4 text-grey-light">{prop.title}</td>
                      <td className="py-4 px-4 text-grey-light capitalize">{prop.type}</td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          prop.status === 'available' 
                            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                            : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                        }`}>
                          {prop.status?.toUpperCase() || 'UNKNOWN'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-grey-light">
              <p>No available properties found at the moment.</p>
            </div>
          )}
        </Card>

      </div>
    </div>
  );
};
