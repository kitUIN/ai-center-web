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
import { bundleIcon, PlayFilled, PlayRegular } from "@fluentui/react-icons";
import { useNotification } from "../utils/notification/Notification";
import { useQueryClient } from "@tanstack/react-query";
import { BaseModel, ModelId } from "../utils/api/models/Base";
import { DetailResponse } from "../utils/api/BaseFetch";

const PlayIcon = bundleIcon(PlayFilled, PlayRegular);

interface StartTaskButtonProps {
  planId: ModelId;
}
export const StartTaskButton: React.FC<StartTaskButtonProps> = ({ planId }) => {
  // const styles = useStyles();
  const { showNotification } = useNotification();

  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const startClick = (event: React.MouseEvent) => {
    event.stopPropagation();
  };

  return (
    <Dialog modalType="modal" open={dialogOpen}>
      <DialogTrigger disableButtonEnhancement>
        <Tooltip content="启动任务" relationship="label">
          <Button
            appearance="transparent"
            icon={<PlayIcon />}
            aria-label="Play"
            onClick={() => {
              setDialogOpen(true);
            }}
          />
        </Tooltip>
      </DialogTrigger>
      <DialogSurface aria-describedby={undefined}>
        <DialogBody>
          <DialogTitle>提交确认</DialogTitle>
          <DialogContent>确认要执行该计划吗?</DialogContent>
          <DialogActions>
            <Button
              appearance="secondary"
              onClick={() => {
                setDialogOpen(false);
              }}
            >
              取消
            </Button>
            <Button appearance="primary" onClick={startClick}>
              确认执行
            </Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
};
