import {
  PresenceBadge,
  PresenceBadgeStatus,
  Tooltip,
} from "@fluentui/react-components";
import "../scss/loding.scss";
interface RingStutasProps {
  status: number;
}
const RingStatus: React.FC<RingStutasProps> = ({ status }) => {
  const tooltipValue = ["等待中", "进行中", "失败/取消", "已完成"];
  const tooltipBadge: PresenceBadgeStatus[] = [
    "away",
    "away",
    "do-not-disturb",
    "available",
  ];
  if (status === 1) {
    // 进行中
    return (
      <Tooltip content={tooltipValue[status]} relationship="label">
        <span style={{ height: "16px", width: "16px"}}>
          <svg
            aria-label="currently running: "
            width="16px"
            height="16px"
            fill="none"
            viewBox="0 0 16 16"
            className="anim-rotate"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill="none"
              stroke="#EAA300"
              stroke-width="2"
              d="M3.05 3.05a7 7 0 1 1 9.9 9.9 7 7 0 0 1-9.9-9.9Z"
              opacity=".5"
            ></path>
            <path
              fill="#EAA300"
              fill-rule="evenodd"
              d="M8 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z"
              clip-rule="evenodd"
            ></path>
            <path
              fill="#EAA300"
              d="M14 8a6 6 0 0 0-6-6V0a8 8 0 0 1 8 8h-2Z"
            ></path>
          </svg>
        </span>
      </Tooltip>
    );
  } else {
    return (
      <Tooltip content={tooltipValue[status]} relationship="label">
        <PresenceBadge status={tooltipBadge[status]} />
      </Tooltip>
    );
  }
};
export default RingStatus;
