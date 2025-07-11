import type { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: ReactNode; // For action buttons or extra content
}

export default function PageHeader({ title, description, children }: PageHeaderProps) {
  return (
    <div className="mb-6 md:mb-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-headline font-semibold text-foreground tracking-tight">{title}</h1>
          {description && (
            <p className="mt-1 text-muted-foreground">{description}</p>
          )}
        </div>
        {children && <div className="mt-4 md:mt-0">{children}</div>}
      </div>
    </div>
  );
}
