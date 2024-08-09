"use client";
import { createContext, useState, useContext, useEffect } from "react";
import Notification from "../components/Notification/Notification";

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });
  const handleCloseNotification = () => {
    setNotification({ show: false, message: "", type: "" });
  };

  useEffect(() => {
    let timer;
    if (notification.show) {
      timer = setTimeout(() => {
        handleCloseNotification();
      }, 3000);
    }

    return () => clearTimeout(timer);
  }, [notification]);

  return (
    <NotificationContext.Provider value={{ notification, setNotification }}>
      {notification.show && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={handleCloseNotification}
        />
      )}
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  return useContext(NotificationContext);
}
