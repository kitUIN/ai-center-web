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
import { useQueryClient } from "@tanstack/react-query";
import { BaseModel, ModelId } from "../utils/api/models/Base";
import { DetailResponse } from "../utils/api/BaseFetch";
import FileUploadComponent from "./FileUploadComponent";

const CloudAddIcon = bundleIcon(CloudAddFilled, CloudAddRegular);

interface DeleteButtonProps {
  queryKey: string[];
  id: ModelId;
  DeleteReq: (id: ModelId) => Promise<DetailResponse<BaseModel>>;
}
export const FileUploadButton = ( ) => {
  // const styles = useStyles();
  const { showNotification } = useNotification();

  const queryClient = useQueryClient();
  const [files, setFiles] = React.useState<File[]>([]); // 存储选中的文件
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const deleteClick = (event: React.MouseEvent) => {
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
            <FileUploadComponent setFiles={setFiles} files={files}></FileUploadComponent>
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
            <Button
              appearance="primary"
              onClick={deleteClick}
            >
              确认上传
            </Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
};
