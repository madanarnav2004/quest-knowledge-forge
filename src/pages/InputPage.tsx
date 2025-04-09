
import React from 'react';
import Layout from '@/components/Layout';
import InputDashboard from '@/components/input/InputDashboard';
import { useAuth } from '@/hooks/useAuth';

const InputPage = () => {
  const { user } = useAuth();
  
  return (
    <Layout>
      <div className="p-6">
        <InputDashboard />
      </div>
    </Layout>
  );
};

export default InputPage;
