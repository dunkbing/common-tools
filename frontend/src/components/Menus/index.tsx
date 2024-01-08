import { IconSearch } from '@tabler/icons-react';
import { useState } from 'react';
import Input from '../Input';

const menus = [
  'Base64 String Encode/Decode',
  'Base64 Image Encode/Decode',
  'URL Encode/Decode',
  'JWT',
  'HTML Preview',
  'YAML to JSON',
  'JSON to YAML',
];

export default function Menus() {
  const [selectedMenu, setSelectedMenu] = useState<number | null>(null);

  const handleMenuClick = (index: number) => {
    setSelectedMenu(index);
  };

  return (
    <div className="w-full h-screen m-auto font-mono p-4 bg-slate-500 opacity-90">
      <Input
        type="text"
        placeholder="Search..."
        icon={<IconSearch size={17} />}
      />
      <div className="mt-4">
        {menus.map((menu, index) => (
          <div
            key={index}
            onClick={() => handleMenuClick(index)}
            className={`px-4 py-1.5 cursor-pointer text-base ${
              selectedMenu === index ? 'bg-blue-200' : 'bg-transparent'
            } rounded-md my-1 font-bold ${
              selectedMenu === index ? '' : 'font-semibold'
            }`}
          >
            {menu}
          </div>
        ))}
      </div>
    </div>
  );
}
