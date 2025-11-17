import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { PublicPrompt } from '../routes/public/PublicPrompt';
import { getPromptBySlug } from '../api/prompts';

vi.mock('../api/prompts', () => ({
  getPromptBySlug: vi.fn(),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ slug: 'test-slug' }),
  };
});

describe('Public Prompt Sharing', () => {
  it('should render public prompt without auth', async () => {
    const mockPrompt = {
      id: 'prompt-1',
      team_id: 'team-1',
      title: 'Public Prompt',
      body_md: '# Public Content',
      owner_id: 'user-1',
      visibility: 'public' as const,
      folder_id: null,
      public_slug: 'test-slug',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      tags: [],
    };

    vi.mocked(getPromptBySlug).mockResolvedValue(mockPrompt);

    render(
      <BrowserRouter>
        <PublicPrompt />
      </BrowserRouter>
    );

    // Wait for prompt to load
    await screen.findByText('Public Prompt');

    expect(screen.getByText('Public Prompt')).toBeInTheDocument();
  });

  it('should show error for non-existent prompt', async () => {
    vi.mocked(getPromptBySlug).mockRejectedValue(new Error('Not found'));

    render(
      <BrowserRouter>
        <PublicPrompt />
      </BrowserRouter>
    );

    await screen.findByText('Prompt Not Found');

    expect(screen.getByText('Prompt Not Found')).toBeInTheDocument();
  });
});
