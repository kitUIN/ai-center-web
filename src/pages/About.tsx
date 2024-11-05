import * as React from "react";
import {
  makeStyles,
  Button,
  Caption1,
  Text,
  tokens,
  Subtitle1,
  Body1,
  mergeClasses,
  PresenceBadge,
  CardFooter,
  Tooltip,
  MenuTrigger,
  MenuPopover,
  Menu,
  MenuItem,
  MenuList,
} from "@fluentui/react-components";
import {
  AlertUrgent16Filled,
  Attach16Regular,
  CheckmarkCircle16Regular,
  CheckmarkCircleFilled,
  CircleHalfFill16Regular,
  Comment16Regular,
  EditFilled,
  ErrorCircleFilled,
  HistoryFilled,
  LightbulbFilamentFilled,
  MoreHorizontal20Regular,
  Open16Regular,
} from "@fluentui/react-icons";
import { Card, CardHeader, CardPreview } from "@fluentui/react-components";

const resolveAsset = (asset: string) => {
  const ASSET_URL =
    "https://raw.githubusercontent.com/microsoft/fluentui/master/packages/react-components/react-card/stories/src/assets/";

  return `${ASSET_URL}${asset}`;
};

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

  labels: { gap: "6px" },

  footer: { gap: "12px", justifyContent: "space-between" },
  caption: {
    color: tokens.colorNeutralForeground3,
  },

  text: { margin: "0" },
});

const Title = ({ children }: React.PropsWithChildren<{}>) => {
  const styles = useStyles();

  return (
    <Subtitle1 as="h4" block className={styles.title}>
      {children}
    </Subtitle1>
  );
};

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
              <Caption1 className={styles.caption}>这是测试项目</Caption1>
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
              <div className={styles.flex}>
                <HistoryFilled primaryFill="#6B6860" />
                <Text>2024-11-05 14:22:20</Text>
              </div>

              <div className={styles.flex}>
                <EditFilled primaryFill="#6B6860" />
                <Text color="#6B6860">2024-11-05 16:22:20</Text>
              </div>
            </div>
          </footer>
        </Card>
      </section>

      <section className={styles.section}>
        <Title>'horizontal'</Title>
        <p>With image as part of preview</p>

        <Card className={styles.card} orientation="horizontal">
          <CardPreview className={styles.horizontalCardImage}>
            <img
              className={styles.horizontalCardImage}
              src={resolveAsset("app_logo.svg")}
              alt="App Name Document"
            />
          </CardPreview>

          <CardHeader
            header={<Text weight="semibold">App Name</Text>}
            description={
              <Caption1 className={styles.caption}>Developer</Caption1>
            }
            action={
              <Button
                appearance="transparent"
                icon={<MoreHorizontal20Regular />}
                aria-label="More options"
              />
            }
          />
        </Card>
      </section>
    </div>
  );
};
export default About;
