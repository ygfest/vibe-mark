export default function LogoDisplay({ imageUrl }: { imageUrl: string }) {
  return (
    <div className="mt-4">
      <h2 className="text-xl font-semibold">Generated Logo</h2>
      <img
        src={imageUrl}
        alt="Generated Logo"
        className="w-64 h-64 object-contain mt-2 border rounded"
      />
    </div>
  );
}
