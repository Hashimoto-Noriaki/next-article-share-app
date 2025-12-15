import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

function TestComponent() {
  return <h1>Hello Testing Library</h1>;
}

describe('TestComponent', () => {
  it('renders heading', () => {
    render(<TestComponent />);
    expect(screen.getByText('Hello Testing Library')).toBeInTheDocument();
  });
});
