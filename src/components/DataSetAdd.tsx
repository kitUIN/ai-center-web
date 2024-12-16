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
} from "@fluentui/react-components";
import {
  AddSquareFilled,
  AddSquareRegular,
  bundleIcon,
} from "@fluentui/react-icons";
import { ChangeEvent } from "react";
import { defaultDataSet } from "../utils/api/models/DataSet";
import { datasetCreate } from "../utils/api/DataSet";
import { useNotification } from "../utils/notification/Notification";
import { useQueryClient } from "@tanstack/react-query";
const AddButtonIcon = bundleIcon(AddSquareFilled, AddSquareRegular);
const useStyles = makeStyles({
  content: {
    display: "flex",
    flexDirection: "column",
    rowGap: "10px",
  },
});

export const DataSetAdd = () => {
  const styles = useStyles();
  const { showNotification } = useNotification();
  

  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [formData, setFormData] = React.useState(defaultDataSet);
  const handleSubmit = (ev: React.FormEvent) => {
    datasetCreate(formData).then((resp) => {
      if (resp.code === 200) {
        showNotification(resp.msg, 'success');
        setDialogOpen(false);
        setFormData({
          ...formData,
          ["name"]: "",
          ["description"]: "",
        });
        queryClient.refetchQueries({ queryKey: ["datasets"], exact: true })
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
        <Button
          onClick={() => {
            setDialogOpen(true);
          }}
          icon={<AddButtonIcon />}
          style={{ width: "100px" }}
        >
          新建
        </Button>
      </DialogTrigger>
      <DialogSurface aria-describedby={undefined}>
        <form onSubmit={handleSubmit}>
          <DialogBody>
            <DialogTitle>新增数据集</DialogTitle>
            <DialogContent className={styles.content}>
              <Label required htmlFor={"name"}>
                数据集名称
              </Label>
              <Input
                required
                name="name"
                value={formData.name}
                onChange={handleChange}
                id={"name"}
              />
              <Label htmlFor={"description"}>
                数据集描述
              </Label>
              <Input
                name="description"
                value={formData.description}
                onChange={handleChange}
                id={"description"}
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
