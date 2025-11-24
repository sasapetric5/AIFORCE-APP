import React from 'react';
import { Card } from './Card';

export const Settings: React.FC = () => {
  return (
    <Card title="Settings">
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold text-light-text mb-4">Platform Settings</h2>
        <p className="text-medium-text max-w-2xl mx-auto">
          Manage your account details, integrations, notification preferences, and other platform settings here.
        </p>
      </div>
    </Card>
  );
};