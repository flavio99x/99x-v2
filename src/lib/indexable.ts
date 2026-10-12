/** Search engines may index the site only on the real launch: a production deploy with SITE_INDEXABLE=true.
 *  Keeps the vercel.app production URL and every preview out of search while copy awaits 99x approval. */
export const isIndexable = () => process.env.VERCEL_ENV === "production" && process.env.SITE_INDEXABLE === "true";
