
import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  MessageSquare,
  Send,
  Plus,
  Trash,
  Clock,
  Lightbulb,
  Link,
  User,
  Bot,
  Loader2,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Message, Conversation, useAIResponseHandler } from './AIResponseHandler';

const ChatInterface = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState('');
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [showSidebar, setShowSidebar] = useState(true);
  
  const {
    isLoading,
    createConversation,
    saveMessage,
    getAIResponse,
    fetchConversations,
    fetchMessages,
  } = useAIResponseHandler();

  useEffect(() => {
    if (user) {
      loadConversations();
    }
  }, [user]);

  useEffect(() => {
    if (activeConversation) {
      loadMessages(activeConversation.id);
    }
  }, [activeConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadConversations = async () => {
    const data = await fetchConversations();
    setConversations(data);
    
    if (data.length > 0 && !activeConversation) {
      setActiveConversation(data[0]);
    }
  };

  const loadMessages = async (conversationId: string) => {
    const data = await fetchMessages(conversationId);
    setMessages(data);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) return;
    
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'You must be logged in to send messages',
        variant: 'destructive',
      });
      return;
    }
    
    // Create a new conversation if there isn't an active one
    let conversationId = activeConversation?.id;
    if (!conversationId) {
      // Use first few words of the query as the conversation title
      const title = query.split(' ').slice(0, 5).join(' ') + '...';
      conversationId = await createConversation(title);
      
      if (!conversationId) return;
      
      const newConversation = {
        id: conversationId,
        title,
        created_at: new Date().toISOString(),
      };
      
      setActiveConversation(newConversation);
      setConversations([newConversation, ...conversations]);
    }
    
    // Save user message
    const userMessageId = await saveMessage(conversationId, 'user', query);
    
    // Add user message to UI immediately
    const userMessage = {
      id: userMessageId || Date.now().toString(),
      role: 'user' as const,
      content: query,
      created_at: new Date().toISOString(),
    };
    
    setMessages([...messages, userMessage]);
    setQuery('');
    
    // Get AI response
    const aiResponse = await getAIResponse(query, conversationId);
    
    if (aiResponse) {
      // Save AI response
      const aiMessageId = await saveMessage(
        conversationId,
        'assistant',
        aiResponse.answer,
        aiResponse.sources,
        aiResponse.thinking
      );
      
      // Add AI response to UI
      const aiMessage = {
        id: aiMessageId || Date.now().toString(),
        role: 'assistant' as const,
        content: aiResponse.answer,
        sources: aiResponse.sources,
        thinking: aiResponse.thinking,
        created_at: new Date().toISOString(),
      };
      
      setMessages([...messages, userMessage, aiMessage]);
    }
    
    // Refresh conversations to update the list
    loadConversations();
  };

  const handleNewConversation = async () => {
    const conversationId = await createConversation();
    
    if (conversationId) {
      const newConversation = {
        id: conversationId,
        title: 'New Conversation',
        created_at: new Date().toISOString(),
      };
      
      setActiveConversation(newConversation);
      setConversations([newConversation, ...conversations]);
      setMessages([]);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="flex h-full">
      {/* Conversations Sidebar */}
      {showSidebar && (
        <div className="w-64 border-r border-gray-200 bg-gray-50 flex flex-col">
          <div className="p-4">
            <Button
              className="w-full justify-start gap-2"
              onClick={handleNewConversation}
            >
              <Plus size={16} />
              New Conversation
            </Button>
          </div>
          
          <ScrollArea className="flex-1">
            <div className="p-2 space-y-2">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`p-2 rounded-md cursor-pointer transition-colors ${
                    activeConversation?.id === conversation.id
                      ? 'bg-knowledge-accent text-white'
                      : 'hover:bg-gray-100'
                  }`}
                  onClick={() => setActiveConversation(conversation)}
                >
                  <div className="flex items-start gap-2">
                    <MessageSquare size={16} className="mt-1 flex-shrink-0" />
                    <div className="overflow-hidden">
                      <div className="font-medium truncate">{conversation.title}</div>
                      <div className="text-xs opacity-70 truncate">
                        <Clock size={12} className="inline mr-1" />
                        {formatDate(conversation.created_at)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {conversations.length === 0 && (
                <div className="text-center p-4 text-gray-500">
                  No conversations yet
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      )}
      
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="border-b border-gray-200 p-4 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setShowSidebar(!showSidebar)}
            >
              <MessageSquare size={20} />
            </Button>
            <h2 className="font-semibold">
              {activeConversation ? activeConversation.title : 'New Conversation'}
            </h2>
          </div>
          {activeConversation && (
            <Button variant="ghost" size="icon">
              <Trash size={18} />
            </Button>
          )}
        </div>
        
        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-6">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-72 text-center">
                <MessageSquare size={48} className="text-gray-300 mb-4" />
                <h3 className="text-lg font-medium">No messages yet</h3>
                <p className="text-sm text-gray-500 max-w-md mt-2">
                  Start a conversation by asking a question about your knowledge base
                </p>
              </div>
            ) : (
              messages.map((message) => (
                <div key={message.id} className="space-y-2">
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.role === 'user' 
                        ? 'bg-blue-100 text-blue-600' 
                        : 'bg-knowledge-accent text-white'
                    }`}>
                      {message.role === 'user' ? <User size={18} /> : <Bot size={18} />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {message.role === 'user' ? 'You' : 'AI Assistant'}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatDate(message.created_at)}
                        </span>
                      </div>
                      <div className="mt-1 text-gray-800 whitespace-pre-wrap">
                        {message.content}
                      </div>
                      
                      {/* Sources */}
                      {message.sources && message.sources.length > 0 && (
                        <div className="mt-2">
                          <Separator className="my-2" />
                          <div className="text-sm font-medium flex items-center gap-1 text-gray-600">
                            <Link size={14} />
                            Sources:
                          </div>
                          <div className="mt-1 space-y-1">
                            {message.sources.map((source, index) => (
                              <div key={index} className="text-sm text-blue-600 hover:underline cursor-pointer">
                                {source.title || source.url || `Source ${index + 1}`}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Thinking */}
                      {message.thinking && (
                        <div className="mt-2">
                          <Separator className="my-2" />
                          <div 
                            className="text-sm font-medium flex items-center gap-1 text-gray-600 cursor-pointer hover:text-gray-900"
                          >
                            <Lightbulb size={14} />
                            AI Reasoning
                          </div>
                          <div className="mt-1 text-sm text-gray-600 bg-gray-50 p-2 rounded border whitespace-pre-wrap">
                            {message.thinking}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
        
        {/* Message Input */}
        <div className="border-t border-gray-200 p-4 bg-white">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <Textarea
              placeholder="Ask a question about your knowledge base..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 min-h-[60px] max-h-[200px]"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(e);
                }
              }}
            />
            <Button type="submit" className="self-end" disabled={isLoading || !query.trim()}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send size={18} />}
            </Button>
          </form>
          <div className="mt-2 text-xs text-gray-500 text-center">
            The AI system will search your documents to provide the most relevant answers
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
