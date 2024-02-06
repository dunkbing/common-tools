import {
  IconLink,
  IconCodeAsterix,
  IconFileTypeHtml,
  IconTransform,
  IconPhoto,
  IconFileTypeSvg,
  IconUser,
  IconMail,
  IconSettings,
} from '@tabler/icons-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { convertToSlug } from '../../lib/strings';
import IconJwt from '../../assets/icons/jwt';
import IconBase64 from '../../assets/icons/base64';
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from '@/components/ui/command';
import { CommandShortcut } from '../ui/command';

export const menus = {
  jsonViewer: {
    title: 'JSON Viewer',
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
  htmlViewer: {
    title: 'HTML Viewer',
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
  svgViewer: {
    title: 'SVG Viewer',
    icon: <IconFileTypeSvg />,
  },
};

export const menuSlugs = {
  jsonViewer: convertToSlug(menus.jsonViewer.title),
  base64: convertToSlug(menus.base64.title),
  base64Image: convertToSlug(menus.base64Image.title),
  url: convertToSlug(menus.url.title),
  jwt: convertToSlug(menus.jwt.title),
  htmlViewer: convertToSlug(menus.htmlViewer.title),
  yaml: convertToSlug(menus.yaml.title),
  json: convertToSlug(menus.json.title),
  svgViewer: convertToSlug(menus.svgViewer.title),
};

export type Menu = keyof typeof menus;

export default function Menus() {
  const [selectedMenu, setSelectedMenu] = useState<Menu>('jsonViewer');
  const navigate = useNavigate();

  const handleMenuClick = (key: Menu) => {
    return () => {
      setSelectedMenu(key);
      navigate(`/${menuSlugs[key]}`);
    };
  };

  const selectedStyle = 'bg-slate-200 text-slate-800 pointer-events-none';
  const defaultStyle =
    'aria-selected:bg-slate-800 aria-selected:text-white hover:cursor-pointer';

  return (
    <div className="w-full h-screen m-auto py-4 px-3 bg-slate-800 opacity-90">
      <Command className="text-slate-50 bg-slate-800">
        <CommandInput className="text-slate-200" placeholder="Search..." />
        <CommandList className="max-h-screen mb-2">
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup
            heading="Suggestions"
            className="text-slate-200 text-sm"
          >
            {Object.entries(menus).map(([key, menu]) => (
              <CommandItem
                key={key}
                onSelect={handleMenuClick(key as Menu)}
                className={`gap-2 font-semibold ${
                  selectedMenu === key ? selectedStyle : defaultStyle
                }`}
              >
                {menu.icon}
                <span>{menu.title}</span>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Others" className="text-slate-50 text-sm">
            <CommandItem>
              <IconUser className="mr-2 h-4 w-4" />
              <span>Profile</span>
              <CommandShortcut>⌘P</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <IconMail className="mr-2 h-4 w-4" />
              <span>Mail</span>
              <CommandShortcut>⌘B</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <IconSettings className="mr-2 h-4 w-4" />
              <span>Settings</span>
              <CommandShortcut>⌘S</CommandShortcut>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  );
}
