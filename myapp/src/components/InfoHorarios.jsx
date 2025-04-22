import React, { useEffect } from 'react';
import './InfoHorarios.css';
import { X } from 'lucide-react';

const OrderInfoModal = ({ onClose }) => {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>
          <X size={20} />
        </button>
        <h2>Horario de atención</h2>
        <p>Tomamos pedidos de <strong>jueves a domingo</strong> de <strong>17 a 23 hs</strong>.</p>
      </div>
    </div>
  );
};

export default OrderInfoModal;
