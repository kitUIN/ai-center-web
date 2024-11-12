import React, { useState } from "react";
import {
  Card,
  CardHeader,
  Menu,
  MenuTrigger,
  MenuPopover,
  MenuList,
  MenuItem,
  Tooltip,
  Button,
  Body1,
  Text,
  Caption1,
  PresenceBadge,
  makeStyles,
  mergeClasses,
  tokens,
  Dialog,
  DialogSurface,
  DialogBody,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@fluentui/react-components";
import {
  CheckmarkCircleFilled,
  ErrorCircleFilled,
  LightbulbFilamentFilled,
  HistoryFilled,
  CalendarDateFilled,
  SettingsFilled,
  DeleteFilled,
  MoreHorizontalFilled,
} from "@fluentui/react-icons";
import { datasetDelete } from "../utils/api/DataSet";
import { useNotification } from "../utils/notification/Notification";
import { useQueryClient } from "@tanstack/react-query";
import { DataSet } from "../utils/api/models/DataSet";

interface ProjectCardProps {
  dataset: DataSet;
}
const useStyles = makeStyles({
  card: {
    width: "360px",
    maxWidth: "100%",
    height: "fit-content",
    cursor: "pointer",
    borderRadius: "10px",
    padding: "14px 20px",
  },
  moreButton: {
    "&:hover": {
      backgroundColor: "#d5dbed",
    },
  },
  flex: {
    gap: "4px",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  ellipsisText: {
    display: "block",
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
  },
  footerDateTime: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  caption: {
    color: tokens.colorNeutralForeground3,
  },
  deleteMenuItem: {
    color: "#d13438",
  },

  footer: { gap: "12px", justifyContent: "space-between" },
});
const handleMenuClick = (event: React.MouseEvent) => {
  event.stopPropagation();
};
const DataSetCard: React.FC<ProjectCardProps> = ({ dataset }) => {
  const styles = useStyles();
  const queryClient = useQueryClient();
  const { showNotification } = useNotification();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleMenuItemClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    window.open(dataset.settings_url, "_blank", "noopener,noreferrer");
  };
  const openInNewTab = () => {
    window.open(dataset.middle_url, "_blank", "noopener,noreferrer");
  };
  const handleMenuItemDeleteClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    setIsDialogOpen(true);
  };
  const closeDialog = (event: React.MouseEvent) => {
    setIsDialogOpen(false);
    event.stopPropagation();
  };
  const deteleClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    datasetDelete(dataset.id).then((resp) => {
      if (resp.code === 200) {
        setIsDialogOpen(false);
        showNotification(resp.msg, "success");
        queryClient.refetchQueries({ queryKey: ["datasets"], exact: true });
      } else {
        showNotification(resp.msg, "error");
      }
    });
  };

  return (
    <>
      <Card className={styles.card} onClick={openInNewTab}>
        <CardHeader
          header={
            <Tooltip content={dataset.name} relationship="label">
              <div style={{ width: "200px" }}>
                <Text weight="semibold" className={styles.ellipsisText}>
                  {dataset.name}
                </Text>
              </div>
            </Tooltip>
          }
          description={
            <Tooltip content={dataset.description} relationship="label">
              <div style={{ width: "230px" }}>
                <Caption1
                  className={mergeClasses(styles.caption, styles.ellipsisText)}
                >
                  {dataset.description}
                </Caption1>
              </div>
            </Tooltip>
          }
          action={
            <div className={styles.flex}>
              <Tooltip
                content={dataset.status ? "标注完成" : "进行中"}
                relationship="label"
              >
                <PresenceBadge status={dataset.status ? "available" : "away"} />
              </Tooltip>
              <Body1>{`${dataset.finished_task_number}/${dataset.task_number}`}</Body1>
              <Menu>
                <MenuTrigger disableButtonEnhancement>
                  <Tooltip content="更多操作" relationship="label">
                    <Button
                      className={styles.moreButton}
                      onClick={handleMenuClick}
                      appearance="transparent"
                      icon={<MoreHorizontalFilled />}
                      aria-label="More options"
                    />
                  </Tooltip>
                </MenuTrigger>
                <MenuPopover>
                  <MenuList>
                    <MenuItem
                      onClick={handleMenuItemClick}
                      icon={<SettingsFilled />}
                    >
                      设置
                    </MenuItem>
                    <MenuItem
                      onClick={handleMenuItemDeleteClick}
                      className={styles.deleteMenuItem}
                      icon={<DeleteFilled className={styles.deleteMenuItem} />}
                    >
                      删除
                    </MenuItem>
                  </MenuList>
                </MenuPopover>
              </Menu>
            </div>
          }
        />

        <footer className={mergeClasses(styles.flex, styles.footer)}>
          <div className={styles.flex}>
            <CheckmarkCircleFilled primaryFill="#13A10E" fontSize="20px" />
            <Body1>{dataset.total_annotations_number}</Body1>
          </div>
          <div className={styles.flex}>
            <ErrorCircleFilled primaryFill="#D13438" fontSize="20px" />
            <Body1>{dataset.skipped_annotations_number}</Body1>
          </div>
          <div className={styles.flex}>
            <LightbulbFilamentFilled primaryFill="#677ED4" fontSize="20px" />
            <Body1>{dataset.total_predictions_number}</Body1>
          </div>
          <div>
            <Tooltip content="创建时间" relationship="label">
              <div className={styles.footerDateTime}>
                <CalendarDateFilled primaryFill="#6B6860" fontSize={18} />
                <Text>{dataset.create_datetime}</Text>
              </div>
            </Tooltip>
            <Tooltip content="更新时间" relationship="label">
              <div className={styles.footerDateTime}>
                <HistoryFilled primaryFill="#6B6860" fontSize={18} />
                <Text>{dataset.update_datetime}</Text>
              </div>
            </Tooltip>
          </div>
        </footer>
      </Card>
      {isDialogOpen && (
        <Dialog modalType="alert" open={isDialogOpen}>
          <DialogSurface>
            <DialogBody>
              <DialogTitle>删除确认</DialogTitle>
              <DialogContent>确认要删除吗? 删除后无法恢复</DialogContent>
              <DialogActions>
                <Button appearance="secondary" onClick={closeDialog}>
                  取消
                </Button>
                <Button
                  appearance="primary"
                  onClick={deteleClick}
                  style={{ backgroundColor: "#D13438", color: "white" }}
                >
                  确认删除
                </Button>
              </DialogActions>
            </DialogBody>
          </DialogSurface>
        </Dialog>
      )}
    </>
  );
};

export default DataSetCard;
