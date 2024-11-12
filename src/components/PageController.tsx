import {
  Badge,
  CounterBadge,
  makeStyles,
  tokens,
  Tooltip,
} from "@fluentui/react-components";
import { MoreHorizontalFilled } from "@fluentui/react-icons";
interface PagesProps {
  currentPage: number;
  totalPages: number;
  toPage: (to: number) => void;
}
const useStyles = makeStyles({
  pages: {
    alignItems: "center",
    gap: "2px",
    display: "flex",
    justifyContent: "center",
  },
  cardContainer: {
    marginTop: "16px",
    gap: "16px",
    alignItems: "center",
    display: "flex",
    justifyContent: "center",
  },
  clickableBadge: {
    cursor: "pointer",
    ":hover": {
      backgroundColor: tokens.colorNeutralBackground3Pressed,
      boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
    },
  },
  nonClickableBadge: {
    cursor: "default",
  },
});

const PageController: React.FC<PagesProps> = ({
  currentPage,
  totalPages,
  toPage,
}) => {
  const styles = useStyles();
  const badges = [];
  const showCount = 2; // 前后显示多少
  const minPage = 1;
  const moreToPage = 5; // 省略号跳几页
  const start = currentPage > showCount + 1 ? currentPage - showCount : minPage;
  for (
    let index = start;
    index <= totalPages && index <= currentPage + showCount;
    index++
  ) {
    badges.push(index);
  }

  return (
    <div className={styles.cardContainer}>
      <div className={styles.pages}>
        {currentPage - showCount > minPage && (
          <Tooltip content={`第${minPage}页`} relationship={"label"}>
            <CounterBadge
              className={styles.clickableBadge}
              onClick={() => toPage(minPage)}
              appearance="filled"
              color="informative"
              count={minPage}
            ></CounterBadge>
          </Tooltip>
        )}
        {currentPage - showCount - 1 > minPage && (
          <Tooltip content={`向前${moreToPage}页`} relationship={"label"}>
            <Badge
              className={styles.clickableBadge}
              onClick={() =>
                toPage(
                  currentPage - moreToPage > minPage
                    ? currentPage - moreToPage
                    : minPage
                )
              }
              color="informative"
              icon={<MoreHorizontalFilled />}
            />
          </Tooltip>
        )}
        {badges.map((num) => (
          <Tooltip content={`第${num}页`} relationship={"label"}>
            <CounterBadge
              className={
                currentPage === num
                  ? styles.nonClickableBadge
                  : styles.clickableBadge
              }
              appearance="filled"
              color={currentPage === num ? "brand" : "informative"}
              count={num}
              onClick={() => (currentPage === num ? {} : toPage(num))}
            />
          </Tooltip>
        ))}
        {currentPage + showCount + 1 < totalPages && (
          <Tooltip content={`向后${moreToPage}页`} relationship={"label"}>
            <Badge
              className={styles.clickableBadge}
              onClick={() =>
                toPage(
                  currentPage + moreToPage < totalPages
                    ? currentPage + moreToPage
                    : totalPages
                )
              }
              color="informative"
              icon={<MoreHorizontalFilled />}
            />
          </Tooltip>
        )}
        {currentPage + showCount < totalPages && (
          <Tooltip content={`第${totalPages}页`} relationship={"label"}>
            <CounterBadge
              className={styles.clickableBadge}
              appearance="filled"
              color="informative"
              count={totalPages}
              onClick={() => toPage(totalPages)}
            />
          </Tooltip>
        )}
      </div>
    </div>
  );
};
export default PageController;
