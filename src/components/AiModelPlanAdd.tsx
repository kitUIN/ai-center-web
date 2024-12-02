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
import {
  aiFileSimpleList,
  aiPlanCreate,
  aiPlanTemplateList,
} from "../utils/api/AiModel";
import { ArgData, StartupData } from "../utils/api/models/PlanTemplate";
import { ModelId } from "../utils/api/models/Base";
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

  const aiPlanTemplateQuery = useQuery({
    queryKey: ["aiPlanTemplate"],
    queryFn: () => aiPlanTemplateList(itemId),
    staleTime: 0,
  });
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [useTemplate, setUseTemplate] = React.useState(false);
  const [args, setArgs] = React.useState<ArgData[]>([]);
  const defaultAiModelPlan: {
    name: string;
    startup: StartupData;
    requirements?: ModelId;
  } = {
    name: "",
    startup: {
      value: "",
      allow_modify: true,
    },
    requirements: null,
  };
  const [formData, setFormData] = React.useState(defaultAiModelPlan);
  const changeTemplate = () => {
    if (useTemplate) {
      setFormData({
        ...formData,
        ["startup"]: {
          value: "",
          allow_modify: true,
        },
      });
      setArgs([]);
    } else if (aiPlanTemplateQuery.data?.data) {
      const { args, startup } = aiPlanTemplateQuery.data.data;
      setFormData({
        ...formData,
        ["startup"]: startup,
      });
      setArgs(args);
    }
    setUseTemplate(!useTemplate);
  };
  const handleSubmit = (ev: React.FormEvent) => {
    const { name, startup, requirements } = formData;
    aiPlanCreate(itemId, {
      name: name,
      startup: startup.value,
      ai_model: itemId,
      id: null,
      requirements: requirements,
      create_datetime: null,
      update_datetime: null,
      args: JSON.stringify(args),
    })
      .then((resp) => {
        if (resp.code === 200) {
          showNotification(resp.msg, "success");
          setDialogOpen(false);
          setFormData(defaultAiModelPlan);
          setArgs([]);
          setUseTemplate(false)
          queryClient.refetchQueries({ queryKey: ["aiPlans"], exact: true });
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
  const handleChange = (
    ev: ChangeEvent<HTMLInputElement>,
    data: InputOnChangeData
  ) => {
    const { name } = ev.target;
    let vData: string | StartupData = "";
    if (name === "startup") {
      vData = {
        ...formData.startup,
        ["value"]: data.value,
      };
    } else {
      vData = data.value;
    }
    setFormData({
      ...formData,
      [name]: vData,
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
              <Label htmlFor={"requirements"}>依赖文件requirements.txt</Label>
              <Combobox
                value={aiFileQuery.data?.data?.find(i=>i.id == formData.requirements)?.file || ""}
                onOptionSelect={(_e, data) => {
                  setFormData({
                    ...formData,
                    ["requirements"]: data.optionValue,
                  });
                }}
                style={{ width: "100%" }}
              >
                {aiFileQuery.data?.data?.map((fileItem) => (
                  <Option
                    key={fileItem.id}
                    value={`${fileItem.id}`}
                    checkIcon={<CheckmarkCircleRegular />}
                  >{`${fileItem.file_name} #${fileItem.id}`}</Option>
                ))}
              </Combobox>
              <InfoLabel
                required
                htmlFor={"startup"}
                info="使用{命令参数名称}来使用命令参数"
              >
                启动命令
              </InfoLabel>
              <Input
                disabled={!formData.startup.allow_modify}
                required
                name="startup"
                value={formData.startup.value}
                onChange={handleChange}
                id={"startup"}
              />
              <Label htmlFor={"args"}>启动参数</Label>
              {args.map((item) => (
                <div key={item.id} className={styles.args}>
                  <div style={{ position: "relative", minWidth: "80px" }}>
                    <Input
                      disabled={!item.allow_modify}
                      required
                      style={{ minWidth: "80px", maxWidth: "80px" }}
                      value={item.name}
                      name={`${item.id}`}
                      onChange={handleArgNameChange}
                    />
                    {item.info && (
                      <InfoLabel
                        info={item.info}
                        style={{
                          position: "absolute",
                          top: 0,
                          right: 0,
                          zIndex: 5,
                        }}
                      />
                    )}
                  </div>

                  <Select
                    disabled={!item.allow_modify}
                    onChange={(_event, data) => {
                      setArgs((prevArgs) =>
                        prevArgs.map((arg) =>
                          arg.id === item.id
                            ? {
                                ...arg,
                                ["type"]:
                                  data.value === "file" ? "file" : "string",
                              }
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
                          key={fileItem.id}
                          value={`#${fileItem.id}`}
                          checkIcon={<CheckmarkCircleRegular />}
                        >{`${fileItem.file_name} #${fileItem.id}`}</Option>
                      ))}
                    </Combobox>
                  )}

                  <Button
                    disabled={!item.allow_modify}
                    icon={<DeleteDismissIcon />}
                    onClick={() => handleDeleteArg(item.id)}
                  ></Button>
                </div>
              ))}
              <Button onClick={handleAddArg}>新增参数</Button>
            </DialogContent>

            <DialogActions>
              <Button onClick={changeTemplate}>
                {useTemplate ? "使用自定义" : "使用模板"}
              </Button>
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
