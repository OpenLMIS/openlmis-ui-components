import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import DetailsBlock from '../../react-components/DetailsBlock';

const sampleData = [
    [
        { topic: 'Name', value: 'John Doe' },
        { topic: 'Age', value: 30 }
    ],
    [
        { topic: 'Occupation', value: 'Engineer' },
        { topic: 'Country', value: 'USA' }
    ]
];

test('renders DetailsBlock with provided data', () => {
    render(<DetailsBlock data={sampleData} className="custom-class" />);

    expect(screen.getByText('Name:')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Age:')).toBeInTheDocument();
    expect(screen.getByText('30')).toBeInTheDocument();
    expect(screen.getByText('Occupation:')).toBeInTheDocument();
    expect(screen.getByText('Engineer')).toBeInTheDocument();
    expect(screen.getByText('Country:')).toBeInTheDocument();
    expect(screen.getByText('USA')).toBeInTheDocument();

    // Ensure the custom class is applied
    expect(screen.getByText('Name:').closest('div')).toHaveClass('custom-class');
});