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
import { 
  Tooltip,
  makeStyles,
  tokens,
  useId,
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
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home'
import About from './pages/About'
const useStyles = makeStyles({
  root: {
    overflow: "hidden",
    display: "flex",
    height: "600px",
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

 
export const App = (props: Partial<NavDrawerProps>) => {
  const styles = useStyles();

  const [openCategories, setOpenCategories] = React.useState<NavItemValue[]>([
    "6",
    "11",
  ]);
  const [selectedCategoryValue, setSelectedCategoryValue] = React.useState<
    string | undefined
  >("6");
  const [selectedValue, setSelectedValue] = React.useState<string>("7");
  const [isMultiple, setIsMultiple] = React.useState(true);

  const handleCategoryToggle = (
    ev: Event | React.SyntheticEvent<Element, Event>,
    data: OnNavItemSelectData
  ) => {
    if (data.value === undefined && data.categoryValue) {
      // we're just opening it,
      setOpenCategories([data.categoryValue as string]);
    }

    if (isMultiple) {
      // if it's already open, remove it from the list
      if (openCategories.includes(data.categoryValue as string)) {
        setOpenCategories([
          ...openCategories.filter(
            (category) => category !== data.categoryValue
          ),
        ]);
      } else {
        // otherwise add it
        setOpenCategories([...openCategories, data.categoryValue as string]);
      }
    } else {
      // if it's already open, remove it from the list
      if (openCategories.includes(data.categoryValue as string)) {
        setOpenCategories([]);
      } else {
        // otherwise add it
        setOpenCategories([data.categoryValue as string]);
      }
    }
  };

  const handleItemSelect = (
    ev: Event | React.SyntheticEvent<Element, Event>,
    data: OnNavItemSelectData
  ) => {
    setSelectedCategoryValue(data.categoryValue as string);
    setSelectedValue(data.value as string);
  };

  const renderHamburgerWithToolTip = () => {
    return (
      <Tooltip content="Navigation" relationship="label">
        <Hamburger />
      </Tooltip>
    );
  };

 

  return (
    <div className={styles.root}>
      <NavDrawer
        // This a controlled example,
        // so don't use these props
        // defaultSelectedValue="7"
        // defaultSelectedCategoryValue="6"
        // defaultOpenCategories={['6']}
        // multiple={isMultiple}
        onNavCategoryItemToggle={handleCategoryToggle}
        onNavItemSelect={handleItemSelect}
        openCategories={openCategories}
        selectedValue={selectedValue}
        selectedCategoryValue={selectedCategoryValue}
        type={"inline"}
        open={true}
      >
        <NavDrawerHeader>{renderHamburgerWithToolTip()}</NavDrawerHeader>

        <NavDrawerBody>
          {/* <AppItem icon={<PersonCircle32Regular />} as="a">
            Contoso HR
          </AppItem> */}
          <NavItem href="/" icon={<Dashboard />} value="1">
            看板
          </NavItem>
          <NavItem href="/about" icon={<Announcements />} value="2">
            数据集
          </NavItem>
          <NavItem icon={<EmployeeSpotlight />} value="3">
            训练任务
          </NavItem>
          <NavSectionHeader>模型</NavSectionHeader>
           
          <NavItem icon={<Interviews />} value="4">
            模型配置
          </NavItem>
          <NavItem icon={<TrainingPrograms />} value="5">
            模型能力
          </NavItem>
        </NavDrawerBody>
      </NavDrawer>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
        </Routes>
		</BrowserRouter> 
    </div>
  );
};
