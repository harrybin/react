import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { ManufacturersResponse } from '../../../api/swagger/manufacturersResponse';
import { mockUseQuery } from '../../../test/setupTests';
import { DotNetApi } from './DotNetApi';

test('render DotNetApi', () => {
    const mockManufacturerData: ManufacturersResponse = { results: [{ id: '1', name: 'manufacturer1' }] };
    mockUseQuery(mockManufacturerData);
    render(<DotNetApi />);
    const component = screen.getByText('DotnetTemplate Api');
    expect(component).toBeTruthy();
    expect(component).toBeInTheDocument();
});
