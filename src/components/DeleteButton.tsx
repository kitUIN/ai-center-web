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
  icon?: JSX.Element;
  tooltip?:string;
  deleteReq: (id: ModelId) => Promise<DetailResponse<BaseModel>>;
}
export const DeleteButton:React.FC<DeleteButtonProps> = ({
  queryKey,
  id,
  icon = <DeleteIcon />,
  tooltip = "删除",
  deleteReq
}) => {
  // const styles = useStyles();
  const { showNotification } = useNotification();

  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const deleteClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    deleteReq(id).then((resp) => {
      if (resp.code === 200) {
        setDialogOpen(false);
        showNotification(resp.msg, "success");
        queryClient.refetchQueries({ queryKey: queryKey, exact: true });
      } else {
        showNotification(resp.msg, "error");
      }
    });
  };

  return (
    <Dialog modalType="modal" open={dialogOpen}>
      <DialogTrigger disableButtonEnhancement>
        <Tooltip content={tooltip} relationship="label">
        <Button
          appearance="transparent"
          icon={ icon}
          aria-label="Delete"
          onClick={() => {
            setDialogOpen(true);
          }}
        />
        </Tooltip>
      </DialogTrigger>
      <DialogSurface aria-describedby={undefined}>
        <DialogBody>
          <DialogTitle>{tooltip}确认</DialogTitle>
          <DialogContent>确认要{tooltip}吗? {tooltip}后无法恢复</DialogContent>
          <DialogActions>
            <Button
              appearance="secondary"
              onClick={() => {
                setDialogOpen(false);
              }}
            >
              返回
            </Button>
            <Button
              appearance="primary"
              onClick={deleteClick}
              style={{ backgroundColor: "#D13438", color: "white" }}
            >
              确认{tooltip}
            </Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
};
