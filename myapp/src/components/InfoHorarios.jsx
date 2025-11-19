// src/components/InfoHorarios.jsx
import React, { useEffect, useState, useRef } from "react";
import "./InfoHorarios.css";
import { X } from "lucide-react";

const OrderInfoModal = ({ onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const closeButtonRef = useRef(null);
  const lastActiveElementRef = useRef(null);

  useEffect(() => {
    // Guardar el elemento que tenía el foco antes de abrir
    lastActiveElementRef.current = document.activeElement;

    // Mostrar animación
    setIsVisible(true);

    // Dar foco al botón cerrar al abrir
    if (closeButtonRef.current) {
      closeButtonRef.current.focus();
    }

    const handleEsc = (e) => {
      if (e.key === "Escape") handleClose();
    };

    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
      // Devolver foco al elemento que lo abrió
      if (lastActiveElementRef.current) {
        lastActiveElementRef.current.focus();
      }
    }, 300);
  };

  return (
    <div
      className={`modal-overlay ${isVisible ? "fade-in" : "fade-out"}`}
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button
          ref={closeButtonRef}
          className="close-button"
          onClick={handleClose}
          aria-label="Cerrar modal"
        >
          <X size={20} aria-hidden="true" />
        </button>

        <h2 id="modal-title">Horario de atención</h2>
        <p>
          Tomamos pedidos de <strong>jueves a domingo</strong> de{" "}
          <strong>17 a 23 hs</strong>.
        </p>
      </div>
    </div>
  );
};

export default OrderInfoModal;
