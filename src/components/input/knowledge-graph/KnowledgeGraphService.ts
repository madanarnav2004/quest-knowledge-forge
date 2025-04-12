
import { supabase } from "@/integrations/supabase/client";

export interface KnowledgeNode {
  id: string;
  name: string;
  type: string;
  count: number;
  color?: string;
  size?: number;
}

export interface KnowledgeEdge {
  id: string;
  source: string;
  target: string;
  label: string;
  strength: number;
  type: string;
}

export interface KnowledgeGraph {
  nodes: KnowledgeNode[];
  edges: KnowledgeEdge[];
}

// Get node color based on type
export const getNodeColor = (type: string): string => {
  switch (type.toLowerCase()) {
    case 'person':
      return '#3B82F6'; // blue
    case 'organization':
      return '#10B981'; // green
    case 'concept':
      return '#8B5CF6'; // purple
    case 'technical_term':
      return '#EC4899'; // pink
    case 'date':
      return '#F59E0B'; // amber
    case 'document':
      return '#6B7280'; // gray
    default:
      return '#3B82F6'; // default blue
  }
};

// Fetch knowledge graph data
export const fetchKnowledgeGraph = async (): Promise<KnowledgeGraph> => {
  try {
    // Fetch nodes
    const { data: nodes, error: nodesError } = await supabase
      .from('knowledge_nodes')
      .select('*');
      
    if (nodesError) {
      console.error('Error fetching knowledge nodes:', nodesError);
      throw nodesError;
    }
    
    // Fetch relationships
    const { data: edges, error: edgesError } = await supabase
      .from('knowledge_relationships')
      .select('*');
      
    if (edgesError) {
      console.error('Error fetching knowledge relationships:', edgesError);
      throw edgesError;
    }
    
    // Format nodes with proper type assertions
    const formattedNodes = nodes.map(node => ({
      id: node.id,
      name: node.name,
      type: node.type,
      count: node.count || 1,
      color: getNodeColor(node.type),
      size: calculateNodeSize(node.count || 1)
    })) as KnowledgeNode[];
    
    // Format edges with proper type assertions
    const formattedEdges = edges.map(edge => {
      // Safely extract the strength from metadata
      let strength = 0.5; // Default value
      if (edge.metadata && typeof edge.metadata === 'object') {
        // Check if strength exists in metadata and is a number
        const metadataObj = edge.metadata as Record<string, unknown>;
        if (metadataObj.strength !== undefined) {
          if (typeof metadataObj.strength === 'number') {
            strength = metadataObj.strength;
          } else if (typeof metadataObj.strength === 'string') {
            // Try to parse string to number
            const parsed = parseFloat(metadataObj.strength as string);
            if (!isNaN(parsed)) {
              strength = parsed;
            }
          }
        }
      }
      
      return {
        id: edge.id,
        source: edge.source_id,
        target: edge.target_id,
        label: formatRelationshipType(edge.relationship_type),
        strength: strength,
        type: edge.relationship_type
      };
    }) as KnowledgeEdge[];
    
    return {
      nodes: formattedNodes,
      edges: formattedEdges
    };
  } catch (error) {
    console.error('Error fetching knowledge graph:', error);
    return { nodes: [], edges: [] };
  }
};

// Calculate node size based on count
const calculateNodeSize = (count: number): number => {
  // Base size is 10, max size is 30
  return Math.min(10 + (count * 2), 30);
};

// Format relationship type for display
const formatRelationshipType = (type: string): string => {
  return type
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};
