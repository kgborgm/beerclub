import { render, screen } from '@testing-library/react';
import App from './App';

test('renders NavBar', () => {
  render(<App />);
  const navBarElement = screen.getByText(/Beer Club Analytics by Tavour/i);
  expect(navBarElement).toBeInTheDocument();
});
