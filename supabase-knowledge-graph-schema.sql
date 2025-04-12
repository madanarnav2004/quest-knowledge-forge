
-- Create the knowledge_nodes table
CREATE TABLE IF NOT EXISTS public.knowledge_nodes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users NOT NULL,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    count INTEGER DEFAULT 1,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create the knowledge_relationships table
CREATE TABLE IF NOT EXISTS public.knowledge_relationships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_id UUID NOT NULL,
    target_id UUID NOT NULL,
    relationship_type TEXT NOT NULL,
    user_id UUID REFERENCES auth.users NOT NULL,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create index on knowledge_nodes
CREATE INDEX IF NOT EXISTS knowledge_nodes_user_id_idx ON public.knowledge_nodes(user_id);
CREATE INDEX IF NOT EXISTS knowledge_nodes_name_idx ON public.knowledge_nodes(name);
CREATE INDEX IF NOT EXISTS knowledge_nodes_type_idx ON public.knowledge_nodes(type);

-- Create index on knowledge_relationships
CREATE INDEX IF NOT EXISTS knowledge_relationships_source_id_idx ON public.knowledge_relationships(source_id);
CREATE INDEX IF NOT EXISTS knowledge_relationships_target_id_idx ON public.knowledge_relationships(target_id);
CREATE INDEX IF NOT EXISTS knowledge_relationships_user_id_idx ON public.knowledge_relationships(user_id);
CREATE INDEX IF NOT EXISTS knowledge_relationships_type_idx ON public.knowledge_relationships(relationship_type);

-- Add RLS policies for knowledge_nodes
ALTER TABLE public.knowledge_nodes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own knowledge nodes"
ON public.knowledge_nodes
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own knowledge nodes"
ON public.knowledge_nodes
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own knowledge nodes"
ON public.knowledge_nodes
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own knowledge nodes"
ON public.knowledge_nodes
FOR DELETE
USING (auth.uid() = user_id);

-- Add RLS policies for knowledge_relationships
ALTER TABLE public.knowledge_relationships ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own knowledge relationships"
ON public.knowledge_relationships
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own knowledge relationships"
ON public.knowledge_relationships
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own knowledge relationships"
ON public.knowledge_relationships
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own knowledge relationships"
ON public.knowledge_relationships
FOR DELETE
USING (auth.uid() = user_id);

-- Create storage bucket if not exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', false)
ON CONFLICT (id) DO NOTHING;

-- Create policy to allow authenticated users to upload their own documents
CREATE POLICY "Users can upload their own documents"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'documents' 
    AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Create policy to allow authenticated users to access their own documents
CREATE POLICY "Users can access their own documents"
ON storage.objects
FOR SELECT
TO authenticated
USING (
    bucket_id = 'documents' 
    AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Create policy to allow authenticated users to update their own documents
CREATE POLICY "Users can update their own documents"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
    bucket_id = 'documents' 
    AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Create policy to allow authenticated users to delete their own documents
CREATE POLICY "Users can delete their own documents"
ON storage.objects
FOR DELETE
TO authenticated
USING (
    bucket_id = 'documents' 
    AND auth.uid()::text = (storage.foldername(name))[1]
);
