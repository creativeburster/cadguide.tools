import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'CADTools.cc',
    short_name: 'CADTools',
    description: 'Compare 80+ CAD/BIM tools – pricing, features, specs, expert verdicts.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#020617',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  }
}
