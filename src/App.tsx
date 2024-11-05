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
} from "@fluentui/react-nav-preview";
import { Tooltip, makeStyles, tokens } from "@fluentui/react-components";
import { useLocation, useRoutes } from "react-router-dom";
import { useEffect } from "react";
import { NavRouterItem, navItems } from "./utils/NavItems";
const useStyles = makeStyles({
  root: {
    overflow: "hidden",
    display: "flex",
    height: "100vh",
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
export const App = (props: Partial<NavDrawerProps>) => {
  const styles = useStyles();
  const location = useLocation();

  const [openCategories, setOpenCategories] = React.useState<NavItemValue[]>([
    "6",
    "11",
  ]);
  const [selectedCategoryValue, setSelectedCategoryValue] = React.useState<
    string | undefined
  >("home");
  const [selectedValue, setSelectedValue] = React.useState<string>("home");

  const MyRoutes = () => {
    return useRoutes(navItems);
  };
  useEffect(() => {
    navItems.forEach((item) => {
      if (item.path === location.pathname) {
        setSelectedCategoryValue(item.key);
        setSelectedValue(item.key);
      }
    });
  }, []);
  return (
    <div className={styles.root}>
      <NavDrawer
        // This a controlled example,
        // so don't use these props
        // defaultSelectedValue="1"
        // defaultSelectedCategoryValue="6"
        // defaultOpenCategories={['6']}
        // multiple={isMultiple}
        // onNavCategoryItemToggle={handleCategoryToggle}
        // onNavItemSelect={handleItemSelect}
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
            <>
              {CheckHeader(item)}
              <NavItem
                key={item.key}
                icon={item.icon}
                value={item.key}
              >
                {item.name}
              </NavItem>
            </>
          ))}
        </NavDrawerBody>
      </NavDrawer>
      <MyRoutes />
    </div>
  );
};
