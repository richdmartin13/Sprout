import React from 'react';

export default function AlertSheet({ title, body, onClose }) {
  return (
    <>
      <div className="sheet-backdrop" onClick={onClose} />
      <div className="sheet">
        <div className="sheet-grab" />
        <h2>{title}</h2>
        <p style={{ color: 'var(--text-2)', fontSize: 13.5, lineHeight: 1.5, marginBottom: 14, whiteSpace: 'pre-wrap' }}>
          {body}
        </p>
        <div className="sheet-actions" style={{ gridTemplateColumns: '1fr' }}>
          <button className="primary" onClick={onClose}>OK</button>
        </div>
      </div>
    </>
  );
}
