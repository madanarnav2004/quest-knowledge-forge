
import React from 'react';
import { 
  BarChart, 
  BookOpen, 
  BrainCircuit, 
  FileText, 
  GitBranch, 
  Globe, 
  MessageSquare, 
  Network, 
  Search, 
  ShieldCheck, 
  Upload 
} from 'lucide-react';

const Features: React.FC = () => {
  const features = [
    {
      title: "Input Integration",
      description: "Seamlessly connect with Teams, Google Workspace, GitHub, Confluence, Jira, and more.",
      icon: <Upload className="h-8 w-8 text-knowledge-accent" />,
    },
    {
      title: "Code Analysis",
      description: "Auto-detect code patterns, relationships, and dependencies in your entire codebase.",
      icon: <GitBranch className="h-8 w-8 text-knowledge-accent" />,
    },
    {
      title: "Document Processing",
      description: "Parse PDFs, wikis, and documentation for structured knowledge extraction.",
      icon: <FileText className="h-8 w-8 text-knowledge-accent" />,
    },
    {
      title: "Deep Research",
      description: "Leverage Perplexity's research capabilities to fill knowledge gaps and provide context.",
      icon: <Search className="h-8 w-8 text-knowledge-accent" />,
    },
    {
      title: "Interactive Q&A",
      description: "Ask questions in natural language and receive comprehensive, sourced answers.",
      icon: <MessageSquare className="h-8 w-8 text-knowledge-accent" />,
    },
    {
      title: "Knowledge Graphs",
      description: "Visualize relationships between systems, modules, and documentation.",
      icon: <Network className="h-8 w-8 text-knowledge-accent" />,
    },
    {
      title: "Learning Paths",
      description: "Generate personalized onboarding and knowledge transfer sequences.",
      icon: <BookOpen className="h-8 w-8 text-knowledge-accent" />,
    },
    {
      title: "Enterprise Security",
      description: "Maintain compliance with SOC2, GDPR, and industry-specific regulations.",
      icon: <ShieldCheck className="h-8 w-8 text-knowledge-accent" />,
    },
    {
      title: "Analytics Dashboard",
      description: "Track knowledge capture progress, usage patterns, and ROI metrics.",
      icon: <BarChart className="h-8 w-8 text-knowledge-accent" />,
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-knowledge-primary">
            Comprehensive Knowledge Management
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-lg">
            Quest Knowledge Forge combines cutting-edge AI with enterprise-grade integrations to create a complete knowledge transfer solution.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="knowledge-card hover:border-knowledge-accent/50 group"
            >
              <div className="mb-4 inline-flex items-center justify-center p-2 bg-knowledge-accent/10 rounded-lg group-hover:bg-knowledge-accent/20 transition-colors">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-2 text-knowledge-primary">
                {feature.title}
              </h3>
              <p className="text-slate-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
