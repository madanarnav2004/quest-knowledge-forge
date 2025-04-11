
import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { 
  Network, 
  ZoomIn, 
  ZoomOut, 
  RefreshCw, 
  Download, 
  Filter, 
  Search, 
  Maximize2,
  FileText,
  GitBranch,
  MessagesSquare,
  Briefcase
} from 'lucide-react';

const KnowledgeGraphPreview = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState(true);
  const [zoomLevel, setZoomLevel] = useState([50]);
  const [showLabels, setShowLabels] = useState(true);
  const [graphData, setGraphData] = useState<any>(null);
  
  // Simulated graph nodes and edges
  const mockGraphData = {
    nodes: [
      { id: '1', label: 'Authentication Service', type: 'service', color: '#3b82f6' },
      { id: '2', label: 'User Database', type: 'database', color: '#10b981' },
      { id: '3', label: 'API Gateway', type: 'service', color: '#3b82f6' },
      { id: '4', label: 'JWT Verification', type: 'service', color: '#3b82f6' },
      { id: '5', label: 'User Records', type: 'data', color: '#8b5cf6' },
      { id: '6', label: 'OAuth 2.0 Specification', type: 'document', color: '#f59e0b' },
      { id: '7', label: 'Security Meeting (03/15/25)', type: 'meeting', color: '#ec4899' },
      { id: '8', label: 'Architecture Diagram', type: 'document', color: '#f59e0b' },
    ],
    edges: [
      { from: '1', to: '2', label: 'connects to' },
      { from: '1', to: '4', label: 'validates via' },
      { from: '3', to: '1', label: 'routes to' },
      { from: '4', to: '5', label: 'verifies' },
      { from: '2', to: '5', label: 'contains' },
      { from: '1', to: '6', label: 'implements' },
      { from: '7', to: '1', label: 'discusses' },
      { from: '7', to: '8', label: 'references' },
      { from: '8', to: '1', label: 'documents' },
      { from: '8', to: '2', label: 'documents' },
      { from: '8', to: '3', label: 'documents' },
    ],
  };
  
  useEffect(() => {
    // Simulate loading graph data
    const timer = setTimeout(() => {
      setGraphData(mockGraphData);
      setLoading(false);
      drawGraph();
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  useEffect(() => {
    if (graphData) {
      drawGraph();
    }
  }, [graphData, zoomLevel, showLabels]);
  
  const drawGraph = () => {
    if (!canvasRef.current || !graphData) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Reset canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Set up scaling based on zoom level
    const scale = zoomLevel[0] / 50;
    
    // Calculate center of canvas
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    // Node positions (simplified for demo)
    const nodePositions: Record<string, {x: number, y: number}> = {};
    const radius = 150 * scale;
    
    // Position nodes in a circle
    graphData.nodes.forEach((node: any, index: number) => {
      const angle = (index / graphData.nodes.length) * 2 * Math.PI;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      nodePositions[node.id] = { x, y };
    });
    
    // Draw edges
    ctx.strokeStyle = '#d1d5db';
    ctx.lineWidth = 1.5;
    
    graphData.edges.forEach((edge: any) => {
      const fromPos = nodePositions[edge.from];
      const toPos = nodePositions[edge.to];
      
      if (fromPos && toPos) {
        ctx.beginPath();
        ctx.moveTo(fromPos.x, fromPos.y);
        ctx.lineTo(toPos.x, toPos.y);
        ctx.stroke();
        
        // Draw edge label
        if (showLabels) {
          const midX = (fromPos.x + toPos.x) / 2;
          const midY = (fromPos.y + toPos.y) / 2;
          
          ctx.fillStyle = '#6b7280';
          ctx.font = `${10 * scale}px sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(edge.label, midX, midY);
        }
      }
    });
    
    // Draw nodes
    graphData.nodes.forEach((node: any) => {
      const pos = nodePositions[node.id];
      if (pos) {
        // Draw node circle
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 12 * scale, 0, 2 * Math.PI);
        ctx.fillStyle = node.color || '#3b82f6';
        ctx.fill();
        
        // Draw node label
        if (showLabels) {
          ctx.fillStyle = '#1f2937';
          ctx.font = `${12 * scale}px sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(node.label, pos.x, pos.y + 20 * scale);
        }
      }
    });
  };
  
  const handleResize = () => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const parent = canvas.parentElement;
    if (!parent) return;
    
    canvas.width = parent.clientWidth;
    canvas.height = parent.clientHeight;
    
    drawGraph();
  };
  
  useEffect(() => {
    // Set canvas size on mount and window resize
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-1 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Network className="mr-2 h-5 w-5" />
              Knowledge Graph Controls
            </CardTitle>
            <CardDescription>
              Customize your view of the knowledge graph
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Zoom Level</Label>
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={() => setZoomLevel([Math.max(zoomLevel[0] - 10, 10)])}
                  >
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={() => setZoomLevel([Math.min(zoomLevel[0] + 10, 100)])}
                  >
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <Slider 
                value={zoomLevel} 
                onValueChange={setZoomLevel} 
                min={10} 
                max={100} 
                step={1} 
              />
            </div>
            
            <div className="space-y-2">
              <Label>View Mode</Label>
              <Select defaultValue="force">
                <SelectTrigger>
                  <SelectValue placeholder="Select view mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="force">Force Directed</SelectItem>
                  <SelectItem value="radial">Radial</SelectItem>
                  <SelectItem value="hierarchical">Hierarchical</SelectItem>
                  <SelectItem value="cluster">Cluster</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-4">
              <Label>Display Options</Label>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Show Labels</span>
                <Switch 
                  checked={showLabels} 
                  onCheckedChange={setShowLabels} 
                />
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Show Relationships</span>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Group By Type</span>
                <Switch defaultChecked />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Filter By Type</Label>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 cursor-pointer">
                  <div className="h-2 w-2 rounded-full bg-blue-500 mr-1"></div>
                  Services
                </Badge>
                <Badge className="bg-green-100 text-green-800 hover:bg-green-200 cursor-pointer">
                  <div className="h-2 w-2 rounded-full bg-green-500 mr-1"></div>
                  Databases
                </Badge>
                <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200 cursor-pointer">
                  <div className="h-2 w-2 rounded-full bg-purple-500 mr-1"></div>
                  Data
                </Badge>
                <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200 cursor-pointer">
                  <div className="h-2 w-2 rounded-full bg-amber-500 mr-1"></div>
                  Documents
                </Badge>
                <Badge className="bg-pink-100 text-pink-800 hover:bg-pink-200 cursor-pointer">
                  <div className="h-2 w-2 rounded-full bg-pink-500 mr-1"></div>
                  Meetings
                </Badge>
              </div>
            </div>
            
            <div>
              <Label htmlFor="search-graph">Search Nodes</Label>
              <div className="relative mt-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input id="search-graph" placeholder="Find in graph..." className="pl-8" />
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" className="flex items-center">
                <RefreshCw className="mr-2 h-3 w-3" />
                Refresh
              </Button>
              <Button variant="outline" size="sm" className="flex items-center">
                <Filter className="mr-2 h-3 w-3" />
                Filter
              </Button>
              <Button variant="outline" size="sm" className="flex items-center">
                <Download className="mr-2 h-3 w-3" />
                Export
              </Button>
              <Button variant="outline" size="sm" className="flex items-center">
                <Maximize2 className="mr-2 h-3 w-3" />
                Fullscreen
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Knowledge Entities</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <FileText className="text-amber-500 h-4 w-4 mr-2" />
                  <span>Documents</span>
                </div>
                <Badge>42</Badge>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <GitBranch className="text-blue-500 h-4 w-4 mr-2" />
                  <span>Code</span>
                </div>
                <Badge>27</Badge>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <MessagesSquare className="text-pink-500 h-4 w-4 mr-2" />
                  <span>Conversations</span>
                </div>
                <Badge>65</Badge>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <Briefcase className="text-green-500 h-4 w-4 mr-2" />
                  <span>Projects</span>
                </div>
                <Badge>12</Badge>
              </div>
            </div>
            
            <div className="text-xs text-muted-foreground mt-2 pt-2 border-t">
              Last updated: {new Date().toLocaleDateString()}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="lg:col-span-3">
        <Card className="h-[650px]">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle>Knowledge Graph</CardTitle>
              <Button variant="outline" size="sm">
                Rebuild Graph
              </Button>
            </div>
            <CardDescription>
              Visual representation of connected knowledge in your organization
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[550px] relative">
            {loading ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex flex-col items-center">
                  <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                  <p className="mt-2 text-sm text-muted-foreground">Building knowledge graph...</p>
                </div>
              </div>
            ) : (
              <canvas 
                ref={canvasRef} 
                className="w-full h-full"
              ></canvas>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default KnowledgeGraphPreview;
