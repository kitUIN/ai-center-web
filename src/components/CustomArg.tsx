import * as React from "react";
import {
  Button,
  makeStyles,
  Input,
  InputOnChangeData,
  Option,
  Combobox,
  Select,
  tokens,
} from "@fluentui/react-components";
import { 
  bundleIcon,
  CheckmarkCircleRegular,
  DeleteDismissFilled,
  DeleteDismissRegular,
} from "@fluentui/react-icons";
import { ChangeEvent } from "react";
import { ArgData } from "../utils/api/models/PlanTemplate";
import { AiModelFile } from "../utils/api/models/AiModelFile";
const DeleteDismissIcon = bundleIcon(DeleteDismissFilled, DeleteDismissRegular);
const useStyles = makeStyles({
  args: {
    alignItems: "center",
    display: "flex",
    gap: "4px",
  },
  container: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    rowGap: tokens.spacingVerticalS,
  },

  containerOut: {
    width: "100%",
    display: "flex",
    gap: tokens.spacingHorizontalS,
  },
  containerAfter: {
    borderRadius: "2px",
    bottom: "0",
    content: "",
    left: "10px",
    // position: "absolute",
    top: "0",
    transition: "0.3s",
    width: "4px",
  },
});
interface CustomArgProps {
  item: ArgData;
  files: AiModelFile[];
  setArgs: React.Dispatch<React.SetStateAction<ArgData[]>>;
}
export const CustomArg: React.FC<CustomArgProps> = ({
  item,
  files,
  setArgs,
}) => {
  const styles = useStyles();
  const [isFocused, setIsFocused] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);

  const handleFocus = () => {
    setIsFocused(true);
  };
  const handleBlur = () => {
    setIsFocused(false);
  };
  const handleMouseEnter = () => {
    setIsHovered(true);
  };
  const handleMouseLeave = () => {
    setIsHovered(false);
  };
  const handleDeleteArg = (id: number) => {
    setArgs((prevArgs) => prevArgs.filter((arg) => arg.id !== id));
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
    <div
      className={styles.containerOut}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      tabIndex={0}
    >
      <div
        className={styles.containerAfter}
        style={{
          backgroundColor:
            isFocused || isHovered
              ? tokens.colorBrandBackground
              : tokens.colorBrandBackground2Pressed,
        }}
      ></div>
      <div key={item.id} className={styles.container}>
        <div className={styles.args}>
          <Input
            disabled={!item.allow_modify}
            required
            style={{ width: "100%" }}
            value={item.name}
            name={`${item.id}`}
            onChange={handleArgNameChange}
          />
          <Select
            disabled={!item.allow_modify}
            onChange={(_event, data) => {
              setArgs((prevArgs) =>
                prevArgs.map((arg) =>
                  arg.id === item.id
                    ? {
                        ...arg,
                        ["type"]: data.value === "file" ? "file" : "string",
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
        </div>
        <div className={styles.args}>
          {item.type == "string" ? (
            <Input
              style={{ width: "100%" }}
              required
              placeholder={item.info}
              name={`${item.id}`}
              value={item.value}
              onChange={handleArgValueChange}
            />
          ) : (
            <Combobox
              required
              placeholder={item.info}
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
              {files.map((fileItem) => (
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
      </div>
    </div>
  );
};
