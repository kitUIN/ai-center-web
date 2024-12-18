import {
  bundleIcon,
  FolderOpenFilled,
  FolderOpenRegular,
  ClipboardTaskListLtrFilled,
  ClipboardTaskListLtrRegular,
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
  InfoLabel,
  Tag,
} from "@fluentui/react-components";
import React, { useEffect } from "react";
import PageController from "../components/PageController";
import { DataGridToolBar } from "../components/DataGridToolBar";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { aiDelete, aiList, aiPluginList } from "../utils/api/AiModel";
import { AiModelAdd } from "../components/AiModelAdd";
import { AiModel } from "../utils/api/models/AiModel";
import { DeleteButton } from "../components/DeleteButton";
import { useNavigate } from "react-router-dom";
import { BotSparkle } from "../utils/NavItems";

const FolderOpenIcon = bundleIcon(FolderOpenFilled, FolderOpenRegular);
const ClipboardTaskListLtrIcon = bundleIcon(
  ClipboardTaskListLtrFilled,
  ClipboardTaskListLtrRegular
);
const columns: TableColumnDefinition<AiModel>[] = [
  createTableColumn<AiModel>({
    columnId: "name",
    compare: (a, b) => {
      return a.name.localeCompare(b.name);
    },
  }),
  createTableColumn<AiModel>({
    columnId: "key",
    compare: (a, b) => {
      return a.key.localeCompare(b.key);
    },
  }),
  createTableColumn<AiModel>({
    columnId: "tags",
    compare: () => {
      return 1;
    },
  }),
  createTableColumn<AiModel>({
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

export const AiModelPage = () => {
  const styles = useStyles();
  const queryClient = useQueryClient();
  const [current, setCurrent] = React.useState(1);
  const aiQuery = useQuery({
    queryKey: ["aimodels"],
    queryFn: () => aiList(current),
    staleTime: 0,
  });
  const pluginList = useQuery({
    queryKey: ["trainPluginList"],
    queryFn: aiPluginList,
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
      queryKey: ["aimodels"],
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
  const listName = "模型列表";
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
                surface={<AiModelAdd pluginList={pluginList} />}
                refreshClick={() =>
                  queryClient.refetchQueries({
                    queryKey: ["aimodels"],
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
                <TableHeaderCell {...headerSortProps("key")}>
                  所属插件
                </TableHeaderCell>
                <TableHeaderCell {...headerSortProps("tags")}>
                  标签
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
                      <TableCellLayout>
                        <InfoLabel
                          info={
                            pluginList?.data?.data?.find(
                              (option) => option.key === item.key
                            )?.info
                          }
                        >
                          {item.key}
                        </InfoLabel>
                      </TableCellLayout>
                    </TableCell>
                    <TableCell tabIndex={0} role="gridcell">
                      <TableCellLayout>
                        <div  style={{ display: "flex", gap: "4px" }}>
                          {item.tags.map((tag) => (
                            <Tag size="small">{tag}</Tag>
                          ))}
                        </div>
                      </TableCellLayout>
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
                        <Tooltip content="文件列表" relationship={"label"}>
                          <Button
                            appearance="transparent"
                            icon={<FolderOpenIcon />}
                            aria-label="FolderOpen"
                            onClick={() =>
                              navigate(`/model/ai/${item.id}/file`, {
                                state: item,
                              })
                            }
                          />
                        </Tooltip>
                        <Tooltip content="训练计划" relationship={"label"}>
                          <Button
                            appearance="transparent"
                            icon={<ClipboardTaskListLtrIcon />}
                            aria-label="TrainPlan"
                            onClick={() =>
                              navigate(`/model/ai/${item.id}/plan`, {
                                state: item,
                              })
                            }
                          />
                        </Tooltip>
                        <Tooltip content="模型能力" relationship={"label"}>
                          <Button
                            appearance="transparent"
                            icon={<BotSparkle />}
                            aria-label="AiPower"
                            onClick={() =>
                              navigate(`/model/ai/power?ai=${item.id}`, {
                                state: item,
                              })
                            }
                          />
                        </Tooltip>
                        <DeleteButton
                          id={item.id}
                          queryKey={["aimodels"]}
                          deleteReq={aiDelete}
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

export default AiModelPage;
