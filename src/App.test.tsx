import React from 'react';
import App from './App';
import { render, screen, waitFor } from '@testing-library/react';
import 'vitest-fetch-mock';
import { beforeEach, test, expect } from 'vitest';
import '@testing-library/jest-dom';
import { debug } from 'vitest-preview';

beforeEach(() => {
    fetchMock.doMock();
});

test('renders the app', async () => {
    // Arrange
    fetchMock.mockResponse(JSON.stringify({ Firstname: 'Harry', Lastname: 'Test' }));

    // Act
    render(<App />);

    // Assert
    debug(); // exec `npm run test:preview` to see the rendered output at this point (run test, then reload the preview)

    // Assert
    expect(await screen.findByTestId('main-content')).toBeInTheDocument();
});
