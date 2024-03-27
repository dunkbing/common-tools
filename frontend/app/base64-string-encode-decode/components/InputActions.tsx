import { ChangeEvent } from "react";
import { Clipboard } from "lucide-react";
import { Button } from "@/components/ui/button";

interface InputProps {
  isEncode: boolean;
  handleEncodeDecodeChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handlePaste: () => void;
}

export default function InputActions({
  isEncode,
  handleEncodeDecodeChange,
  handlePaste,
}: InputProps) {
  return (
    <div className="mb-3 flex flex-row items-center justify-between">
      <label className="font-semibold">Input</label>
      <div className="flex flex-row items-center gap-2">
        <label>
          <input
            type="radio"
            value="encode"
            checked={isEncode}
            onChange={handleEncodeDecodeChange}
          />
          <span className="ml-2">Encode</span>
        </label>
        <label>
          <input
            type="radio"
            value="decode"
            checked={!isEncode}
            onChange={handleEncodeDecodeChange}
          />
          <span className="ml-2">Decode</span>
        </label>
        <Button
          onClick={handlePaste}
          className="flex flex-row items-center gap-1"
        >
          Clipboard
          <Clipboard size={16} />
        </Button>
      </div>{" "}
    </div>
  );
}
