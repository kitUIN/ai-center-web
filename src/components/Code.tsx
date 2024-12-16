import { makeStyles } from "@fluentui/react-components";
import * as React from "react";
const useStyles = makeStyles({
  code: {
    
    color: "#18181b",
    borderRadius: ".5rem",
    padding: ".25rem .375rem",
    boxShadow: "inset 0 0 0 1px #d4d4d8",
    backgroundColor: "#f4f4f5",
    fontSize: ".625rem",
    fontFamily:
      "ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace",
  },
});

const Code: React.FC<React.PropsWithChildren<object>> = ({ children }) => {
  const styles = useStyles();
  return (
    <code className={styles.code}>{children}</code>
  );
};
export default Code;
