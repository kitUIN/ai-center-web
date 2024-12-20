import {
  bundleIcon,
  GlobeDesktopFilled, GlobeDesktopRegular,
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
  Button,
  Tag,
} from "@fluentui/react-components";
import React, { useEffect } from "react";
import PageController from "../components/PageController";
import { DataGridToolBar } from "../components/DataGridToolBar";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { aiPowerList } from "../utils/api/AiModelPower";
import { AiModelPower } from "../utils/api/models/AiModelPower";
import { AiPowerRename } from "../components/AiPowerRename";
import { AiPowerArgsUpdate } from "../components/AiPowerArgsUpdate";
const GlobeDesktopIcon = bundleIcon(GlobeDesktopFilled, GlobeDesktopRegular);
const columns: TableColumnDefinition<AiModelPower>[] = [
  createTableColumn<AiModelPower>({
    columnId: "name",
    compare: (a, b) => {
      return a.name.localeCompare(b.name);
    },
  }),
  createTableColumn<AiModelPower>({
    columnId: "task_name",
    compare: (a, b) => {
      return a.task_name!.localeCompare(b.task_name!);
    },
  }),
  createTableColumn<AiModelPower>({
    columnId: "ai_model_name",
    compare: (a, b) => {
      return a.ai_model_name!.localeCompare(b.ai_model_name!);
    },
  }),
  createTableColumn<AiModelPower>({
    columnId: "configured",
    compare: (a, b) => {
      return Number(a.configured > b.configured);
    },
  }),
  createTableColumn<AiModelPower>({
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

export const AiModelPowerPage = () => {
  const styles = useStyles();
  const queryClient = useQueryClient();
  const [current, setCurrent] = React.useState(1);
  const navigate = useNavigate();
  const aiQuery = useQuery({
    queryKey: ["aiPowers"],
    queryFn: () => aiPowerList(current),
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
        defaultSortState: { sortColumn: "create_datetime", sortDirection: "descending" },
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
  const listName = `${location.state?.name || ""}模型能力`;
  const [flag, setFlag] = React.useState(true);
  useEffect(() => {
    if (flag) {
      setFlag(false);
      return;
    }
    queryClient.refetchQueries({
      queryKey: ["aiPowers"],
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
                surface={<></>}
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
                <TableHeaderCell {...headerSortProps("task_name")}>
                  来源任务
                </TableHeaderCell>
                <TableHeaderCell {...headerSortProps("ai_model_name")}>
                  模型
                </TableHeaderCell>
                <TableHeaderCell {...headerSortProps("configured")}>
                  是否配置
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
                      <TableCellLayout>{item.name}</TableCellLayout>
                    </TableCell>
                    <TableCell tabIndex={0} role="gridcell">
                      <Tag size="small">{item.task_name} </Tag>
                    </TableCell>
                    <TableCell tabIndex={0} role="gridcell">
                      <Tag size="small">{item.ai_model_name} </Tag>
                    </TableCell>
                    <TableCell tabIndex={0} role="gridcell">
                      <Tag
                        shape="circular"
                        appearance="brand"
                        style={
                          item.configured
                            ? { backgroundColor: "#F6FFED", color: "#389E0D", fontSize:"12px" }
                            : { backgroundColor: "#FFF7E6", color: "#D46B08", fontSize:"12px"}
                        }
                      >
                        {item.configured ? "已配置" : "未配置"}
                      </Tag>
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
                      <AiPowerRename itemId={item.id} item={item}></AiPowerRename>
                      <AiPowerArgsUpdate itemId={item.id} aiId={item.ai_model}></AiPowerArgsUpdate>
                        <Tooltip content="API" relationship="label">
                          <Button
                            appearance="transparent"
                            icon={<GlobeDesktopIcon />}
                            aria-label="Settings"
                            onClick={() => {
                              navigate(`/model/power/${item.id}/detail`)
                            }}
                          />
                        </Tooltip>
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

export default AiModelPowerPage;
