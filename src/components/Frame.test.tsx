import React from 'react';
import { Frame } from './Frame';
import { render, screen } from '@testing-library/react';

test('renders the frame component', () => {
    render(<Frame>{<h1>Hello world</h1>}</Frame>);
    const component = screen.getByRole('heading', { name: 'Hello world' });
    expect(component).toBeTruthy();
    expect(component).toBeInTheDocument();
    expect(component).toHaveTextContent('Hello world');
});
