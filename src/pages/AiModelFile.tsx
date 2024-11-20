import {
  bundleIcon,
  ClipboardTaskListLtrFilled,
  ClipboardTaskListLtrRegular,
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
  Tooltip,
  ToolbarButton,
} from "@fluentui/react-components";
import React, { useEffect } from "react";
import PageController from "../components/PageController";
import { DataGridToolBar } from "../components/DataGridToolBar";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { aiFileDelete, aiFileList } from "../utils/api/AiModel";
import { DeleteButton } from "../components/DeleteButton";
import { FileUploadButton } from "../components/FileUploadButton";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { AiModelFile } from "../utils/api/models/AiModelFile";

const ClipboardTaskListLtrIcon = bundleIcon(
  ClipboardTaskListLtrFilled,
  ClipboardTaskListLtrRegular
);
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
  createTableColumn<AiModelFile>({
    columnId: "file",
    compare: (a, b) => {
      return a.file?.localeCompare(b.file!) ?? 1;
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
  header: {
    overflowY: "auto",
    maxHeight: "100%",
  },
});

export const AiModelFilePage = () => {
  const { id } = useParams();
  const styles = useStyles();
  const navigate = useNavigate();
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
  const listName = `${location.state?.name || ""}模型文件列表`;
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
                    <FileUploadButton item={location.state} />
                    <Tooltip content="训练计划" relationship="label">
                      <ToolbarButton
                        icon={<ClipboardTaskListLtrIcon />}
                        aria-label="ClipboardTask"
                        onClick={() => {
                          navigate(`/model/ai/${id}/plan`, {
                            state: location.state,
                          });
                        }}
                      >
                        训练计划
                      </ToolbarButton>
                    </Tooltip>
                  </>
                }
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
                <TableHeaderCell {...headerSortProps("file")}>
                  路径
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
                    <TableCell tabIndex={0} role="gridcell">
                      <TableCellLayout truncate>{item.file}</TableCellLayout>
                    </TableCell>
                    <TableCell
                      role="gridcell"
                      tabIndex={0}
                      {...focusableGroupAttr}
                    >
                      <TableCellLayout>
                        <Popover>
                          <PopoverTrigger disableButtonEnhancement>
                            <Tooltip content={"预览"} relationship={"label"}>
                              <Button
                                appearance="transparent"
                                icon={<EyeIcon />}
                                aria-label="See"
                              />
                            </Tooltip>
                          </PopoverTrigger>

                          <PopoverSurface tabIndex={-1}>
                            {isImg(item.file) ? (
                              <Image src={item.file} width={300}></Image>
                            ) : (
                              <Text>{item.file}</Text>
                            )}
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
      </div>
      <PageController
        currentPage={current}
        totalPages={aiQuery.data?.data?.pages ?? 1}
        toPage={setCurrent}
      ></PageController>
    </Card>
  );
};

export default AiModelFilePage;
