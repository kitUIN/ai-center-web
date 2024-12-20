import {
  makeStyles,
  Card,
  CardHeader,
  Divider,
  Body1,
  Tag,
  Text,
  Subtitle1,
  Tooltip,
  ToolbarButton,
} from "@fluentui/react-components";
import remarkGfm from "remark-gfm";
import { useQuery } from "@tanstack/react-query";
// import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { aiPowerDetail } from "../utils/api/AiModelPower";
import { PowerApiKeyAdd } from "../components/PowerApiKeyAdd";
import CodeBox from "../components/CodeBox";
import Code from "../components/Code";
import { DataGridToolBar } from "../components/DataGridToolBar";
import ReactMarkdown from "react-markdown";
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

export const AiPowerDetailPage = () => {
  const { id } = useParams();
  const styles = useStyles();
  // const queryClient = useQueryClient();
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
                surface={
                  <>
                    <Tooltip content="状态" relationship="label">
                      <ToolbarButton
                        // icon={<KeyIcon />}
                        aria-label="Play"
                      >
                        状态:{" "}
                        {detailQuery.data?.data?.configured
                          ? "运行中"
                          : "未配置"}
                      </ToolbarButton>
                    </Tooltip>
                    <PowerApiKeyAdd powerId={id} />
                  </>
                }
              />
            </div>
          }
        />
        <Divider className={styles.divider} />
        <div className={styles.header}>
          <div style={{ maxWidth: "50rem", marginBottom: "3rem" }}>
            <h3>Base URL</h3>
            <CodeBox>http://localhost:8000/api/v1</CodeBox>
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
            <CodeBox>{"Authorization: Bearer {API_KEY}"}</CodeBox>
            <h2
              style={{
                marginBottom: "2rem",
              }}
            >
              API
            </h2>
            {detailQuery.data?.data?.doc.map((item) => {
              return (
                <div>
                  <div>
                    <div
                      style={{
                        display: "flex",
                        gap: "8px",
                        alignItems: "center",
                        marginBottom: "4px",
                        marginTop: "10px",
                      }}
                    >
                      <Tag size="small" shape="circular" appearance="brand">
                        {item.method}
                      </Tag>
                      <Text style={{ color: "#a1a1aa" }}>{item.api}</Text>
                    </div>
                    <Subtitle1>{item.name}</Subtitle1>
                  </div>
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      code(props) {
                        const { className, node, ...rest } = props;
                        console.log(node);
                        if (className) {
                          return <CodeBox {...rest}></CodeBox>;
                        }
                        return <Code {...rest} />;
                      },
                    }}
                  >{`
${item.description}
#### Content Type

- \`${item.content_type}\`

#### Request Body

${item.request_body}

#### Response

${item.response_body}

`}</ReactMarkdown>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default AiPowerDetailPage;
