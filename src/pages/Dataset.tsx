import { Button, Card, makeStyles } from "@fluentui/react-components";
import DataSetCard from "../components/DataSetCard";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { datasetList } from "../utils/api/DataSet";
import { DataSetAdd } from "../components/DataSetAdd";
import { ArrowClockwiseRegular } from "@fluentui/react-icons";
const useStyles = makeStyles({
  toolBar: {
    width: "100%",
  },
  toolCardBar: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    gap: "16px",
  },
  cardContainer: {
    padding: "16px",
    flexDirection: "row",
    display: "flex",
    flexWrap: "wrap",
    gap: "16px",
    alignItems: "flex-start",
    alignContent: "flex-start",
  },
});
export const DataSetPage = () => {
  const styles = useStyles();
  const queryClient = useQueryClient();
  const datasetQuery = useQuery({
    queryKey: ["datasets"],
    queryFn: datasetList,
    staleTime: 0,
  });
  return (
    <div className={styles.toolBar}>
      <Card className={styles.toolCardBar}>
        <DataSetAdd />
        <Button
          icon={<ArrowClockwiseRegular />}
          onClick={() =>
            queryClient.refetchQueries({ queryKey: ["datasets"], exact: true })
          }
        >
          刷新
        </Button>
      </Card>
      <div className={styles.cardContainer}>
        {datasetQuery.data?.data?.data?.map((dataset) => (
          <DataSetCard dataset={dataset} />
        ))}
      </div>
    </div>
  );
};

export default DataSetPage;
