
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BookOpen, Brain, Database, GitBranch } from 'lucide-react';

const Hero: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="relative overflow-hidden bg-knowledge-primary py-20 md:py-32">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '30px 30px'
        }}></div>
      </div>
      
      <div className="container relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 text-center lg:text-left">
            <div className="mb-6 inline-flex items-center rounded-full border border-knowledge-accent/30 bg-knowledge-accent/10 px-4 py-1.5 text-sm text-knowledge-accent">
              <div className="mr-2 h-2 w-2 rounded-full bg-knowledge-accent"></div>
              Powered by Perplexity AI
            </div>
            
            <h1 className="font-serif text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
              Transform company knowledge into <span className="text-knowledge-accent">actionable intelligence</span>
            </h1>
            
            <p className="text-slate-300 text-lg md:text-xl mb-8 max-w-2xl mx-auto lg:mx-0">
              ZeroKT helps teams capture, process, and distribute institutional knowledge with AI-powered insights and seamless integrations.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button 
                size="lg" 
                className="bg-knowledge-accent hover:bg-knowledge-accent/90 text-white"
                onClick={() => navigate('/dashboard')}
              >
                Get Started
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-slate-500 text-white hover:bg-slate-800"
                onClick={() => navigate('/docs')}
              >
                See Documentation
              </Button>
            </div>
          </div>
          
          <div className="flex-1 max-w-lg">
            <div className="relative rounded-lg overflow-hidden">
              <div className="bg-gradient-to-br from-slate-800 to-knowledge-primary p-6 rounded-lg border border-slate-700 shadow-xl">
                <div className="flex items-center mb-4">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-knowledge-danger"></div>
                    <div className="w-3 h-3 rounded-full bg-knowledge-warning"></div>
                    <div className="w-3 h-3 rounded-full bg-knowledge-success"></div>
                  </div>
                </div>
                
                <div className="space-y-5">
                  <div className="bg-slate-700/50 p-4 rounded-md">
                    <div className="flex items-center gap-2 mb-2">
                      <Brain className="h-5 w-5 text-knowledge-accent" />
                      <h3 className="text-white text-sm font-semibold">Knowledge Query</h3>
                    </div>
                    <p className="text-slate-300 text-sm">How does our authentication service connect to the user database?</p>
                  </div>
                  
                  <div className="pl-5 border-l-2 border-knowledge-accent/50">
                    <div className="bg-slate-700/50 p-4 rounded-md">
                      <div className="flex items-center gap-2 mb-2">
                        <Database className="h-5 w-5 text-knowledge-accent" />
                        <h3 className="text-white text-sm font-semibold">Knowledge Answer</h3>
                      </div>
                      <p className="text-slate-300 text-sm">The authentication service uses OAuth 2.0 to connect to the user database via the API Gateway. It validates tokens through the JWT verification microservice before accessing user records.</p>
                    </div>
                  </div>
                  
                  <div className="pl-8">
                    <div className="bg-slate-700/30 p-4 rounded-md">
                      <div className="flex items-center gap-2 mb-2">
                        <GitBranch className="h-5 w-5 text-knowledge-info" />
                        <h3 className="text-white text-sm font-semibold">Sources</h3>
                      </div>
                      <ul className="text-xs text-slate-400 space-y-1.5">
                        <li className="flex items-center gap-1">
                          <span className="w-1.5 h-1.5 bg-knowledge-info/70 rounded-full"></span>
                          <span>auth-service/README.md</span>
                        </li>
                        <li className="flex items-center gap-1">
                          <span className="w-1.5 h-1.5 bg-knowledge-info/70 rounded-full"></span>
                          <span>Architecture diagram (v3.2)</span>
                        </li>
                        <li className="flex items-center gap-1">
                          <span className="w-1.5 h-1.5 bg-knowledge-info/70 rounded-full"></span>
                          <span>Security meeting (March 15, 2025)</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
