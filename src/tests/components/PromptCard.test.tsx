import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PromptCard } from '@/components/PromptCard';
import type { Prompt } from '@/lib/types';

const mockPrompt: Prompt = {
  id: '1',
  team_id: 'team1',
  folder_id: null,
  owner_id: 'user1',
  title: 'Test Prompt',
  body_md: 'This is test content',
  visibility: 'private',
  public_slug: null,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-02T00:00:00Z',
};

describe('PromptCard', () => {
  it('should render prompt title', () => {
    render(
      <PromptCard prompt={mockPrompt} onEdit={vi.fn()} onDelete={vi.fn()} />
    );

    expect(screen.getByText('Test Prompt')).toBeInTheDocument();
  });

  it('should render prompt content preview', () => {
    render(
      <PromptCard prompt={mockPrompt} onEdit={vi.fn()} onDelete={vi.fn()} />
    );

    expect(screen.getByText(/This is test content/)).toBeInTheDocument();
  });

  it('should call onEdit when edit button is clicked', async () => {
    const user = userEvent.setup();
    const onEdit = vi.fn();

    render(
      <PromptCard prompt={mockPrompt} onEdit={onEdit} onDelete={vi.fn()} />
    );

    const editButton = screen.getByRole('button', { name: /edit/i });
    await user.click(editButton);

    expect(onEdit).toHaveBeenCalledWith(mockPrompt);
  });

  it('should call onDelete when delete button is clicked', async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();

    render(
      <PromptCard prompt={mockPrompt} onEdit={vi.fn()} onDelete={onDelete} />
    );

    const deleteButton = screen.getByRole('button', { name: /delete/i });
    await user.click(deleteButton);

    expect(onDelete).toHaveBeenCalledWith(mockPrompt);
  });

  it('should show visibility badge for public prompts', () => {
    const publicPrompt: Prompt = {
      ...mockPrompt,
      visibility: 'public',
      public_slug: 'abc123',
    };

    render(
      <PromptCard prompt={publicPrompt} onEdit={vi.fn()} onDelete={vi.fn()} />
    );

    expect(screen.getByText(/public/i)).toBeInTheDocument();
  });

  it('should truncate long content', () => {
    const longPrompt: Prompt = {
      ...mockPrompt,
      body_md: 'A'.repeat(500),
    };

    render(
      <PromptCard prompt={longPrompt} onEdit={vi.fn()} onDelete={vi.fn()} />
    );

    const content = screen.getByText(/A+/);
    // Content should be truncated (not full 500 characters)
    expect(content.textContent?.length).toBeLessThan(500);
  });

  it('should display updated date', () => {
    render(
      <PromptCard prompt={mockPrompt} onEdit={vi.fn()} onDelete={vi.fn()} />
    );

    // Should show some date information
    expect(screen.getByText(/updated/i)).toBeInTheDocument();
  });
});
