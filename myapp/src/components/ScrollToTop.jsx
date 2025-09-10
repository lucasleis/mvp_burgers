// src/components/ScrollToTop.jsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // 🔒 Validar que window esté disponible (prevención en SSR)
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }

    // ♿ Mejora accesibilidad: mover foco al main si existe
    const mainContent = document.querySelector("main");
    if (mainContent) {
      mainContent.setAttribute("tabindex", "-1");
      mainContent.focus();
    }
  }, [pathname]);

  return null;
};

export default ScrollToTop;
