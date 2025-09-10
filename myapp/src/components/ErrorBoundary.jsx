// src/components/ErrorBoundary.jsx
import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorInfo: null };
  }

  static getDerivedStateFromError() {
    // Marca el estado de error para mostrar UI alternativa
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // ⚠️ No mostrar detalles sensibles al usuario en producción
    console.error("Error atrapado por ErrorBoundary:", error, errorInfo);

    // Podés enviar a un servicio externo como Sentry
    // Sentry.captureException(error, { extra: errorInfo });

    this.setState({ errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{ padding: "2rem", color: "#b00020", textAlign: "center" }}
          role="alert"
        >
          <h2>Algo salió mal.</h2>
          <p>Intenta recargar la página o volver al inicio.</p>

          <div style={{ marginTop: "1rem" }}>
            <button onClick={this.handleReload} style={{ marginRight: "1rem" }}>
              Recargar
            </button>
            <button onClick={this.handleGoHome}>Ir al inicio</button>
          </div>

          {process.env.NODE_ENV === "development" && this.state.errorInfo && (
            <details style={{ whiteSpace: "pre-wrap", marginTop: "1rem" }}>
              {this.state.errorInfo?.componentStack}
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
