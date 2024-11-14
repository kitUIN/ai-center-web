import {
  MoreHorizontal24Filled,
  AddSquareFilled,
  AddSquareRegular,
  bundleIcon,
  ArrowClockwiseFilled,
  ArrowClockwiseRegular,
} from "@fluentui/react-icons";
import {
  Toolbar,
  ToolbarButton,
  ToolbarDivider,
  Menu,
  MenuTrigger,
  MenuPopover,
  DialogTrigger,
  Dialog,
} from "@fluentui/react-components";
interface ToolBarProps {
  surface: JSX.Element;
  moreList: JSX.Element;
  refreshClick: () => void;
}
const AddButtonIcon = bundleIcon(AddSquareFilled, AddSquareRegular);
const RefreshIcon = bundleIcon(ArrowClockwiseFilled, ArrowClockwiseRegular);
export const DataGridToolBar = (props: Partial<ToolBarProps>) => {
  return (
    <Toolbar aria-label="Default" {...props}>
      {props.surface !== undefined && (
        <Dialog modalType="modal">
          <DialogTrigger disableButtonEnhancement>
            <ToolbarButton icon={<AddButtonIcon />}>新建</ToolbarButton>
          </DialogTrigger>
          {props.surface}
        </Dialog>
      )}
      <ToolbarButton icon={<RefreshIcon />} onClick={props.refreshClick}>
        刷新
      </ToolbarButton>

      {props.moreList !== undefined && (
        <>
          <ToolbarDivider />
          <Menu>
            <MenuTrigger>
              <ToolbarButton
                aria-label="More"
                icon={<MoreHorizontal24Filled />}
              />
            </MenuTrigger>

            <MenuPopover>{props.moreList}</MenuPopover>
          </Menu>
        </>
      )}
    </Toolbar>
  );
};
