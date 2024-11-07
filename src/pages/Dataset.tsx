import { 
  makeStyles,
} from "@fluentui/react-components";
import DataSetCard from "../components/DataSetCard";
 
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

  return (
    <div className={styles.cardContainer}>
      <DataSetCard
        title="Project Test #1"
        description="这是测试项目"
        progress="45/50"
        status="away"
        completed={5}
        failed={0}
        predictions={0}
        createdAt="2024-11-05 14:22:20"
        editedAt="2024-11-05 16:22:20"
        onClick={() => {
          alert("测试跳转");
        }}
      />{" "}
      <DataSetCard
        title="Project Test #1"
        description="这是测试项目"
        progress="45/50"
        status="away"
        completed={5}
        failed={0}
        predictions={0}
        createdAt="2024-11-05 14:22:20"
        editedAt="2024-11-05 16:22:20"
        onClick={() => {
          alert("测试跳转");
        }}
      />
      <DataSetCard
        title="Project Test #1"
        description="这是测试项目"
        progress="45/50"
        status="away"
        completed={5}
        failed={0}
        predictions={0}
        createdAt="2024-11-05 14:22:20"
        editedAt="2024-11-05 16:22:20"
        onClick={() => {
          alert("测试跳转");
        }}
      />
      <DataSetCard
        title="Project Test #1"
        description="这是测试项目"
        progress="45/50"
        status="away"
        completed={5}
        failed={0}
        predictions={0}
        createdAt="2024-11-05 14:22:20"
        editedAt="2024-11-05 16:22:20"
        onClick={() => {
          alert("测试跳转");
        }}
      />
      <DataSetCard
        title="Project Test #1"
        description="这是测试项目"
        progress="45/50"
        status="away"
        completed={5}
        failed={0}
        predictions={0}
        createdAt="2024-11-05 14:22:20"
        editedAt="2024-11-05 16:22:20"
        onClick={() => {
          alert("测试跳转");
        }}
      />
    </div>
  );
};

export default DataSetPage;
