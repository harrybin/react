import { render, screen } from '@testing-library/react';
import { ErrorBoundary } from './ErrorBoundary';
import * as StackTrace from 'stacktrace-js';
import React from 'react';
import { vi } from 'vitest';

// Mock the notistack module.
vi.mock('notistack', () => ({
    enqueueSnackbar: vi.fn(),
    closeSnackbar: vi.fn(),
}));

describe('ErrorBoundary', () => {
    let errorBoundaryInstance: any;

    beforeEach(() => {
        errorBoundaryInstance = new ErrorBoundary({ children: <div /> });
    });

    it('getErrorMessage should get error message correctly', () => {
        const error = new Error('test error');
        const message = errorBoundaryInstance.getErrorMessage(error);
        expect(message).toEqual(`[Error] ${error.message}`);
    });

    it('getErrorMessage should get error message correctly for error without name', () => {
        const message = errorBoundaryInstance.getErrorMessage({ message: 'test error' });
        expect(message).toEqual(`[Promise.Rejection] test error`);
    });

    it('getCallStack should process stack frames correctly', () => {
        const stackframes: StackTrace.StackFrame[] = [
            { functionName: 'function1', fileName: 'file1', lineNumber: 1, columnNumber: 1, source: 'source1' },
            { functionName: 'function2', fileName: 'file2', lineNumber: 2, columnNumber: 2, source: 'source2' },
        ];
        const result = errorBoundaryInstance.getCallStack(stackframes);
        const expected = `   at ${stackframes[0]?.toString()}\n   at ${stackframes[1]?.toString()}`;
        expect(result).toEqual(expected);
    });

    it('getErrorStringWithCallstack should process stack frames correctly', () => {
        const stackframes: StackTrace.StackFrame[] = [
            { functionName: 'function1', fileName: 'file1', lineNumber: 1, columnNumber: 1, source: 'source1' },
            { functionName: 'function2', fileName: 'file2', lineNumber: 2, columnNumber: 2, source: 'source2' },
        ];
        const result = errorBoundaryInstance.getErrorStringWithCallstack(new Error('test error'), stackframes);
        const expected = `Error: [Error] test error\n   at ${stackframes[0]?.toString()}\n   at ${stackframes[1]?.toString()}`;
        expect(result).toEqual(expected);
    });

    it('should render children correctly when there is no error', () => {
        render(<ErrorBoundary>{'child'}</ErrorBoundary>);
        expect(screen.getByText('child')).toBeInTheDocument();
    });

    it('should render default fallback when there is an error', () => {
        const ThrowError = () => {
            throw new Error('Test');
        };
        render(
            <ErrorBoundary>
                <>
                    <ThrowError />
                </>
            </ErrorBoundary>
        );
        expect(screen.getByText('Stacktrace:')).toBeInTheDocument();
    });

    it('should render fallback when there is an error', () => {
        const ThrowError = () => {
            throw new Error('Test');
        };
        render(
            <ErrorBoundary fallback={<>{'error'}</>}>
                <ThrowError />
            </ErrorBoundary>
        );
        expect(screen.getByText('error')).toBeInTheDocument();
    });
});
