"use client";

import { useEffect, useMemo, useState } from "react";

type ModerationStatus = "PENDING" | "APPROVED" | "REJECTED";

type AdminProduct = {
  id: string;
  title: string;
  slug: string;
  price: number;
  imageUrl: string;
  description: string;
  stock: number;
  category: string;
  status: ModerationStatus;
  author?: { id: string; name?: string | null; image?: string | null } | null;
};

const initialForm: Omit<AdminProduct, "id"> = {
  title: "",
  slug: "",
  price: 0,
  imageUrl: "",
  description: "",
  stock: 0,
  category: "decor",
  status: "PENDING",
};

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

const maxImageBytes = 8 * 1024 * 1024;

export function ProductForm() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<AdminProduct>>({});

  const editingProduct = useMemo(
    () => products.find((item) => item.id === editingId) ?? null,
    [editingId, products],
  );

  async function loadProducts() {
    setLoading(true);
    try {
      const response = await fetch("/api/products");
      if (!response.ok) throw new Error("Failed");
      const data = (await response.json()) as AdminProduct[];
      setProducts(data);
    } catch (e) {
      console.error("load products error", e);
    }
    setLoading(false);
  }

  useEffect(() => {
    void loadProducts();
  }, []);

  useEffect(() => {
    if (editingProduct) {
      setEditForm({ ...editingProduct });
    }
  }, [editingProduct]);

  async function onImageFileSelect(file: File | null) {
    if (!file) return;
    if (file.size > maxImageBytes) {
      setStatus("error");
      setMessage("Файл больше 8 МБ. Выберите изображение меньшего размера.");
      return;
    }
    setUploadingImage(true);
    setMessage("");

    const payload = new FormData();
    payload.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: payload,
      });
      let data: { error?: string; url?: string } = {};
      try {
        data = (await response.json()) as { error?: string; url?: string };
      } catch {}
      if (!response.ok) {
        setStatus("error");
        setMessage(typeof data.error === "string" ? data.error : "Не удалось загрузить изображение");
        return;
      }
      if (typeof data.url !== "string" || !data.url) {
        setStatus("error");
        setMessage("Сервер не вернул адрес файла");
        return;
      }
      setForm((current) => ({ ...current, imageUrl: data.url }));
      setStatus("success");
      setMessage("Изображение загружено");
    } finally {
      setUploadingImage(false);
    }
  }

  async function onEditImageFileSelect(file: File | null) {
    if (!file || !editingId) return;
    if (file.size > maxImageBytes) {
      setStatus("error");
      setMessage("Файл больше 8 МБ. Выберите изображение меньшего размера.");
      return;
    }
    setUploadingImage(true);
    setMessage("");

    const payload = new FormData();
    payload.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: payload,
      });
      let data: { error?: string; url?: string } = {};
      try {
        data = (await response.json()) as { error?: string; url?: string };
      } catch {}
      if (!response.ok) {
        setStatus("error");
        setMessage(typeof data.error === "string" ? data.error : "Не удалось загрузить изображение");
        return;
      }
      if (typeof data.url !== "string" || !data.url) {
        setStatus("error");
        setMessage("Сервер не вернул адрес файла");
        return;
      }
      setEditForm((current) => ({ ...current, imageUrl: data.url }));
      setStatus("success");
      setMessage("Изображение загружено");
    } finally {
      setUploadingImage(false);
    }
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form.imageUrl.trim()) {
      setStatus("error");
      setMessage("Загрузите изображение.");
      return;
    }
    setStatus("saving");
    setMessage("");

    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        setStatus("error");
        setMessage(typeof error.error === "string" ? error.error : "Не удалось создать товар");
        return;
      }
      setStatus("success");
      setMessage("Товар создан");
      setForm(initialForm);
      await loadProducts();
    } catch {
      setStatus("error");
      setMessage("Ошибка при добавлении товара");
    }
  }

  async function onSaveEdit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editingId) return;
    setStatus("saving");
    setMessage("");
    try {
      const response = await fetch(`/api/products/${editingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        setStatus("error");
        setMessage(typeof error.error === "string" ? error.error : "Не удалось обновить товар");
        return;
      }
      setStatus("success");
      setMessage("Товар обновлён");
      setEditingId(null);
      await loadProducts();
    } catch {
      setStatus("error");
      setMessage("Ошибка при сохранении");
    }
  }

  async function onDelete(id: string) {
    const ok = window.confirm("Удалить товар?");
    if (!ok) return;
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        setStatus("error");
        setMessage("Не удалось удалить товар");
        return;
      }
      await loadProducts();
    } catch {
      setStatus("error");
      setMessage("Ошибка при удалении");
    }
  }

  async function setModeration(id: string, moderationStatus: ModerationStatus) {
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: moderationStatus }),
      });
      if (!response.ok) {
        setStatus("error");
        setMessage("Не удалось изменить статус");
        return;
      }
      await loadProducts();
    } catch {
      setStatus("error");
      setMessage("Ошибка при изменении статуса");
    }
  }

  const statusLabel: Record<string, string> = {
    PENDING: "На проверке",
    APPROVED: "Одобрено",
    REJECTED: "Отклонено",
  };

  return (
    <div className="space-y-8">
      <form onSubmit={onSubmit} className="space-y-4 rounded border border-black/10 bg-white p-6">
        <h2 className="text-xl font-black">Добавление товара</h2>

        {message && (
          <p
            className={`text-sm ${
              status === "error" ? "text-red-700" : status === "success" ? "text-green-700" : "text-gray-700"
            }`}
          >
            {message}
          </p>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-800">Название товара</label>
          <p className="text-xs text-gray-500">Название, которое увидят покупатели</p>
          <input
            type="text"
            required
            value={form.title}
            onChange={(event) => {
              const title = event.target.value;
              setForm((current) => ({
                ...current,
                title,
                slug: current.slug === "" || current.slug === slugify(current.title) ? slugify(title) : current.slug,
              }));
            }}
            className="mt-2 w-full rounded border border-gray-300 px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-800">URL-имя (slug)</label>
          <p className="text-xs text-gray-500">Короткое название для ссылки (только латиница, цифры, дефис)</p>
          <input
            type="text"
            required
            value={form.slug}
            onChange={(event) => setForm((current) => ({ ...current, slug: slugify(event.target.value) }))}
            className="mt-2 w-full rounded border border-gray-300 px-3 py-2"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-800">Цена</label>
            <p className="text-xs text-gray-500">Цена в рублях, целое число</p>
            <input
              required
              type="number"
              min={0}
              value={form.price}
              onChange={(event) => setForm((current) => ({ ...current, price: Number(event.target.value) }))}
              className="mt-2 w-full rounded border border-gray-300 px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-800">Остаток</label>
            <p className="text-xs text-gray-500">Количество доступных единиц</p>
            <input
              required
              type="number"
              min={0}
              value={form.stock}
              onChange={(event) => setForm((current) => ({ ...current, stock: Number(event.target.value) }))}
              className="mt-2 w-full rounded border border-gray-300 px-3 py-2"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-800">Изображение</label>
          <p className="text-xs text-gray-500">Загрузите фото (формат: JPEG, PNG, WebP; максимум 8 МБ)</p>
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
            {uploadingImage && <p className="mt-1 text-xs text-gray-700">Загрузка...</p>}
            {form.imageUrl && (
              <div className="mt-3">
                <p className="text-xs text-emerald-600">Изображение загружено</p>
                <img
                  src={form.imageUrl}
                  alt="Preview"
                  className="mt-2 h-32 w-32 object-cover rounded border"
                />
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-800">Категория</label>
          <p className="text-xs text-gray-500">Выберите подходящую категорию</p>
          <select
            required
            value={form.category}
            onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))}
            className="mt-2 w-full rounded border border-gray-300 px-3 py-2"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-800">Описание</label>
          <p className="text-xs text-gray-500">Подробное описание работы</p>
          <textarea
            required
            rows={4}
            value={form.description}
            onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
            className="mt-2 w-full rounded border border-gray-300 px-3 py-2"
          />
        </div>

        <button
          type="submit"
          disabled={status === "saving" || uploadingImage}
          className="rounded bg-[#32495e] px-5 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          {status === "saving" ? "Сохраняем..." : "Создать товар"}
        </button>
      </form>

      <section className="rounded border border-black/10 bg-white p-6">
        <h2 className="text-xl font-black">Модерация и управление</h2>
        {loading ? (
          <p className="mt-4 text-sm text-gray-600">Загружаем товары...</p>
        ) : (
          <div className="mt-4 space-y-3">
            {products.map((item) => (
              <div key={item.id} className="rounded border border-gray-200 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="space-y-1">
                    <p className="font-semibold text-gray-900">{item.title}</p>
                    {item.author && (
                      <p className="text-xs text-gray-500">Автор: {item.author?.name || item.author?.id}</p>
                    )}
                  </div>
                  <span className="text-xs uppercase tracking-wide text-gray-600">
                    {statusLabel[item.status] || item.status}
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-500">{item.slug}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="rounded border border-gray-300 px-3 py-1 text-xs"
                    onClick={() => setModeration(item.id, "PENDING")}
                  >
                    На проверке
                  </button>
                  <button
                    type="button"
                    className="rounded border border-gray-300 px-3 py-1 text-xs"
                    onClick={() => setModeration(item.id, "APPROVED")}
                  >
                    Одобрить
                  </button>
                  <button
                    type="button"
                    className="rounded border border-gray-300 px-3 py-1 text-xs"
                    onClick={() => setModeration(item.id, "REJECTED")}
                  >
                    Отклонить
                  </button>
                  <button
                    type="button"
                    className="rounded border border-gray-300 px-3 py-1 text-xs"
                    onClick={() => setEditingId(item.id)}
                  >
                    Редактировать
                  </button>
                  <button
                    type="button"
                    className="rounded border border-red-300 px-3 py-1 text-xs text-red-700"
                    onClick={() => onDelete(item.id)}
                  >
                    Удалить
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {editingProduct && (
        <form onSubmit={onSaveEdit} className="space-y-4 rounded border border-black/10 bg-white p-6">
          <h2 className="text-xl font-black">Редактирование товара</h2>

          {message && (
            <p
              className={`text-sm ${
                status === "error" ? "text-red-700" : status === "success" ? "text-green-700" : "text-gray-700"
              }`}
            >
              {message}
            </p>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-800">Название товара</label>
            <p className="text-xs text-gray-500">Название, которое увидят покупатели</p>
            <input
              required
              value={editForm.title || ""}
              onChange={(event) =>
                setEditForm((current) => ({
                  ...current,
                  title: event.target.value,
                  slug: slugify(event.target.value),
                }))
              }
              className="mt-2 w-full rounded border border-gray-300 px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-800">URL-имя (slug)</label>
            <p className="text-xs text-gray-500">Короткое название для ссылки</p>
            <input
              required
              value={editForm.slug || ""}
              onChange={(event) => setEditForm((current) => ({ ...current, slug: slugify(event.target.value) }))}
              className="mt-2 w-full rounded border border-gray-300 px-3 py-2"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-800">Цена</label>
              <p className="text-xs text-gray-500">Цена в рублях</p>
              <input
                required
                type="number"
                min={0}
                value={editForm.price || 0}
                onChange={(event) => setEditForm((current) => ({ ...current, price: Number(event.target.value) }))}
                className="mt-2 w-full rounded border border-gray-300 px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-800">Остаток</label>
              <p className="text-xs text-gray-500">Количество доступных единиц</p>
              <input
                required
                type="number"
                min={0}
                value={editForm.stock || 0}
                onChange={(event) => setEditForm((current) => ({ ...current, stock: Number(event.target.value) }))}
                className="mt-2 w-full rounded border border-gray-300 px-3 py-2"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-800">Изображение</label>
            <p className="text-xs text-gray-500">Загрузите новое фото, если нужно обновить</p>
            <div className="mt-2 rounded border border-dashed border-gray-300 p-3">
              <input
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp,.jpg,.jpeg,.png,.webp"
                onChange={(event) => {
                  const file = event.target.files?.[0] ?? null;
                  void onEditImageFileSelect(file);
                  event.target.value = "";
                }}
                className="w-full text-sm"
              />
              {uploadingImage && <p className="mt-1 text-xs text-gray-700">Загрузка...</p>}
              {(editForm.imageUrl || editingProduct.imageUrl) && (
                <div className="mt-3">
                  <p className="text-xs text-emerald-600">Текущее изображение</p>
                  <img
                    src={editForm.imageUrl || editingProduct.imageUrl}
                    alt="Preview"
                    className="mt-2 h-32 w-32 object-cover rounded border"
                  />
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-800">Категория</label>
            <p className="text-xs text-gray-500">Выберите подходящую категорию</p>
            <select
              required
              value={editForm.category || "decor"}
              onChange={(event) => setEditForm((current) => ({ ...current, category: event.target.value }))}
              className="mt-2 w-full rounded border border-gray-300 px-3 py-2"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-800">Описание</label>
            <p className="text-xs text-gray-500">Подробное описание работы</p>
            <textarea
              required
              rows={4}
              value={editForm.description || ""}
              onChange={(event) => setEditForm((current) => ({ ...current, description: event.target.value }))}
              className="mt-2 w-full rounded border border-gray-300 px-3 py-2"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={status === "saving" || uploadingImage}
              className="rounded bg-[#32495e] px-5 py-2 text-sm font-semibold text-white disabled:opacity-60"
            >
              {status === "saving" ? "Сохраняем..." : "Сохранить"}
            </button>
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setMessage("");
                setStatus("idle");
              }}
              className="rounded border border-gray-300 px-5 py-2 text-sm"
            >
              Отмена
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
