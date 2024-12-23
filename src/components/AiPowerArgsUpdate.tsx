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
  Option,
  Combobox,
  Select,
  InfoLabel,
  Tooltip,
} from "@fluentui/react-components";
import {
  bundleIcon,
  CheckmarkCircleRegular,
  DeleteDismissFilled,
  DeleteDismissRegular,
  SettingsFilled,
  SettingsRegular,
  InfoFilled,
  InfoRegular,
} from "@fluentui/react-icons";
import { ChangeEvent } from "react";
import { useNotification } from "../utils/notification/Notification";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { aiFileSimpleList } from "../utils/api/AiModel";
import { ArgData } from "../utils/api/models/PlanTemplate";
import { aiPowerArgs, aiPowerArgsUpdate } from "../utils/api/AiModelPower";
import { ModelId } from "../utils/api/models/Base";
const SettingsIcon = bundleIcon(SettingsFilled, SettingsRegular);
const InfoIcon = bundleIcon(InfoFilled, InfoRegular);
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
  textArea: {
    minHeight: "200px",
    fontSize: "12px",
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

  const aiFileQuery = useQuery({
    queryKey: [`aifilesAdd_${aiId}`],
    queryFn: () => aiFileSimpleList(aiId),
    staleTime: 0,
  });
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [args, setArgs] = React.useState<ArgData[]>([]);
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
        <Tooltip content="配置" relationship="label">
          <Button
            appearance="transparent"
            icon={<SettingsIcon />}
            aria-label="config"
            onClick={async () => {
              setDialogOpen(true);
              const response = await aiPowerArgs(itemId);
              if (response.data) {
                setArgs(response.data);
              }
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
              {args.map((item) => (
                <div key={item.id} className={styles.args}>
                  {item.info && <InfoLabel info={item.info} />}
                  <div style={{ position: "relative", minWidth: "80px" }}>
                    <Input
                      disabled={!item.allow_modify}
                      required
                      style={{ minWidth: "80px", maxWidth: "80px" }}
                      value={item.name}
                      name={`${item.id}`}
                      onChange={handleArgNameChange}
                    />
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
