import {
  makeStyles,
  Card,
  CardHeader,
  Accordion,
  AccordionToggleEventHandler,
  Divider,
  Text,
  Subtitle2,
  Tag,
} from "@fluentui/react-components";
import {
  bundleIcon,
  DismissCircleFilled,
  DismissCircleRegular,
} from "@fluentui/react-icons";
import React, { useEffect, useState } from "react";
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
const TotalTimeElapsed = ({
  createDatetime,
}: {
  createDatetime?: string | null;
}) => {
  const [elapsedTime, setElapsedTime] = useState<string>(toNow(createDatetime));

  useEffect(() => {
    const intervalId = setInterval(() => {
      setElapsedTime(toNow(createDatetime)); // 每秒更新状态
    }, 1000);

    return () => clearInterval(intervalId);
  }, [createDatetime]);

  return <Text size={200}>执行耗时 {elapsedTime}</Text>;
};
export const TrainTaskLogPage = () => {
  const { id } = useParams();
  const styles = useStyles();
  const [openItems, setOpenItems] = React.useState<string[]>([]);
  const [pos, setPos] = React.useState<{
    requirements: number;
    train: number;
    [key: string]: number;
  }>({
    requirements: 0,
    train: 0,
    venv: 0,
  });
  const [content, setContent] = React.useState<{
    requirements: string[];
    train: string[];
    [key: string]: string[];
  }>({
    requirements: [],
    train: [],
    venv: [],
  });
  const handleToggle: AccordionToggleEventHandler<string> = (event, data) => {
    setOpenItems(data.openItems);
  };
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
  const aiLogDetailQuery = useQuery({
    queryKey: [`trainLogDetail_${id}`],
    queryFn: () => {
      if (openItems.length == 0) {
        return trainTaskLogDetail(id, "venv", 0);
      }
      const logType = openItems[0];
      return trainTaskLogDetail(id, logType, pos[logType]);
    },
    staleTime: 0,
  });
  const queryClient = useQueryClient();
  useEffect(() => {
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
    const interval2Id = setInterval(() => {
      if (openItems.length > 0) {
        queryClient.refetchQueries({
          queryKey: [`trainLogDetail_${id}`],
          exact: true,
        });
        setPos({
          ...pos,
          [openItems[0]]: aiLogDetailQuery.data?.data?.pos ?? 0,
        });
        if (aiLogDetailQuery.data?.data?.lines){
          setContent({
            ...content,
            [openItems[0]]: [
              ...content[openItems[0]],
              ...(aiLogDetailQuery.data?.data?.lines ?? []),
            ],
          });
        }
      }
    }, 3000);
    return () => {
      clearInterval(intervalId);
      clearInterval(interval2Id);
      clearInterval(interval3Id);
    };
  }, []);
  // const navigate = useNavigate();
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
                  ) : (
                    <TotalTimeElapsed
                      createDatetime={
                        aiLogQuery.data?.data?.venv_start_datetime
                      }
                    ></TotalTimeElapsed>
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
          <Accordion
            openItems={openItems}
            onToggle={handleToggle} 
            collapsible
          >
            <TrainTaskLogAccordion
              status={aiLogQuery.data?.data?.venv}
              seconds={aiLogQuery.data?.data?.venv_seconds}
              name="创建虚拟环境"
              value="venv"
              openItems={openItems}
            ></TrainTaskLogAccordion>
            <TrainTaskLogAccordion
              status={aiLogQuery.data?.data?.requirements}
              seconds={aiLogQuery.data?.data?.requirements_seconds}
              name="安装依赖"
              value="requirements"
              openItems={openItems}
              content={content["requirements"]}
            ></TrainTaskLogAccordion>
            <TrainTaskLogAccordion
              status={aiLogQuery.data?.data?.train}
              seconds={aiLogQuery.data?.data?.train_seconds}
              name="模型训练"
              value="train"
              openItems={openItems}
              content={content["train"]}
            ></TrainTaskLogAccordion>
          </Accordion>
        </div>
      </div>
    </Card>
  );
};

export default TrainTaskLogPage;
