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
  useComboboxFilter,
  ComboboxProps,
  Text,
  Image,
  Combobox,
} from "@fluentui/react-components";
import {
  AddSquareFilled,
  AddSquareRegular,
  bundleIcon,
} from "@fluentui/react-icons";
import { ChangeEvent } from "react";
import { useNotification } from "../utils/notification/Notification";
import { useQueryClient, UseQueryResult } from "@tanstack/react-query";
import { aiCreate } from "../utils/api/AiModel";
import { defaultAiModel } from "../utils/api/models/AiModel";
import { SimpleTagBox } from "./SimpleTagBox";
import { DetailResponse } from "../utils/api/BaseFetch";
import { PluginModel } from "../utils/api/models/PluginModel";
const AddButtonIcon = bundleIcon(AddSquareFilled, AddSquareRegular);
const useStyles = makeStyles({
  content: {
    display: "flex",
    flexDirection: "column",
    rowGap: "10px",
  },
  keyCombo: {
    display: "flex",
    justifyContent: "center",
    gap: "4px",
  },
});
interface AiModelAddProps {
  pluginList: UseQueryResult<DetailResponse<PluginModel[]>, Error>;
}
export const AiModelAdd: React.FC<AiModelAddProps> = ({pluginList}) => {
  const styles = useStyles();
  const { showNotification } = useNotification();
  const comboId = React.useId();
  //   const queryClient = useQueryClient();

  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [selectedOptions, setSelectedOptions] = React.useState<string[]>([]);
  const [formData, setFormData] = React.useState(defaultAiModel);
  const [query, setQuery] = React.useState<string>("");

  React.useEffect(() => {
    setFormData({
      ...formData,
      ["tags"]: selectedOptions,
    });
  }, [selectedOptions]);

  const options =
    pluginList.data?.data?.map((item) => {
      return {
        children: (
          <div className={styles.keyCombo} id={item.key}>
            {item.icon && (
              <Image
                alt="icon"
                src={`/plugin/icon/${item.icon}`}
                height={20}
                width={20}
              />
            )}
            <Text>{item.info}</Text>
          </div>
        ),
        value: item.info ?? "",
      };
    }) ?? [];

  const children = useComboboxFilter(query, options, {
    noOptionsMessage: "没有可选的插件",
  });
  const onOptionSelect: ComboboxProps["onOptionSelect"] = (_e, data) => {
    setQuery(data.optionText ?? "");
    const selectedOption = options.find(
      (option) => option.value === data.optionText
    );
    if (selectedOption) {
      setFormData({
        ...formData,
        ["key"]: selectedOption.children.props.id,
      });
    }
  };
  const handleSubmit = (ev: React.FormEvent) => {
    aiCreate(formData)
      .then((resp) => {
        if (resp.code === 200) {
          showNotification(resp.msg, "success");
          setDialogOpen(false);
          setFormData({
            ...formData,
            ["name"]: "",
          });
          queryClient.refetchQueries({ queryKey: ["aimodels"], exact: true });
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
              <Label required htmlFor={"key"}>
                训练模板
              </Label>
              <Combobox
                required
                onOptionSelect={onOptionSelect}
                aria-labelledby={comboId}
                placeholder="选择插件"
                onChange={(ev) => setQuery(ev.target.value)}
                value={query}
              >
                {children}
              </Combobox>
              <Label htmlFor={"tags"}>标签</Label>
              <SimpleTagBox
                selectedOptions={selectedOptions}
                setSelectedOptions={setSelectedOptions}
              ></SimpleTagBox>
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
