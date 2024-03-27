import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { HelpCircle } from "lucide-react";
import React from "react";
import JSONPathCheatSheet from "./CheatSheet";

const HtmlDialog: React.FC = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className="cursor-pointer rounded-full bg-gray-500 p-1 hover:bg-gray-400"
        >
          <HelpCircle size={20} />
        </button>
      </DialogTrigger>
      <DialogContent className="overflow-y-scroll bg-zinc-600">
        <JSONPathCheatSheet />
      </DialogContent>
    </Dialog>
  );
};

export default HtmlDialog;
