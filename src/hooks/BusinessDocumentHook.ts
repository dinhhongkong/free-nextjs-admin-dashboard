import apiClient from "@/api/apiClient";
import { BusinessDocument } from "@/model/BusinessDocument";
import { useEffect, useState } from "react";

export const useBusinessDocumentHook = () => {
  const [documents, setDocuments] = useState<BusinessDocument[]>([]);

  const fetchDocuments = async () => {
    try {
      const response : BusinessDocument[] = await apiClient.get('/ai/manage/documents');
      setDocuments(response);
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };

  const deleteDocument = async (id: number) => {
    try {
      const data = await apiClient.delete("/ai/manage/document?id=" + id);
      await fetchDocuments();
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };

  const createDocument = async (body: BusinessDocument) => {
    const data = await apiClient.post("/ai/manage/document", body);
    await fetchDocuments();
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  return { documents, setDocuments, fetchDocuments, deleteDocument, createDocument };



}; 