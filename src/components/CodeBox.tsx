import { Button, makeStyles, Tooltip } from "@fluentui/react-components";
import * as React from "react";
import { bundleIcon, CopyFilled, CopyRegular } from "@fluentui/react-icons";
import { useNotification } from "../utils/notification/Notification";
import { useState } from "react";
const useStyles = makeStyles({
  container: {
    marginTop: "1.5rem",
    marginBottom: "1.5rem",
    overflow: "hidden",
    borderRadius: "1rem",
    backgroundColor: "#18181b",
  },
  inner: {
    display: "flex",
    minHeight: `calc(3rem + 1px)`,
    flexWrap: "wrap",
    alignItems: "flex-start",
    gap: "1rem",
    borderBottom: `1px solid #374151`, // border-b border-zinc-700
    backgroundColor: "#27272a", // bg-zinc-800
    padding: "0rem 1rem",
  },
  h3Title: {
    color: "#ffffff",
    fontWeight: 600,
    fontSize: "14px",
    lineHeight: "1rem", 
    marginRight: "auto",
    marginTop:"auto",
    marginBottom:"auto",
  },
  codePre: {
    color: "#ffffff",
    fontSize: ".75rem",
    lineHeight: "1rem",
    padding: "1rem",
    margin:"0px",
    overflowX: "auto",
  },
  relative: {
    position: "relative",
  },
  code: {
    fontFamily:
      "ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace",
    userSelect: "text",
  },
});
interface CodeBoxProps {
  copyValue?: string;
}

const CodeBox: React.FC<React.PropsWithChildren<CodeBoxProps>> = ({
  children,
  copyValue,
}) => {
  const styles = useStyles();
  const { showNotification } = useNotification();
  const [isMouseInside, setIsMouseInside] = useState(false);

  const handleMouseEnter = () => {
    setIsMouseInside(true); // 鼠标进入时设置为 true
  };

  const handleMouseLeave = () => {
    setIsMouseInside(false); // 鼠标离开时设置为 false
  };

  return (
    <div className={styles.container} onMouseEnter={handleMouseEnter}
    onMouseLeave={handleMouseLeave}>
      <div className={styles.inner}>
        <h3 className={styles.h3Title}>Code</h3>
        {isMouseInside && <Tooltip content="点击复制" relationship="label">
          <Button  appearance="transparent" 
            style={{ margin: "auto 0px", backgroundColor: "#3c3c3d",color:"#d2d2d6" }}
            icon={<CopyFilled />}
            aria-label="Copy"
            onClick={async () => {
              try {
                const text = copyValue===undefined ? String(children): copyValue;
                await navigator.clipboard.writeText(text);
                showNotification("复制成功", "success");
              } catch (err) {
                console.error("复制失败", err);
                showNotification("复制失败", "error");
              }
            }}
          >
            复制
          </Button>
        </Tooltip>}
      </div>
      <div>
        <div className={styles.relative}>
          <pre className={styles.codePre}>
            <pre>
              <code className={styles.code}>{children}</code>
            </pre>
          </pre>
        </div>
      </div>
    </div>
  );
};
export default CodeBox;
