import {
  MoreHorizontal24Filled, 
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
} from "@fluentui/react-components";
interface ToolBarProps {
  surface: JSX.Element;
  moreList: JSX.Element;
  refreshClick: () => void;
}

const RefreshIcon = bundleIcon(ArrowClockwiseFilled, ArrowClockwiseRegular);
export const DataGridToolBar = (props: Partial<ToolBarProps>) => {
  return (
    <Toolbar aria-label="Default" {...props}>
      {props.surface !== undefined && (
        <>{props.surface}</>
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
