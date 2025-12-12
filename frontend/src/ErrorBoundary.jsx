// frontend/src/ErrorBoundary.jsx
import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    this.setState({ error, info });
    console.error("Caught by ErrorBoundary:", error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 24, fontFamily: "system-ui, Arial" }}>
          <h1 style={{ color: "#b71c1c" }}>App error — details below</h1>
          <pre style={{ whiteSpace: "pre-wrap" }}>
            {this.state.error && this.state.error.toString()}
          </pre>
          <details style={{ whiteSpace: "pre-wrap" }}>
            {this.state.info && this.state.info.componentStack}
          </details>
          <p>Open DevTools → Console for full stack trace.</p>
        </div>
      );
    }
    return this.props.children;
  }
}
