const withPlugins = require('next-compose-plugins');

const withTM = require('next-transpile-modules')([
  '@siiges-ui/shared',
  '@siiges-ui/authentication',
  '@siiges-ui/inspecciones',
  '@siiges-ui/users',
  '@siiges-ui/instituciones',
  '@siiges-ui/solicitudes',
  '@siiges-ui/serviciosescolares',
  '@siiges-ui/opds',
]);

module.exports = withPlugins([withTM()], {
  webpack: (config) => config,
  experimental: {
    images: {
      unoptimized: true,
    },
  },
});
