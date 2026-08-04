import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { useMenuItems } from '../hooks/useMenuItems.js';
import DishImage from '../components/DishImage.jsx';

const categories = [
  { key: 'all', label: 'All' },
  { key: 'breakfast', label: 'Breakfast' },
  { key: 'lunch', label: 'Lunch' },
  { key: 'dinner', label: 'Dinner' },
  { key: 'seafood', label: 'Seafood' },
  { key: 'specialty', label: 'Specialty' },
  { key: 'dessert', label: 'Dessert' },
  { key: 'drink', label: 'Drink' },
];

export default function Menu() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const { addToCart } = useCart();
  const { menuItems, loading } = useMenuItems();

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return menuItems.filter((item) => {
      const matchesCategory = filter === 'all' || item.category === filter;
      const matchesSearch = item.name.toLowerCase().includes(term);
      return matchesCategory && matchesSearch;
    });
  }, [search, filter, menuItems]);

  return (
    <>
      <header className="page-header has-photo" style={{ '--photo-url': `url(https://images.unsplash.com/photo-1547573854-74d2a71d0826?w=1600&q=80&auto=format)` }}>
        <div className="container">
          <div className="breadcrumb-ticket mb-2"><Link to="/">Home</Link><span className="sep">/</span>Menu</div>
          <h1>Our Menu</h1>
          <p className="lead-sub">Wood-fired plates, garden produce, and honest flavor &mdash; browse it all below.</p>
        </div>
      </header>

      <section>
        <div className="container">
          <div className="row justify-content-between align-items-center mb-4 g-3">
            <div className="col-md-6">
              <input
                type="text"
                className="form-control"
                placeholder="Search the menu, e.g. pizza, coffee..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="col-md-6 text-md-end">
              {categories.map((c) => (
                <button
                  key={c.key}
                  className={`filter-btn${filter === c.key ? ' active' : ''}`}
                  onClick={() => setFilter(c.key)}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          <div className="row g-4">
            {filtered.map((item) => (
              <div className="col-md-6 col-lg-4" key={item.id}>
                <div className="ticket-card h-100">
                  <div className="menu-photo"><DishImage item={item} /></div>
                  <span className="badge-cat mb-3">{item.category[0].toUpperCase() + item.category.slice(1)}</span>
                  <div className="menu-line"><span className="name">{item.name}</span><span className="fill"></span><span className="price">${item.price}</span></div>
                  <p className="text-muted small mt-2 mb-3">{item.desc}</p>
                  <button className="btn btn-outline-ink btn-sm order-btn" onClick={() => addToCart(item.id, item.name, item.price)}>Order Now</button>
                </div>
              </div>
            ))}
          </div>

          {!loading && filtered.length === 0 && (
            <p className="text-center text-muted mt-5">No dishes match your search.</p>
          )}
        </div>
      </section>
    </>
  );
}
