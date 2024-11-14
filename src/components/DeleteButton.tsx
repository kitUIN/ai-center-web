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
} from "@fluentui/react-components";
import { bundleIcon, DeleteFilled, DeleteRegular } from "@fluentui/react-icons";
import { useNotification } from "../utils/notification/Notification";
import { useQueryClient } from "@tanstack/react-query";
import { BaseModel, ModelId } from "../utils/api/models/Base";
import { DetailResponse } from "../utils/api/BaseFetch";

const DeleteIcon = bundleIcon(DeleteFilled, DeleteRegular);

interface DeleteButtonProps {
  queryKey: string[];
  id: ModelId;
  DeleteReq: (id: ModelId) => Promise<DetailResponse<BaseModel>>;
}
export const DeleteButton = (props: DeleteButtonProps) => {
  // const styles = useStyles();
  const { showNotification } = useNotification();

  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const deleteClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    props.DeleteReq(props.id).then((resp) => {
      if (resp.code === 200) {
        setDialogOpen(false);
        showNotification(resp.msg, "success");
        queryClient.refetchQueries({ queryKey: props.queryKey, exact: true });
      } else {
        showNotification(resp.msg, "error");
      }
    });
  };

  return (
    <Dialog modalType="modal" open={dialogOpen}>
      <DialogTrigger disableButtonEnhancement>
        <Tooltip content="删除" relationship="label">
        <Button
          appearance="transparent"
          icon={<DeleteIcon />}
          aria-label="Delete"
          onClick={() => {
            setDialogOpen(true);
          }}
        />
        </Tooltip>
      </DialogTrigger>
      <DialogSurface aria-describedby={undefined}>
        <DialogBody>
          <DialogTitle>删除确认</DialogTitle>
          <DialogContent>确认要删除吗? 删除后无法恢复</DialogContent>
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
              style={{ backgroundColor: "#D13438", color: "white" }}
            >
              确认删除
            </Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
};
