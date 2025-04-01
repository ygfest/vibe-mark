"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useTheme } from "next-themes";

const fileFormats = [
  { name: "SVG", extension: "svg" },
  { name: "PNG", extension: "png" },
  { name: "JPEG", extension: "jpeg" },
  { name: "WebP", extension: "webp" },
];

interface ExportMenuProps {
  imageUrl: string;
}

export default function ExportMenu({ imageUrl }: ExportMenuProps) {
  const { theme } = useTheme();

  const handleExport = (extension: string) => {
    // For now, just download as is, but in the future could convert formats server-side
    const a = document.createElement("a");
    a.href = imageUrl;
    a.download = `logo.${extension}`;
    a.click();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="w-full bg-black dark:bg-white text-white dark:text-black px-4 py-2 rounded-md hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors flex items-center justify-center gap-2">
          <Download className="w-4 h-4" />
          Export
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {fileFormats.map((format) => (
          <DropdownMenuItem
            key={format.extension}
            onClick={() => handleExport(format.extension)}
            className="cursor-pointer"
          >
            <span className="font-medium">{format.name}</span>
            <span className="ml-auto text-xs text-muted-foreground">
              .{format.extension}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
