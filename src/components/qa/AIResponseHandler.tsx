
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
        } as any)
        .select('id')
        .single();
      
      if (error) throw error;
      return data?.id || null;
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
        } as any)
        .select('id')
        .single();
      
      if (error) throw error;
      return data?.id || null;
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
        .order('created_at', { ascending: false }) as { data: Conversation[] | null, error: any };
      
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
        .order('created_at', { ascending: true }) as { data: Message[] | null, error: any };
      
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

  const deleteConversation = async (conversationId: string): Promise<boolean> => {
    if (!user || !conversationId) return false;
    
    try {
      const { error } = await supabase
        .from('conversations')
        .delete()
        .eq('id', conversationId) as { error: any };
      
      if (error) throw error;
      
      toast({
        title: 'Conversation deleted',
        description: 'The conversation has been successfully deleted',
      });
      
      return true;
    } catch (error: any) {
      toast({
        title: 'Error deleting conversation',
        description: error.message,
        variant: 'destructive',
      });
      return false;
    }
  };

  const updateConversationTitle = async (conversationId: string, title: string): Promise<boolean> => {
    if (!user || !conversationId) return false;
    
    try {
      const { error } = await supabase
        .from('conversations')
        .update({ title })
        .eq('id', conversationId) as { error: any };
      
      if (error) throw error;
      return true;
    } catch (error: any) {
      toast({
        title: 'Error updating conversation',
        description: error.message,
        variant: 'destructive',
      });
      return false;
    }
  };

  return {
    isLoading,
    createConversation,
    saveMessage,
    getAIResponse,
    fetchConversations,
    fetchMessages,
    deleteConversation,
    updateConversationTitle,
  };
};
