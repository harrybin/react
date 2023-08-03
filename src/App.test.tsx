import React from 'react';
import App from './App';
import { render, screen, waitFor } from '@testing-library/react';
import 'vitest-fetch-mock';

beforeEach(() => {
    fetchMock.doMock();
});

test('renders the app', async () => {
    // Arrange
    fetchMock.mockResponse(JSON.stringify({}));

    // Act
    render(<App />);

    // Assert
    await waitFor(() => {
        const component = screen.getByText('react');
        expect(component).toBeTruthy();
        expect(component).toBeInTheDocument();
        expect(component).toHaveTextContent('react');
    });
});
