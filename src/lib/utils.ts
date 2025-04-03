import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      // Remove the data URL prefix (like "data:image/png;base64,") and return only the base64 content
      const base64Content = result.split(",")[1];
      resolve(base64Content);
    };
    reader.readAsDataURL(blob);
  });
}
