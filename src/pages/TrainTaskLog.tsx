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
    maxHeight: "100%",
  },
  divider: {
    margin: "10px 0px",
  },
});

const DismissCircleIcon = bundleIcon(DismissCircleFilled, DismissCircleRegular);

export const TrainTaskLogPage = () => {
  const { id } = useParams();
  const styles = useStyles();
  const [openItems, setOpenItems] = React.useState<string[]>([]);
  const [content, setContent] = React.useState<{
    [key: string]: {
      pos: number;
      lines: string[];
    };
  }>({});
  const aiQuery = useQuery({
    queryKey: [`trainDetail_${id}`],
    queryFn: () => trainTaskDetail(id),
    staleTime: 0,
  });
  const aiLogQuery = useQuery({
    queryKey: [`trainDetailLog_${id}`],
    queryFn: () => trainTaskLog(id),
    staleTime: 0,
  });
  useQuery({
    queryKey: [`trainLogDetail_${id}`],
    queryFn: async () => {
      const logType = openItems[0] ?? "venv";
      const response = await trainTaskLogDetail(id, logType, content[logType]?.pos ?? 0)
      if (response.data?.log_type && response.data?.lines) {
        const n = {
          ...content,
          [logType]: {
            pos: response.data?.pos ?? 0,
            lines: [
              ...(content[logType]?.lines ?? []),
              ...(response.data?.lines ?? []),
            ],
          },
        };
        setContent(n);
      }
      return response;
    } ,
    staleTime: 0,
  });
  const queryClient = useQueryClient();
   
   
  useEffect(() => {
    const interval2Id = setInterval(() => {
      queryClient.refetchQueries({
        queryKey: [`trainLogDetail_${id}`],
        exact: true,
      });
    }, 3000);
    const intervalId = setInterval(() => {
      queryClient.refetchQueries({
        queryKey: [`trainDetailLog_${id}`],
        exact: true,
      });
    }, 1000);
    const interval3Id = setInterval(() => {
      queryClient.refetchQueries({
        queryKey: [`trainDetail_${id}`],
        exact: true,
      });
    }, 1000);

    return () => {
      clearInterval(intervalId);
      clearInterval(interval2Id);
      clearInterval(interval3Id);
    };
  }, []);
  // const navigate = useNavigate();
  const handleToggle: AccordionToggleEventHandler<string> = (event, data) => {
    setOpenItems(data.openItems);
  };
  return (
    <Card className={styles.card}>
      <div style={{ height: "90%" }}>
        <CardHeader
          header={
            <div className={styles.cardHeader}>
              <Subtitle2>
                <b>{aiQuery.data?.data?.name}</b>
                <div>
                  {aiQuery.data?.data?.status === 3 ? (
                    <Text size={200}>
                      完成于
                      {toNow(aiQuery.data?.data?.finished_datetime, true)}
                      前,执行耗时
                      {secondsToString(
                        aiLogQuery.data?.data?.total_seconds ?? 0
                      )}
                    </Text>
                  ) : aiQuery.data?.data?.status === 2 ? (
                    <Text size={200}>
                      取消于
                      {toNow(aiQuery.data?.data?.update_datetime, true)}
                      前,执行耗时
                      {secondsToString(
                        aiLogQuery.data?.data?.total_seconds ?? 0
                      )}
                    </Text>
                  ) : aiQuery.data?.data?.status === 4 ? (
                    <Text size={200}>
                      失败于
                      {toNow(aiQuery.data?.data?.update_datetime, true)}
                      前,执行耗时
                      {secondsToString(
                        aiLogQuery.data?.data?.total_seconds ?? 0
                      )}
                    </Text>
                  ) : (
                    <Text size={200}>
                      创建于
                      {toNow(aiQuery.data?.data?.create_datetime, true)}
                      前,执行耗时
                      {secondsToString(
                        aiLogQuery.data?.data?.total_seconds ?? 0
                      )}
                    </Text>
                  )}
                </div>
              </Subtitle2>
              <div>
                <Tag
                  shape="circular"
                  appearance="brand"
                  style={
                    aiQuery.data?.data?.status === 2 ||
                    aiQuery.data?.data?.status === 4
                      ? { backgroundColor: "#FFF1F0", color: "#CF1322" }
                      : aiQuery.data?.data?.status === 0
                      ? { backgroundColor: "#FFF7E6", color: "#D46B08" }
                      : aiQuery.data?.data?.status === 3
                      ? { backgroundColor: "#F6FFED", color: "#389E0D" }
                      : {}
                  }
                >
                  {aiQuery.data?.data?.running_status}
                </Tag>
                {aiQuery.data?.data?.status !== 2 &&
                aiQuery.data?.data?.status !== 4 ? (
                  <DeleteButton
                    id={id}
                    tooltip="取消任务"
                    icon={<DismissCircleIcon />}
                    // queryKey={["trainTasks"]}
                    deleteReq={trainTaskDelete}
                  />
                ) : (
                  <></>
                )}
              </div>
            </div>
          }
        />
        <Divider className={styles.divider} />
        <div className={styles.header}>
          <Accordion openItems={openItems} collapsible onToggle={handleToggle}>
            {aiLogQuery.data?.data?.steps.map((step) => (
              <TrainTaskLogAccordion
                key={step.id}
                status={step.status}
                seconds={step.seconds}
                name={step.name}
                value={`${step.id}`}
                openItems={openItems}
                content={content[`${step.id}`]?.lines}
                onToggle={setOpenItems}
              />
            ))}
          </Accordion>
        </div>
      </div>
    </Card>
  );
};

export default TrainTaskLogPage;
