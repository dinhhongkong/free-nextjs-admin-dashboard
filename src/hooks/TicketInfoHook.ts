
import apiClient from "@/api/apiClient";
import { useNotification } from "@/context/NotificationContext";
import { TicketInfo } from "@/model/ManageTicket";
import { useState } from "react";

export const useTicketInfo = () => {
  const [tickets, setTickets] = useState<TicketInfo[]>([]);
  const { setNotification } = useNotification();


  const fetchTicketInfo = async (id: number, phoneNumber: string) => {
    try {
      const response: TicketInfo[] = await apiClient.get(`/manage/check-ticket?ticketId=${id}&phoneNumber=${phoneNumber}`);
      setTickets(response);
      setNotification({
        show: true,
        message: "Tìm thấy vé",
        type: "success",
      });
      
    } catch (error) {
      setNotification({
        show: true,
        message: "Vé không tìm thấy",
        type: "error",
      });
      setTickets([]);
    
    }
  };

  const cancelTicket = async (id: number) => {
    try {
      const response = await apiClient.get(`/manage/check-ticket/cancel?ticketId=${id}`);
      setNotification({
        show: true,
        message: "Hủy vé thành công",
        type: "success",
      });
    } catch (error) {
      setNotification({
        show: true,
        message: "Lỗi khi hủy vé, xin thử lại sau",
        type: "error",      
      });
    }
  };

  const confirmPayment = async (id: number) => {
    try {
      const response = await apiClient.get(`/manage/check-ticket/pay?ticketId=${id}`);
      setNotification({
        show: true,
        message: "Thanh toán vé thành công",
        type: "success",
      });
    } catch (error) {
      setNotification({
        show: true,
        message: "Lỗi khi thanh toán vé, xin thử lại sau",
        type: "error",      
      });
    }
  };

  return { tickets, fetchTicketInfo, cancelTicket, confirmPayment };
};