import * as React from "react";
import {
  Dialog,
  DialogTrigger,
  DialogSurface,
  DialogTitle,
  DialogContent,
  DialogBody,
  DialogActions,
  Button,
  Tooltip,
  ToolbarButton,
} from "@fluentui/react-components";
import {
  bundleIcon,
  CloudAddFilled,
  CloudAddRegular,
} from "@fluentui/react-icons";
import { useNotification } from "../utils/notification/Notification";
import FileUploadComponent from "./FileUploadComponent";
import { AiModel } from "../utils/api/models/AiModel";

const CloudAddIcon = bundleIcon(CloudAddFilled, CloudAddRegular);

interface FileUploadButtonProps {
  item: AiModel;
}
export const FileUploadButton: React.FC<FileUploadButtonProps> = ({ item }) => {
  // const styles = useStyles();
  const { showNotification } = useNotification();

  // const queryClient = useQueryClient();
  const [files, setFiles] = React.useState<File[]>([]); // 存储选中的文件
  const [dialogOpen, setDialogOpen] = React.useState(false);

  const uploadClick = async (event: React.MouseEvent) => {
    const formData = new FormData();
    for (const file of files) {
      formData.append("files", file);
    }

    const response = await fetch(`/api/ai/${item.id}/upload`, {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      const result = await response.json();
      console.log("Uploaded files:", result);
      showNotification("上传成功", "success");
      setDialogOpen(false);
    } else {
      console.error("Upload failed:", response.statusText);
    }
    event.stopPropagation();
  };
  return (
    <Dialog modalType="modal" open={dialogOpen}>
      <DialogTrigger disableButtonEnhancement>
        <Tooltip content="上传" relationship="label">
          <ToolbarButton
            icon={<CloudAddIcon />}
            aria-label="Upload"
            onClick={() => {
              setDialogOpen(true);
              setFiles([]);
            }}
          >
            上传
          </ToolbarButton>
        </Tooltip>
      </DialogTrigger>
      <DialogSurface aria-describedby={undefined}>
        <DialogBody>
          <DialogTitle>上传文件</DialogTitle>
          <DialogContent>
            <FileUploadComponent
              setFiles={setFiles}
              files={files}
            ></FileUploadComponent>
          </DialogContent>
          <DialogActions>
            <Button
              appearance="secondary"
              onClick={() => {
                setDialogOpen(false);
              }}
            >
              取消
            </Button>
            <Button appearance="primary" onClick={uploadClick}>
              确认上传
            </Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
};
