// src/content/routes.ts
export const BUILT_ROUTES = ["/", "/about-us", "/services", "/services/nearshore-tech-talent-usa", "/contact"] as const;
export type BuiltRoute = (typeof BUILT_ROUTES)[number];
