import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, _) => {
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

// Utility function to convert SVG to image
export async function getSvgAsImage(
  svg: SVGElement,
  isSafari: boolean,
  options = { type: "png", quality: 0.8, scale: 1 }
): Promise<Blob | null> {
  const { type, quality, scale } = options;

  // Create a canvas element
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) return null;

  // Convert the SVG to a data URL
  const svgString = new XMLSerializer().serializeToString(svg);
  const svgBlob = new Blob([svgString], { type: "image/svg+xml" });
  const url = URL.createObjectURL(svgBlob);

  // Create a new image from the SVG
  const img = new Image();

  return new Promise((resolve) => {
    img.onload = () => {
      // Set canvas dimensions
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;

      // Draw the image to the canvas
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Convert canvas to blob
      canvas.toBlob(
        (blob) => {
          URL.revokeObjectURL(url);
          resolve(blob);
        },
        `image/${type}`,
        quality
      );
    };
    img.src = url;
  });
}

// Get any text from shapes (can be expanded based on your needs)
export function getShapesAsText(shapes: any[]): string {
  // Extract text from shapes if needed
  // This is a simple implementation - customize based on your app's needs
  return shapes
    .filter((shape) => shape.type === "text")
    .map((shape) => shape.props?.text || "")
    .join(" ");
}
