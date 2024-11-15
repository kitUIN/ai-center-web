import React, { useState } from "react";
import {
  makeStyles,
  MessageBar,
  MessageBarGroup,
  tokens,
} from "@fluentui/react-components";
import { MessageType, NotificationContext } from "./NotificationInstance";

const useStyles = makeStyles({
  messageBarGroup: {
    padding: tokens.spacingHorizontalMNudge,
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    overflow: "auto",
  },
  messageDiv: {
    position: "fixed",
    top: "10px",
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: 9000000,
    display: "flex",
    justifyContent: "center",
    width: "auto",
  },
});

export const NotificationProvider: React.FC<
  React.PropsWithChildren<object>
> = ({ children }) => {
  const [messages, setMessages] = useState<
    { message: string; type: MessageType }[]
  >([]);
  const styles = useStyles();

  const showNotification = (message: string, type: MessageType) => {
    setMessages((prevMessages) => [...prevMessages, { message, type }]);

    setTimeout(() => {
      setMessages((prevMessages) => prevMessages.slice(1));
    }, 2000);
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {messages.length > 0 && (
        <div className={styles.messageDiv}>
          <MessageBarGroup animate="both" className={styles.messageBarGroup}>
            {messages.map((msg, index) => (
              <MessageBar
                style={{ paddingRight: "14px" }}
                key={index}
                intent={msg.type}
              >
                {msg.message}
              </MessageBar>
            ))}
          </MessageBarGroup>
        </div>
      )}
      {children}
    </NotificationContext.Provider>
  );
};
