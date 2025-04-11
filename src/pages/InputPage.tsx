
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import InputDashboard from '@/components/input/InputDashboard';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

const InputPage = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);
  
  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-[80vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="p-6">
        {user && <InputDashboard />}
      </div>
    </Layout>
  );
};

export default InputPage;
