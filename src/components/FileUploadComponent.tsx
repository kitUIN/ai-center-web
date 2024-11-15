import React, { useState } from 'react';
import { makeStyles, Subtitle1, Subtitle2 } from '@fluentui/react-components';
import { Button, Text, Tooltip } from '@fluentui/react-components';
import { FolderOpenIcon } from '@fluentui/react-icons-mdl2';

const useStyles = makeStyles({
  dropZone: {
    width: '100%',
    height: '200px',
    border: '2px dashed #0078d4',
    borderRadius: '8px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    backgroundColor: '#f3f2f1',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  hover: {
    backgroundColor: '#e1e1e1',
  },
  fileName: {
    marginTop: '10px',
  },
  fileList: {
    marginTop: '10px',
    maxHeight: '150px',
    overflowY: 'auto',
  },
  fileItem: {
    marginBottom: '8px',
  },
});

const FileUploadComponent: React.FC = () => {
  const [dragOver, setDragOver] = useState(false);
  const [files, setFiles] = useState<File[]>([]); // 存储选中的文件

  const styles = useStyles();

  // 处理文件选择
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (selectedFiles) {
      const newFiles = Array.from(selectedFiles);
      setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    }
  };

  // 处理文件拖拽
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

  const handleFileUpload = () => {
    if (files.length > 0) {
      // 在此实现文件上传逻辑，例如使用 fetch 或 axios 上传文件
      files.forEach((file) => {
        console.log('上传文件:', file);
      });
    }
  };

  return (
    <div>
      <div
        className={`${styles.dropZone} ${dragOver ? styles.hover : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Subtitle1  >拖拽文件到此区域</Subtitle1>
        <Subtitle2  >或</Subtitle2>
        <Subtitle1  >选择文件</Subtitle1>
        <Button
          appearance="transparent"
          onClick={() => document.getElementById('file-input')?.click()}
        >
           
        </Button>
        <input
          id="file-input"
          type="file"
          style={{ display: 'none' }}
          multiple // 允许选择多个文件
          onChange={handleFileSelect}
        />
      </div>

      {files.length > 0 && (
        <div className={styles.fileList}>
          <Text  >已选择的文件:</Text>
          {files.map((file, index) => (
            <div key={index} className={styles.fileItem}>
              <Text>{file.name}</Text>
            </div>
          ))}
        </div>
      )}

      <Button onClick={handleFileUpload} disabled={files.length === 0}>
        上传文件
      </Button>
    </div>
  );
};

export default FileUploadComponent;
