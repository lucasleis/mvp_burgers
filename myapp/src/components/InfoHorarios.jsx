import React, { useEffect, useState } from 'react';
import './InfoHorarios.css';
import { X } from 'lucide-react';

const OrderInfoModal = ({ onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true); // Activar animación al montar

    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose(), 300); 
  };

  return (
    <div
      className={`modal-overlay ${isVisible ? 'fade-in' : 'fade-out'}`}
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={handleClose} aria-label="Cerrar modal">
          <X size={20} />
        </button>
        <h2 id="modal-title">Horario de atención</h2>
        <p>
          Tomamos pedidos de <strong>jueves a domingo</strong> de <strong>17 a 23 hs</strong>.
        </p>
      </div>
    </div>
  );
};

export default OrderInfoModal;
