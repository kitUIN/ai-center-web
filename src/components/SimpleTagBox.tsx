import * as React from "react";
import {
  TagPicker,
  TagPickerControl,
  TagPickerProps,
  TagPickerGroup,
  TagPickerInput,
} from "@fluentui/react-components";
import { Tag } from "@fluentui/react-components";

interface SimpleTagBoxProps {
  selectedOptions: string[],
  setSelectedOptions: React.Dispatch<React.SetStateAction<string[]>>
}
export const SimpleTagBox : React.FC<SimpleTagBoxProps> = ({selectedOptions,setSelectedOptions}) => {
    const [inputValue, setInputValue] = React.useState("");

    const onOptionSelect: TagPickerProps["onOptionSelect"] = (_, data) => {
      setSelectedOptions(data.selectedOptions);
    };
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(event.currentTarget.value);
    };
    const handleKeyDown = (event: React.KeyboardEvent) => {
      if (event.key === "Enter" && inputValue) {
        setInputValue("");
        setSelectedOptions((curr) =>
          curr.includes(inputValue) ? curr : [...curr, inputValue]
        );
      }
    };
  
    return (
        <TagPicker
        noPopover
        onOptionSelect={onOptionSelect}
        selectedOptions={selectedOptions}
      >
        <TagPickerControl>
          <TagPickerGroup aria-label="Selected Employees">
            {selectedOptions.map((option, index) => (
              <Tag
                key={index}
                shape="rounded"
                 
                value={option}
              >
                {option}
              </Tag>
            ))}
          </TagPickerGroup>
          <TagPickerInput
            value={inputValue}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            aria-label="Add Employees"
          />
        </TagPickerControl>
      </TagPicker>
    );
  };