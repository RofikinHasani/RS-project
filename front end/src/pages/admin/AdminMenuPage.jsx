import { useEffect, useMemo, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout.jsx';
import { useAdminAuth } from '../../context/AdminAuthContext.jsx';
import { api } from '../../lib/api.js';

const CATEGORIES = ['breakfast', 'lunch', 'dinner', 'seafood', 'specialty', 'dessert', 'drink'];
const EMPTY_FORM = { name: '', category: 'lunch', price: '', description: '', photo_url: '', featured: false };

export default function AdminMenuPage() {
  const { token } = useAdminAuth();
  const [items, setItems] = useState(null);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  function loadItems() {
    return api.getAdminMenuItems(token)
      .then((data) => setItems(Array.isArray(data) ? data : []))
      .catch((err) => setError(err.message || 'Could not load menu items.'));
  }

  useEffect(() => {
    let cancelled = false;
    api.getAdminMenuItems(token)
      .then((data) => !cancelled && setItems(Array.isArray(data) ? data : []))
      .catch((err) => !cancelled && setError(err.message || 'Could not load menu items.'));
    return () => { cancelled = true; };
  }, [token]);

  const filtered = useMemo(() => {
    if (!items) return [];
    const term = search.trim().toLowerCase();
    return items.filter((i) => !term || i.name.toLowerCase().includes(term));
  }, [items, search]);

  function openAddModal() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError('');
    setModalOpen(true);
  }

  function openEditModal(item) {
    setEditingId(item.id);
    setForm({
      name: item.name,
      category: item.category,
      price: item.price,
      description: item.description || '',
      photo_url: item.photo_url || '',
      featured: !!item.featured,
    });
    setFormError('');
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
  }

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setFormError('');
    try {
      const payload = { ...form, price: parseFloat(form.price) };
      if (editingId) {
        await api.updateAdminMenuItem(token, editingId, payload);
      } else {
        await api.createAdminMenuItem(token, payload);
      }
      await loadItems();
      setModalOpen(false);
    } catch (err) {
      setFormError(err.message || 'Could not save this dish.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(item) {
    if (!window.confirm(`Delete "${item.name}" from the menu? This can't be undone.`)) return;
    try {
      await api.deleteAdminMenuItem(token, item.id);
      setItems((list) => list.filter((i) => i.id !== item.id));
    } catch (err) {
      setError(err.message || 'Could not delete this dish.');
    }
  }

  return (
    <AdminLayout title="Menu Items">
      {error && <div className="auth-error mb-4">{error}</div>}

      <div className="admin-card">
        <div className="admin-card-header">
          <h2>All Dishes {items ? `(${filtered.length})` : ''}</h2>
          <button type="button" className="btn btn-ember btn-sm" onClick={openAddModal}>+ Add Dish</button>
        </div>

        <div className="admin-filter-row">
          <input
            type="text"
            placeholder="Search dish name…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ minWidth: 220 }}
          />
        </div>

        <div className="admin-table-scroll">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Dish</th>
                <th>Category</th>
                <th>Price</th>
                <th>Featured</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items === null && <tr><td colSpan={5} className="admin-empty">Loading menu items…</td></tr>}
              {items && filtered.length === 0 && <tr><td colSpan={5} className="admin-empty">No dishes match.</td></tr>}
              {filtered.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div><strong>{item.name}</strong></div>
                    <div className="muted-sub" style={{ maxWidth: 320 }}>{item.description}</div>
                  </td>
                  <td className="text-capitalize">{item.category}</td>
                  <td><strong>${Number(item.price).toFixed(2)}</strong></td>
                  <td>{item.featured ? <span className="admin-badge tone-green">featured</span> : <span className="muted-sub">—</span>}</td>
                  <td className="text-end">
                    <button type="button" className="admin-action-btn" aria-label="Edit" title="Edit" onClick={() => openEditModal(item)}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z" /></svg>
                    </button>
                    <button type="button" className="admin-action-btn danger" aria-label="Delete" title="Delete" onClick={() => handleDelete(item)}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M8 6V4a1 1 0 011-1h6a1 1 0 011 1v2m2 0-1 14a1 1 0 01-1 1H8a1 1 0 01-1-1L6 6" /></svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className={`admin-modal-overlay${modalOpen ? ' open' : ''}`} onClick={closeModal}>
        <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
          <h3>{editingId ? 'Edit Dish' : 'Add New Dish'}</h3>
          {formError && <div className="auth-error mb-3">{formError}</div>}
          <form onSubmit={handleSave}>
            <div className="row g-3">
              <div className="col-12">
                <label className="form-label">Name</label>
                <input type="text" className="form-control" required value={form.name} onChange={(e) => update('name', e.target.value)} />
              </div>
              <div className="col-6">
                <label className="form-label">Category</label>
                <select className="form-select" value={form.category} onChange={(e) => update('category', e.target.value)}>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c[0].toUpperCase() + c.slice(1)}</option>)}
                </select>
              </div>
              <div className="col-6">
                <label className="form-label">Price ($)</label>
                <input type="number" step="0.01" min="0" className="form-control" required value={form.price} onChange={(e) => update('price', e.target.value)} />
              </div>
              <div className="col-12">
                <label className="form-label">Description</label>
                <textarea className="form-control" rows={2} value={form.description} onChange={(e) => update('description', e.target.value)} />
              </div>
              <div className="col-12">
                <label className="form-label">Photo URL (optional)</label>
                <input type="text" className="form-control" placeholder="https://…" value={form.photo_url} onChange={(e) => update('photo_url', e.target.value)} />
              </div>
              <div className="col-12 form-check ps-4">
                <input type="checkbox" className="form-check-input" id="featuredCheck" checked={form.featured} onChange={(e) => update('featured', e.target.checked)} />
                <label className="form-check-label" htmlFor="featuredCheck">Show on homepage &ldquo;Featured&rdquo; section</label>
              </div>
            </div>

            <div className="d-flex gap-2 mt-4">
              <button type="submit" className="btn btn-ember flex-grow-1" disabled={saving}>
                {saving ? 'Saving…' : editingId ? 'Save Changes' : 'Add Dish'}
              </button>
              <button type="button" className="btn btn-outline-ink" onClick={closeModal} disabled={saving}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}
