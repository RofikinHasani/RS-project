const TONES = {
  placed: 'amber',
  preparing: 'blue',
  completed: 'green',
  cancelled: 'red',
  confirmed: 'green',
};

export default function StatusBadge({ status }) {
  const tone = TONES[status] || 'gray';
  return <span className={`admin-badge tone-${tone}`}>{status}</span>;
}
