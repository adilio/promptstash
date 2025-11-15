import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EmptyState } from '@/components/EmptyState';
import { FileText } from 'lucide-react';

describe('EmptyState', () => {
  it('should render title and description', () => {
    render(
      <EmptyState
        icon={FileText}
        title="No items found"
        description="Try creating a new item"
      />
    );

    expect(screen.getByText('No items found')).toBeInTheDocument();
    expect(screen.getByText('Try creating a new item')).toBeInTheDocument();
  });

  it('should render icon', () => {
    const { container } = render(
      <EmptyState
        icon={FileText}
        title="Empty"
        description="Nothing here"
      />
    );

    // Icon should be rendered (lucide-react renders SVG)
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('should render action button when provided', () => {
    const action = {
      label: 'Create New',
      onClick: vi.fn(),
    };

    render(
      <EmptyState
        icon={FileText}
        title="Empty"
        description="Nothing here"
        action={action}
      />
    );

    const button = screen.getByRole('button', { name: 'Create New' });
    expect(button).toBeInTheDocument();
  });

  it('should call action onClick when button is clicked', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const action = {
      label: 'Create New',
      onClick,
    };

    render(
      <EmptyState
        icon={FileText}
        title="Empty"
        description="Nothing here"
        action={action}
      />
    );

    const button = screen.getByRole('button', { name: 'Create New' });
    await user.click(button);

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('should not render action button when not provided', () => {
    render(
      <EmptyState
        icon={FileText}
        title="Empty"
        description="Nothing here"
      />
    );

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
