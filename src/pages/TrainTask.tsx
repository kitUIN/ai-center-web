import {
  bundleIcon,
  PlayFilled,
  PlayRegular,
  BoxCheckmarkFilled,
  BoxCheckmarkRegular,
  DismissCircleFilled,
  DismissCircleRegular,
} from "@fluentui/react-icons";
import {
  TableCellLayout,
  makeStyles,
  Card,
  CardHeader,
  Body1,
  TableBody,
  TableCell,
  TableRow,
  Table,
  TableHeader,
  TableHeaderCell,
  Button,
  useArrowNavigationGroup,
  useFocusableGroup,
  TableColumnId,
  useTableSort,
  useTableFeatures,
  TableColumnDefinition,
  createTableColumn,
  TableColumnSizingOptions,
  useTableColumnSizing_unstable,
  Tooltip,
} from "@fluentui/react-components";
import React, { useEffect } from "react";
import PageController from "../components/PageController";
import { DataGridToolBar } from "../components/DataGridToolBar";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { DeleteButton } from "../components/DeleteButton";
import { useNavigate } from "react-router-dom";
import { trainTaskDelete, trainTaskList } from "../utils/api/TrainTask";
import { TrainTask } from "../utils/api/models/TrainTask";
import RingStatus from "../components/RingStatus";
import { TrainTaskAdd } from "../components/TrainTaskAdd";

const DismissCircleIcon = bundleIcon(DismissCircleFilled, DismissCircleRegular);
const BoxCheckmarkIcon = bundleIcon(BoxCheckmarkFilled, BoxCheckmarkRegular);
const columns: TableColumnDefinition<TrainTask>[] = [
  createTableColumn<TrainTask>({
    columnId: "name",
    compare: (a, b) => {
      return a.name?.localeCompare(b.name ?? "") ?? 1;
    },
  }),
  createTableColumn<TrainTask>({
    columnId: "update_datetime",
    compare: (a, b) => {
      return a.update_datetime?.localeCompare(b.update_datetime!) ?? 1;
    },
  }),
];

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

    alignItems: "center",
    justifyContent: "space-between",
  },
  header: {
    overflowY: "auto",
    maxHeight: "100%",
  },
});

export const TrainTaskPage = () => {
  const styles = useStyles();
  const queryClient = useQueryClient();
  const [current, setCurrent] = React.useState(1);
  const aiQuery = useQuery({
    queryKey: ["trainTasks"],
    queryFn: () => trainTaskList(current),
    staleTime: 0,
  });
  const items = aiQuery.data?.data?.data ?? [];
  const [columnSizingOptions] = React.useState<TableColumnSizingOptions>({
    actions: {
      minWidth: 150,
      defaultWidth: 250,
      idealWidth: 300,
    },
  });
  const {
    getRows,
    columnSizing_unstable,
    sort: { getSortDirection, toggleColumnSort, sort },
  } = useTableFeatures(
    {
      columns,
      items,
    },
    [
      useTableSort({
        defaultSortState: { sortColumn: "name", sortDirection: "ascending" },
      }),
      useTableColumnSizing_unstable({ columnSizingOptions }),
    ]
  );
  const [flag, setFlag] = React.useState(true);
  useEffect(() => {
    if (flag) {
      setFlag(false);
      return;
    }
    queryClient.refetchQueries({
      queryKey: ["trainTasks"],
      exact: true,
    });
    console.log(current);
  }, [current]);
  const headerSortProps = (columnId: TableColumnId) => ({
    onClick: (e: React.MouseEvent) => {
      toggleColumnSort(e, columnId);
    },
    sortDirection: getSortDirection(columnId),
  });

  const rows = sort(getRows());

  const keyboardNavAttr = useArrowNavigationGroup({ axis: "grid" });
  const focusableGroupAttr = useFocusableGroup({
    tabBehavior: "limited-trap-focus",
  });
  const listName = "训练任务列表";
  const navigate = useNavigate();
  return (
    <Card className={styles.card}>
      <div style={{ height: "90%" }}>
        <CardHeader
          header={
            <div className={styles.cardHeader}>
              <Body1>
                <b>{listName}</b>
              </Body1>
              <DataGridToolBar
                surface={<TrainTaskAdd />}
                refreshClick={() =>
                  queryClient.refetchQueries({
                    queryKey: ["trainTasks"],
                    exact: true,
                  })
                }
              />
            </div>
          }
        />
        <div className={styles.header}>
          <Table
            sortable
            {...keyboardNavAttr}
            {...columnSizing_unstable.getTableProps()}
            role="grid"
            style={{ minWidth: "620px" }}
          >
            <TableHeader>
              <TableRow>
                <TableHeaderCell {...headerSortProps("name")}>
                  名称
                </TableHeaderCell>
                <TableHeaderCell {...headerSortProps("update_datetime")}>
                  上次更新
                </TableHeaderCell>
                <TableHeaderCell key="actions">操作</TableHeaderCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    style={{ textAlign: "center" }}
                  >
                    暂无数据
                  </TableCell>
                </TableRow>
              ) : (
                rows.map(({ item }) => (
                  <TableRow key={item.id}>
                    <TableCell tabIndex={0} role="gridcell">
                      <div
                        style={{
                          gap: "4px",
                          display: "flex",
                          // justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <RingStatus status={item.status ?? 0}></RingStatus>
                        <TableCellLayout>{item.name}</TableCellLayout>
                      </div>
                    </TableCell>
                    <TableCell tabIndex={0} role="gridcell">
                      {item.update_datetime}
                    </TableCell>
                    <TableCell
                      role="gridcell"
                      tabIndex={0}
                      {...focusableGroupAttr}
                    >
                      <TableCellLayout>
                        {item.status === 3 ? (
                          <Tooltip content={"训练结果"} relationship={"label"}>
                            <Button
                              appearance="transparent"
                              icon={<BoxCheckmarkIcon />}
                              aria-label="BoxCheckmark"
                            />
                          </Tooltip>
                        ) : (
                          <></>
                        )}
                        <DeleteButton
                          id={item.id}
                          tooltip="取消任务"
                          icon={<DismissCircleIcon />}
                          queryKey={["trainTasks"]}
                          deleteReq={trainTaskDelete}
                        />
                      </TableCellLayout>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      <PageController
        currentPage={current}
        totalPages={aiQuery.data?.data?.pages ?? 1}
        toPage={setCurrent}
      ></PageController>
    </Card>
  );
};

export default TrainTaskPage;