export default function RightSidebar({ children }) {
  // children = [PreviewCard, Tips]
  return <div className="space-y-4">{children}</div>;
}
export function PostingTips() {
  return (
    <div className="p-4 rounded-2xl border bg-white shadow-sm">
      <div className="font-semibold mb-2">Posting Tips</div>
      <ul className="list-disc pl-5 text-sm space-y-1">
        <li>Use a clear, specific title (brand, model, year).</li>
        <li>Add battery health and service records to increase trust.</li>
        <li>Upload photos with good lighting (exterior & interior).</li>
      </ul>
    </div>
  );
}