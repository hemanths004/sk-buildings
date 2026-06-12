import React from 'react';
import { Card } from '../../components/Card';
import { Settings } from 'lucide-react';

export const AdminSettings: React.FC = () => {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-grey-light">Configure platform settings</p>
      </div>

      <Card className="text-center py-16">
        <Settings size={64} className="mx-auto mb-4 text-primary" />
        <h3 className="text-2xl font-bold text-white mb-2">Settings Module Coming Soon</h3>
        <p className="text-grey-light">This section will allow you to update platform configurations.</p>
      </Card>
    </div>
  );
};
