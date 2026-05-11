import React from 'react';

export default function ConfirmSheet({ title, body, confirmLabel = 'Delete', danger = true, onClose, onConfirm }) {
  return (
    <>
      <div className="sheet-backdrop" onClick={onClose} />
      <div className="sheet">
        <div className="sheet-grab" />
        <h2>{title}</h2>
        <p style={{ color: 'var(--text-2)', fontSize: 13.5, lineHeight: 1.5, marginBottom: 14 }}>
          {body}
        </p>
        <div className="sheet-actions">
          <button onClick={onClose}>Cancel</button>
          <button
            className={danger ? 'danger' : 'primary'}
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </>
  );
}
