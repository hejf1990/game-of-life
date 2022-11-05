import { render, screen } from '@testing-library/react';
import App from './App';

test('renders render the panel', () => {
    const input =  [{"x":6,"y":0},{"x":5,"y":1},{"x":7,"y":1},{"x":4,"y":2},{"x":8,"y":2},{"x":4,"y":3},{"x":8,"y":3},{"x":4,"y":4},{"x":8,"y":4},{"x":4,"y":5},{"x":8,"y":5},{"x":4,"y":6},{"x":8,"y":6},{"x":4,"y":7},{"x":8,"y":7},{"x":5,"y":8},{"x":7,"y":8},{"x":6,"y":9}]
    render(<App />);
    const linkElement = screen.getByText(/Conway's Game of Life/i);
    expect(linkElement).toBeInTheDocument();
});
