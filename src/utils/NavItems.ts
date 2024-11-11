
import {
  Board20Filled,
  Board20Regular,
  Bot20Filled,
  Bot20Regular,
  BotSparkle20Filled,
  BotSparkle20Regular,
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

export const Dashboard = bundleIcon(Board20Filled, Board20Regular);
export const Announcements = bundleIcon(MegaphoneLoud20Filled, MegaphoneLoud20Regular);
export const EmployeeSpotlight = bundleIcon(
  PersonLightbulb20Filled,
  PersonLightbulb20Regular
);
export const Interviews = bundleIcon(People20Filled, People20Regular);
export const BotSparkle = bundleIcon(BotSparkle20Filled, BotSparkle20Regular);
export const Bot = bundleIcon(Bot20Filled, Bot20Regular);
export const DataBase = bundleIcon(BoxMultiple20Filled, BoxMultiple20Regular);

 
export type NavRouterItem = {
  key: string;
  path: string;
  name: string;
  header: string | null;
  element: React.ReactNode;
  icon: JSX.Element;
};
