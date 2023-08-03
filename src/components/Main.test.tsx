import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { mockUseQuery } from '../../test/setupTests';
import { ChucknorrisData } from './ChuckNorrisJoke';
import Main from './Main';

test('renders the main component', () => {
    const chuckNorrisMockData = { value: 'Unit Test Chuck Norris joke' } as ChucknorrisData;
    mockUseQuery(chuckNorrisMockData);
    render(<Main />);
    const component = screen.getByText('app_title');
    expect(component).toBeTruthy();
    expect(component).toBeInTheDocument();
    expect(component).toHaveTextContent('app_title');
});
