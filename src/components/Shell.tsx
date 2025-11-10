import { ReactNode } from 'react';

interface ShellProps {
  children: ReactNode;
}

export function Shell({ children }: ShellProps) {
  return <div className="flex h-screen overflow-hidden bg-background">{children}</div>;
}
