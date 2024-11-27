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
  Combobox,
  useComboboxFilter,
  Text,
  ComboboxProps,
  makeStyles,
  Link,
} from "@fluentui/react-components";
import { bundleIcon, PlayFilled, PlayRegular } from "@fluentui/react-icons";
import { useNotification } from "../utils/notification/Notification";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { trainTaskSimple, trainTaskStart } from "../utils/api/TrainTask";
import { useNavigate } from "react-router-dom";

const PlayIcon = bundleIcon(PlayFilled, PlayRegular);

// interface TrainTaskAddProps {
//   planId: ModelId;
// }
const useStyles = makeStyles({
  comboRoot: {
    // Stack the label above the field with a gap
    display: "grid",
    gridTemplateRows: "repeat(1fr)",
    justifyItems: "start",
    gap: "6px",
    maxWidth: "400px",
  },
});
export const TrainTaskAdd: React.FC = () => {
  const styles = useStyles();
  const { showNotification } = useNotification();

  const comboId = React.useId();
  const queryClient = useQueryClient();
  const aiQuery = useQuery({
    queryKey: ["trainTaskSimple"],
    queryFn: trainTaskSimple,
    staleTime: 0,
  });
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const navigate = useNavigate();
  const [query, setQuery] = React.useState<string>("");
  const options =
    aiQuery.data?.data?.map((item) => {
      return {
        children: <Text id={`${item.id}`}>{item.name}</Text>,
        value: item.name ?? "",
      };
    }) ?? [];

  const children = useComboboxFilter(query, options, {
    noOptionsMessage: "没有可选的计划",
  });
  const onOptionSelect: ComboboxProps["onOptionSelect"] = (_e, data) => {
    setQuery(data.optionText ?? "");
  };
  const handleButtonClick = () => {
    const selectedOption = options.find((option) => option.value === query);
    if (selectedOption) {
      const planId = selectedOption.children.props.id;
      trainTaskStart(planId)
      .then((resp) => {
        if (resp.code === 200) {
          showNotification(resp.msg, "success");
          setQuery("");
          setDialogOpen(false);
          queryClient.refetchQueries({ queryKey: ["trainTasks"], exact: true });
        } else {
          showNotification(resp.msg, "error");
        }
      })
      .catch((reason: Error) => {
        showNotification(reason.message, "error");
      });
    } else {
      showNotification("请先选择计划", "warning");
    }
  };
  return (
    <Dialog modalType="modal" open={dialogOpen}>
      <DialogTrigger disableButtonEnhancement>
        <Tooltip content="启动计划" relationship="label">
          <ToolbarButton
            icon={<PlayIcon />}
            aria-label="Play"
            onClick={() => {
              setDialogOpen(true);
            }}
          >
            启动计划
          </ToolbarButton>
        </Tooltip>
      </DialogTrigger>
      <DialogSurface aria-describedby={undefined}>
        <DialogBody>
          <DialogTitle>启动计划</DialogTitle>
          <DialogContent>
            <div className={styles.comboRoot}>
              <label id={comboId}>请选择需要启动的计划</label>
              <Combobox
                onOptionSelect={onOptionSelect}
                aria-labelledby={comboId}
                placeholder="选择计划"
                onChange={(ev) => setQuery(ev.target.value)}
                value={query}
              >
                {children}
              </Combobox>
              <div>
                没有想要的训练计划?{" "}
                <Link onClick={()=>navigate("/model/ai",{
                    state:{
                        planTip: true
                    }
                })} inline>
                  前往新增
                </Link>{" "}
              </div>
            </div>
          </DialogContent>
          <DialogActions>
            <Button
              appearance="secondary"
              onClick={() => {
                setDialogOpen(false);
              }}
            >
              取消
            </Button>
            <Button appearance="primary" onClick={handleButtonClick}>
              确认执行
            </Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
};
