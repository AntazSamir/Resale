import { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button, Card, CardContent } from "./ui";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("[Admin App ErrorBoundary caught error]:", error, errorInfo);
  }

  public handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-100 flex items-center justify-center p-6">
          <Card className="max-w-md w-full border-destructive/40 bg-destructive/5">
            <CardContent className="pt-6 text-center space-y-4">
              <div className="size-12 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mx-auto">
                <AlertTriangle className="size-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-foreground">Something went wrong</h3>
                <p className="text-xs text-muted-foreground">
                  {this.state.error?.message ||
                    "An unexpected error occurred while rendering this page."}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={this.handleReset}
                className="gap-2 text-xs"
              >
                <RefreshCw className="size-3.5" />
                Reload Page
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
