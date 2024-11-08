import * as React from "react";
import {
  Hamburger,
  NavDrawer,
  NavDrawerBody,
  NavDrawerHeader,
  NavDrawerProps,
  NavItem,
  NavItemValue,
  NavSectionHeader,
  OnNavItemSelectData,
} from "@fluentui/react-nav-preview";
import { Tooltip, makeStyles, tokens } from "@fluentui/react-components";
import { useLocation, useNavigate, useRoutes } from "react-router-dom";
import { useEffect } from "react";
import { NavRouterItem, navItems } from "./utils/NavItems";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const useStyles = makeStyles({
  root: {
    overflow: "hidden",
    display: "flex",
    height: "100vh",
    width: "100%",
    backgroundColor: "#FAFAFA",
  },
  content: {
    flex: "1",
    padding: "16px",
    display: "grid",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  field: {
    display: "flex",
    marginTop: "4px",
    marginLeft: "8px",
    flexDirection: "column",
    gridRowGap: tokens.spacingVerticalS,
  },
});

function CheckHeader(item: NavRouterItem) {
  if (item.header !== null) {
    return <NavSectionHeader>{item.header}</NavSectionHeader>;
  }
  return <></>;
}
const queryClient = new QueryClient();
export const App = (props: Partial<NavDrawerProps>) => {
  const styles = useStyles();
  const location = useLocation();
  const navigate = useNavigate();

  const [openCategories, setOpenCategories] = React.useState<NavItemValue[]>([
    "6",
    "11",
  ]);
  const [selectedCategoryValue, setSelectedCategoryValue] = React.useState<
    string | undefined
  >("home");
  const [selectedValue, setSelectedValue] = React.useState<string>("home");
  const handleItemSelect = (
    _: Event | React.SyntheticEvent<Element, Event>,
    data: OnNavItemSelectData
  ) => {
    setSelectedCategoryValue(data.value as string);
    setSelectedValue(data.value as string);
    navigate(data.value as string);
  };
  const MyRoutes = () => {
    return useRoutes(navItems);
  };
  useEffect(() => {
    navItems.forEach((item) => {
      if (item.path === location.pathname) {
        setSelectedCategoryValue(item.path);
        setSelectedValue(item.path);
      }
    });
  }, [location.pathname]);
  return (
    <div className={styles.root}>
      <NavDrawer
        style={{ minWidth: "160px",width: "160px" }}
        // This a controlled example,
        // so don't use these props
        // defaultSelectedValue="1"
        // defaultSelectedCategoryValue="6"
        // defaultOpenCategories={['6']}
        // multiple={isMultiple}
        // onNavCategoryItemToggle={handleCategoryToggle}
        onNavItemSelect={handleItemSelect}
        openCategories={openCategories}
        selectedValue={selectedValue}
        selectedCategoryValue={selectedCategoryValue}
        type={"inline"}
        open={true}
      >
        <NavDrawerHeader>
          <Tooltip content="Navigation" relationship="label">
            <Hamburger />
          </Tooltip>
        </NavDrawerHeader>

        <NavDrawerBody>
          {/* <AppItem icon={<PersonCircle32Regular />} as="a">
            Contoso HR
          </AppItem> */}
          {navItems.map((item) => (
            <React.Fragment key={item.key}>
              {CheckHeader(item)}
              <NavItem key={item.key} icon={item.icon} value={item.path}>
                {item.name}
              </NavItem>
            </React.Fragment>
          ))}
        </NavDrawerBody>
      </NavDrawer>
      <QueryClientProvider client={queryClient}>
        <MyRoutes />
      </QueryClientProvider>
    </div>
  );
};
