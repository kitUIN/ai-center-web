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
import React, { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
// import { useNavigate } from "react-router-dom";
import { trainTaskDetail, trainTaskLog } from "../utils/api/TrainTask";
import { useParams } from "react-router-dom";
import { TrainTaskLogAccordion } from "../components/TrainTaskLogAccordion";
import { secondsToString, toNow } from "../utils/DateUtils";

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
  
  const [openItems, setOpenItems] = React.useState(["1"]);
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
  const queryClient = useQueryClient();
  useEffect(() => {
    const intervalId = setInterval(() => {
      queryClient.refetchQueries({ queryKey: [`trainDetailLog_${id}`], exact: true });
    }, 1000);

    return () => clearInterval(intervalId);
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
              <Tag
                shape="circular"
                appearance="brand"
                style={
                  (aiQuery.data?.data?.status === 2 || aiQuery.data?.data?.status === 4)
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
            </div>
          }
        />
        <Divider className={styles.divider} />
        <div className={styles.header}>
          <Accordion
            openItems={openItems}
            onToggle={handleToggle}
            multiple
            collapsible
          >
            <TrainTaskLogAccordion
              status={aiLogQuery.data?.data?.venv}
              seconds={aiLogQuery.data?.data?.venv_seconds}
              name="创建虚拟环境"
              value="1"
              openItems={openItems}
            ></TrainTaskLogAccordion>
            <TrainTaskLogAccordion
              status={aiLogQuery.data?.data?.requirements}
              seconds={aiLogQuery.data?.data?.requirements_seconds}
              name="安装依赖"
              value="2"
              openItems={openItems}
            ></TrainTaskLogAccordion>
            <TrainTaskLogAccordion
              status={aiLogQuery.data?.data?.train}
              seconds={aiLogQuery.data?.data?.train_seconds}
              name="模型训练"
              value="3"
              openItems={openItems}
            ></TrainTaskLogAccordion>
          </Accordion>
        </div>
      </div>
    </Card>
  );
};

export default TrainTaskLogPage;
