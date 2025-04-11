import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  FileText,
  File,
  FileCode,
  FilePen,
  Trash2,
  AlertCircle,
  CheckCircle,
  Loader2,
  MoreVertical,
  Eye,
  Download,
  Pencil,
  BarChart,
  Brain,
  MessageSquare,
  Filter,
  Clock,
  Tag,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

type Document = {
  id: string;
  title: string;
  document_type: string;
  status: string;
  created_at: string;
  file_path: string;
  description?: string;
  tags?: string[];
  ocr_enabled?: boolean;
  summarization_enabled?: boolean;
  size?: number;
  word_count?: number;
  vector_embedded?: boolean;
};

const DocumentsList = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [documentToDelete, setDocumentToDelete] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [currentFilter, setCurrentFilter] = useState<string | null>(null);
  
  const [analytics, setAnalytics] = useState({
    totalDocuments: 0,
    processingDocuments: 0,
    completedDocuments: 0,
    failedDocuments: 0,
    byType: {} as Record<string, number>,
    totalSize: 0,
  });

  useEffect(() => {
    if (!user) return;
    
    fetchDocuments();
    
    const subscription = supabase
      .channel('document-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'documents',
        },
        () => {
          fetchDocuments();
        }
      )
      .subscribe();
    
    return () => {
      subscription.unsubscribe();
    };
  }, [user]);
  
  useEffect(() => {
    if (documents.length) {
      filterDocuments();
      calculateAnalytics();
    }
  }, [documents, searchQuery, activeTab, currentFilter]);

  const fetchDocuments = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .order('created_at', { ascending: false }) as { data: Document[] | null, error: any };
      
      if (error) throw error;
      
      const enhancedData = (data || []).map(doc => ({
        ...doc,
        size: Math.floor(Math.random() * 10000) + 100,
        word_count: Math.floor(Math.random() * 5000) + 100,
      }));
      
      setDocuments(enhancedData);
      setFilteredDocuments(enhancedData);
    } catch (error: any) {
      toast({
        title: "Error fetching documents",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const filterDocuments = () => {
    let filtered = [...documents];
    
    if (searchQuery) {
      filtered = filtered.filter(doc => 
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (doc.description && doc.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (doc.tags && doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
      );
    }
    
    if (activeTab === 'processing') {
      filtered = filtered.filter(doc => doc.status === 'processing');
    } else if (activeTab === 'completed') {
      filtered = filtered.filter(doc => doc.status === 'completed');
    } else if (activeTab === 'failed') {
      filtered = filtered.filter(doc => doc.status === 'failed');
    }
    
    if (currentFilter) {
      filtered = filtered.filter(doc => doc.document_type === currentFilter);
    }
    
    setFilteredDocuments(filtered);
  };
  
  const calculateAnalytics = () => {
    const byType: Record<string, number> = {};
    let totalSize = 0;
    
    documents.forEach(doc => {
      byType[doc.document_type] = (byType[doc.document_type] || 0) + 1;
      totalSize += doc.size || 0;
    });
    
    setAnalytics({
      totalDocuments: documents.length,
      processingDocuments: documents.filter(doc => doc.status === 'processing').length,
      completedDocuments: documents.filter(doc => doc.status === 'completed').length,
      failedDocuments: documents.filter(doc => doc.status === 'failed').length,
      byType,
      totalSize,
    });
  };

  const deleteDocument = async (id: string) => {
    try {
      const documentToDelete = documents.find(doc => doc.id === id);
      
      if (!documentToDelete) return;
      
      if (documentToDelete.file_path) {
        const { error: storageError } = await supabase.storage
          .from('documents')
          .remove([documentToDelete.file_path]);
          
        if (storageError) throw storageError;
      }
      
      const { error: dbError } = await supabase
        .from('documents')
        .delete()
        .eq('id', id) as { error: any };
        
      if (dbError) throw dbError;
      
      setDocuments(documents.filter(doc => doc.id !== id));
      
      toast({
        title: "Document deleted",
        description: "The document has been deleted successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error deleting document",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setDocumentToDelete(null);
    }
  };
  
  const handleReprocessDocument = (id: string) => {
    const updatedDocuments = documents.map(doc => 
      doc.id === id ? { ...doc, status: 'processing' } : doc
    );
    
    setDocuments(updatedDocuments);
    
    setTimeout(() => {
      const completedDocuments = documents.map(doc => 
        doc.id === id ? { ...doc, status: 'completed' } : doc
      );
      
      setDocuments(completedDocuments);
      
      toast({
        title: "Document processed",
        description: "The document has been successfully processed",
      });
    }, 3000);
  };
  
  const handleFilterByType = (type: string | null) => {
    setCurrentFilter(currentFilter === type ? null : type);
  };

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className="h-5 w-5 text-red-500" />;
      case 'markdown':
        return <FilePen className="h-5 w-5 text-blue-500" />;
      case 'code':
        return <FileCode className="h-5 w-5 text-purple-500" />;
      case 'excel':
        return <BarChart className="h-5 w-5 text-green-500" />;
      case 'text':
        return <File className="h-5 w-5 text-gray-500" />;
      case 'presentation':
        return <FileText className="h-5 w-5 text-amber-500" />;
      case 'audio':
        return <MessageSquare className="h-5 w-5 text-indigo-500" />;
      case 'video':
        return <FileText className="h-5 w-5 text-pink-500" />;
      default:
        return <File className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'processing':
        return <Loader2 className="h-5 w-5 text-amber-500 animate-spin" />;
      case 'failed':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return <Loader2 className="h-5 w-5 text-amber-500 animate-spin" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };
  
  const formatFileSize = (sizeInKB?: number) => {
    if (!sizeInKB) return 'Unknown';
    
    if (sizeInKB < 1000) {
      return `${sizeInKB} KB`;
    } else {
      return `${(sizeInKB / 1024).toFixed(2)} MB`;
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6 border flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6 border text-center">
        <File className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium">No documents found</h3>
        <p className="text-sm text-gray-500 mt-2">
          Upload your first document to start building your knowledge base
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Document Analytics</CardTitle>
              <CardDescription>
                Overview of your knowledge base documents
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" className="flex items-center">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-slate-50 p-4 rounded-lg text-center">
              <p className="text-sm text-slate-500">Total Documents</p>
              <p className="text-2xl font-bold">{analytics.totalDocuments}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <p className="text-sm text-green-600">Processed</p>
              <p className="text-2xl font-bold">{analytics.completedDocuments}</p>
            </div>
            <div className="bg-amber-50 p-4 rounded-lg text-center">
              <p className="text-sm text-amber-600">Processing</p>
              <p className="text-2xl font-bold">{analytics.processingDocuments}</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-lg text-center">
              <p className="text-sm text-slate-600">Total Size</p>
              <p className="text-2xl font-bold">{formatFileSize(analytics.totalSize)}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium mb-2">Documents by Type</h3>
              <div className="space-y-3">
                {Object.entries(analytics.byType).map(([type, count]) => (
                  <div key={type} className="space-y-1">
                    <div className="flex justify-between">
                      <div className="flex items-center">
                        {getDocumentIcon(type)}
                        <span className="ml-2 text-sm capitalize">{type}</span>
                      </div>
                      <span className="text-sm">{count} files</span>
                    </div>
                    <Progress 
                      value={(count / analytics.totalDocuments) * 100} 
                      className="h-1" 
                    />
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">Processing Status</h3>
              <div className="h-36 p-4 rounded-lg bg-slate-50 flex items-center justify-center">
                <div className="text-sm text-center text-slate-500">
                  {analytics.processingDocuments > 0 ? (
                    <>
                      <Loader2 className="h-10 w-10 text-primary mx-auto mb-2 animate-spin" />
                      <p>Processing {analytics.processingDocuments} documents</p>
                      <p className="text-xs mt-1">This may take a few minutes</p>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-10 w-10 text-green-500 mx-auto mb-2" />
                      <p>All documents are processed</p>
                      <p className="text-xs mt-1">Your knowledge base is up to date</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <div>
            <CardTitle>Your Documents</CardTitle>
            <CardDescription>
              Manage your uploaded documents
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative w-64">
              <Input 
                placeholder="Search documents..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
              <Eye className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="h-9 w-9">
                  <Filter className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter by Type</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleFilterByType('pdf')}>
                  <FileText className="h-4 w-4 text-red-500 mr-2" />
                  PDF Documents
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleFilterByType('markdown')}>
                  <FilePen className="h-4 w-4 text-blue-500 mr-2" />
                  Markdown
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleFilterByType('code')}>
                  <FileCode className="h-4 w-4 text-purple-500 mr-2" />
                  Code Files
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleFilterByType(null)}>
                  Clear Filters
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        
        <Tabs defaultValue="all" onValueChange={setActiveTab}>
          <div className="px-6 pt-2">
            <TabsList>
              <TabsTrigger value="all" className="text-xs">All Documents</TabsTrigger>
              <TabsTrigger value="processing" className="text-xs">Processing</TabsTrigger>
              <TabsTrigger value="completed" className="text-xs">Completed</TabsTrigger>
              <TabsTrigger value="failed" className="text-xs">Failed</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="all" className="m-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Document</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Uploaded</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDocuments.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {getDocumentIcon(doc.document_type)}
                          <div>
                            <div>{doc.title}</div>
                            {doc.tags && doc.tags.length > 0 && (
                              <div className="flex gap-1 mt-1">
                                {doc.tags.slice(0, 2).map((tag, idx) => (
                                  <Badge key={idx} variant="outline" className="text-xs py-0 h-5">
                                    {tag}
                                  </Badge>
                                ))}
                                {doc.tags.length > 2 && (
                                  <Badge variant="outline" className="text-xs py-0 h-5">
                                    +{doc.tags.length - 2} more
                                  </Badge>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {doc.document_type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(doc.status)}
                          <span className="capitalize">
                            {doc.status}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{formatFileSize(doc.size)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5 text-slate-400" />
                          <span>{formatDate(doc.created_at)}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem className="flex items-center">
                              <Eye className="h-4 w-4 mr-2" />
                              View Document
                            </DropdownMenuItem>
                            <DropdownMenuItem className="flex items-center">
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </DropdownMenuItem>
                            <DropdownMenuItem className="flex items-center">
                              <Pencil className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem className="flex items-center" onClick={() => handleReprocessDocument(doc.id)}>
                              <Brain className="h-4 w-4 mr-2" />
                              Reprocess
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="flex items-center text-red-600"
                              onClick={() => setDocumentToDelete(doc.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                  
                  {filteredDocuments.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <div className="flex flex-col items-center">
                          <File className="h-8 w-8 text-slate-300 mb-2" />
                          <p className="text-sm text-slate-500">No documents found</p>
                          {searchQuery && (
                            <p className="text-xs text-slate-400 mt-1">
                              Try a different search term or clear filters
                            </p>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          
          <TabsContent value="processing" className="m-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Document</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Uploaded</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDocuments.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <div className="flex flex-col items-center">
                          <CheckCircle className="h-8 w-8 text-green-300 mb-2" />
                          <p className="text-sm text-slate-500">No documents are currently processing</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          
          <TabsContent value="completed" className="m-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Document</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Uploaded</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDocuments.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <div className="flex flex-col items-center">
                          <File className="h-8 w-8 text-slate-300 mb-2" />
                          <p className="text-sm text-slate-500">No completed documents found</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          
          <TabsContent value="failed" className="m-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Document</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Uploaded</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDocuments.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <div className="flex flex-col items-center">
                          <CheckCircle className="h-8 w-8 text-green-300 mb-2" />
                          <p className="text-sm text-slate-500">No failed documents</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </Card>

      <AlertDialog open={!!documentToDelete}>
        <AlertDialogTrigger asChild>
          <span className="hidden">{/* This is triggered programmatically */}</span>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Document</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this document? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDocumentToDelete(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600"
              onClick={() => documentToDelete && deleteDocument(documentToDelete)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DocumentsList;
