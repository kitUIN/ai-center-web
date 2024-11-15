import { EditRegular, EditFilled, bundleIcon } from "@fluentui/react-icons";
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
} from "@fluentui/react-components";
import React from "react";
import PageController from "../components/PageController";
import { DataGridToolBar } from "../components/DataGridToolBar";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { aiDelete, aiList } from "../utils/api/AiModel";
import { AiModelAdd } from "../components/AiModelAdd";
import { AiModel } from "../utils/api/models/AiModel";
import { DeleteButton } from "../components/DeleteButton";
import FileUploadComponent from "./FileUploadComponent";

const EditIcon = bundleIcon(EditFilled, EditRegular);
const columns: TableColumnDefinition<AiModel>[] = [
  createTableColumn<AiModel>({
    columnId: "name",
    compare: (a, b) => {
      return a.name.localeCompare(b.name);
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
    margin: "auto",
    padding: "20px",
    width: "90%",
    height: "90%",
  },
  cardHeader: {
    display: "flex",
    width: "100%",

    alignItems: "center",
    justifyContent: "space-between",
  },
});

export const AiModelFilePage = () => {
  const styles = useStyles();
  const queryClient = useQueryClient();
  const [current, setCurrent] = React.useState(1);
  const aiQuery = useQuery({
    queryKey: ["aimodels"],
    queryFn: () => aiList(current),
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
  const listName = "模型配置文件";
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
                surface={<AiModelAdd />}
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
        <FileUploadComponent></FileUploadComponent>
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
                      <Button
                        appearance="transparent"
                        icon={<EditIcon />}
                        aria-label="Edit"
                      />
                      <DeleteButton
                        id={item.id}
                        queryKey={["aimodels"]}
                        DeleteReq={aiDelete}
                      />
                    </TableCellLayout>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <PageController
        currentPage={current}
        totalPages={aiQuery.data?.data?.page ?? 1}
        toPage={setCurrent}
      ></PageController>
    </Card>
  );
};

export default AiModelFilePage;
