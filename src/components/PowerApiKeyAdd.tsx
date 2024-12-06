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
  makeStyles,
  tokens,
  PopoverSurface,
  PopoverTrigger,
  Popover,
} from "@fluentui/react-components";
import {
  bundleIcon,
  KeyFilled,
  KeyRegular,
  CopyFilled,
  DeleteFilled,
  DeleteRegular,
  CopyRegular,
} from "@fluentui/react-icons";
import { useNotification } from "../utils/notification/Notification";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ModelId } from "../utils/api/models/Base";
import {
  aiPowerApiKey,
  aiPowerApiKeyCreate,
  aiPowerApiKeyDelete,
} from "../utils/api/AiModelPower";

const KeyIcon = bundleIcon(KeyFilled, KeyRegular);
const CopyIcon = bundleIcon(CopyFilled, CopyRegular);
const DeleteIcon = bundleIcon(DeleteFilled, DeleteRegular);

interface PowerApiKeyAddProps {
  powerId: ModelId;
}
const useStyles = makeStyles({
  root: {
    overflowY: "auto",
    maxHeight: "400px",
    marginTop: "20px",
    marginBottom: "20px",
  },
  apiKeyLine: {
    borderRadius: "4px",
    padding: "6px",
    display: "flex",
    alignItems: "center",
    ":hover": {
      color: tokens.colorNeutralForeground3BrandSelected,
      background: tokens.colorNeutralBackground1Hover,
    },
    justifyContent: "space-between",
  },
});
export const PowerApiKeyAdd: React.FC<PowerApiKeyAddProps> = ({ powerId }) => {
  const styles = useStyles();
  const { showNotification } = useNotification();

  const queryClient = useQueryClient();
  const apiKeyQuery = useQuery({
    queryKey: [`apiKey_${powerId}`],
    queryFn: () => aiPowerApiKey(powerId),
    staleTime: 0,
  });
  const addKey = () => {
    aiPowerApiKeyCreate(powerId)
      .then((resp) => {
        if (resp.code === 200) {
          showNotification(resp.msg, "success");
          queryClient.refetchQueries({
            queryKey: [`apiKey_${powerId}`],
            exact: true,
          });
        } else {
          showNotification(resp.msg, "error");
        }
      })
      .catch((reason: Error) => {
        showNotification(reason.message, "error");
      });
  };
  const deleteKey = (apiKey: string) => {
    aiPowerApiKeyDelete(powerId, apiKey)
      .then((resp) => {
        if (resp.code === 200) {
          showNotification(resp.msg, "success");
          queryClient.refetchQueries({
            queryKey: [`apiKey_${powerId}`],
            exact: true,
          });
        } else {
          showNotification(resp.msg, "error");
        }
      })
      .catch((reason: Error) => {
        showNotification(reason.message, "error");
      });
  };
  const [dialogOpen, setDialogOpen] = React.useState(false);
  return (
    <Dialog modalType="modal" open={dialogOpen}>
      <DialogTrigger disableButtonEnhancement>
        <Tooltip content="ApiKey设置" relationship="label">
          <ToolbarButton
            icon={<KeyIcon />}
            aria-label="Play"
            onClick={() => {
              setDialogOpen(true);
            }}
          >
            ApiKey设置
          </ToolbarButton>
        </Tooltip>
      </DialogTrigger>
      <DialogSurface aria-describedby={undefined}>
        <DialogBody>
          <DialogTitle>ApiKey设置</DialogTitle>
          <DialogContent className={styles.root}>
            {apiKeyQuery.data?.data?.map((item) => (
              <div className={styles.apiKeyLine}>
                <span>{item.id}</span>
                <div style={{ display: "flex" }}>
                  <Tooltip content="点击复制" relationship="label">
                    <ToolbarButton
                      icon={<CopyIcon />}
                      aria-label="Copy"
                      onClick={async () => {
                        try {
                          await navigator.clipboard.writeText(`${item.id}`);
                          showNotification("复制成功", "success");
                        } catch (err) {
                          console.error("复制失败", err);
                          showNotification("复制失败", "error");
                        }
                      }}
                    ></ToolbarButton>
                  </Tooltip>

                  <Tooltip content="删除" relationship="label">
                    <Popover withArrow>
                      <PopoverTrigger disableButtonEnhancement>
                        <Button
                          appearance="transparent"
                          icon={<DeleteIcon></DeleteIcon>}
                          aria-label="Delete"
                          onClick={() => {
                            setDialogOpen(true);
                          }}
                        ></Button>
                      </PopoverTrigger>

                      <PopoverSurface>
                        <div style={{ marginBottom: "12px" }}>
                          确定删除吗?该操作不可逆
                        </div>
                        <div>
                          <Button
                            style={{
                              backgroundColor: "#D13438",
                              color: "white",
                            }}
                            onClick={() => deleteKey(`${item.id}`)}
                          >
                            确定删除
                          </Button>
                        </div>
                      </PopoverSurface>
                    </Popover>
                  </Tooltip>
                </div>
              </div>
            ))}
          </DialogContent>
          <DialogActions>
            <Button appearance="secondary" onClick={() => addKey()}>
              新增
            </Button>
            <Button
              appearance="secondary"
              onClick={() => {
                setDialogOpen(false);
              }}
            >
              返回
            </Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
};
