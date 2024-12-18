import apiClient from "@/api/apiClient";
import { ChatIntent } from "@/model/ChatIntent";
import { use, useEffect, useState } from "react";

export const useChatIntent = () => {
  const [chatIntents, setChatIntents] = useState<ChatIntent[]>([]);

  const fetchChatIntents = async () => {
    try {
      const response : ChatIntent[] = await apiClient.get('/ai/manage/chat-intents');
      setChatIntents(response);
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };

  const deleteChatIntent = async (id: number) => {
    try {
      const data = await apiClient.delete("/ai/manage/chat-intent?id=" + id);
      await fetchChatIntents();
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };

  const createChatIntent = async (body: ChatIntent) => {
    const data = await apiClient.post("/ai/manage/chat-intent", body);
    await fetchChatIntents();
  };

  const updateChatIntent = async (body: ChatIntent) => {
    const data = await apiClient.put("/ai/manage/chat-intent?id=" + body.id, body);
    await fetchChatIntents();
  };

  useEffect(() => {
    fetchChatIntents();
  }, []);

  return { chatIntents, fetchChatIntents, createChatIntent, deleteChatIntent, updateChatIntent };
};
