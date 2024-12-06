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
import { aiPowerDetail } from "../utils/api/AiModelPower";
import { PowerApiKeyAdd } from "../components/PowerApiKeyAdd";

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
            <div>
              {detailQuery.data?.data?.name}
            </div>
           }
        />
        <Divider className={styles.divider} />
        <div className={styles.header}>
          <PowerApiKeyAdd powerId={id}/>
        </div>
      </div>
    </Card>
  );
};

export default AiPowerDetailPage;
