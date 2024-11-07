import Home from "../pages/Home";
import About from "../pages/About";
import DataSetPage from "../pages/DataSet";

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

const Dashboard = bundleIcon(Board20Filled, Board20Regular);
const Announcements = bundleIcon(MegaphoneLoud20Filled, MegaphoneLoud20Regular);
const EmployeeSpotlight = bundleIcon(
  PersonLightbulb20Filled,
  PersonLightbulb20Regular
);
const Interviews = bundleIcon(People20Filled, People20Regular);
const TrainingPrograms = bundleIcon(BoxMultiple20Filled, BoxMultiple20Regular);

export type NavRouterItem = {
  key: string;
  path: string;
  name: string;
  header: string | null;
  element: React.ReactNode;
  icon: any;
};
export const navItems: NavRouterItem[] = [
  {
    key: "home",
    name: "看板",
    header: null,
    icon: <Dashboard />,
    path: "/",
    element: <Home />,
  },
  {
    key: "dataset",
    name: "数据集",
    header: null,
    path: "/dataset",
    icon: <Announcements />,
    element: <DataSetPage />,
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
