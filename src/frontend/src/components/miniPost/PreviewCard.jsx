export default function PreviewCard({ data }) {
  return (
    <div className="p-4 rounded-2xl border bg-white shadow-sm">
      <div className="font-semibold mb-2">Listing Preview</div>
      <div className="space-y-1 text-sm">
        <div><span className="font-medium">Title:</span> {data.title || "—"}</div>
        <div><span className="font-medium">Brand:</span> {data.brand || "—"}</div>
        <div><span className="font-medium">Model:</span> {data.model || "—"}</div>
        <div><span className="font-medium">Year:</span> {data.year || "—"}</div>
        <div><span className="font-medium">Price:</span> {data.price ? `$${data.price}` : "—"}</div>
        <div className="text-gray-500 line-clamp-3">{data.description || "Description..."}</div>
      </div>
    </div>
  );
}
