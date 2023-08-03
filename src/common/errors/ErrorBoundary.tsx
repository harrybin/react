import React, { ReactNode } from 'react';
import { closeSnackbar, enqueueSnackbar, SnackbarAction } from 'notistack';
import * as StackTrace from 'stacktrace-js';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

interface ErrorBoundaryProps {
    children: ReactNode | ReactNode[];
    fallback?: ReactNode | ReactNode[];
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error;
    stackframes: StackTrace.StackFrame[];
    errorInfo: React.ErrorInfo;
}

/**
 * React error boundary based on documentation: https://reactjs.org/docs/error-boundaries.html
 * Displays errors as snackbar messages to the user.
 */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    getErrorMessage(error: Error): string {
        if (!error.name) error.name = 'Promise.Rejection';
        return `[${error.name}] ${error.message}`;
    }

    getCallStack(stackframes: StackTrace.StackFrame[]): string {
        return stackframes
            .map(function (frame) {
                return `   at ${frame?.toString()}`;
            })
            .join('\n');
    }

    getErrorStringWithCallstack(error: Error, stackframes: StackTrace.StackFrame[]): string {
        return `Error: ${this.getErrorMessage(error)}\n${this.getCallStack(stackframes)}`;
    }

    addToNotiStack(message: string, stackframes: StackTrace.StackFrame[]): void {
        // You can view the information in an alert to see things working like this:
        enqueueSnackbar(
            `Timestamp: ${new Intl.DateTimeFormat('en', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
            }).format(new Date())}\nError; ${message}\n at ${stackframes[0].toString()}\n${
                stackframes[1] ? stackframes[1].toString() : ''
            }`,
            {
                variant: 'error',
                style: { whiteSpace: 'pre-line' },
                action: closeSnackbar as SnackbarAction,
            }
        );
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidMount() {
        window.addEventListener('unhandledrejection', this.promiseRejectionHandler);
    }

    componentWillUnmount() {
        window.removeEventListener('unhandledrejection', this.promiseRejectionHandler);
    }

    /**
     * Makes promise rejections available to the error boundaries error handling and display
     * mechanism.
     */
    private readonly promiseRejectionHandler = (event: PromiseRejectionEvent) => {
        if (event && event.reason) {
            this.handleError(event.reason, {
                componentStack: '',
            });
        }
    };

    errback(err: any): void {
        console.log(err.message);
    }

    private handleError(error: Error, errorInfo: React.ErrorInfo) {
        console.error(error, errorInfo.componentStack);
        this.processError(error);
    }

    processError(error: Error | undefined) {
        if (!error) return;
        // callback is called with an Array[StackFrame]
        StackTrace.fromError(error)
            .then((stackframes) => {
                this.setState({ ...this.state, stackframes, error });
                this.addToNotiStack(this.getErrorMessage(error), stackframes);
            })
            .catch(this.errback);
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        this.handleError(error, errorInfo);
    }
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false } as ErrorBoundaryState;
        this.addToNotiStack = this.addToNotiStack.bind(this);
        this.getErrorStringWithCallstack = this.getErrorStringWithCallstack.bind(this);
        this.getErrorMessage = this.getErrorMessage.bind(this);
        this.getCallStack = this.getCallStack.bind(this);

        window.onerror = (_msg, _url, _line, _col, error) => {
            this.processError(error);

            // If you return true, then error alerts (like in older versions of
            // Internet Explorer) will be suppressed.
            return true; // suppressErrorAlert;
        };
    }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return (
                this.props.fallback ?? (
                    <Box margin="5%">
                        <Typography variant="h5" color="error">
                            {this.state.error && this.getErrorMessage(this.state.error)}
                        </Typography>
                        <Box margin="10px">
                            Stacktrace:
                            {this.state.stackframes &&
                                this.state.stackframes.map((frame, index) => {
                                    return (
                                        <Typography
                                            variant="body1"
                                            key={'stackframe' + index}
                                        >{`   at ${frame?.toString()}`}</Typography>
                                    );
                                })}
                        </Box>
                        <Typography variant="body2">
                            {this.state.errorInfo && this.state.errorInfo.componentStack}
                        </Typography>
                    </Box>
                )
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
