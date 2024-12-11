import {
  bundleIcon,
  BoxCheckmarkFilled,
  BoxCheckmarkRegular,
  DismissCircleFilled,
  DismissCircleRegular,
  DocumentBulletListMultipleFilled,
  DocumentBulletListMultipleRegular,
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
  Tag,
} from "@fluentui/react-components";
import React, { useEffect } from "react";
import PageController from "../components/PageController";
import { DataGridToolBar } from "../components/DataGridToolBar";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { DeleteButton } from "../components/DeleteButton";
// import { useNavigate } from "react-router-dom";
import { trainTaskDelete, trainTaskList } from "../utils/api/TrainTask";
import { TrainTask } from "../utils/api/models/TrainTask";
import RingStatus from "../components/RingStatus";
import { TrainTaskAdd } from "../components/TrainTaskAdd";
import { useNavigate, useSearchParams } from "react-router-dom";

const DismissCircleIcon = bundleIcon(DismissCircleFilled, DismissCircleRegular);
const BoxCheckmarkIcon = bundleIcon(BoxCheckmarkFilled, BoxCheckmarkRegular);
const DocumentBulletListMultipleIcon = bundleIcon(
  DocumentBulletListMultipleFilled,
  DocumentBulletListMultipleRegular
);
const columns: TableColumnDefinition<TrainTask>[] = [
  createTableColumn<TrainTask>({
    columnId: "name",
    compare: (a, b) => {
      return a.name?.localeCompare(b.name ?? "") ?? 1;
    },
  }),
  createTableColumn<TrainTask>({
    columnId: "ai_model_name",
    compare: (a, b) => {
      return a.ai_model_name?.localeCompare(b.ai_model_name!) ?? 1;
    },
  }),
  createTableColumn<TrainTask>({
    columnId: "running_status",
    compare: (a, b) => {
      return a.running_status?.localeCompare(b.running_status!) ?? 1;
    },
  }),
  createTableColumn<TrainTask>({
    columnId: "create_datetime",
    compare: (a, b) => {
      return a.create_datetime?.localeCompare(b.create_datetime!) ?? 1;
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
  const [searchParams, setSearchParams] = useSearchParams();
  useEffect(() => {
    if (searchParams.get("page") === null) {
      searchParams.set("page", "1");
      setSearchParams(searchParams);
      console.log(searchParams.get("page"));
    }
  }, []);

  const [current, setCurrent] = React.useState(1);
  const aiQuery = useQuery({
    queryKey: ["trainTasks"],
    queryFn: () =>
      trainTaskList(
        Number(searchParams.get("page")),
        20,
        searchParams.get("plan")
      ),
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
        defaultSortState: {
          sortColumn: "create_datetime",
          sortDirection: "descending",
        },
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
                <TableHeaderCell {...headerSortProps("ai_model_name")}>
                  模型
                </TableHeaderCell>
                <TableHeaderCell {...headerSortProps("running_status")}>
                  运行状态
                </TableHeaderCell>
                <TableHeaderCell {...headerSortProps("create_datetime")}>
                  创建时间
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
                      <TableCellLayout>{item.ai_model_name}</TableCellLayout>
                    </TableCell>
                    <TableCell tabIndex={0} role="gridcell">
                      <Tag
                        shape="circular"
                        appearance="brand"
                        style={
                          item.status === 2 || item.status === 4
                            ? { backgroundColor: "#FFF1F0", color: "#CF1322" }
                            : item.status === 0
                            ? { backgroundColor: "#FFF7E6", color: "#D46B08" }
                            : item.status === 3
                            ? { backgroundColor: "#F6FFED", color: "#389E0D" }
                            : {}
                        }
                      >
                        {item.running_status}
                      </Tag>
                    </TableCell>
                    <TableCell tabIndex={0} role="gridcell">
                      {item.create_datetime}
                    </TableCell>
                    <TableCell
                      role="gridcell"
                      tabIndex={0}
                      {...focusableGroupAttr}
                    >
                      <TableCellLayout>
                        <Tooltip content={"日志"} relationship={"label"}>
                          <Button
                            appearance="transparent"
                            icon={<DocumentBulletListMultipleIcon />}
                            aria-label="DocumentBulletListMultiple"
                            onClick={() => {
                              window.open(
                                item.log_url,
                                "_blank",
                                "noopener,noreferrer"
                              );
                            }}
                          />
                        </Tooltip>
                        {item.status === 3 ? (
                          <Tooltip content={"训练结果文件"} relationship={"label"}>
                            <Button
                              appearance="transparent"
                              icon={<BoxCheckmarkIcon />}
                              aria-label="BoxCheckmark"
                              onClick={() => {
                                window.open(
                                  item.res_url,
                                  "_blank",
                                  "noopener,noreferrer"
                                );
                              }}
                            />
                          </Tooltip>
                        ) : (
                          <></>
                        )}
                        {item.status >= 2 ? (
                          <></>
                        ) : (
                          <DeleteButton
                            id={item.id}
                            tooltip="取消任务"
                            icon={<DismissCircleIcon />}
                            queryKey={["trainTasks"]}
                            deleteReq={trainTaskDelete}
                          />
                        )}
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
