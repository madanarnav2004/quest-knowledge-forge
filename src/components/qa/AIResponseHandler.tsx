
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: any[];
  thinking?: string;
  created_at: string;
};

export type Conversation = {
  id: string;
  title: string;
  created_at: string;
};

export const useAIResponseHandler = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const createConversation = async (title: string = 'New Conversation'): Promise<string | null> => {
    if (!user) return null;
    
    try {
      const { data, error } = await supabase
        .from('conversations')
        .insert({
          user_id: user.id,
          title
        })
        .select('id')
        .single();
      
      if (error) throw error;
      return data.id;
    } catch (error: any) {
      toast({
        title: 'Error creating conversation',
        description: error.message,
        variant: 'destructive',
      });
      return null;
    }
  };

  const saveMessage = async (
    conversationId: string,
    role: 'user' | 'assistant',
    content: string,
    sources?: any[],
    thinking?: string
  ): Promise<string | null> => {
    if (!user) return null;
    
    try {
      const { data, error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          role,
          content,
          sources,
          thinking
        })
        .select('id')
        .single();
      
      if (error) throw error;
      return data.id;
    } catch (error: any) {
      toast({
        title: 'Error saving message',
        description: error.message,
        variant: 'destructive',
      });
      return null;
    }
  };

  const getAIResponse = async (query: string, conversationId: string) => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'You must be logged in to use the AI assistant',
        variant: 'destructive',
      });
      return null;
    }
    
    setIsLoading(true);
    
    try {
      // Call our Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('query-knowledge', {
        body: { query, conversationId },
      });
      
      if (error) throw error;
      
      return data;
    } catch (error: any) {
      toast({
        title: 'Error getting AI response',
        description: error.message,
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchConversations = async (): Promise<Conversation[]> => {
    if (!user) return [];
    
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error: any) {
      toast({
        title: 'Error fetching conversations',
        description: error.message,
        variant: 'destructive',
      });
      return [];
    }
  };

  const fetchMessages = async (conversationId: string): Promise<Message[]> => {
    if (!user || !conversationId) return [];
    
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      return data || [];
    } catch (error: any) {
      toast({
        title: 'Error fetching messages',
        description: error.message,
        variant: 'destructive',
      });
      return [];
    }
  };

  return {
    isLoading,
    createConversation,
    saveMessage,
    getAIResponse,
    fetchConversations,
    fetchMessages,
  };
};
