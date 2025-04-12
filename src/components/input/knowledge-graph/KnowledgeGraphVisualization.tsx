
import React, { useEffect, useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { fetchKnowledgeGraph, KnowledgeGraph, KnowledgeNode, KnowledgeEdge } from './KnowledgeGraphService';
import { toast } from "sonner";
import { Network, RefreshCw, Download, Search, Maximize2, ZoomIn, ZoomOut } from 'lucide-react';

const KnowledgeGraphVisualization = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState(true);
  const [graphData, setGraphData] = useState<KnowledgeGraph | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showLabels, setShowLabels] = useState(true);
  const [nodePositions, setNodePositions] = useState<Record<string, {x: number, y: number}>>({});
  
  useEffect(() => {
    loadGraphData();
  }, []);
  
  const loadGraphData = async () => {
    setLoading(true);
    try {
      const data = await fetchKnowledgeGraph();
      console.log("Knowledge graph data:", data);
      setGraphData(data);
      
      if (data.nodes.length > 0) {
        calculateNodePositions(data);
      }
    } catch (error) {
      console.error('Error loading graph data:', error);
      toast.error('Failed to load knowledge graph');
    } finally {
      setLoading(false);
    }
  };
  
  const calculateNodePositions = (graph: KnowledgeGraph) => {
    const positions: Record<string, {x: number, y: number}> = {};
    
    // Canvas dimensions
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    
    // For a small number of nodes, use circle layout
    if (graph.nodes.length <= 20) {
      // Calculate positions in a circle layout
      const radius = Math.min(width, height) * 0.4;
      
      graph.nodes.forEach((node, index) => {
        const angle = (index / graph.nodes.length) * 2 * Math.PI;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        positions[node.id] = { x, y };
      });
    } else {
      // For larger graphs, use a more complex force-directed-like layout
      const nodeMap: Record<string, KnowledgeNode> = {};
      graph.nodes.forEach(node => {
        nodeMap[node.id] = node;
        
        // Initial random position
        positions[node.id] = { 
          x: centerX + (Math.random() - 0.5) * width * 0.8,
          y: centerY + (Math.random() - 0.5) * height * 0.8
        };
      });
      
      // Simple force-directed algorithm (just a few iterations for performance)
      const REPULSION = 500;
      const ATTRACTION = 0.005;
      const ITERATIONS = 20;
      
      for (let iter = 0; iter < ITERATIONS; iter++) {
        // Calculate repulsive forces between all nodes
        for (let i = 0; i < graph.nodes.length; i++) {
          for (let j = i + 1; j < graph.nodes.length; j++) {
            const nodeA = graph.nodes[i];
            const nodeB = graph.nodes[j];
            const posA = positions[nodeA.id];
            const posB = positions[nodeB.id];
            
            const dx = posB.x - posA.x;
            const dy = posB.y - posA.y;
            const distance = Math.sqrt(dx * dx + dy * dy) || 1;
            
            // Apply repulsion force (inverse square law)
            const force = REPULSION / (distance * distance);
            const forceX = (dx / distance) * force;
            const forceY = (dy / distance) * force;
            
            positions[nodeA.id].x -= forceX;
            positions[nodeA.id].y -= forceY;
            positions[nodeB.id].x += forceX;
            positions[nodeB.id].y += forceY;
          }
        }
        
        // Calculate attractive forces along edges
        for (const edge of graph.edges) {
          const sourcePos = positions[edge.source];
          const targetPos = positions[edge.target];
          
          if (sourcePos && targetPos) {
            const dx = targetPos.x - sourcePos.x;
            const dy = targetPos.y - sourcePos.y;
            const distance = Math.sqrt(dx * dx + dy * dy) || 1;
            
            // Strength affects attraction
            const force = distance * ATTRACTION * (edge.strength || 0.5);
            const forceX = (dx / distance) * force;
            const forceY = (dy / distance) * force;
            
            positions[edge.source].x += forceX;
            positions[edge.source].y += forceY;
            positions[edge.target].x -= forceX;
            positions[edge.target].y -= forceY;
          }
        }
      }
      
      // Ensure all nodes are within canvas bounds
      Object.keys(positions).forEach(nodeId => {
        positions[nodeId].x = Math.max(50, Math.min(width - 50, positions[nodeId].x));
        positions[nodeId].y = Math.max(50, Math.min(height - 50, positions[nodeId].y));
      });
    }
    
    setNodePositions(positions);
  };
  
  useEffect(() => {
    if (graphData && Object.keys(nodePositions).length > 0) {
      drawGraph();
    }
  }, [graphData, nodePositions, zoomLevel, showLabels]);
  
  const drawGraph = () => {
    const canvas = canvasRef.current;
    if (!canvas || !graphData) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Apply zoom
    ctx.save();
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    ctx.translate(centerX, centerY);
    ctx.scale(zoomLevel, zoomLevel);
    ctx.translate(-centerX, -centerY);
    
    // Draw edges
    graphData.edges.forEach(edge => {
      const sourcePos = nodePositions[edge.source];
      const targetPos = nodePositions[edge.target];
      
      if (sourcePos && targetPos) {
        // Draw edge
        ctx.beginPath();
        ctx.moveTo(sourcePos.x, sourcePos.y);
        ctx.lineTo(targetPos.x, targetPos.y);
        
        // Edge style based on strength and type
        const opacity = 0.2 + (edge.strength || 0.5) * 0.8;
        ctx.strokeStyle = `rgba(169, 169, 169, ${opacity})`;
        ctx.lineWidth = 1 + (edge.strength || 0.5) * 2;
        
        // Different line style based on relationship type
        if (edge.type === 'mentioned_in') {
          ctx.setLineDash([5, 2]);
        } else {
          ctx.setLineDash([]);
        }
        
        ctx.stroke();
        ctx.setLineDash([]);
        
        // Draw edge label
        if (showLabels && zoomLevel > 0.8) {
          const midX = (sourcePos.x + targetPos.x) / 2;
          const midY = (sourcePos.y + targetPos.y) / 2;
          
          // Draw label background for better readability
          const label = edge.label || edge.type;
          const labelWidth = ctx.measureText(label).width;
          
          ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
          ctx.fillRect(midX - labelWidth/2 - 3, midY - 8, labelWidth + 6, 16);
          
          ctx.fillStyle = '#6B7280';
          ctx.font = '10px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(label, midX, midY);
        }
      }
    });
    
    // Draw nodes
    graphData.nodes.forEach(node => {
      const pos = nodePositions[node.id];
      if (pos) {
        // Draw node circle
        ctx.beginPath();
        const radius = (node.size || 10) * (0.5 + zoomLevel * 0.5);
        ctx.arc(pos.x, pos.y, radius, 0, 2 * Math.PI);
        ctx.fillStyle = node.color || '#3B82F6';
        ctx.fill();
        
        // Add a subtle border
        ctx.strokeStyle = 'rgba(255,255,255,0.8)';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        
        // Draw node label
        if (showLabels) {
          // Label background for better readability
          const labelWidth = ctx.measureText(node.name).width;
          const labelY = pos.y + radius + 10;
          
          ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
          ctx.fillRect(pos.x - labelWidth/2 - 3, labelY - 8, labelWidth + 6, 16);
          
          ctx.fillStyle = '#1F2937';
          ctx.font = 'bold 12px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(node.name, pos.x, labelY);
          
          if (node.type && zoomLevel > 0.8) {
            const typeY = labelY + 15;
            const typeWidth = ctx.measureText(node.type).width;
            
            ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
            ctx.fillRect(pos.x - typeWidth/2 - 3, typeY - 6, typeWidth + 6, 12);
            
            ctx.fillStyle = '#6B7280';
            ctx.font = '10px sans-serif';
            ctx.fillText(node.type, pos.x, typeY);
          }
        }
      }
    });
    
    ctx.restore();
  };
  
  const handleResize = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const parent = canvas.parentElement;
    if (!parent) return;
    
    canvas.width = parent.clientWidth;
    canvas.height = parent.clientHeight;
    
    if (graphData) {
      calculateNodePositions(graphData);
    }
  };
  
  const handleRefresh = () => {
    loadGraphData();
  };
  
  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.1, 2));
  };
  
  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.1, 0.5));
  };
  
  const handleToggleLabels = () => {
    setShowLabels(prev => !prev);
  };
  
  const handleExport = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = 'knowledge-graph.png';
    link.href = dataUrl;
    link.click();
  };
  
  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  return (
    <div className="border rounded-lg bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Network className="h-5 w-5 mr-2" />
          <h2 className="text-lg font-semibold">Knowledge Graph</h2>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleZoomOut}
            disabled={zoomLevel <= 0.5}
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleZoomIn}
            disabled={zoomLevel >= 2}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleToggleLabels}
          >
            {showLabels ? 'Hide Labels' : 'Show Labels'}
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleExport}
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="relative h-[500px]">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-10">
            <div className="flex flex-col items-center">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
              <p className="mt-2 text-sm text-gray-500">Building knowledge graph...</p>
            </div>
          </div>
        )}
        
        <canvas 
          ref={canvasRef} 
          className="w-full h-full border rounded bg-gray-50"
        />
        
        {graphData && graphData.nodes.length === 0 && !loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center p-4">
              <Network className="mx-auto h-12 w-12 text-gray-300 mb-2" />
              <h3 className="text-lg font-medium text-gray-800">No Knowledge Graph Data</h3>
              <p className="text-sm text-gray-500 mt-1">
                Upload and process documents to build your knowledge graph
              </p>
            </div>
          </div>
        )}
      </div>
      
      {graphData && graphData.nodes.length > 0 && (
        <div className="mt-4 text-sm text-gray-500">
          {graphData.nodes.length} nodes and {graphData.edges.length} connections found in your knowledge base
        </div>
      )}
    </div>
  );
};

export default KnowledgeGraphVisualization;
