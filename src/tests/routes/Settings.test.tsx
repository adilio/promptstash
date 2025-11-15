import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { Settings } from '@/routes/app/Settings';
import * as teamsApi from '@/api/teams';

vi.mock('@/api/teams');

const mockTeam = {
  id: 'team1',
  name: 'Test Team',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-02T00:00:00Z',
};

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useOutletContext: () => ({ currentTeamId: 'team1' }),
  };
});

describe('Settings', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render settings page', () => {
    vi.mocked(teamsApi.getTeam).mockResolvedValue(mockTeam);

    render(
      <MemoryRouter>
        <Settings />
      </MemoryRouter>
    );

    expect(screen.getByText(/settings/i)).toBeInTheDocument();
  });

  it('should load team information', async () => {
    vi.mocked(teamsApi.getTeam).mockResolvedValue(mockTeam);

    render(
      <MemoryRouter>
        <Settings />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(teamsApi.getTeam).toHaveBeenCalledWith('team1');
    });
  });

  it('should display team name', async () => {
    vi.mocked(teamsApi.getTeam).mockResolvedValue(mockTeam);

    render(
      <MemoryRouter>
        <Settings />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Test Team/i)).toBeInTheDocument();
    });
  });

  it('should allow updating team name', async () => {
    const user = userEvent.setup();

    vi.mocked(teamsApi.getTeam).mockResolvedValue(mockTeam);
    vi.mocked(teamsApi.updateTeam).mockResolvedValue({
      ...mockTeam,
      name: 'Updated Team',
    });

    render(
      <MemoryRouter>
        <Settings />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByDisplayValue('Test Team')).toBeInTheDocument();
    });

    const nameInput = screen.getByDisplayValue('Test Team');
    await user.clear(nameInput);
    await user.type(nameInput, 'Updated Team');

    const saveButton = screen.getByRole('button', { name: /save/i });
    await user.click(saveButton);

    await waitFor(() => {
      expect(teamsApi.updateTeam).toHaveBeenCalledWith('team1', {
        name: 'Updated Team',
      });
    });
  });

  it('should show loading state while loading team', () => {
    vi.mocked(teamsApi.getTeam).mockImplementation(
      () => new Promise(() => {}) // Never resolves
    );

    render(
      <MemoryRouter>
        <Settings />
      </MemoryRouter>
    );

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('should handle API errors gracefully', async () => {
    vi.mocked(teamsApi.getTeam).mockRejectedValue(
      new Error('Failed to load team')
    );

    render(
      <MemoryRouter>
        <Settings />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    // Should not crash
    expect(screen.getByText(/settings/i)).toBeInTheDocument();
  });
});
