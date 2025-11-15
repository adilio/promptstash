import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Loading } from '@/components/Loading';

describe('Loading', () => {
  it('should render loading component', () => {
    render(<Loading />);

    // Check for loading text or spinner
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('should be visible', () => {
    const { container } = render(<Loading />);

    expect(container.firstChild).toBeVisible();
  });

  it('should center content', () => {
    const { container } = render(<Loading />);

    const element = container.firstChild as HTMLElement;
    expect(element.className).toMatch(/flex|center/i);
  });
});
