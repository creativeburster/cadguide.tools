import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { pageMetadata, siteBreadcrumbLd } from '@/lib/seo';
import type { Metadata } from 'next';

export const metadata: Metadata = pageMetadata({
  title: 'Sponsor CADGuide.tools — Reach CAD Decision-Makers',
  description:
    'Advertise your CAD, BIM, CAE/CAM, or EDA software to a highly targeted audience of engineers, architects, designers, and procurement decision-makers.',
  path: '/sponsor',
});

export default function SponsorPage() {
  const breadcrumbs = siteBreadcrumbLd([
    { name: 'Home', path: '/' },
    { name: 'Sponsor', path: '/sponsor' },
  ]);
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      <SponsorBody />
    </>
  );
}

function SponsorBody() {
  return (
    <main className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">Partner with CADGuide.tools</h1>
        <p className="text-xl text-muted-foreground">Reach a highly targeted audience of engineers, architects, and decision-makers.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="text-2xl">Standard Listing</CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            <p className="text-slate-600 mb-6">Get your software indexed in our directory. We list all relevant CAD tools for free to ensure objectivity.</p>
            <ul className="space-y-2 mb-8 text-sm">
              <li>• Technical parameter indexing</li>
              <li>• Link to official website</li>
              <li>• Community score inclusion</li>
            </ul>
            <Button asChild variant="outline" className="w-full mt-auto">
              <Link href="/contact?subject=Claim%20or%20Submit%20a%20Tool">
                Submit or Claim Your Tool (Free)
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="flex flex-col border-2 border-blue-600 relative overflow-visible">
          <Badge className="absolute -top-3 right-4 bg-blue-600 text-white">Most Effective</Badge>
          <CardHeader>
            <CardTitle className="text-2xl">Sponsored Placement</CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            <p className="text-slate-600 mb-6">Pin your product to the top of specific category lists and the homepage to maximize visibility.</p>
            <ul className="space-y-2 mb-8 text-sm">
              <li>• Top of Search & Category results</li>
              <li>• Featured Badge on card</li>
              <li>• Priority SEO landing page placement</li>
            </ul>
            <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-auto">
              <Link href="/contact?subject=Media%20Kit%20Request">
                Request Media Kit
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="mt-16 text-center text-slate-500">
        <p>Prefer direct email? Reach our partnerships desk at: <a href="mailto:partners@cadguide.tools" className="font-bold text-blue-600 hover:underline">partners@cadguide.tools</a></p>
      </div>
    </main>
  );
}
