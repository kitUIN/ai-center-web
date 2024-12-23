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
  makeStyles,
  Label,
  Tooltip,
  tokens,
} from "@fluentui/react-components";
import {
  bundleIcon,
  SettingsFilled,
  SettingsRegular,
} from "@fluentui/react-icons";
import { useNotification } from "../utils/notification/Notification";
import { useQueryClient } from "@tanstack/react-query";
import { aiFileSimpleList } from "../utils/api/AiModel";
import { ArgData } from "../utils/api/models/PlanTemplate";
import { aiPowerArgs, aiPowerArgsUpdate } from "../utils/api/AiModelPower";
import { ModelId } from "../utils/api/models/Base";
import { CustomArg } from "./CustomArg";
import { AiModelFile } from "../utils/api/models/AiModelFile";
const SettingsIcon = bundleIcon(SettingsFilled, SettingsRegular);
const useStyles = makeStyles({
  content: {
    display: "flex",
    flexDirection: "column",
    rowGap: "10px",
  },
  argDropdown: {
    width: "30px",
  },
  args: {
    display: "flex",
    gap: "4px",
  },
  textArea: {
    minHeight: "200px",
    fontSize: "12px",
  },
  containerTop: {
    display: "flex",
    flexDirection: "column",
    overflowY: "auto",
    rowGap: tokens.spacingVerticalM,
  },
});

interface AiPowerArgsUpdateProps {
  itemId: ModelId;
  aiId: ModelId;
}
export const AiPowerArgsUpdate: React.FC<AiPowerArgsUpdateProps> = ({
  itemId,
  aiId,
}) => {
  const styles = useStyles();
  const { showNotification } = useNotification();

  const queryClient = useQueryClient();

  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [args, setArgs] = React.useState<ArgData[]>([]);
  const [files, setFiles] = React.useState<AiModelFile[]>([]);
  const handleSubmit = (ev: React.FormEvent) => {
    aiPowerArgsUpdate(itemId, JSON.stringify(args))
      .then((resp) => {
        if (resp.code === 200) {
          showNotification(resp.msg, "success");
          setDialogOpen(false);
          setArgs([]);
          queryClient.refetchQueries({ queryKey: ["aiPowers"], exact: true });
        } else {
          showNotification(resp.msg, "error");
        }
      })
      .catch((reason: Error) => {
        showNotification(reason.message, "error");
      });
    ev.preventDefault();
  };

  const start = () => {
    aiPowerArgs(itemId)
      .then((resp) => {
        if (resp.code === 200 && resp.data) {
          setArgs(resp.data);
        } else {
          showNotification(resp.msg, "error");
        }
      })
      .catch((reason: Error) => {
        showNotification(reason.message, "error");
      });
    aiFileSimpleList(aiId)
      .then((resp) => {
        if (resp.code === 200 && resp.data) {
          setFiles(resp.data);
        } else {
          showNotification(resp.msg, "error");
        }
      })
      .catch((reason: Error) => {
        showNotification(reason.message, "error");
      });
  };
  const handleAddArg = () => {
    const c = args.length > 0 ? args[args.length - 1].id + 1 : 1;
    setArgs([
      ...args,
      {
        id: c,
        name: `arg_${c}`,
        value: "",
        type: "string",
        allow_modify: true,
      },
    ]);
  };

  return (
    <Dialog modalType="modal" open={dialogOpen}>
      <DialogTrigger disableButtonEnhancement>
        <Tooltip content="配置" relationship="label">
          <Button
            appearance="transparent"
            icon={<SettingsIcon />}
            aria-label="config"
            onClick={async () => {
              setDialogOpen(true);
              start();
            }}
          />
        </Tooltip>
      </DialogTrigger>
      <DialogSurface aria-describedby={undefined}>
        <form onSubmit={handleSubmit}>
          <DialogBody>
            <DialogTitle>配置参数</DialogTitle>
            <DialogContent className={styles.content}>
              <Label htmlFor={"args"}>配置参数</Label>
              <div className={styles.containerTop}>
                {args.map((item) => (
                  <CustomArg
                    key={item.id}
                    item={item}
                    files={files}
                    setArgs={setArgs}
                  ></CustomArg>
                ))}
              </div>
              <Button onClick={handleAddArg}>新增参数</Button>
            </DialogContent>

            <DialogActions>
              <DialogTrigger disableButtonEnhancement>
                <Button
                  appearance="secondary"
                  onClick={() => {
                    setDialogOpen(false);
                  }}
                >
                  取消
                </Button>
              </DialogTrigger>
              <Button type="submit" appearance="primary">
                提交
              </Button>
            </DialogActions>
          </DialogBody>
        </form>
      </DialogSurface>
    </Dialog>
  );
};
