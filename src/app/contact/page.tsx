import { pageMetadata, siteBreadcrumbLd } from '@/lib/seo';
import type { Metadata } from 'next';
import { ContactBody } from './contact-form';

export const metadata: Metadata = pageMetadata({
  title: 'Contact & Support — Partnerships & Feedback',
  description:
    'Get in touch with the CADGuide.tools team for partnerships, software submissions, listing corrections, press inquiries, or general feedback.',
  path: '/contact',
});

export default function ContactPage() {
  const breadcrumbs = siteBreadcrumbLd([
    { name: 'Home', path: '/' },
    { name: 'Contact', path: '/contact' },
  ]);
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      <ContactBody />
    </>
  );
}
