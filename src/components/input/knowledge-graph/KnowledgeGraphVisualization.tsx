
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
    
    // Calculate positions in a circle layout
    const radius = Math.min(width, height) * 0.4;
    
    graph.nodes.forEach((node, index) => {
      const angle = (index / graph.nodes.length) * 2 * Math.PI;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      positions[node.id] = { x, y };
    });
    
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
        ctx.strokeStyle = `rgba(169, 169, 169, ${edge.strength})`;
        ctx.lineWidth = 1 + edge.strength;
        ctx.stroke();
        
        // Draw edge label
        if (showLabels) {
          const midX = (sourcePos.x + targetPos.x) / 2;
          const midY = (sourcePos.y + targetPos.y) / 2;
          
          ctx.fillStyle = '#6B7280';
          ctx.font = '10px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(edge.label, midX, midY);
        }
      }
    });
    
    // Draw nodes
    graphData.nodes.forEach(node => {
      const pos = nodePositions[node.id];
      if (pos) {
        // Draw node circle
        ctx.beginPath();
        const radius = node.size || 10;
        ctx.arc(pos.x, pos.y, radius, 0, 2 * Math.PI);
        ctx.fillStyle = node.color || '#3B82F6';
        ctx.fill();
        
        // Draw node label
        if (showLabels) {
          ctx.fillStyle = '#1F2937';
          ctx.font = 'bold 12px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(node.name, pos.x, pos.y + radius + 10);
          
          if (node.type) {
            ctx.fillStyle = '#6B7280';
            ctx.font = '10px sans-serif';
            ctx.fillText(node.type, pos.x, pos.y + radius + 25);
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
