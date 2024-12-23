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
  InfoLabel,
  Textarea,
  TextareaOnChangeData,
  tokens,
} from "@fluentui/react-components";
import {
  AddSquareFilled,
  AddSquareRegular,
  bundleIcon,
} from "@fluentui/react-icons";
import { ChangeEvent } from "react";
import { useNotification } from "../utils/notification/Notification";
import { useQueryClient } from "@tanstack/react-query";
import {
  aiFileSimpleList,
  aiPlanCreate,
  aiPlanTemplateList,
} from "../utils/api/AiModel";
import { ArgData, StartupData } from "../utils/api/models/PlanTemplate";
import { ModelId } from "../utils/api/models/Base";
import { AiModelFile } from "../utils/api/models/AiModelFile";
import { CustomArg } from "./CustomArg";
const AddButtonIcon = bundleIcon(AddSquareFilled, AddSquareRegular);
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
    alignItems: "center",
    display: "flex",
    gap: "4px",
  },
  textArea: {
    minHeight: "200px",
    fontSize: "12px",
  },
  container: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    rowGap: tokens.spacingVerticalS,
  },
  containerTop: {
    display: "flex",
    flexDirection: "column",
    overflowY: "auto",
    rowGap: tokens.spacingVerticalM,
  },
  containerOut: {
    width: "100%",
    display: "flex",
    gap: tokens.spacingHorizontalS,
  },
  containerAfter: {
    background: tokens.colorBrandBackground2Pressed,
    borderRadius: "2px",
    bottom: "0",
    content: "",
    left: "10px",
    // position: "absolute",
    top: "0",
    transition: "0.3s",
    width: "4px",
    ":hover": {
      background: tokens.colorBrandBackground,
    },
  },
});

interface AiModelPlanAddProps {
  itemId: number;
}
export const AiModelPlanAdd: React.FC<AiModelPlanAddProps> = ({ itemId }) => {
  const styles = useStyles();
  const { showNotification } = useNotification();

  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [useTemplate, setUseTemplate] = React.useState(false);
  const [template, setTemplate] = React.useState<{
    args: ArgData[];
    startup: StartupData;
  }>();
  const [submiting, setSubmiting] = React.useState(false);
  const [args, setArgs] = React.useState<ArgData[]>([]);
  const [files, setFiles] = React.useState<AiModelFile[]>([]);
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
    } else if (template) {
      const { args, startup } = template;
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
    setSubmiting(true);
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
          setUseTemplate(false);
          queryClient.refetchQueries({ queryKey: ["aiPlans"], exact: true });
        } else {
          showNotification(resp.msg, "error");
        }
      })
      .catch((reason: Error) => {
        showNotification(reason.message, "error");
      });
    ev.preventDefault();
    setSubmiting(false);
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
    ev: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    data: InputOnChangeData | TextareaOnChangeData
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

  const start = () => {
    aiPlanTemplateList(itemId)
      .then((resp) => {
        if (resp.code === 200 && resp.data) {
          setTemplate({
            args: resp.data.args,
            startup: resp.data.startup,
          });
        } else {
          showNotification(resp.msg, "error");
        }
      })
      .catch((reason: Error) => {
        showNotification(reason.message, "error");
      });
    aiFileSimpleList(itemId)
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
  return (
    <Dialog modalType="modal" open={dialogOpen}>
      <DialogTrigger disableButtonEnhancement>
        <ToolbarButton
          onClick={() => {
            setDialogOpen(true);
            start();
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
                info="使用${参数名称}来使用脚本参数"
              >
                脚本
              </InfoLabel>
              <Textarea
                resize="vertical"
                disabled={!formData.startup.allow_modify}
                required
                textarea={{ className: styles.textArea }}
                name="startup"
                value={formData.startup.value}
                onChange={handleChange}
                id={"startup"}
              />
              <InfoLabel
                required
                htmlFor={"args"}
                info={
                  <div>
                    若使用请添加
                    <div>{"environment {"}</div>
                    <div>{"#CUSTOM_ENV_ARGS#"}</div>
                    <div>{"}"}</div>
                  </div>
                }
              >
                脚本参数
              </InfoLabel>
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
              <Button type="submit" disabled={submiting} appearance="primary">
                {submiting ? "提交中" : "提交"}
              </Button>
            </DialogActions>
          </DialogBody>
        </form>
      </DialogSurface>
    </Dialog>
  );
};
