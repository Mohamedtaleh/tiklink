/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://tiklink.ink",
  generateRobotsTxt: true,
  sitemapSize: 7000,
  changefreq: "daily",
  priority: 0.7,
  exclude: ['/tools/*'],
  additionalPaths: async () => {
    const paths = [
      { loc: '/', changefreq: 'daily', priority: 1.0 },
      { loc: '/instagram', changefreq: 'weekly', priority: 0.9 },
      { loc: '/youtube', changefreq: 'weekly', priority: 0.9 },
      { loc: '/bulk', changefreq: 'weekly', priority: 0.9 },
      { loc: '/mp3', changefreq: 'weekly', priority: 0.8 },
      { loc: '/captions', changefreq: 'weekly', priority: 0.8 },
      { loc: '/hashtags', changefreq: 'weekly', priority: 0.8 },
      { loc: '/blog', changefreq: 'daily', priority: 0.8 },
      { loc: '/about', changefreq: 'monthly', priority: 0.5 },
      { loc: '/contact', changefreq: 'monthly', priority: 0.4 },
      { loc: '/privacy', changefreq: 'monthly', priority: 0.3 },
      { loc: '/terms', changefreq: 'monthly', priority: 0.3 },
    ];
    return paths;
  },
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/tools/'],
      },
    ],
    additionalSitemaps: [],
  },
};
