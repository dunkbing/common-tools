import React from 'react';
import JSONPathCheatSheet from './CheatSheet';
import { HelpCircle } from 'lucide-react';
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog';

const HtmlDialog: React.FC = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className="rounded-full bg-gray-500 p-1 hover:bg-gray-400 cursor-pointer"
        >
          <HelpCircle size={20} />
        </button>
      </DialogTrigger>
      <DialogContent className="bg-zinc-600 overflow-y-scroll">
        <JSONPathCheatSheet />
      </DialogContent>
    </Dialog>
  );
};

export default HtmlDialog;
