import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught Error Boundary exception:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 my-4 bg-white border border-red-200 rounded-xl text-center space-y-3 shadow-sm">
          <AlertTriangle className="w-8 h-8 text-amber-600 mx-auto" />
          <h3 className="text-lg font-semibold text-slate-900">
            {this.props.fallbackTitle || 'Unable to load module'}
          </h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            {this.state.error?.message || 'A temporary error occurred while rendering this section.'}
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Reload Section
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
