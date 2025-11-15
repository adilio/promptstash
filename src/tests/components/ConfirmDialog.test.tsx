import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ConfirmDialog } from '@/components/ConfirmDialog';

describe('ConfirmDialog', () => {
  it('should render when open is true', () => {
    render(
      <ConfirmDialog
        open={true}
        onOpenChange={vi.fn()}
        title="Confirm Action"
        description="Are you sure?"
        onConfirm={vi.fn()}
      />
    );

    expect(screen.getByText('Confirm Action')).toBeInTheDocument();
    expect(screen.getByText('Are you sure?')).toBeInTheDocument();
  });

  it('should not render when open is false', () => {
    render(
      <ConfirmDialog
        open={false}
        onOpenChange={vi.fn()}
        title="Confirm Action"
        description="Are you sure?"
        onConfirm={vi.fn()}
      />
    );

    expect(screen.queryByText('Confirm Action')).not.toBeInTheDocument();
  });

  it('should call onConfirm when confirm button is clicked', async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();

    render(
      <ConfirmDialog
        open={true}
        onOpenChange={vi.fn()}
        title="Confirm Action"
        description="Are you sure?"
        onConfirm={onConfirm}
        confirmText="Delete"
      />
    );

    const confirmButton = screen.getByRole('button', { name: /delete/i });
    await user.click(confirmButton);

    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('should call onOpenChange with false when cancel is clicked', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();

    render(
      <ConfirmDialog
        open={true}
        onOpenChange={onOpenChange}
        title="Confirm Action"
        description="Are you sure?"
        onConfirm={vi.fn()}
      />
    );

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    await user.click(cancelButton);

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('should use custom confirm button text', () => {
    render(
      <ConfirmDialog
        open={true}
        onOpenChange={vi.fn()}
        title="Confirm Action"
        description="Are you sure?"
        onConfirm={vi.fn()}
        confirmText="Yes, Delete"
      />
    );

    expect(screen.getByRole('button', { name: 'Yes, Delete' })).toBeInTheDocument();
  });

  it('should use default confirm button text when not provided', () => {
    render(
      <ConfirmDialog
        open={true}
        onOpenChange={vi.fn()}
        title="Confirm Action"
        description="Are you sure?"
        onConfirm={vi.fn()}
      />
    );

    expect(screen.getByRole('button', { name: /confirm/i })).toBeInTheDocument();
  });
});
