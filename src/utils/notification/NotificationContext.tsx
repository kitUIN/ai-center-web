import React, {  useState } from "react";
import { MessageBar, MessageBarGroup } from "@fluentui/react-components";
import { MessageType, NotificationContext } from "./NotificationInstance";

export const NotificationProvider: React.FC<
  React.PropsWithChildren<object>
> = ({ children }) => {
  const [messages, setMessages] = useState<
    { message: string; type: MessageType }[]
  >([]);

  const showNotification = (message: string, type: MessageType) => {
    setMessages((prevMessages) => [...prevMessages, { message, type }]);

    setTimeout(() => {
      setMessages((prevMessages) => prevMessages.slice(1));
    }, 2000);
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      {messages.length > 0 && (
        <div
          style={{
            position: "fixed",
            top: 20,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 1000,
            display: "flex",
            justifyContent: "center",
            width: "auto",
          }}
        >
          <MessageBarGroup>
            {messages.map((msg, index) => (
              <MessageBar style={{paddingRight: "14px"}} key={index} intent={msg.type}>
                {msg.message}
              </MessageBar>
            ))}
          </MessageBarGroup>
        </div>
      )}
    </NotificationContext.Provider>
  );
};

