import React, { useContext } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IndentContext, IndentContextType } from "@/contexts/IndentContext";

interface IndentSelectionProps {
  onChangeIndent?: (indent: number) => void;
}

const IndentSelection: React.FC<IndentSelectionProps> = (props) => {
  const { indent, setIndent } = useContext(IndentContext) as IndentContextType;
  const changeSpaces = (value: string): void => {
    const newIndent = Number(value);
    setIndent(newIndent);
    props?.onChangeIndent?.(newIndent);
  };

  return (
    <Select onValueChange={changeSpaces}>
      <SelectTrigger className="h-9 w-fit border-none bg-slate-900">
        <SelectValue placeholder={`${indent} spaces`}>
          {indent} spaces
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="">
        <SelectGroup>
          <SelectItem value="2">2 spaces</SelectItem>
          <SelectItem value="3">3 spaces</SelectItem>
          <SelectItem value="4">4 spaces</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

IndentSelection.displayName = "IndentSelection";

export default IndentSelection;
