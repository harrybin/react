import { render, screen } from '@testing-library/react';
import { ErrorBoundary } from './ErrorBoundary';
import { beforeEach, describe, it, expect } from 'vitest';
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
