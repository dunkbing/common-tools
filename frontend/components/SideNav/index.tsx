"use client";

import { useState } from "react";
import {
  Braces,
  Code2,
  FileImage,
  Image as ImageIcon,
  Link as LinkIcon,
  Replace,
} from "lucide-react";
import clsx from "clsx";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import IconBase64 from "../../assets/icons/base64";
import IconJwt from "../../assets/icons/jwt";
import { convertToSlug } from "@/lib/strings";
import Link from "next/link";
import { Resizable } from "re-resizable";
import { usePathname } from "next/navigation";

export const menus = {
  jsonViewer: {
    title: "JSON Viewer",
    icon: <Braces />,
  },
  jsonTransformer: {
    title: "JSON Transformer",
    icon: <Replace />,
  },
  base64: {
    title: "Base64 String Encode/Decode",
    icon: <IconBase64 size={23} />,
  },
  base64Image: {
    title: "Base64 Image Encode/Decode",
    icon: <FileImage />,
  },
  url: {
    title: "URL Encode/Decode",
    icon: <LinkIcon />,
  },
  jwt: {
    title: "JWT",
    icon: <IconJwt size={23} />,
  },
  htmlViewer: {
    title: "HTML Viewer",
    icon: <Code2 />,
  },
  htmlToMarkdown: {
    title: "HTML To Markdown",
    icon: <Code2 />,
  },
  yaml: {
    title: "YAML to JSON",
    icon: <Replace />,
  },
  svgViewer: {
    title: "SVG Viewer",
    icon: <ImageIcon />,
  },
  composerize: {
    title: "Docker Composerize",
    icon: <Braces />,
  },
};

export const menuSlugs = {
  jsonViewer: convertToSlug(menus.jsonViewer.title),
  jsonTransformer: convertToSlug(menus.jsonTransformer.title),
  base64: convertToSlug(menus.base64.title),
  base64Image: convertToSlug(menus.base64Image.title),
  url: convertToSlug(menus.url.title),
  jwt: convertToSlug(menus.jwt.title),
  htmlViewer: convertToSlug(menus.htmlViewer.title),
  htmlToMarkdown: convertToSlug(menus.htmlToMarkdown.title),
  yaml: convertToSlug(menus.yaml.title),
  svgViewer: convertToSlug(menus.svgViewer.title),
  composerize: convertToSlug(menus.composerize.title),
};

export type Menu = keyof typeof menus;

export default function SideNav() {
  const [width, setWidth] = useState(340);
  const pathname = usePathname();

  return (
    <Resizable
      className="resizable"
      size={{
        width,
        height: "100%",
      }}
      maxWidth={390}
      minWidth={270}
      enable={{ right: true }}
      onResizeStop={(e, direction, ref, delta) => {
        setWidth(width + delta.width);
      }}
    >
      <div className="m-auto h-screen w-full bg-gradient-to-r from-slate-900 to-gray-800 px-3 py-4 opacity-85">
        <Command className="bg-inherit text-slate-50">
          <CommandInput className="text-slate-200" placeholder="Search..." />
          <CommandList className="mb-2 max-h-screen">
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup
              heading="Suggestions"
              className="text-sm text-slate-200"
            >
              {Object.entries(menus).map(([key, menu]) => (
                <Link key={key} href={`/${menuSlugs[key as Menu]}`}>
                  <CommandItem
                    // onSelect={handleMenuClick(key as Menu)}
                    className={clsx("gap-2 font-semibold", {
                      "pointer-events-none bg-slate-200 text-slate-800":
                        pathname === menuSlugs[key as Menu],
                      "hover:cursor-pointer aria-selected:bg-slate-800 aria-selected:text-white":
                        pathname !== menuSlugs[key as Menu],
                    })}
                    value={menu.title}
                  >
                    {menu.icon}
                    <span>{menu.title}</span>
                  </CommandItem>
                </Link>
              ))}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Others" className="text-sm text-slate-50">
              <CommandItem>
                <span>Profile</span>
                <CommandShortcut>⌘P</CommandShortcut>
              </CommandItem>
              <CommandItem>
                {/* <IconMail className="mr-2 h-4 w-4" /> */}
                <span>Mail</span>
                <CommandShortcut>⌘B</CommandShortcut>
              </CommandItem>
              <CommandItem>
                {/* <IconSettings className="mr-2 h-4 w-4" /> */}
                <span>Settings</span>
                <CommandShortcut>⌘S</CommandShortcut>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </div>
    </Resizable>
  );
}
