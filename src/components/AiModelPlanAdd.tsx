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
  Option,
  Combobox,
  Select,
  InfoLabel,
} from "@fluentui/react-components";
import {
  AddSquareFilled,
  AddSquareRegular,
  bundleIcon,
  CheckmarkCircleRegular,
  DeleteDismissFilled,
  DeleteDismissRegular,
} from "@fluentui/react-icons";
import { ChangeEvent } from "react";
import { useNotification } from "../utils/notification/Notification";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AiModelPlan } from "../utils/api/models/AiModelPlan";
import { aiFileSimpleList, aiPlanCreate } from "../utils/api/AiModel";
const AddButtonIcon = bundleIcon(AddSquareFilled, AddSquareRegular);
const DeleteDismissIcon = bundleIcon(DeleteDismissFilled, DeleteDismissRegular);
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
});
interface ArgObj {
  id: number;
  name: string;
  value: string;
  type: string;
}
interface AiModelPlanAddProps {
  itemId: number;
}
export const AiModelPlanAdd: React.FC<AiModelPlanAddProps> = ({ itemId }) => {
  const styles = useStyles();
  const { showNotification } = useNotification();

  const queryClient = useQueryClient();
  const aiFileQuery = useQuery({
    queryKey: ["aifilesAdd"],
    queryFn: () => aiFileSimpleList(itemId),
    staleTime: 0,
  });
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [args, setArgs] = React.useState<ArgObj[]>([]);
  const defaultAiModelPlan: AiModelPlan = {
    name: "",
    create_datetime: null,
    update_datetime: null,
    id: null,
    ai_model: null,
    startup: "",
    args: "{}",
  };
  const [formData, setFormData] = React.useState(defaultAiModelPlan);
  const handleSubmit = (ev: React.FormEvent) => {
    const data = { ...formData };
    data.args = JSON.stringify(args);
    aiPlanCreate(itemId, data)
      .then((resp) => {
        if (resp.code === 200) {
          showNotification(resp.msg, "success");
          setDialogOpen(false);
          setFormData(defaultAiModelPlan);
          setArgs([]);
          queryClient.refetchQueries({ queryKey: ["aiplans"], exact: true });
        } else {
          showNotification(resp.msg, "error");
        }
      })
      .catch((reason: Error) => {
        showNotification(reason.message, "error");
      });
    ev.preventDefault();
  };
  const handleDeleteArg = (id: number) => {
    setArgs((prevArgs) => prevArgs.filter((arg) => arg.id !== id));
  };
  const handleAddArg = () => {
    const c = args.length > 0 ? args[args.length - 1].id + 1 : 1;
    setArgs([...args, { id: c, name: `arg_${c}`, value: "", type: "string" }]);
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
  const handleArgValueChange = (
    ev: ChangeEvent<HTMLInputElement>,
    data: InputOnChangeData
  ) => {
    handleArgChange(ev, data, "value");
  };
  const handleArgNameChange = (
    ev: ChangeEvent<HTMLInputElement>,
    data: InputOnChangeData
  ) => {
    handleArgChange(ev, data, "name");
  };

  const handleArgChange = (
    ev: ChangeEvent<HTMLInputElement>,
    data: InputOnChangeData,
    argName: string
  ) => {
    const { name } = ev.target;
    const targetId = Number(name);
    setArgs((prevArgs) =>
      prevArgs.map((arg) =>
        arg.id === targetId ? { ...arg, [argName]: data.value } : arg
      )
    );
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
          新增
        </ToolbarButton>
      </DialogTrigger>
      <DialogSurface aria-describedby={undefined}>
        <form onSubmit={handleSubmit}>
          <DialogBody>
            <DialogTitle>新增训练计划</DialogTitle>
            <DialogContent className={styles.content}>
              <Label required htmlFor={"name"}>
                训练计划名称
              </Label>
              <Input
                required
                name="name"
                value={formData.name}
                onChange={handleChange}
                id={"name"}
              />
              <InfoLabel
                required
                htmlFor={"startup"}
                info="使用{命令参数名称}来使用命令参数"
              >
                启动命令
              </InfoLabel>
              <Input
                required
                name="startup"
                value={formData.startup}
                onChange={handleChange}
                id={"startup"}
              />
              <Label htmlFor={"args"}>启动参数</Label>
              {args.map((item) => (
                <div key={item.id} className={styles.args}>
                  <Input
                    required
                    style={{ minWidth: "80px", maxWidth: "80px" }}
                    value={item.name}
                    name={`${item.id}`}
                    onChange={handleArgNameChange}
                  />
                  <Select
                    onChange={(_event, data) => {
                      setArgs((prevArgs) =>
                        prevArgs.map((arg) =>
                          arg.id === item.id
                            ? { ...arg, ["type"]: data.value ?? "string" }
                            : arg
                        )
                      );
                    }}
                    value={item.type || "string"}
                    style={{ minWidth: "80px", maxWidth: "80px" }}
                  >
                    <option key="string" value="string">
                      字符
                    </option>
                    <option key="file" value="file">
                      文件
                    </option>
                  </Select>
                  {item.type == "string" ? (
                    <Input
                      style={{ width: "100%" }}
                      required
                      name={`${item.id}`}
                      value={item.value}
                      onChange={handleArgValueChange}
                    />
                  ) : (
                    <Combobox
                      value={item.value || ""}
                      onOptionSelect={(_e, data) => {
                        setArgs((prevArgs) =>
                          prevArgs.map((arg) =>
                            arg.id === item.id
                              ? {
                                  ...arg,
                                  ["value"]: data.optionText ?? "",
                                }
                              : arg
                          )
                        );
                      }}
                      style={{ width: "100%" }}
                    >
                      {aiFileQuery.data?.data?.map((fileItem) => (
                        <Option
                          value={`#${fileItem.id}`}
                          checkIcon={<CheckmarkCircleRegular />}
                        >{`${fileItem.file_name} #${fileItem.id}`}</Option>
                      ))}
                    </Combobox>
                  )}

                  <Button
                    icon={<DeleteDismissIcon />}
                    onClick={() => handleDeleteArg(item.id)}
                  ></Button>
                </div>
              ))}
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
