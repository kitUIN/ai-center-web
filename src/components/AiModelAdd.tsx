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
  ToolbarButton,
} from "@fluentui/react-components";
import {
  AddSquareFilled,
  AddSquareRegular,
  bundleIcon,
} from "@fluentui/react-icons";
import { ChangeEvent } from "react";
import { useNotification } from "../utils/notification/Notification";
import { useQueryClient } from "@tanstack/react-query";
import { aiCreate } from "../utils/api/AiModel";
import { defaultAiModel } from "../utils/api/models/AiModel";
const AddButtonIcon = bundleIcon(AddSquareFilled, AddSquareRegular);
const useStyles = makeStyles({
  content: {
    display: "flex",
    flexDirection: "column",
    rowGap: "10px",
  },
});

export const AiModelAdd = () => {
  const styles = useStyles();
  const { showNotification } = useNotification();

  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [formData, setFormData] = React.useState(defaultAiModel);
  const handleSubmit = (ev: React.FormEvent) => {
    aiCreate(formData).then((resp) => {
      if (resp.code === 200) {
        showNotification(resp.msg, 'success');
        setDialogOpen(false);
        setFormData({
          ...formData,
          ["name"]: "",
        });
        queryClient.refetchQueries({ queryKey: ["aimodels"], exact: true })
      } else {
        showNotification(resp.msg, 'error');
      }
    }).catch((reason:Error) =>{
      showNotification(reason.message, 'error');
    });
    ev.preventDefault();
  };
  const handleChange = (
    ev: ChangeEvent<HTMLInputElement>,
    data: InputOnChangeData
  ) => {
    const { name } = ev.target;
    setFormData({
      ...formData,
      [name]: data.value || "",
    });
  };

  return (
    <Dialog modalType="modal" open={dialogOpen}>
      <DialogTrigger disableButtonEnhancement>
        <ToolbarButton
          onClick={() => {
            setDialogOpen(true);
          }}
          icon={<AddButtonIcon />}
        >
          新建
        </ToolbarButton>
      </DialogTrigger>
      <DialogSurface aria-describedby={undefined}>
        <form onSubmit={handleSubmit}>
          <DialogBody>
            <DialogTitle>新增模型</DialogTitle>
            <DialogContent className={styles.content}>
              <Label required htmlFor={"name"}>
                模型名称
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
