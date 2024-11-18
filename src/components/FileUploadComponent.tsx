import React, { useState } from "react";
import { makeStyles, Subtitle1, Subtitle2, Tooltip } from "@fluentui/react-components";
import { Text } from "@fluentui/react-components";

const useStyles = makeStyles({
  uploadZone: {
    width: "100%",
    height: "200px",
    border: "2px dashed #0078d4",
    borderRadius: "8px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    backgroundColor: "#f3f2f1",
    cursor: "pointer",
    transition: "all 0.3s ease",
    "&:hover": {
      backgroundColor: "#e1f5fe",
      transform: "scale(1.01)",
    },
  },
  hover: {
    backgroundColor: "#e1e1e1",
  },
  fileName: {
    marginTop: "10px",
  },
  fileList: {
    marginTop: "10px",
    maxHeight: "150px",
    overflowY: "auto",
  },
  fileItem: {
    marginBottom: "8px",
  },
});
interface FileUploadComponentProps {
  files: File[];
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
}
const FileUploadComponent: React.FC<FileUploadComponentProps> = ({
  files,
  setFiles,
}) => {
  const [dragOver, setDragOver] = useState(false);

  const styles = useStyles();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (selectedFiles) {
      const newFiles = Array.from(selectedFiles);
      setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(false);

    const droppedFiles = event.dataTransfer.files;
    if (droppedFiles) {
      const newFiles = Array.from(droppedFiles);
      setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    }
  };

  const handleUploadZoneClick = () => {
    document.getElementById("file-input")?.click();
  };

  return (
    <div style={{ padding: "4px 10px" }}>
      <div
        className={`${styles.uploadZone} ${dragOver ? styles.hover : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleUploadZoneClick}
      >
        <Subtitle1>拖拽文件到此区域</Subtitle1>
        <Subtitle2>或</Subtitle2>
        <Subtitle1>选择文件</Subtitle1>

        <input
          id="file-input"
          type="file"
          style={{ display: "none" }}
          multiple
          onChange={handleFileSelect}
        />
      </div>

      {files.length > 0 && (
        <div style={{ marginTop: "8px" }}>
          <Text>已选择的文件:</Text>
          <div className={styles.fileList}>
            {files.map((file, index) => (
              <div key={index} className={styles.fileItem}>
                <Tooltip content={file.webkitRelativePath || file.name} relationship="label">
                <Text>{file.name}</Text>
                </Tooltip>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploadComponent;
