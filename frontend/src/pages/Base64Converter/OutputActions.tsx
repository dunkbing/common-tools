import { Copy, CornerRightUp } from 'lucide-react';

import Button from '@/components/Button';

interface OutputActionsProps {
  handleCopy: () => void;
  handleUseAsInput: () => void;
}

export default function OutputActions({
  handleCopy,
  handleUseAsInput,
}: OutputActionsProps) {
  return (
    <div className="mb-3 flex flex-row items-center justify-between">
      <label className="font-semibold">Output</label>
      <div className="flex flex-row gap-2 items-center">
        <Button
          onClick={handleCopy}
          className="flex flex-row items-center gap-1"
        >
          Copy
          <Copy size={16} />
        </Button>
        <Button
          onClick={handleUseAsInput}
          className="flex flex-row items-center gap-1"
        >
          Use as input
          <CornerRightUp size={16} />
        </Button>
      </div>
    </div>
  );
}
