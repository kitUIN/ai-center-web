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
import AiModelPage from "../pages/AiModel"; 
import { motion } from "framer-motion";
import AiModelFilePage from "../pages/AiModelFile";
import { AiModelPlanPage } from "../pages/AiModelPlan";
import TrainTaskPage from "../pages/TrainTask";

interface PageWithAnimationProps {
  component: JSX.Element;
}

function PageWithAnimation({ component }: PageWithAnimationProps) {
  return (
    <motion.div
      style={{ width: "100%", height: "100%", display:"flex"}}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {component}
    </motion.div>
  );
}
export const navItems: NavRouterItem[] = [
  {
    key: "home",
    name: "看板",
    header: null,
    icon: <Dashboard />,
    path: "/",
    show: true,
    element: <Home />,
  },
  {
    key: "dataset",
    name: "数据集",
    header: null,
    path: "/dataset",
    show: true,
    icon: <DataBase />,
    element: <DataSetPage />,
  },
  {
    key: "train_task",
    name: "训练任务",
    header: null,
    path: "/train/task",
    show: true,
    icon: <EmployeeSpotlight />,
    element: <TrainTaskPage />,
  },
  {
    key: "model",
    name: "模型列表",
    header: "模型",
    path: "/model/ai",
    show: true,
    icon: <Bot />,
    element: <PageWithAnimation component={<AiModelPage />}/>,
  },
  {
    key: "model_power",
    name: "模型能力",
    header: null,
    path: "/model/power",
    show: true,
    icon: <BotSparkle />,
    element: <About />,
  },
  {
    key: "model_file",
    name: "模型相关文件",
    header: null,
    path: "/model/ai/:id/file",
    show: false,
    icon: <BotSparkle />,
    element: <PageWithAnimation component={<AiModelFilePage />}/>,
  },
  {
    key: "model_plan",
    name: "模型训练计划",
    header: null,
    path: "/model/ai/:id/plan",
    show: false,
    icon: <BotSparkle />,
    element: <PageWithAnimation component={<AiModelPlanPage />}/>,
  },
];
