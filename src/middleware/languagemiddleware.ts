import createMiddleware from "next-intl/middleware";
import { locales, defaultLocale } from "../i18n/i18n";

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix: "always", // Always include the locale in the URL (e.g., /vi, /en)
});

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"], // Apply middleware to all routes except API routes, _next, and static files
};
