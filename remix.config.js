/** @type {import('@remix-run/dev').AppConfig} */
export default {
  ignoredRouteFiles: ["**/.*"],
  serverModuleFormat: "cjs",
  future: {
    v3_throwAbortReason: true,
    v3_singleFetch: true,
    v3_lazyRouteDiscovery: true,
    v3_relativeSplatPath: true,
    v3_fetcherPersist: true,
  },
  // appDirectory: "app",
  // assetsBuildDirectory: "public/build",
  // serverBuildPath: "build/index.js",
  // publicPath: "/build/",
  serverPlatform: "node",
  serverMinify: true,
  serverDependenciesToBundle: ["@heroicons/react"],
}; 