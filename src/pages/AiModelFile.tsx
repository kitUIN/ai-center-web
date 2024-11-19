import {
  bundleIcon,
  DocumentRegular,
  EyeFilled,
  EyeRegular,
  ImageRegular,
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
  Popover,
  Image,
  PopoverTrigger,
  PopoverSurface,
  Text,
} from "@fluentui/react-components";
import React from "react";
import PageController from "../components/PageController";
import { DataGridToolBar } from "../components/DataGridToolBar";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { aiFileDelete, aiFileList } from "../utils/api/AiModel";
import { DeleteButton } from "../components/DeleteButton";
import { FileUploadButton } from "../components/FileUploadButton";
import { useLocation, useParams } from "react-router-dom";
import { AiModelFile } from "../utils/api/models/AiModelFile";

const EyeIcon = bundleIcon(EyeFilled, EyeRegular);
const columns: TableColumnDefinition<AiModelFile>[] = [
  createTableColumn<AiModelFile>({
    columnId: "file_name",
    compare: (a, b) => {
      return a.file_name.localeCompare(b.file_name);
    },
  }),
  createTableColumn<AiModelFile>({
    columnId: "update_datetime",
    compare: (a, b) => {
      return a.update_datetime?.localeCompare(b.update_datetime!) ?? 1;
    },
  }),
];
function isImg(path: string) {
  const imgs = [".png", ".jpg", ".jpeg", ".PNG", ".JPG", ".JPEG"];

  for (let index = 0; index < imgs.length; index++) {
    const element = imgs[index];
    if (path.endsWith(element)) return true;
  }
  return false;
}
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
});

export const AiModelFilePage = () => {
  const { id } = useParams();
  const styles = useStyles();
  const queryClient = useQueryClient();
  const [current, setCurrent] = React.useState(1);
  const aiQuery = useQuery({
    queryKey: ["aifiles"],
    queryFn: () => aiFileList(id, current),
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
  const listName = `${location.state?.name || ""}模型配置文件`;
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
                surface={<FileUploadButton item={location.state} />}
                refreshClick={() =>
                  queryClient.refetchQueries({
                    queryKey: ["aifiles"],
                    exact: true,
                  })
                }
              />
            </div>
          }
        />

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
                    <TableCellLayout
                      media={
                        isImg(item.file) ? (
                          <ImageRegular />
                        ) : (
                          <DocumentRegular />
                        )
                      }
                    >
                      {item.file_name}
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
                      <Popover>
                        <PopoverTrigger disableButtonEnhancement>
                          <Button
                            appearance="transparent"
                            icon={<EyeIcon />}
                            aria-label="See"
                          />
                        </PopoverTrigger>

                        <PopoverSurface tabIndex={-1}>
                          <Image src={item.file} width={300}></Image>
                        </PopoverSurface>
                      </Popover>
                      <DeleteButton
                        id={item.id}
                        queryKey={["aifiles"]}
                        DeleteReq={(file_id) => aiFileDelete(id, file_id)}
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
