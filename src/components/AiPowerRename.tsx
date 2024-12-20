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
  Input,
  InputOnChangeData,
  TextareaOnChangeData,
  Tooltip,
} from "@fluentui/react-components";
import {
  bundleIcon,
  RenameFilled,
  RenameRegular,
} from "@fluentui/react-icons";
import { ChangeEvent } from "react";
import { useNotification } from "../utils/notification/Notification";
import { useQueryClient } from "@tanstack/react-query";
import { AiModelPower } from "../utils/api/models/AiModelPower";
import { aiPowerUpdate } from "../utils/api/AiModelPower";
import { ModelId } from "../utils/api/models/Base";
const RenameIcon = bundleIcon(RenameFilled, RenameRegular);
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
});

interface AiPowerRenameProps {
  itemId: ModelId;
  item: AiModelPower;
}
export const AiPowerRename: React.FC<AiPowerRenameProps> = ({
  itemId,
  item,
}) => {
  const styles = useStyles();
  const { showNotification } = useNotification();

  const queryClient = useQueryClient();

  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [formData, setFormData] = React.useState(item);
  const handleSubmit = (ev: React.FormEvent) => {
    aiPowerUpdate(itemId, formData)
      .then((resp) => {
        if (resp.code === 200) {
          showNotification(resp.msg, "success");
          setDialogOpen(false);
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
  const handleChange = (
    ev: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    data: InputOnChangeData | TextareaOnChangeData
  ) => {
    const { name } = ev.target;
    setFormData({
      ...formData,
      [name]: data.value,
    });
  };

  return (
    <Dialog modalType="modal" open={dialogOpen}>
      <DialogTrigger disableButtonEnhancement>
        <Tooltip content="重命名" relationship="label">
          <Button
            appearance="transparent"
            icon={<RenameIcon />}
            aria-label="Rename"
            onClick={() => {
              setDialogOpen(true);
            }}
          />
        </Tooltip>
      </DialogTrigger>
      <DialogSurface aria-describedby={undefined}>
        <form onSubmit={handleSubmit}>
          <DialogBody>
            <DialogTitle>重命名</DialogTitle>
            <DialogContent className={styles.content}>
              <Label required htmlFor={"name"}>
                重命名
              </Label>

              <Input
                required
                name="name"
                value={formData.name}
                onChange={handleChange}
                id={"name"}
              />
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
