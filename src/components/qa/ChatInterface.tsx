
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { BrainCircuit, FileText, Loader2, MessageSquare, SendIcon } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: {
    type: string;
    name: string;
    path?: string;
  }[];
  thinking?: string;
}

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your knowledge assistant powered by Perplexity. I can help you find information about your company\'s products, codebase, documentation, and more. What would you like to know today?',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSources, setShowSources] = useState<Record<string, boolean>>({});
  const [showThinking, setShowThinking] = useState<Record<string, boolean>>({});
  const { toast } = useToast();
  
  const apiKey = ''; // This would be retrieved from secure storage in a real implementation
  
  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    // Generate unique ID for the message
    const userMessageId = Date.now().toString();
    
    // Add user message to chat
    const userMessage: Message = {
      id: userMessageId,
      role: 'user',
      content: input,
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      // In a real implementation, this would call the Perplexity API
      // Simulating API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate response based on query
      const query = input.toLowerCase();
      let responseContent = '';
      let sources = [];
      let thinking = '';
      
      if (query.includes('authentication') || query.includes('login')) {
        responseContent = 'Our authentication system uses OAuth 2.0 with JWT tokens. The main authentication service is in the auth-service repository, and it connects to the user database through the API Gateway. Recent updates in version 2.3 added support for multi-factor authentication.';
        sources = [
          { type: 'code', name: 'auth-service/src/auth.ts', path: 'github://company/auth-service/src/auth.ts' },
          { type: 'document', name: 'Authentication Flow Diagram', path: 'confluence://Engineering/Auth/Flow' },
          { type: 'meeting', name: 'Security Review - March 2025', path: 'teams://meetings/2025-03-15' }
        ];
        thinking = 'The query is about our authentication system. Relevant documents include the auth-service code repository, architectural documentation about authentication flows, and recent security review meetings where authentication was discussed. The most recent version is 2.3 which added MFA support according to the release notes.';
      } else if (query.includes('database') || query.includes('data model')) {
        responseContent = 'We use PostgreSQL for our primary data store with a microservice architecture. The core data models are defined in the data-models repository. Each service maintains its own database, but they share common user and organizational data through a federated data layer.';
        sources = [
          { type: 'code', name: 'data-models/schema.prisma', path: 'github://company/data-models/schema.prisma' },
          { type: 'document', name: 'Database Architecture', path: 'confluence://Engineering/Database' },
          { type: 'meeting', name: 'Data Team Sync - April 2025', path: 'teams://meetings/2025-04-01' }
        ];
        thinking = 'This query is about our database architecture and data models. The main schemas are defined in the data-models repository using Prisma. According to architecture documentation, we use PostgreSQL with a microservice approach where each service has its own database but shares common data through a federation layer.';
      } else {
        responseContent = 'I\'ve searched through our knowledge base but don\'t have specific information about that topic yet. Would you like me to help you find someone in the organization who might know more about this?';
        sources = [
          { type: 'system', name: 'Knowledge Gap Detected', path: null },
        ];
        thinking = 'This query doesn\'t match any of our indexed knowledge documents or code repositories. This appears to be a knowledge gap that should be addressed.';
      }
      
      const assistantMessageId = (Date.now() + 1).toString();
      const assistantMessage: Message = {
        id: assistantMessageId,
        role: 'assistant',
        content: responseContent,
        sources,
        thinking,
      };
      
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error fetching response:', error);
      toast({
        title: "Error",
        description: "Failed to get a response. Please try again.",
        variant: "destructive",
      });
      
      // Add error message
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: 'I encountered an error while processing your request. Please try again.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const toggleSources = (messageId: string) => {
    setShowSources((prev) => ({
      ...prev,
      [messageId]: !prev[messageId],
    }));
  };
  
  const toggleThinking = (messageId: string) => {
    setShowThinking((prev) => ({
      ...prev,
      [messageId]: !prev[messageId],
    }));
  };
  
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[80%] rounded-lg p-4 ${
                message.role === 'user'
                  ? 'bg-knowledge-primary text-white'
                  : 'bg-white border border-slate-200 shadow-sm'
              }`}
            >
              <div className="flex items-start gap-2">
                <div className={`mt-1 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 ${
                  message.role === 'user'
                    ? 'bg-knowledge-accent'
                    : 'bg-knowledge-primary'
                }`}>
                  {message.role === 'user' ? (
                    <span className="text-white text-xs font-bold">U</span>
                  ) : (
                    <BrainCircuit className="h-4 w-4 text-white" />
                  )}
                </div>
                <div className="flex-1">
                  <div className={`text-sm ${message.role === 'user' ? 'text-white' : 'text-slate-800'}`}>
                    {message.content}
                  </div>
                  
                  {message.sources && message.sources.length > 0 && (
                    <div className="mt-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`text-xs ${message.role === 'user' ? 'text-white/70 hover:text-white/90 hover:bg-white/10' : 'text-slate-500 hover:text-slate-800'}`}
                        onClick={() => toggleSources(message.id)}
                      >
                        {showSources[message.id] ? 'Hide Sources' : 'Show Sources'} ({message.sources.length})
                      </Button>
                      
                      {showSources[message.id] && (
                        <div className={`mt-2 text-xs rounded-md p-3 ${
                          message.role === 'user' ? 'bg-white/10' : 'bg-slate-50'
                        }`}>
                          <div className="font-medium mb-2">Sources:</div>
                          <ul className="space-y-1.5">
                            {message.sources.map((source, index) => (
                              <li key={index} className="flex items-center gap-1.5">
                                {source.type === 'code' && (
                                  <FileText className="h-3 w-3 text-knowledge-info" />
                                )}
                                {source.type === 'document' && (
                                  <FileText className="h-3 w-3 text-knowledge-accent" />
                                )}
                                {source.type === 'meeting' && (
                                  <MessageSquare className="h-3 w-3 text-knowledge-warning" />
                                )}
                                <span>{source.name}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {message.thinking && (
                    <div className="mt-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`text-xs ${message.role === 'user' ? 'text-white/70 hover:text-white/90 hover:bg-white/10' : 'text-slate-500 hover:text-slate-800'}`}
                        onClick={() => toggleThinking(message.id)}
                      >
                        {showThinking[message.id] ? 'Hide Thinking' : 'Show Thinking'}
                      </Button>
                      
                      {showThinking[message.id] && (
                        <div className={`mt-2 text-xs rounded-md p-3 ${
                          message.role === 'user' ? 'bg-white/10' : 'bg-slate-50'
                        }`}>
                          <div className="font-medium mb-2">AI Thinking Process:</div>
                          <p className={message.role === 'user' ? 'text-white/90' : 'text-slate-600'}>
                            {message.thinking}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm max-w-[80%]">
              <div className="flex items-center gap-2">
                <div className="bg-knowledge-primary rounded-full w-8 h-8 flex items-center justify-center">
                  <Loader2 className="h-4 w-4 text-white animate-spin" />
                </div>
                <div className="text-sm text-slate-600">Searching knowledge base...</div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {!apiKey && (
        <Card className="mx-4 mb-4">
          <CardContent className="p-4">
            <div className="flex flex-col">
              <p className="text-sm text-slate-600 mb-2">
                Enter your Perplexity API key to enable AI-powered knowledge search:
              </p>
              <div className="flex gap-2">
                <Input 
                  placeholder="Perplexity API Key" 
                  className="flex-1"
                  type="password"
                />
                <Button>Save Key</Button>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Your API key is stored securely and only used for queries to Perplexity.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
      
      <div className="p-4 border-t border-slate-200">
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question about your codebase, documentation, or processes..."
            className="flex-1 min-h-[60px] resize-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <Button
            className="bg-knowledge-accent hover:bg-knowledge-accent/90 self-end h-10 w-10 p-0"
            onClick={handleSendMessage}
            disabled={isLoading || !input.trim()}
          >
            <SendIcon className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-slate-500 mt-2">
          Powered by Perplexity AI • Data stays within your organization
        </p>
      </div>
    </div>
  );
};

export default ChatInterface;
