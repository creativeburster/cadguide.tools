import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Leaving CADGuide.tools...',
  description: 'You are being redirected to an external reviews source.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function GoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <h1 className="sr-only">External Redirect — CADGuide.tools</h1>
      {children}
    </>
  );
}
