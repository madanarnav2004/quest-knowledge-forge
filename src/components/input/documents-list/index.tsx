import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Document } from "./types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PlusCircle, RefreshCw } from "lucide-react";
import { DocumentsTable } from "./DocumentsTable";
import { SearchInput } from "./SearchInput";
import { FilterDropdown } from "./FilterDropdown";
import { DocumentsAnalytics } from "./DocumentsAnalytics";
import { EmptyState } from "./EmptyState";
import { LoadingState } from "./LoadingState";
import { calculateAnalytics, filterDocuments } from "./utils";
import { DeleteConfirmationDialog } from "./DeleteConfirmationDialog";
import { toast } from "sonner";
import KnowledgeGraphVisualization from "../knowledge-graph";

const DocumentsList: React.FC = () => {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentFilter, setCurrentFilter] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<string | null>(null);
  const [showKnowledgeGraph, setShowKnowledgeGraph] = useState(false);

  useEffect(() => {
    if (user) {
      fetchDocuments();
    }
  }, [user]);

  useEffect(() => {
    setFilteredDocuments(
      filterDocuments(documents, searchQuery, activeTab, currentFilter)
    );
  }, [documents, searchQuery, activeTab, currentFilter]);

  const fetchDocuments = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("documents")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (error) {
      console.error("Error fetching documents:", error);
      toast.error("Failed to load documents");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteRequest = (id: string) => {
    setDocumentToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!documentToDelete) return;

    try {
      // Get document to find file path
      const { data: document, error: fetchError } = await supabase
        .from("documents")
        .select("file_path")
        .eq("id", documentToDelete)
        .single();

      if (fetchError) throw fetchError;

      // Delete document from database
      const { error: deleteError } = await supabase
        .from("documents")
        .delete()
        .eq("id", documentToDelete);

      if (deleteError) throw deleteError;

      // Delete file from storage if file_path exists
      if (document?.file_path) {
        const { error: storageError } = await supabase.storage
          .from("documents")
          .remove([document.file_path]);

        if (storageError) {
          console.error("Error deleting file:", storageError);
          // Don't throw, continue as document is deleted from DB
        }
      }

      // Use a try-catch block to handle potential errors
      try {
        // Delete any knowledge graph relations related to this document
        await supabase
          .from("knowledge_relationships")
          .delete()
          .or(`source_id.eq.${documentToDelete},target_id.eq.${documentToDelete}`);
      } catch (error) {
        console.error("Error deleting knowledge relationships:", error);
        // Don't throw, continue as document is deleted from DB
      }

      // Update document list
      setDocuments((prev) =>
        prev.filter((doc) => doc.id !== documentToDelete)
      );
      toast.success("Document deleted successfully");
    } catch (error) {
      console.error("Error deleting document:", error);
      toast.error("Failed to delete document");
    } finally {
      setDeleteDialogOpen(false);
      setDocumentToDelete(null);
    }
  };

  const handleReprocess = (id: string) => {
    // Optimistically update UI
    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === id ? { ...doc, status: "processing" } : doc
      )
    );
  };

  const handleRefresh = () => {
    fetchDocuments();
  };

  const analytics = calculateAnalytics(documents);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Knowledge Base</h2>
          <p className="text-muted-foreground">
            Manage documents and view your knowledge graph
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setShowKnowledgeGraph(!showKnowledgeGraph)}
            variant="outline"
          >
            {showKnowledgeGraph
              ? "Hide Knowledge Graph"
              : "Show Knowledge Graph"}
          </Button>
          <Button onClick={handleRefresh} variant="outline" size="icon">
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button asChild>
            <a href="/input#upload">
              <PlusCircle className="mr-2 h-4 w-4" /> Upload Document
            </a>
          </Button>
        </div>
      </div>

      {showKnowledgeGraph && (
        <div className="mb-8">
          <KnowledgeGraphVisualization />
        </div>
      )}

      <DocumentsAnalytics analytics={analytics} />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <Tabs
          defaultValue="all"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList>
            <TabsTrigger value="all">All Documents</TabsTrigger>
            <TabsTrigger value="processing">
              Processing ({analytics.processingDocuments})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed ({analytics.completedDocuments})
            </TabsTrigger>
            <TabsTrigger value="failed">
              Failed ({analytics.failedDocuments})
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex gap-2">
          <SearchInput value={searchQuery} onChange={setSearchQuery} />
          <FilterDropdown
            currentFilter={currentFilter}
            setCurrentFilter={setCurrentFilter}
            documentTypes={Object.keys(analytics.byType)}
          />
        </div>
      </div>

      {isLoading ? (
        <LoadingState />
      ) : documents.length === 0 ? (
        <EmptyState />
      ) : (
        <DocumentsTable
          documents={filteredDocuments}
          onReprocess={handleReprocess}
          onDeleteRequest={handleDeleteRequest}
          onRefresh={handleRefresh}
        />
      )}

      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

export default DocumentsList;
