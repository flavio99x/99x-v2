import { z } from "zod";

const FILENAME_LIKE = /(^(img|dsc|image|screenshot|chatgpt)[\s_-]?\d*)|(\.(jpe?g|png|webp|avif|svg)$)|(^\d+$)/i;

export const LinkSchema = z
  .object({ label: z.string().min(1), href: z.string().min(1), external: z.boolean().optional() })
  .refine((l) => !l.external || l.href.startsWith("https://"), { message: "external links must be https" });
export type Link = z.infer<typeof LinkSchema>;

export const ImgSchema = z.object({
  src: z.string().startsWith("/"),
  alt: z.string().min(3).refine((a) => !FILENAME_LIKE.test(a.trim()), { message: "alt looks like a filename" }),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
});
export type Img = z.infer<typeof ImgSchema>;

export const ThemeSchema = z.enum(["dark", "paper", "tint"]);
export type Theme = z.infer<typeof ThemeSchema>;

export const SectionHeadSchema = z.object({
  label: z.string().min(1),
  statement: z.string().optional(),
});
export type SectionHead = z.infer<typeof SectionHeadSchema>;

export const PersonSchema = z.object({
  name: z.string(),
  role: z.string(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  photo: ImgSchema.optional(),
});
export type Person = z.infer<typeof PersonSchema>;

export const OfficeSchema = z.object({
  id: z.string(),
  city: z.string(),
  country: z.string(),
  countryCode: z.string().length(2),
  address: z.string(),
  email: z.string().email(),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
});
export type Office = z.infer<typeof OfficeSchema>;

const IconName = z.enum([
  "calendar", "people", "globe", "chart", "code", "browser", "users", "spark",
  "layers", "shield", "clock", "star", "heart", "mobile", "database", "arrow",
]);
export type IconName = z.infer<typeof IconName>;

export const HeroSchema = z.object({
  eyebrow: z.string(),
  lines: z.array(z.string()).min(1).max(3),
  image: ImgSchema,
  metric: z.object({ label: z.string(), value: z.string() }).optional(),
  cards: z.array(z.object({ image: ImgSchema, link: LinkSchema })).max(2).optional(),
});
export type Hero = z.infer<typeof HeroSchema>;

const base = { theme: ThemeSchema, head: SectionHeadSchema, id: z.string().optional() };

export const StatsSectionSchema = z.object({
  type: z.literal("stats"),
  ...base,
  image: ImgSchema.optional(),
  items: z.array(z.object({ value: z.string(), label: z.string(), icon: IconName })).min(2).max(4),
  body: z.string().optional(),
  link: LinkSchema.optional(),
});
export const CardGridSectionSchema = z.object({
  type: z.literal("cardGrid"),
  ...base,
  cards: z
    .array(z.object({ title: z.string(), description: z.string(), icon: IconName, link: LinkSchema.optional() }))
    .min(2)
    .max(6),
  photo: ImgSchema.optional(),
  link: LinkSchema.optional(),
});
export const StickySplitSectionSchema = z.object({
  type: z.literal("stickySplit"),
  ...base,
  image: ImgSchema,
  mediaSide: z.enum(["left", "right"]),
  heading: z.string(),
  body: z.string(),
  link: LinkSchema.optional(),
});
export const NumberedListSectionSchema = z.object({
  type: z.literal("numberedList"),
  ...base,
  image: ImgSchema.optional(),
  items: z.array(z.object({ title: z.string(), description: z.string().optional() })).min(1),
  link: LinkSchema.optional(),
});
export const DisplayLineSectionSchema = z.object({
  type: z.literal("displayLine"),
  ...base,
  text: z.string(),
  subline: z.string().optional(),
  fill: z.enum(["pill", "image"]),
  image: ImgSchema.optional(),
  body: z.string().optional(),
});
export const CaseCardsSectionSchema = z.object({
  type: z.literal("caseCards"),
  ...base,
  display: z.object({ text: z.string(), subline: z.string() }).optional(),
  cards: z.array(z.object({ title: z.string(), tag: z.string(), image: ImgSchema, link: LinkSchema })).min(1).max(4),
  link: LinkSchema.optional(),
});
export const InsightCardsSectionSchema = z.object({
  type: z.literal("insightCards"),
  ...base,
  // imageFit "contain": the thumbnail has text baked in, so it must not be cropped.
  cards: z.array(z.object({ kind: z.string(), title: z.string(), image: ImgSchema, imageFit: z.enum(["cover", "contain"]).optional(), link: LinkSchema })).min(1).max(3),
  link: LinkSchema.optional(),
});
export const MediaStatementSectionSchema = z.object({
  type: z.literal("mediaStatement"),
  ...base,
  body: z.string(),
  images: z.tuple([ImgSchema, ImgSchema]),
  video: z.object({ youtubeId: z.string(), label: z.string() }).optional(),
});
export const TabsSectionSchema = z.object({
  type: z.literal("tabs"),
  ...base,
  items: z.array(z.object({ label: z.string(), heading: z.string(), body: z.string(), image: ImgSchema })).min(2).max(4),
});
export const ProofToggleSectionSchema = z.object({
  type: z.literal("proofToggle"),
  ...base,
  subline: z.string(),
  items: z.array(z.object({ value: z.string(), text: z.string() })).min(2).max(4),
});
export const NamesCylinderSectionSchema = z.object({
  type: z.literal("namesCylinder"),
  ...base,
  names: z.array(z.string()).min(3),
});
export const TimelineSectionSchema = z.object({
  type: z.literal("timeline"),
  ...base,
  items: z.array(z.object({ year: z.string().regex(/^\d{4}$/), title: z.string(), image: ImgSchema })).min(2),
});
export const OfficeRowsSectionSchema = z.object({ type: z.literal("officeRows"), ...base, body: z.string().optional() });
export const PeopleGridSectionSchema = z.object({ type: z.literal("peopleGrid"), ...base, people: z.array(PersonSchema).min(1) });
export const ContactBlockSectionSchema = z.object({
  type: z.literal("contactBlock"),
  ...base,
  person: PersonSchema,
  source: z.string(),
});
export const ContactMainSectionSchema = z.object({
  type: z.literal("contactMain"),
  theme: ThemeSchema,
  id: z.string().optional(),
  heading: z.string(),
  intro: z.string(),
  source: z.string(),
});
export const DivisionContactsSectionSchema = z.object({
  type: z.literal("divisionContacts"),
  ...base,
  divisions: z.array(z.object({ label: z.string(), heading: z.string(), email: z.string().email() })).min(1),
  people: z.array(PersonSchema),
  internships: z.object({ heading: z.string(), body: z.string(), email: z.string().email() }),
});
export const LogoStorySectionSchema = z.object({ type: z.literal("logoStory"), ...base });

export const SectionSchema = z.discriminatedUnion("type", [
  StatsSectionSchema, CardGridSectionSchema, StickySplitSectionSchema, NumberedListSectionSchema,
  DisplayLineSectionSchema, CaseCardsSectionSchema, InsightCardsSectionSchema, MediaStatementSectionSchema,
  TabsSectionSchema, ProofToggleSectionSchema, NamesCylinderSectionSchema, TimelineSectionSchema,
  OfficeRowsSectionSchema, PeopleGridSectionSchema, ContactBlockSectionSchema, ContactMainSectionSchema,
  DivisionContactsSectionSchema, LogoStorySectionSchema,
]);
export type Section = z.infer<typeof SectionSchema>;
export type StatsSection = z.infer<typeof StatsSectionSchema>;
export type CardGridSection = z.infer<typeof CardGridSectionSchema>;
export type StickySplitSection = z.infer<typeof StickySplitSectionSchema>;
export type NumberedListSection = z.infer<typeof NumberedListSectionSchema>;
export type DisplayLineSection = z.infer<typeof DisplayLineSectionSchema>;
export type CaseCardsSection = z.infer<typeof CaseCardsSectionSchema>;
export type InsightCardsSection = z.infer<typeof InsightCardsSectionSchema>;
export type MediaStatementSection = z.infer<typeof MediaStatementSectionSchema>;
export type TabsSection = z.infer<typeof TabsSectionSchema>;
export type ProofToggleSection = z.infer<typeof ProofToggleSectionSchema>;
export type NamesCylinderSection = z.infer<typeof NamesCylinderSectionSchema>;
export type TimelineSection = z.infer<typeof TimelineSectionSchema>;
export type OfficeRowsSection = z.infer<typeof OfficeRowsSectionSchema>;
export type PeopleGridSection = z.infer<typeof PeopleGridSectionSchema>;
export type ContactBlockSection = z.infer<typeof ContactBlockSectionSchema>;
export type ContactMainSection = z.infer<typeof ContactMainSectionSchema>;
export type DivisionContactsSection = z.infer<typeof DivisionContactsSectionSchema>;
export type LogoStorySection = z.infer<typeof LogoStorySectionSchema>;

export const PageSchema = z.object({
  slug: z.enum(["home", "about", "services", "nearshore-usa", "contact"]),
  path: z.string().startsWith("/"),
  meta: z.object({ title: z.string().max(60), description: z.string().min(50).max(160), ogImage: ImgSchema }),
  hero: HeroSchema.optional(),
  sections: z.array(SectionSchema).min(1),
  next: z.object({ label: z.string(), eyebrow: z.string(), href: z.string().startsWith("/"), image: ImgSchema }),
});
export type Page = z.infer<typeof PageSchema>;

const NavGroupSchema = z.object({ label: z.string(), links: z.array(LinkSchema) });
export const SiteSchema = z.object({
  name: z.literal("99x"),
  url: z.string().url(),
  nav: z.array(NavGroupSchema).min(1),
  cta: LinkSchema,
  languages: z.array(z.object({ code: z.string(), label: z.string(), href: z.string(), active: z.boolean() })),
  socials: z.array(z.object({ label: z.string(), href: z.string().url(), icon: z.enum(["linkedin", "youtube"]) })),
  footer: z.object({
    columns: z.array(z.object({ tag: z.string(), links: z.array(LinkSchema) })),
    contact: z.object({ address: z.string(), email: z.string().email(), phone: z.string() }),
  }),
  legal: z.array(LinkSchema),
  offices: z.array(OfficeSchema).length(5),
});
export type Site = z.infer<typeof SiteSchema>;
