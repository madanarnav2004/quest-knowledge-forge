
import React from 'react';
import { Button } from '@/components/ui/button';

const Integrations: React.FC = () => {
  // Integration logos as simple styled divs for demo purposes
  const integrations = [
    { name: 'GitHub', color: '#171515' },
    { name: 'Jira', color: '#0052CC' },
    { name: 'Confluence', color: '#172B4D' },
    { name: 'Google Workspace', color: '#34A853' },
    { name: 'Microsoft Teams', color: '#6264A7' },
    { name: 'Slack', color: '#4A154B' },
    { name: 'Linear', color: '#5E6AD2' },
    { name: 'Notion', color: '#000000' },
  ];

  return (
    <section className="py-20 bg-slate-50">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-knowledge-primary">
            Seamless Integrations
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-lg">
            Connect your existing tools and automatically extract knowledge from where your team already works.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-12">
          {integrations.map((integration, index) => (
            <div 
              key={index}
              className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 h-24 flex items-center justify-center hover:shadow-md transition-shadow"
            >
              <div className="text-center">
                <div 
                  className="w-12 h-12 mx-auto rounded-md flex items-center justify-center text-white font-bold text-xl"
                  style={{ backgroundColor: integration.color }}
                >
                  {integration.name.charAt(0)}
                </div>
                <p className="mt-2 text-sm font-medium text-slate-700">{integration.name}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg p-8 shadow-md border border-slate-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-bold text-knowledge-primary mb-2">
                Ready to connect your tools?
              </h3>
              <p className="text-slate-600">
                Start extracting knowledge from your existing workspace in minutes.
              </p>
            </div>
            <Button 
              className="bg-knowledge-accent hover:bg-knowledge-accent/90 text-white"
              size="lg"
            >
              Set Up Integrations
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Integrations;
