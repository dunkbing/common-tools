import { ChangeEventHandler } from "react";
import { Clipboard } from "lucide-react";
import { Button } from "@/components/ui/button";

export type ConvertType = "composerize" | "de-composerize";

interface InputProps {
  type: ConvertType;
  onConverterChange: (type_: ConvertType) => void;
  onPaste: () => void;
}

export default function InputActions({
  type,
  onConverterChange,
  onPaste,
}: InputProps) {
  const handleConverterChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    if (onConverterChange) {
      onConverterChange(e.target.value as ConvertType);
    }
  };

  return (
    <div className="mb-3 flex flex-row items-center justify-between">
      <label className="font-semibold">Input</label>
      <div className="flex flex-row items-center gap-2">
        <label>
          <input
            type="radio"
            value="composerize"
            checked={type === "composerize"}
            onChange={handleConverterChange}
          />
          <span className="ml-2">Composerize</span>
        </label>
        <label>
          <input
            type="radio"
            value="de-composerize"
            checked={type === "de-composerize"}
            onChange={handleConverterChange}
          />
          <span className="ml-2">De-Composerize</span>
        </label>
        <Button onClick={onPaste} className="flex flex-row items-center gap-1">
          Clipboard
          <Clipboard size={16} />
        </Button>
      </div>{" "}
    </div>
  );
}
