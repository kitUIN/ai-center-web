import { 
  makeStyles,
} from "@fluentui/react-components";
import DataSetCard from "../components/DataSetCard";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { datasetList } from "../utils/api/DataSet";
 
const useStyles = makeStyles({
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
  const datasetQuery = useQuery({ queryKey: ['datasets'], queryFn: datasetList });
  return (
    <div className={styles.cardContainer}>
      {datasetQuery.data?.data?.data?.map((dataset) => (
          <DataSetCard
          title={dataset.name}
          description={dataset.description}
          progress={`${dataset.finished_task_number}/${dataset.task_number}`}
          status={dataset.status}
          completed={dataset.total_annotations_number}
          failed={dataset.skipped_annotations_number}
          predictions={dataset.total_predictions_number}
          createdAt={dataset.create_datetime}
          editedAt={dataset.update_datetime}
          onClick={() => {
            alert("测试跳转");
          }}
        />
        ))}
    </div>
  );
};

export default DataSetPage;
