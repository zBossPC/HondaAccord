import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div className="crash-screen">
          <img src="/icon.png" alt="" className="app-logo" />
          <h1>Something went wrong</h1>
          <p className="crash-message">{this.state.error.message}</p>
          <button
            type="button"
            className="crash-reload"
            onClick={() => window.location.reload()}
          >
            Reload HondaAccord
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
