import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";

export default getRequestConfig(async () => {
  // Get language from cookie or default to 'vi'
  const cookieLocale = (await cookies()).get("NEXT_LOCALE")?.value || "vi";
  const locale = cookieLocale;
  console.log("locale:", locale);

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
