const nextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // 1. HSTS
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },

          // 2. CSP
          {
            key: "Content-Security-Policy",
            value: `
              default-src 'self';
              script-src 'self' https://apis.google.com;
              style-src 'self' 'unsafe-inline';
              img-src 'self' data:;
              connect-src 'self';
            `.replace(/\n/g, ""),
          },

          // 3. CORS (for API calls)
          {
            key: "Access-Control-Allow-Origin",
            value: "https://your-frontend-domain.com",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, PUT, DELETE",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
