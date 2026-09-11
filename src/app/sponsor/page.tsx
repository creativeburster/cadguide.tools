import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
              <a href="mailto:partners@cadguide.tools?subject=Claim%20or%20Submit%20Tool%20Listing%20-%20CADGuide.tools&body=Hi%20CADGuide%20Team%2C%0A%0AI%20would%20like%20to%20submit%20or%20claim%20the%20following%20tool%20listing%3A%0A-%20Tool%20Name%3A%0A-%20Official%20Website%3A%0A-%20My%20Role%20%2F%20Affiliation%3A%0A-%20Requested%20Updates%20or%20Details%3A%0A%0AThank%20you!">
                Submit or Claim Your Tool (Free)
              </a>
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
              <a href="mailto:partners@cadguide.tools?subject=Media%20Kit%20Request%20-%20CADGuide.tools&body=Hi%20CADGuide%20Team%2C%0A%0AI%20am%20interested%20in%20sponsored%20placements%20and%20partnership%20opportunities%20on%20CADGuide.tools.%20Could%20you%20please%20send%20over%20the%20media%20kit%3F%0A%0A-%20Company%20%2F%20Tool%20Name%3A%0A-%20Website%3A%0A%0AThank%20you!">
                Request Media Kit
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="mt-16 text-center text-slate-500">
        <p>Contact us at: <span className="font-bold">partners@cadguide.tools</span></p>
      </div>
    </main>
  );
}
