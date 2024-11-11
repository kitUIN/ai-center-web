import Home from "../pages/Home";
import About from "../pages/About";
import DataSetPage from "../pages/DataSet";
import {
  Dashboard,
  NavRouterItem,
  Bot,
  EmployeeSpotlight,
  DataBase,
  BotSparkle,
} from "../utils/NavItems";
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
    icon: <DataBase />,
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
    icon: <Bot />,
    element: <About />,
  },
  {
    key: "model_power",
    name: "模型能力",
    header: null,
    path: "/model/power",
    icon: <BotSparkle />,
    element: <About />,
  },
];
