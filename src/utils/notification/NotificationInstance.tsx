import { createContext } from "react";

export type MessageType = "success" | "warning" | "error" | "info";
type NotificationContextType = {
  showNotification: (message: string, type: MessageType) => void;
};

export const NotificationContext = createContext<
  NotificationContextType | undefined
>(undefined);
