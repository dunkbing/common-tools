import React, { useRef, useEffect } from 'react';
import JSONPathCheatSheet from './CheatSheet';
import { IconQuestionMark } from '@tabler/icons-react';

const HtmlDialog: React.FC = () => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    dialog.addEventListener('click', (e: MouseEvent) => {
      const dialogDimensions = dialog.getBoundingClientRect();
      if (
        e.clientX < dialogDimensions.left ||
        e.clientX > dialogDimensions.right ||
        e.clientY < dialogDimensions.top ||
        e.clientY > dialogDimensions.bottom
      ) {
        dialog.close();
      }
    });

    dialog.addEventListener('close', () => {
      console.log('dialog closed');
    });

    dialog.addEventListener('cancel', (event) => {
      console.log('dialog cancelled');
      event.preventDefault();
    });
  }, []);

  return (
    <section>
      <button
        type="button"
        className="rounded-full bg-gray-500 p-1 hover:bg-gray-400 cursor-pointer"
        onClick={() => {
          dialogRef.current?.showModal();
        }}
      >
        <IconQuestionMark size={20} />
      </button>

      <dialog
        ref={dialogRef}
        className="inset-0 bg-zinc-700 bg-opacity-90 backdrop:bg-slate-600 backdrop:bg-opacity-50 open:animate-fade-in open:backdrop:animate-fade-in w-2/3 h-2/3 rounded-md"
      >
        <div className="flex flex-col items-center gap-3 p-8 rounded-lg bg-zinc-600 shadow-lg text-zinc-50">
          <JSONPathCheatSheet />
        </div>
      </dialog>
    </section>
  );
};

export default HtmlDialog;
