import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { test, expect, describe } from 'vitest';
import { mockUseQuery } from '../../test/setupTests';
import { ChucknorrisData } from './ChuckNorrisJoke';
import Main from './Main';

describe('Main Component - Hallo Starke Feature', () => {
    test('should show "Hallo Starke" button', () => {
        const chuckNorrisMockData = { value: 'Unit Test Chuck Norris joke' } as ChucknorrisData;
        mockUseQuery(chuckNorrisMockData);
        
        render(<Main />);
        
        const halloStarkeButton = screen.getByText('Zeige Hallo Starke');
        expect(halloStarkeButton).toBeInTheDocument();
    });

    test('should show "Hallo Starke" message when button is clicked', () => {
        const chuckNorrisMockData = { value: 'Unit Test Chuck Norris joke' } as ChucknorrisData;
        mockUseQuery(chuckNorrisMockData);
        
        render(<Main />);
        
        const halloStarkeButton = screen.getByText('Zeige Hallo Starke');
        fireEvent.click(halloStarkeButton);
        
        const halloStarkeMessage = screen.getByText('Hallo Starke');
        expect(halloStarkeMessage).toBeInTheDocument();
    });

    test('should hide "Hallo Starke" message when close button is clicked', () => {
        const chuckNorrisMockData = { value: 'Unit Test Chuck Norris joke' } as ChucknorrisData;
        mockUseQuery(chuckNorrisMockData);
        
        render(<Main />);
        
        // Click the button to show the message
        const halloStarkeButton = screen.getByText('Zeige Hallo Starke');
        fireEvent.click(halloStarkeButton);
        
        // Verify message is shown
        const halloStarkeMessage = screen.getByText('Hallo Starke');
        expect(halloStarkeMessage).toBeInTheDocument();
        
        // Find and click the close button in the Alert
        const closeButton = screen.getByRole('button', { name: /close/i });
        fireEvent.click(closeButton);
        
        // Verify message is hidden
        expect(screen.queryByText('Hallo Starke')).not.toBeInTheDocument();
    });
});