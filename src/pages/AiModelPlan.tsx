import {
  bundleIcon,
  FolderOpenFilled,
  FolderOpenRegular,
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
  ToolbarButton,
} from "@fluentui/react-components";
import React, { useEffect } from "react";
import PageController from "../components/PageController";
import { DataGridToolBar } from "../components/DataGridToolBar";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { aiFileDelete, aiPlanList } from "../utils/api/AiModel";
import { DeleteButton } from "../components/DeleteButton";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { AiModelPlan } from "../utils/api/models/AiModelPlan";
import { AiModelPlanAdd } from "../components/AiModelPlanAdd";
import { StartTaskButton } from "../components/StartTaskButton";
const FolderOpenIcon = bundleIcon(FolderOpenFilled, FolderOpenRegular);
const columns: TableColumnDefinition<AiModelPlan>[] = [
  createTableColumn<AiModelPlan>({
    columnId: "name",
    compare: (a, b) => {
      return a.name.localeCompare(b.name);
    },
  }),
  createTableColumn<AiModelPlan>({
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
    margin: "auto",
    padding: "20px",
    width: "96%",
    height: "96%",
  },
  cardHeader: {
    display: "flex",
    width: "100%",

    alignItems: "center",
    justifyContent: "space-between",
  },
  fileNmae: { display: "flex", alignItems: "center", gap: "4px" },
  header: {
    overflowY: "auto",
    maxHeight: "100%",
  },
});

export const AiModelPlanPage = () => {
  const { id } = useParams();
  const styles = useStyles();
  const queryClient = useQueryClient();
  const [current, setCurrent] = React.useState(1);
  const navigate = useNavigate();
  const aiQuery = useQuery({
    queryKey: ["aiPlans"],
    queryFn: () => aiPlanList(id, current),
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
  const location = useLocation();
  const listName = `${location.state?.name || ""}模型训练计划`;
  const [flag, setFlag] = React.useState(true);
  useEffect(() => {
    if (flag) {
      setFlag(false);
      return;
    }
    queryClient.refetchQueries({
      queryKey: ["aimodels"],
      exact: true,
    });
    console.log(current);
  }, [current]);
  return (
    <Card className={styles.card}>
      <div>
        <CardHeader
          header={
            <div className={styles.cardHeader}>
              <Body1>
                <b>{listName}</b>
              </Body1>
              <DataGridToolBar
                surface={
                  <>
                  <AiModelPlanAdd itemId={Number(id)}></AiModelPlanAdd>
                    <Tooltip content="文件列表" relationship="label">
                      <ToolbarButton
                        icon={<FolderOpenIcon />}
                        aria-label="FolderOpen"
                        onClick={() => {
                          navigate(`/model/ai/${id}/file`, {
                            state: location.state,
                          });
                        }}
                      >
                        文件列表
                      </ToolbarButton>
                    </Tooltip>
                  </>
                }
                refreshClick={() =>
                  queryClient.refetchQueries({
                    queryKey: ["aiPlans"],
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
                      <TableCellLayout>{item.name}</TableCellLayout>
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
                        <StartTaskButton planId={item.id}></StartTaskButton>
                        <DeleteButton
                          id={item.id}
                          queryKey={["aiPlans"]}
                          deleteReq={(file_id) => aiFileDelete(id, file_id)}
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

export default AiModelPlanPage;
