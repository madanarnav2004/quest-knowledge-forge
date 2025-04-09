
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Hero from '@/components/landing/Hero';
import Features from '@/components/landing/Features';
import Integrations from '@/components/landing/Integrations';
import CTA from '@/components/landing/CTA';
import Layout from '@/components/Layout';

const Index = () => {
  return (
    <Layout>
      <Hero />
      <Features />
      <Integrations />
      <CTA />
    </Layout>
  );
};

export default Index;
