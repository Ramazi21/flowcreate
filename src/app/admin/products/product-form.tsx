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
};

const initialForm: Omit<AdminProduct, "id"> = {
  title: "",
  slug: "",
  price: 0,
  imageUrl: "",
  description: "",
  stock: 0,
  category: "",
  status: "PENDING",
};

export function ProductForm() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);

  const editingProduct = useMemo(
    () => products.find((item) => item.id === editingId) ?? null,
    [editingId, products],
  );

  async function loadProducts() {
    setLoading(true);
    const response = await fetch("/api/products");
    const data = (await response.json()) as AdminProduct[];
    setProducts(data);
    setLoading(false);
  }

  useEffect(() => {
    void loadProducts();
  }, []);

  async function onImageFileSelect(file: File | null) {
    if (!file) return;
    setUploadingImage(true);
    setMessage("");

    const payload = new FormData();
    payload.append("file", file);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: payload,
    });

    const data = await response.json().catch(() => ({}));
    setUploadingImage(false);

    if (!response.ok) {
      setStatus("error");
      setMessage(typeof data.error === "string" ? data.error : "Не удалось загрузить изображение");
      return;
    }

    setForm((current) => ({ ...current, imageUrl: data.url }));
    setStatus("success");
    setMessage("Изображение загружено");
  }

  async function onEditImageFileSelect(file: File | null) {
    if (!file || !editingProduct) return;
    setUploadingImage(true);
    setMessage("");

    const payload = new FormData();
    payload.append("file", file);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: payload,
    });

    const data = await response.json().catch(() => ({}));
    setUploadingImage(false);

    if (!response.ok) {
      setStatus("error");
      setMessage(typeof data.error === "string" ? data.error : "Не удалось загрузить изображение");
      return;
    }

    setProducts((current) =>
      current.map((item) => (item.id === editingProduct.id ? { ...item, imageUrl: data.url } : item)),
    );
    setStatus("success");
    setMessage("Изображение загружено");
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form.imageUrl.trim()) {
      setStatus("error");
      setMessage("Добавьте ссылку на изображение или загрузите файл.");
      return;
    }
    setStatus("saving");
    setMessage("");

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
  }

  async function onSaveEdit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editingProduct) return;

    setStatus("saving");
    setMessage("");
    const response = await fetch(`/api/products/${editingProduct.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editingProduct),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      setStatus("error");
      setMessage(typeof error.error === "string" ? error.error : "Не удалось обновить товар");
      return;
    }

    setStatus("success");
    setMessage("Товар обновлен");
    setEditingId(null);
    await loadProducts();
  }

  async function onDelete(id: string) {
    const ok = window.confirm("Удалить товар?");
    if (!ok) return;

    const response = await fetch(`/api/products/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      setStatus("error");
      setMessage("Не удалось удалить товар");
      return;
    }
    await loadProducts();
  }

  async function setModeration(id: string, moderationStatus: ModerationStatus) {
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
  }

  return (
    <div className="space-y-8">
      <form onSubmit={onSubmit} className="space-y-4 rounded border border-black/10 bg-white p-6">
        <h2 className="text-xl font-black">Добавление товара</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <input
            required
            placeholder="Название"
            value={form.title}
            onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
            className="rounded border border-black/20 px-3 py-2"
          />
          <input
            required
            placeholder="Slug"
            value={form.slug}
            onChange={(event) => setForm((current) => ({ ...current, slug: event.target.value }))}
            className="rounded border border-black/20 px-3 py-2"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <input
            required
            type="number"
            min={0}
            placeholder="Цена, ₽"
            value={form.price}
            onChange={(event) => setForm((current) => ({ ...current, price: Number(event.target.value) }))}
            className="rounded border border-black/20 px-3 py-2"
          />
          <input
            required
            type="number"
            min={0}
            placeholder="Остаток"
            value={form.stock}
            onChange={(event) => setForm((current) => ({ ...current, stock: Number(event.target.value) }))}
            className="rounded border border-black/20 px-3 py-2"
          />
        </div>

        <input
          type="text"
          placeholder="URL изображения"
          value={form.imageUrl}
          onChange={(event) => setForm((current) => ({ ...current, imageUrl: event.target.value }))}
          className="w-full rounded border border-black/20 px-3 py-2"
        />
        <div className="rounded border border-dashed border-black/20 p-3">
          <label className="block text-sm font-medium text-charcoal">Или загрузите файл с устройства</label>
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            onChange={(event) => {
              const file = event.target.files?.[0] ?? null;
              void onImageFileSelect(file);
            }}
            className="mt-2 w-full text-sm"
          />
          <p className="mt-1 text-xs text-charcoal/60">Поддержка: JPG/PNG/WEBP/GIF, до 5 МБ.</p>
          {uploadingImage ? <p className="mt-1 text-xs text-charcoal/80">Загрузка...</p> : null}
        </div>
        <input
          required
          placeholder="Категория"
          value={form.category}
          onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))}
          className="w-full rounded border border-black/20 px-3 py-2"
        />
        <textarea
          required
          rows={4}
          placeholder="Описание"
          value={form.description}
          onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
          className="w-full rounded border border-black/20 px-3 py-2"
        />

        <button
          type="submit"
          disabled={status === "saving"}
          className="rounded bg-[#32495e] px-5 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          {status === "saving" ? "Сохраняем..." : "Создать товар"}
        </button>
        {message ? <p className="text-sm text-charcoal/80">{message}</p> : null}
      </form>

      <section className="rounded border border-black/10 bg-white p-6">
        <h2 className="text-xl font-black">Модерация и управление</h2>
        {loading ? (
          <p className="mt-4 text-sm text-charcoal/70">Загружаем товары...</p>
        ) : (
          <div className="mt-4 space-y-3">
            {products.map((item) => (
              <div key={item.id} className="rounded border border-black/10 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-semibold">{item.title}</p>
                  <span className="text-xs uppercase tracking-wide text-charcoal/70">{item.status}</span>
                </div>
                <p className="mt-1 text-sm text-charcoal/70">{item.slug}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button type="button" className="rounded border border-black/20 px-3 py-1 text-xs" onClick={() => setModeration(item.id, "PENDING")}>
                    На проверке
                  </button>
                  <button type="button" className="rounded border border-black/20 px-3 py-1 text-xs" onClick={() => setModeration(item.id, "APPROVED")}>
                    Одобрить
                  </button>
                  <button type="button" className="rounded border border-black/20 px-3 py-1 text-xs" onClick={() => setModeration(item.id, "REJECTED")}>
                    Отклонить
                  </button>
                  <button type="button" className="rounded border border-black/20 px-3 py-1 text-xs" onClick={() => setEditingId(item.id)}>
                    Редактировать
                  </button>
                  <button type="button" className="rounded border border-red-300 px-3 py-1 text-xs text-red-700" onClick={() => onDelete(item.id)}>
                    Удалить
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {editingProduct ? (
        <form onSubmit={onSaveEdit} className="space-y-4 rounded border border-black/10 bg-white p-6">
          <h2 className="text-xl font-black">Редактирование товара</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <input
              required
              placeholder="Название"
              value={editingProduct.title}
              onChange={(event) =>
                setProducts((current) =>
                  current.map((item) =>
                    item.id === editingProduct.id ? { ...item, title: event.target.value } : item,
                  ),
                )
              }
              className="rounded border border-black/20 px-3 py-2"
            />
            <input
              required
              placeholder="Slug"
              value={editingProduct.slug}
              onChange={(event) =>
                setProducts((current) =>
                  current.map((item) =>
                    item.id === editingProduct.id ? { ...item, slug: event.target.value } : item,
                  ),
                )
              }
              className="rounded border border-black/20 px-3 py-2"
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <input
              required
              type="number"
              min={0}
              value={editingProduct.price}
              onChange={(event) =>
                setProducts((current) =>
                  current.map((item) =>
                    item.id === editingProduct.id ? { ...item, price: Number(event.target.value) } : item,
                  ),
                )
              }
              className="rounded border border-black/20 px-3 py-2"
            />
            <input
              required
              type="number"
              min={0}
              value={editingProduct.stock}
              onChange={(event) =>
                setProducts((current) =>
                  current.map((item) =>
                    item.id === editingProduct.id ? { ...item, stock: Number(event.target.value) } : item,
                  ),
                )
              }
              className="rounded border border-black/20 px-3 py-2"
            />
          </div>
          <input
            required
            type="text"
            value={editingProduct.imageUrl}
            onChange={(event) =>
              setProducts((current) =>
                current.map((item) =>
                  item.id === editingProduct.id ? { ...item, imageUrl: event.target.value } : item,
                ),
              )
            }
            className="w-full rounded border border-black/20 px-3 py-2"
          />
          <div className="rounded border border-dashed border-black/20 p-3">
            <label className="block text-sm font-medium text-charcoal">Или загрузите новый файл с устройства</label>
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              onChange={(event) => {
                const file = event.target.files?.[0] ?? null;
                void onEditImageFileSelect(file);
              }}
              className="mt-2 w-full text-sm"
            />
            <p className="mt-1 text-xs text-charcoal/60">После загрузки путь подставится автоматически.</p>
            {uploadingImage ? <p className="mt-1 text-xs text-charcoal/80">Загрузка...</p> : null}
          </div>
          <input
            required
            value={editingProduct.category}
            onChange={(event) =>
              setProducts((current) =>
                current.map((item) =>
                  item.id === editingProduct.id ? { ...item, category: event.target.value } : item,
                ),
              )
            }
            className="w-full rounded border border-black/20 px-3 py-2"
          />
          <textarea
            required
            rows={4}
            value={editingProduct.description}
            onChange={(event) =>
              setProducts((current) =>
                current.map((item) =>
                  item.id === editingProduct.id ? { ...item, description: event.target.value } : item,
                ),
              )
            }
            className="w-full rounded border border-black/20 px-3 py-2"
          />
          <div className="flex gap-2">
            <button type="submit" className="rounded bg-[#32495e] px-5 py-2 text-sm font-semibold text-white">
              Сохранить
            </button>
            <button type="button" onClick={() => setEditingId(null)} className="rounded border border-black/20 px-5 py-2 text-sm">
              Отмена
            </button>
          </div>
        </form>
      ) : null}
    </div>
  );
}
