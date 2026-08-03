import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from './Button';
import { logger } from '../../utils/logger';

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
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
    logger.error('Uncaught Error Boundary exception:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined });
    window.location.href = '/dashboard';
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 text-center select-none">
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 mb-6">
            <AlertTriangle className="h-12 w-12" />
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight sm:text-3xl">
            System Execution Error
          </h1>
          <p className="mt-2 text-sm text-slate-400 max-w-md">
            An unexpected runtime error occurred within the interface layer.
          </p>
          <div className="mt-8">
            <Button onClick={this.handleReset} size="lg">
              Reload Interface
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
