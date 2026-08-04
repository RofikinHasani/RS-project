import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMenuItems } from '../hooks/useMenuItems.js';
import DishImage from '../components/DishImage.jsx';

const otherTiles = [
  {
    name: 'Dining Room',
    category: 'restaurant',
    photo: '/assets/images18.png',
    photoFallback: 'https://images.unsplash.com/photo-1632210826643-9ff7e84be2f9?w=500&h=360&fit=crop&auto=format&q=80',
  },
  {
    name: 'Chef at the Grill',
    category: 'chef',
    photo: '/assets/images17.png',
    photoFallback: 'https://images.unsplash.com/photo-1734313276344-b4105538ac10?w=500&h=360&fit=crop&auto=format&q=80',
  },
  {
    name: 'Guests Dining',
    category: 'customer',
    photo: '/assets/images16.png',
    photoFallback: 'https://images.unsplash.com/photo-1723744910051-da35a92321af?w=500&h=360&fit=crop&auto=format&q=80',
  },
  {
    name: 'Bar Corner',
    category: 'restaurant',
    photo: '/assets/images15.png',
    photoFallback: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=500&h=360&fit=crop&auto=format&q=80',
  },
  {
    name: 'Plating a Dish',
    category: 'chef',
    photo: '/assets/images14.png',
    photoFallback: 'https://images.unsplash.com/photo-1577106263724-2c8e03bfe9cf?w=500&h=360&fit=crop&auto=format&q=80',
  },
  {
    name: 'Weekend Brunch',
    category: 'customer',
    photo: '/assets/images13.png',
    photoFallback: 'https://images.unsplash.com/photo-1629978448078-c94a0ab6500f?w=500&h=360&fit=crop&auto=format&q=80',
  },
];

const categories = [
  { key: 'all', label: 'All' },
  { key: 'food', label: 'Food' },
  { key: 'restaurant', label: 'Restaurant' },
  { key: 'chef', label: 'Chef' },
  { key: 'customer', label: 'Customer' },
];

export default function Gallery() {
  const [filter, setFilter] = useState('all');
  const { menuItems } = useMenuItems();

  const foodTiles = menuItems.map((item) => ({
    name: item.name,
    category: 'food',
    item,
  }));
  const tiles = [...foodTiles, ...otherTiles];
  const filtered = tiles.filter((t) => filter === 'all' || t.category === filter);

  return (
    <>
      <header className="page-header has-photo" style={{ '--photo-url': `url(https://images.unsplash.com/photo-1739792598744-3512897156e3?w=1600&q=80&auto=format)` }}>
        <div className="container">
          <div className="breadcrumb-ticket mb-2"><Link to="/">Home</Link><span className="sep">/</span>Gallery</div>
          <h1>Gallery</h1>
          <p className="lead-sub">A look inside Ember &amp; Vine &mdash; the food, the fire, and the faces behind it.</p>
        </div>
      </header>

      <section>
        <div className="container">
          <div className="text-center mb-4">
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

          <div className="row g-3">
            {filtered.map((tile) => (
              <div className="col-6 col-md-4" key={tile.name}>
                <div className="gallery-tile">
                  <DishImage item={tile.item || tile} alt={tile.name} className="gallery-tile-img" />
                  <span>{tile.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
