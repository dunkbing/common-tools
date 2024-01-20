import React, { useState } from 'react';
import { IconCaretUp, IconCaretDown } from '@tabler/icons-react';
import Button from './Button';

export interface Option {
  label: string;
  value: string;
}

interface DropdownProps {
  options: Option[];
  onChange?: (option: Option) => void;
}

const Dropdown: React.FC<DropdownProps> = ({ options, onChange }) => {
  const [selectedOption, setSelectedOption] = useState(options[0]);
  const [isOpen, setIsOpen] = useState(false);

  const handleOptionClick = (option: Option) => {
    setSelectedOption(option);
    setIsOpen(false);
    onChange?.(option);
  };

  return (
    <div className="relative inline-block">
      <Button
        id="options-menu"
        aria-haspopup="true"
        aria-expanded="true"
        onClick={() => setIsOpen(!isOpen)}
        className="flex flex-row items-center gap-1"
      >
        {selectedOption?.label}{' '}
        {isOpen ? <IconCaretUp size={16} /> : <IconCaretDown size={16} />}
      </Button>

      <div
        className={`origin-top-right absolute right-0 mt-2 w-fit rounded-md shadow-lg bg-zinc-500 ring-1 ring-black ring-opacity-5 focus:outline-none z-10 transition-opacity duration-300 ease-in-out ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="options-menu"
      >
        <div className="py-1" role="none">
          {options.map((option) => (
            <button
              key={option.value}
              className="block w-full px-4 py-2 text-sm text-white hover:bg-zinc-600"
              role="menuitem"
              onClick={() => handleOptionClick(option)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

Dropdown.displayName = 'Dropdown';

export default Dropdown;
