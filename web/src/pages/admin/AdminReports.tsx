import React, { useState, useEffect } from 'react';
import { Card } from '../../components/Card';
import { TrendingUp } from 'lucide-react';

import api from '../../services/api';
import { formatCurrency } from '../../utils/helpers';
import { Loading } from '../../components/Loading';

export const AdminReports: React.FC = () => {
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

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Reports</h1>
        <p className="text-grey-light">View system reports and revenue insights</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="flex items-center gap-4 border-l-4 border-emerald-400">
          <div className="p-3 bg-emerald-400/10 rounded-lg">
            <TrendingUp className="text-emerald-400" size={24} />
          </div>
          <div>
            <p className="text-grey-light text-sm">Total Revenue</p>
            <p className="text-3xl font-bold text-emerald-400">{formatCurrency(totals?.totalRevenue || 0)}</p>
          </div>
        </Card>
      </div>

      {/* Revenue Per Project List */}
      <Card>
        <h2 className="text-xl font-bold text-white mb-6">Revenue Per Project</h2>
        {charts?.revenuePerProject && charts.revenuePerProject.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-grey-dark text-grey-light text-sm">
                  <th className="pb-3 px-4 font-semibold">Project Name</th>
                  <th className="pb-3 px-4 font-semibold text-right">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {charts.revenuePerProject.map((project: any, index: number) => (
                  <tr key={index} className="border-b border-dark-lighter hover:bg-dark-lighter/50">
                    <td className="py-4 px-4 text-white font-medium">{project.name}</td>
                    <td className="py-4 px-4 text-emerald-400 font-bold text-right">
                      {formatCurrency(project.revenue || 0)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-grey-light">
            <p>No revenue data available.</p>
          </div>
        )}
      </Card>
    </div>
  );
};
