import * as React from "react";
import {
  AccordionItem,
  AccordionPanel,
  AccordionHeader,
  tokens,
  makeStyles,
} from "@fluentui/react-components";
import RingStatus from "./RingStatus";
import { secondsToString } from "../utils/DateUtils";

const useStyles = makeStyles({
  accordionHeaderLeft: {
    display: "flex",
    gap: "8px",
    alignItems: "center",
  },
  accordionHeaderItems: {
    lineHeight: "16px",
    display: "flex",
    gap: "8px",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
  },
  accordionPanel: {
    padding: "10px",
    marginBottom: "10px",
  },
  accordionHeader: {
    ":hover": {
      background: tokens.colorNeutralBackground1Hover,
    },
  },
  accordionHeaderSelected: {
    background: tokens.colorNeutralBackground1Selected,
  },
});

interface TrainTaskLogAccordionProps {
  status?: number;
  seconds?: number;
  name: string;
  value: string;
  openItems: string[];
}
export const TrainTaskLogAccordion: React.FC<TrainTaskLogAccordionProps> = ({
  status,
  seconds,
  name,
  value,
  openItems,
}) => {
  const styles = useStyles();

  return (
    <AccordionItem value={value}>
      <AccordionHeader
        className={
          openItems.find((x) => x === value)
            ? styles.accordionHeaderSelected
            : styles.accordionHeader
        }
      >
        <div className={styles.accordionHeaderItems}>
          <div className={styles.accordionHeaderLeft}>
            <RingStatus status={status ?? 0}></RingStatus>
            <span>{name}</span>
          </div>
          <span>{status === 0 ? "" : secondsToString(seconds ?? 0)}</span>
        </div>
      </AccordionHeader>
      <AccordionPanel className={styles.accordionPanel}>
        <div>Accordion Panel 1</div>
      </AccordionPanel>
    </AccordionItem>
  );
};
