import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from '@/components/ui/select';
import { IndentContext, IndentContextType } from '@/contexts/IndentContext';
import { useContext } from 'react';

interface IndentSelectionProps {
  onChangeIndent?: (indent: number) => void;
}

export default function (props: IndentSelectionProps) {
  const { indent, setIndent } = useContext(IndentContext) as IndentContextType;
  const changeSpaces = (value: string): void => {
    const newIndent = Number(value);
    setIndent(newIndent);
    props?.onChangeIndent?.(newIndent);
  };

  return (
    <Select onValueChange={changeSpaces}>
      <SelectTrigger className="w-fit bg-slate-900 border-none h-9">
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
}
