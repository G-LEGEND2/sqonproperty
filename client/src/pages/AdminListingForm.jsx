import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function AdminListingForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const token = localStorage.getItem("adminToken");

  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    price: "",
    type: "sale",
    status: "available",
    listedAt: new Date().toISOString().slice(0, 10),
    images: [],
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEdit) return;
    const load = async () => {
      const res = await fetch(`/api/listing/get/${id}`);
      const data = await res.json();
      if (res.ok) {
        setForm({
          ...data,
          listedAt: new Date(data.listedAt).toISOString().slice(0, 10),
          images: data.images || [],
        });
      }
    };
    load();
  }, [id, isEdit]);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    setError("");
    try {
      const fd = new FormData();
      Array.from(files).forEach((f) => fd.append("images", f));
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Upload failed");
      setForm((prev) => ({ ...prev, images: [...prev.images, ...data.urls] }));
    } catch (err) {
      setError(err.message);
    }
    setUploading(false);
    e.target.value = "";
  };

  const removeImage = (url) =>
    setForm({ ...form, images: form.images.filter((u) => u !== url) });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const body = { ...form, price: Number(form.price) };
      const url = isEdit
        ? `/api/listing/update/${id}`
        : "/api/listing/create";
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Save failed");
      navigate("/admin");
    } catch (err) {
      setError(err.message);
    }
    setSaving(false);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">
        {isEdit ? "Edit Listing" : "New Listing"}
      </h1>

      {error && (
        <p className="bg-red-50 text-red-700 text-sm px-3 py-2 rounded mb-4">
          {error}
        </p>
      )}

      <form onSubmit={onSubmit} className="bg-white rounded-lg shadow p-6 space-y-4">
        <input
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={onChange}
          required
          className="w-full border rounded px-3 py-2"
        />

        <input
          name="location"
          placeholder="Location (e.g. Lekki, Lagos)"
          value={form.location}
          onChange={onChange}
          required
          className="w-full border rounded px-3 py-2"
        />

        <textarea
          name="description"
          placeholder="Description / Notes"
          value={form.description}
          onChange={onChange}
          required
          rows={5}
          className="w-full border rounded px-3 py-2"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="price"
            type="number"
            placeholder="Price ($)"
            value={form.price}
            onChange={onChange}
            required
            className="w-full border rounded px-3 py-2"
          />
          <input
            name="listedAt"
            type="date"
            value={form.listedAt}
            onChange={onChange}
            className="w-full border rounded px-3 py-2"
          />
          <select
            name="type"
            value={form.type}
            onChange={onChange}
            className="w-full border rounded px-3 py-2"
          >
            <option value="sale">For Sale</option>
            <option value="rent">For Rent</option>
          </select>
          <select
            name="status"
            value={form.status}
            onChange={onChange}
            className="w-full border rounded px-3 py-2"
          >
            <option value="available">Available</option>
            <option value="sold">Sold</option>
            <option value="rented">Rented</option>
            <option value="unavailable">Unavailable</option>
          </select>
        </div>

        {/* Images */}
        <div>
          <label className="block font-semibold mb-2">Images</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={onUpload}
            disabled={uploading}
            className="block w-full text-sm"
          />
          {uploading && <p className="text-sm text-blue-700 mt-2">Uploading…</p>}

          {form.images.length > 0 && (
            <div className="grid grid-cols-3 md:grid-cols-4 gap-3 mt-4">
              {form.images.map((url, i) => (
                <div key={i} className="relative group">
                  <img
                    src={url}
                    alt={`img-${i}`}
                    className="w-full h-24 object-cover rounded border"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(url)}
                    className="absolute top-1 right-1 bg-red-600 text-white w-6 h-6 rounded-full text-xs opacity-0 group-hover:opacity-100"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          disabled={saving || uploading}
          className="bg-blue-700 text-white px-6 py-2 rounded hover:bg-blue-800 disabled:opacity-60"
        >
          {saving ? "Saving…" : isEdit ? "Update Listing" : "Create Listing"}
        </button>
      </form>
    </div>
  );
}
