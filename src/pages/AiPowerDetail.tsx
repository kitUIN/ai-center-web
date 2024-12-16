import {
  makeStyles,
  Card,
  CardHeader,
  Accordion,
  Divider,
  Text,
  Subtitle2,
  Tag,
  AccordionToggleEventHandler,
  Body1,
} from "@fluentui/react-components";
import {
  bundleIcon,
  DismissCircleFilled,
  DismissCircleRegular,
} from "@fluentui/react-icons";
import React, { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
// import { useNavigate } from "react-router-dom";
import {
  trainTaskDelete,
  trainTaskDetail,
  trainTaskLog,
  trainTaskLogDetail,
} from "../utils/api/TrainTask";
import { useParams } from "react-router-dom";
import { TrainTaskLogAccordion } from "../components/TrainTaskLogAccordion";
import { secondsToString, toNow } from "../utils/DateUtils";
import { DeleteButton } from "../components/DeleteButton";
import { aiPowerDetail } from "../utils/api/AiModelPower";
import { PowerApiKeyAdd } from "../components/PowerApiKeyAdd";
import "../scss/0e5d75f9db3e818a.css";
import CodeBox from "../components/CodeBox";
import Code from "../components/Code";
import { DataGridToolBar } from "../components/DataGridToolBar";
const useStyles = makeStyles({
  card: {
    display: "flex",
    justifyContent: "space-between",
    justifyItems: "center",
    margin: "auto",
    padding: "10px 20px",
    width: "96%",
    height: "96%",
  },
  cardHeader: {
    display: "flex",
    width: "100%",
    marginTop: "6px",
    alignItems: "center",
    justifyContent: "space-between",
  },
  header: {
    overflowY: "auto",
    padding: "1rem 1.5rem",
    maxHeight: "100%",
  },
  divider: {
    margin: "10px 0px",
  },
});

const DismissCircleIcon = bundleIcon(DismissCircleFilled, DismissCircleRegular);

export const AiPowerDetailPage = () => {
  const { id } = useParams();
  const styles = useStyles();
  const queryClient = useQueryClient();
  const detailQuery = useQuery({
    queryKey: [`aiPowerDetail_${id}`],
    queryFn: () => aiPowerDetail(id),
    staleTime: 0,
  });
  // const navigate = useNavigate();

  return (
    <Card className={styles.card}>
      <div style={{ height: "90%" }}>
        <CardHeader
          header={
            <div className={styles.cardHeader}>
              <Body1>
                <b>{detailQuery.data?.data?.name}</b>
              </Body1>
              <DataGridToolBar
                showRefresh={false}
                surface={<PowerApiKeyAdd powerId={id} />}
              />
            </div>
          }
        />
        <Divider className={styles.divider} />
        <div className={styles.header}>
          <div style={{ maxWidth: "50rem" }}>
            <h3>Base URL</h3>
            <CodeBox copyValue="https://api/v1">https://api/v1</CodeBox>
            <h3>Authentication</h3>
            <p style={{ margin: "1.5rem 0rem" }}>
              Dify Service API 使用 <Code>API-Key</Code> 进行鉴权。
              <i>
                <strong>
                  强烈建议开发者把 <Code>API-Key</Code>
                  放在后端存储，而非分享或者放在客户端存储，以免
                  <Code>API-Key</Code> 泄露，导致财产损失。
                </strong>
              </i>
              所有 API 请求都应在
              <strong>
                <Code>Authorization</Code>
              </strong>
              HTTP Header 中包含您的 <Code>API-Key</Code>，如下所示：
            </p>
            <CodeBox copyValue={"Authorization: Bearer {API_KEY}"}>
              {"Authorization: Bearer {API_KEY}"}
            </CodeBox>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default AiPowerDetailPage;
