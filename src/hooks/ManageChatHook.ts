import apiClient from "@/api/apiClient";
import { BusinessDocument } from "@/model/BusinessDocument";
import { ChatMessage } from "@ant-design/pro-chat";
import { use, useEffect, useState } from "react";

export const useChat = () => {
  const [chats, setChats] = useState<ChatMessage<Record<string, any>>[]>([]);

  const setChatsFromString = (chatJson: string) => {
    setChats(JSON.parse(chatJson));
  }

  const pushChat = (chat: ChatMessage<Record<string, any>>) => {
    setChats((prevChats) => [...prevChats, chat]);
  };

  const deleteChats = () => {
    setChats([]);
  };


  const printChats = () => {
    console.log(chats);
  }


  return {chats,setChats,pushChat,setChatsFromString,deleteChats,printChats };
};
