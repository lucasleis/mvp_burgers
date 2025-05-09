import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";
import ErrorBoundary from "./components/ErrorBoundary"; // Debes crear este componente

// Lazy load de componentes de página
const HomeSection = lazy(() => import("./components/HomeSection"));
const OrderPage = lazy(() => import("./components/OrderPage"));
const OrderConfirmationPage = lazy(() => import("./components/OrderConfirmationPage"));
const OrderSuccess = lazy(() => import("./components/OrderSuccess"));

function App() {
  return (
    <Router>
      <div className="app-container">
        <Header />
        <ErrorBoundary>
          <Suspense fallback={<div className="loading">Cargando...</div>}>
            <Routes>
              <Route path="/" element={<HomeSection />} />
              <Route path="/order" element={<OrderPage />} />
              <Route path="/confirmar" element={<OrderConfirmationPage />} />
              <Route path="/pedido-exitoso" element={<OrderSuccess />} />
              <Route path="*" element={<div style={{ padding: "2rem" }}>Página no encontrada</div>} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
