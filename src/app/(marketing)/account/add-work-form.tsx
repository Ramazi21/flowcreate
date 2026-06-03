"use client";

import { useState } from "react";

const CATEGORIES = [
  { value: "risunki", label: "Рисунки" },
  { value: "decor", label: "Декор" },
  { value: "furniture", label: "Мебель" },
  { value: "lighting", label: "Освещение" },
  { value: "other", label: "Другое" },
];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9а-яё]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function AddWorkForm() {
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    price: 0,
    imageUrl: "",
    description: "",
    category: "decor",
  });

  async function onImageFileSelect(file: File | null) {
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) {
      alert("Файл больше 8 МБ. Выберите изображение меньшего размера.");
      return;
    }
    setUploadingImage(true);

    const payload = new FormData();
    payload.append("file", file);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: payload,
    });

    let data: { error?: string; url?: string } = {};
    try {
      data = (await response.json()) as { error?: string; url?: string };
    } catch {}
    setUploadingImage(false);

    if (!response.ok) {
      alert(typeof data.error === "string" ? data.error : "Не удалось загрузить изображение");
      return;
    }

    if (typeof data.url !== "string" || !data.url) {
      alert("Сервер не вернул адрес файла");
      return;
    }

    setForm((current) => ({ ...current, imageUrl: data.url }));
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.error || "Ошибка добавления работы");
        return;
      }

      setSuccess(true);
      setForm({
        title: "",
        slug: "",
        price: 0,
        imageUrl: "",
        description: "",
        category: "decor",
      });

      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      alert("Ошибка добавления работы");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border border-black/10 bg-white p-6 shadow-soft">
      <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-charcoal/60">Добавить свою работу</h2>

      {success && (
        <div className="mt-4 rounded bg-emerald-50 p-3 text-sm text-emerald-600">
          ✅ Работа отправлена на модерацию!
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-800">Название работы</label>
          <p className="text-xs text-gray-500">Название, которое увидят покупатели</p>
          <input
            type="text"
            required
            className="mt-2 w-full rounded border border-gray-300 px-3 py-2"
            value={form.title}
            onChange={(e) => {
              const title = e.target.value;
              setForm((current) => ({
                ...current,
                title,
                slug: current.slug === "" || current.slug === slugify(current.title) ? slugify(title) : current.slug,
              }));
            }}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-800">URL-имя (slug)</label>
          <p className="text-xs text-gray-500">Короткое название для ссылки (только латиница, цифры, дефис). Пример: <code>moja-kartina</code></p>
          <input
            type="text"
            required
            className="mt-2 w-full rounded border border-gray-300 px-3 py-2"
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: slugify(e.target.value) })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-800">Цена</label>
          <p className="text-xs text-gray-500">Цена в рублях, целое число</p>
          <input
            type="number"
            required
            min={0}
            className="mt-2 w-full rounded border border-gray-300 px-3 py-2"
            value={form.price || ""}
            onChange={(e) => setForm({ ...form, price: parseInt(e.target.value) || 0 })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-800">Изображение</label>
          <p className="text-xs text-gray-500">Загрузите фото работы (формат: JPG, PNG, WebP; до 8 МБ)</p>
          <div className="mt-2 rounded border border-dashed border-gray-300 p-3">
            <input
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/webp,.jpg,.jpeg,.png,.webp"
              required={!form.imageUrl}
              onChange={(event) => {
                const file = event.target.files?.[0] ?? null;
                void onImageFileSelect(file);
                event.target.value = "";
              }}
              className="w-full text-sm"
            />
            {uploadingImage ? <p className="mt-1 text-xs text-gray-700">Загрузка...</p> : null}
            {form.imageUrl ? (
              <div className="mt-3">
                <p className="text-xs text-emerald-600">Изображение загружено: {form.imageUrl}</p>
                <img src={form.imageUrl} alt="Preview" className="mt-2 h-32 w-32 object-cover rounded border" />
              </div>
            ) : null}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-800">Категория</label>
          <p className="text-xs text-gray-500">Выберите категорию, чтобы работу было проще найти</p>
          <select
            className="mt-2 w-full rounded border border-gray-300 px-3 py-2"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          >
            {CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-800">Описание</label>
          <p className="text-xs text-gray-500">Подробное описание работы, материалы и особенности</p>
          <textarea
            required
            rows={4}
            className="mt-2 w-full rounded border border-gray-300 px-3 py-2"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>

        <button
          type="submit"
          disabled={loading || uploadingImage}
          className="rounded bg-[#1f3342] px-5 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          {loading ? "Добавляем..." : "Добавить работу"}
        </button>
      </form>
    </div>
  );
}
