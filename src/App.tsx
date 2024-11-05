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
import {
  Tooltip,
  makeStyles,
  tokens,
} from "@fluentui/react-components";
import {
  Board20Filled,
  Board20Regular,
  BoxMultiple20Filled,
  BoxMultiple20Regular,
  MegaphoneLoud20Filled,
  MegaphoneLoud20Regular,
  People20Filled,
  People20Regular,
  PersonLightbulb20Filled,
  PersonLightbulb20Regular,
  bundleIcon,
} from "@fluentui/react-icons";
import {
  useLocation,
  useRoutes,
} from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import { useEffect } from "react";
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
const Dashboard = bundleIcon(Board20Filled, Board20Regular);
const Announcements = bundleIcon(MegaphoneLoud20Filled, MegaphoneLoud20Regular);
const EmployeeSpotlight = bundleIcon(
  PersonLightbulb20Filled,
  PersonLightbulb20Regular
);
const Interviews = bundleIcon(People20Filled, People20Regular);
const TrainingPrograms = bundleIcon(BoxMultiple20Filled, BoxMultiple20Regular);
type NavRouterItem = {
  key: string;
  path: string;
  name: string;
  header: string | null;
  element: React.ReactNode;
  icon: any;
};
const navItems: NavRouterItem[] = [
  {
    key: "home",
    name: "看板",
    header: null,
    icon: <Dashboard />,
    path: "/",
    element: <Home />,
  },
  {
    key: "about",
    name: "数据集",
    header: null,
    path: "/about",
    icon: <Announcements />,
    element: <About />,
  },
  {
    key: "train_task",
    name: "训练任务",
    header: null,
    path: "/train/task",
    icon: <EmployeeSpotlight />,
    element: <About />,
  },
  {
    key: "model_config",
    name: "模型配置",
    header: "模型",
    path: "/model/config",
    icon: <Interviews />,
    element: <About />,
  },
  {
    key: "model_power",
    name: "模型能力",
    header: null,
    path: "/model/power",
    icon: <TrainingPrograms />,
    element: <About />,
  },
];
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
                href={item.path}
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
