import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MarkdownEditor } from '@/components/MarkdownEditor';

describe('MarkdownEditor', () => {
  it('should render textarea with value', () => {
    render(<MarkdownEditor value="Hello World" onChange={vi.fn()} />);

    const textarea = screen.getByRole('textbox');
    expect(textarea).toBeInTheDocument();
    expect(textarea).toHaveValue('Hello World');
  });

  it('should call onChange when text is typed', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<MarkdownEditor value="" onChange={onChange} />);

    const textarea = screen.getByRole('textbox');
    await user.type(textarea, 'New text');

    expect(onChange).toHaveBeenCalled();
  });

  it('should update value when prop changes', () => {
    const { rerender } = render(<MarkdownEditor value="Initial" onChange={vi.fn()} />);

    expect(screen.getByRole('textbox')).toHaveValue('Initial');

    rerender(<MarkdownEditor value="Updated" onChange={vi.fn()} />);

    expect(screen.getByRole('textbox')).toHaveValue('Updated');
  });

  it('should handle multiline content', () => {
    const multilineText = 'Line 1\nLine 2\nLine 3';
    render(<MarkdownEditor value={multilineText} onChange={vi.fn()} />);

    expect(screen.getByRole('textbox')).toHaveValue(multilineText);
  });
});
