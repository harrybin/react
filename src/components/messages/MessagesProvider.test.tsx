import React from 'react';
import { render, screen } from '@testing-library/react';
import { MessagesProvider } from './MessagesProvider';
import { SnackbarProvider } from 'notistack';
import { vi } from 'vitest';

vi.mock('notistack', () => ({
    SnackbarProvider: vi.fn(({ children }) => <div>{children}</div>),
}));

vi.mock('@mui/material', () => ({
    Alert: vi.fn(() => <div>Mock Alert</div>),
}));

describe('MessagesProvider', () => {
    it('renders children correctly', () => {
        render(
            <MessagesProvider>
                <div>Test child</div>
            </MessagesProvider>
        );
        expect(screen.getByText('Test child')).toBeInTheDocument();
    });

    it('renders SnackbarProvider with correct props', () => {
        render(
            <MessagesProvider>
                <div>Test child</div>
            </MessagesProvider>
        );
        expect(SnackbarProvider).toHaveBeenCalledWith(
            expect.objectContaining({
                dense: true,
                hideIconVariant: true,
                preventDuplicate: true,
                maxSnack: 3,
            }),
            {}
        );
    });

    it('renders SnackbarProvider with correct anchorOrigin', () => {
        render(
            <MessagesProvider>
                <div>Test child</div>
            </MessagesProvider>
        );
        expect(SnackbarProvider).toHaveBeenCalledWith(
            expect.objectContaining({
                anchorOrigin: {
                    horizontal: 'center',
                    vertical: 'bottom',
                },
            }),
            {}
        );
    });
});
