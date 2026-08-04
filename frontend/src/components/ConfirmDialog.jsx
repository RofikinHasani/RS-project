import { useEffect } from 'react';

/**
 * A small, styled confirm dialog (replaces the browser's default
 * window.confirm popup). Controlled — pass `open` plus handlers.
 *
 * <ConfirmDialog
 *   open={showLogoutConfirm}
 *   title="Log out?"
 *   message="Are you sure you want to log out?"
 *   confirmLabel="Yes, Log Out"
 *   onConfirm={...}
 *   onCancel={...}
 * />
 */
export default function ConfirmDialog({
  open,
  title = 'Are you sure?',
  message,
  confirmLabel = 'OK',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
}) {
  useEffect(() => {
    if (!open) return;
    function onKeyDown(e) {
      if (e.key === 'Escape') onCancel?.();
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirmDialogTitle"
      onClick={onCancel}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(17, 17, 17, 0.55)',
        zIndex: 2000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
    >
      <div
        className="ticket-card"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: 400, width: '100%', textAlign: 'center' }}
      >
        <h5 id="confirmDialogTitle" className="mb-2">{title}</h5>
        {message && <p className="text-muted mb-4">{message}</p>}
        <div className="d-flex justify-content-center gap-3">
          <button type="button" className="btn btn-outline-ink" onClick={onCancel}>
            {cancelLabel}
          </button>
          <button type="button" className="btn btn-ember" onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
