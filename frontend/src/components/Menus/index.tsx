import {
  IconSearch,
  IconJson,
  IconLink,
  IconCodeAsterix,
  IconFileTypeHtml,
  IconTransform,
  IconPhoto,
} from '@tabler/icons-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../Input';
import { convertToSlug } from '../../lib/strings';
import IconJwt from '../../assets/icons/jwt';
import IconBase64 from '../../assets/icons/base64';

export const menus = {
  jsonFormatter: {
    title: 'JSON Formatter',
    icon: <IconCodeAsterix />,
  },
  base64: {
    title: 'Base64 String Encode/Decode',
    icon: <IconBase64 size={23} />,
  },
  base64Image: {
    title: 'Base64 Image Encode/Decode',
    icon: <IconPhoto />,
  },
  url: {
    title: 'URL Encode/Decode',
    icon: <IconLink />,
  },
  jwt: {
    title: 'JWT',
    icon: <IconJwt size={23} />,
  },
  html: {
    title: 'HTML Preview',
    icon: <IconFileTypeHtml />,
  },
  yaml: {
    title: 'YAML to JSON',
    icon: <IconTransform />,
  },
  json: {
    title: 'JSON to YAML',
    icon: <IconTransform />,
  },
};

export const menuSlugs = {
  jsonFormatter: convertToSlug(menus.jsonFormatter.title),
  base64: convertToSlug(menus.base64.title),
  base64Image: convertToSlug(menus.base64Image.title),
  url: convertToSlug(menus.url.title),
  jwt: convertToSlug(menus.jwt.title),
  html: convertToSlug(menus.html.title),
  yaml: convertToSlug(menus.yaml.title),
  json: convertToSlug(menus.json.title),
};

export type Menu = keyof typeof menus;

export default function Menus() {
  const [selectedMenu, setSelectedMenu] = useState<Menu>('base64');
  const navigate = useNavigate();

  const handleMenuClick = (key: Menu) => {
    setSelectedMenu(key);
    navigate(`/${menuSlugs[key]}`);
  };

  return (
    <div className="w-full h-screen m-auto font-mono p-4 bg-slate-600 opacity-90">
      <Input
        type="text"
        placeholder="Search..."
        icon={<IconSearch size={17} color="white" />}
      />
      <div className="mt-4">
        {Object.entries(menus).map(([key, menu]) => (
          <div
            key={key}
            onClick={() => handleMenuClick(key as Menu)}
            className={`flex flex-row gap-2 items-center px-4 py-1.5 cursor-pointer text-base text-white ${
              selectedMenu === key ? 'bg-blue-500' : 'bg-transparent'
            } rounded-md my-1 font-bold ${
              selectedMenu === key ? '' : 'font-normal'
            }`}
          >
            {menu.icon}
            {menu.title}
          </div>
        ))}
      </div>
    </div>
  );
}
