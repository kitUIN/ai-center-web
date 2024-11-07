import React from "react";
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

// 定义组件属性类型
interface ProjectCardProps {
  title: string;
  description: string;
  progress: string;
  status: boolean;
  completed: number;
  failed: number;
  predictions: number;
  createdAt: string;
  editedAt: string;
  onClick: () => void;
}
const useStyles = makeStyles({
  card: {
    width: "360px",
    maxWidth: "100%",
    height: "fit-content",
    cursor: "pointer", 
    borderRadius: '10px',
    padding:"14px 20px"
  },
  moreButton: { 
    '&:hover': {
      backgroundColor: '#d5dbed',
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
const DataSetCard: React.FC<ProjectCardProps> = ({
  title,
  description,
  progress,
  status,
  completed,
  failed,
  predictions,
  createdAt,
  editedAt,
  onClick,
}) => {
  const styles = useStyles();
  const handleMenuItemClick = (event: React.MouseEvent) => {
    event.stopPropagation(); // 阻止事件冒泡，防止触发 Card 的点击事件
  };

  return (
    <Card className={styles.card} onClick={onClick}>
      <CardHeader
        header={
          <Tooltip content={title} relationship="label">
            <div style={{ width: "200px" }}>
              <Text weight="semibold" className={styles.ellipsisText}>
                {title}
              </Text>
            </div>
          </Tooltip>
        }
        description={
          <Tooltip content={description} relationship="label">
            <div style={{ width: "230px" }}>
              <Caption1
                className={mergeClasses(styles.caption, styles.ellipsisText)}
              >
                {description}
              </Caption1>
            </div>
          </Tooltip>
        }
        action={
          <div className={styles.flex}>
            <Tooltip content={status? "标注完成" : "进行中"} relationship="label">
              <PresenceBadge status={status? "available" : "away"} />
            </Tooltip>
            <Body1>{progress}</Body1>
            <Menu>
              <MenuTrigger disableButtonEnhancement>
                <Tooltip content="更多操作" relationship="label">
                  <Button className={styles.moreButton}
                    onClick={handleMenuClick}
                    appearance="transparent"
                    icon={<MoreHorizontalFilled />}
                    aria-label="More options"
                  />
                </Tooltip>
              </MenuTrigger>
              <MenuPopover>
                <MenuList>
                  <MenuItem icon={<SettingsFilled />}>设置</MenuItem>
                  <MenuItem
                    onClick={handleMenuItemClick}
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
          <Body1>{completed}</Body1>
        </div>
        <div className={styles.flex}>
          <ErrorCircleFilled primaryFill="#D13438" fontSize="20px" />
          <Body1>{failed}</Body1>
        </div>
        <div className={styles.flex}>
          <LightbulbFilamentFilled primaryFill="#677ED4" fontSize="20px" />
          <Body1>{predictions}</Body1>
        </div>
        <div>
          <Tooltip content="创建时间" relationship="label">
            <div className={styles.footerDateTime}>
              <CalendarDateFilled primaryFill="#6B6860" fontSize={18} />
              <Text>{createdAt}</Text>
            </div>
          </Tooltip>
          <Tooltip content="更新时间" relationship="label">
            <div className={styles.footerDateTime}>
              <HistoryFilled primaryFill="#6B6860" fontSize={18} />
              <Text>{editedAt}</Text>
            </div>
          </Tooltip>
        </div>
      </footer>
    </Card>
  );
};

export default DataSetCard;
