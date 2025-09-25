import React from 'react';
import { render, screen } from '@testing-library/react';
import { MessagesProvider } from './MessagesProvider';
import { SnackbarProvider } from 'notistack';
import { describe, expect, it, vi } from 'vitest';

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
        expect(screen.getByText('Test child')).exist;
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
                Components: expect.any(Object),
                classes: expect.any(Object),
                children: expect.any(Object),
            }),
            undefined
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
                Components: expect.any(Object),
                classes: expect.any(Object),
                children: expect.any(Object),
            }),
            undefined
        );
    });
});
