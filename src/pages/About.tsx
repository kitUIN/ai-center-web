import {
  makeStyles,
  Button,
  Caption1,
  Text,
  tokens,
  Body1,
  mergeClasses,
  PresenceBadge,
  Tooltip,
  MenuTrigger,
  MenuPopover,
  Menu,
  MenuItem,
  MenuList,
} from "@fluentui/react-components";
import {
  CalendarDateFilled,
  CheckmarkCircleFilled,
  ErrorCircleFilled,
  HistoryFilled,
  LightbulbFilamentFilled,
  MoreHorizontal20Regular,
} from "@fluentui/react-icons";
import { Card, CardHeader } from "@fluentui/react-components";
import DataSetCard from "../components/DataSetCard";

 
const useStyles = makeStyles({
  main: {
    gap: "36px",
    display: "flex",
    flexDirection: "column",
    flexWrap: "wrap",
  },

  card: {
    width: "360px",
    maxWidth: "100%",
    height: "fit-content",
  },

  section: {
    width: "fit-content",
  },

  title: { margin: "0 0 12px" },

  horizontalCardImage: {
    width: "64px",
    height: "64px",
  },

  headerImage: {
    borderRadius: "4px",
    maxWidth: "44px",
    maxHeight: "44px",
  },
  flex: {
    gap: "4px",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  
  footerDateTime: { 
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  labels: { gap: "6px" },

  footer: { gap: "12px", justifyContent: "space-between" },
  caption: {
    display: "block",
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    color: tokens.colorNeutralForeground3,
  },

  text: { margin: "0" },
});
 
export const About = () => {
  const styles = useStyles();

  return (
    <div className={styles.main}>
      <section className={styles.section}>
        <Card className={styles.card}>
          <CardHeader
            header={
              <>
                <Text weight="semibold">Project Test #1</Text>
              </>
            }
            description={
              <Tooltip content="进行中" relationship="label">
                                <div style={{"width":"230px"}}>
                <Caption1 className={styles.caption}>这是测试项目122222222222222222222222222222222222222222222222222222222222222222222222222222222</Caption1>
                </div>
                </Tooltip>

            }
            action={
              <div className={styles.flex}>
                <Tooltip content="进行中" relationship="label">
                  <PresenceBadge status="away" />
                </Tooltip>

                <Body1>45/50</Body1>

                <Menu>
                  <MenuTrigger disableButtonEnhancement>
                    <Tooltip content="更多操作" relationship="label">
                      <Button
                        appearance="transparent"
                        icon={<MoreHorizontal20Regular />}
                        aria-label="More options"
                      />
                    </Tooltip>
                  </MenuTrigger>
                  <MenuPopover>
                    <MenuList>
                      <MenuItem>Item a</MenuItem>
                      <MenuItem>Item b</MenuItem>
                    </MenuList>
                  </MenuPopover>
                </Menu>
              </div>
            }
          />

          <footer className={mergeClasses(styles.flex, styles.footer)}>
            <div className={styles.flex}>
              <CheckmarkCircleFilled primaryFill="#13A10E" fontSize="20px" />
              <Body1>5</Body1>
            </div>
            <div className={styles.flex}>
              <ErrorCircleFilled primaryFill="#D13438" fontSize="20px" />
              <Body1>0</Body1>
            </div>

            <div className={styles.flex}>
              <LightbulbFilamentFilled primaryFill="#677ED4" fontSize="20px" />
              <Body1>0</Body1>
            </div>
            <div>
              
              <Tooltip content="创建时间" relationship="label">
              <div className={styles.footerDateTime}>
                <CalendarDateFilled primaryFill="#6B6860" fontSize={18}/>
                <Text>2024-11-05 14:22:20</Text>
              </div>
                </Tooltip>
                <Tooltip content="更新时间" relationship="label">
              <div className={styles.footerDateTime}>
              <HistoryFilled primaryFill="#6B6860" fontSize={18} />
              <Text color="#6B6860">2024-11-05 16:22:20</Text>
              </div>
                </Tooltip>
 
            </div>
          </footer>
        </Card>
      </section>

      <section className={styles.section}>
        <DataSetCard
        id="222"
        title="Project Test #1"
        description="这是测试项目"
        progress="45/50"
        status={true}
        completed={5}
        failed={0}
        predictions={0}
        createdAt="2024-11-05 14:22:20"
        editedAt="2024-11-05 16:22:20"
        onClick={()=>{alert("测试跳转")}}
      />
      </section>
    </div>
  );
};
export default About;
