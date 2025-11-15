import { useEffect, useState } from 'react';

interface DragPreviewOptions {
  text: string;
  icon?: React.ReactNode;
}

export function useDragPreview() {
  const [previewElement, setPreviewElement] = useState<HTMLElement | null>(null);

  useEffect(() => {
    // Create preview element
    const preview = document.createElement('div');
    preview.id = 'drag-preview';
    preview.style.position = 'fixed';
    preview.style.pointerEvents = 'none';
    preview.style.zIndex = '9999';
    preview.style.opacity = '0';
    preview.style.transition = 'opacity 0.2s';
    document.body.appendChild(preview);
    setPreviewElement(preview);

    return () => {
      if (document.body.contains(preview)) {
        document.body.removeChild(preview);
      }
    };
  }, []);

  const showPreview = (options: DragPreviewOptions) => {
    if (!previewElement) return;

    previewElement.innerHTML = `
      <div class="bg-primary text-primary-foreground px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
        <span class="font-medium">${options.text}</span>
      </div>
    `;
    previewElement.style.opacity = '1';
  };

  const hidePreview = () => {
    if (!previewElement) return;
    previewElement.style.opacity = '0';
  };

  const updatePreviewPosition = (x: number, y: number) => {
    if (!previewElement) return;
    previewElement.style.left = `${x + 10}px`;
    previewElement.style.top = `${y + 10}px`;
  };

  return {
    showPreview,
    hidePreview,
    updatePreviewPosition,
  };
}
