import type { Page } from "../../schema";
import { img } from "../../img";

const X = (p: string) => `https://99x.io${p}`;


export const nearshoreUsa: Page = {
  slug: "nearshore-usa",
  path: "/services/nearshore-tech-talent-usa",
  meta: {
    title: "Nearshore tech talent for US companies",
    description: "Scale your engineering team with AI-enabled senior nearshore engineers from Brazil, working in your timezone. 4.9/5 on Clutch from 50+ reviews.",
    ogImage: img("nearshore-usa/hero.jpg", "Nearshore engineers in Brazil"),
  },
  hero: {
    eyebrow: "Nearshore tech talent — USA & Canada",
    lines: ["Scale your engineering team", "with AI-enabled nearshore engineers."],
    image: img("nearshore-usa/hero.jpg", "Nearshore engineers in Brazil"),
    metric: { label: "Clutch rating", value: "4.9 / 5" },
    cards: [
      { image: img("nearshore-usa/partners.jpg", "An engineer working at a large screen"), link: { label: "Engagement models", href: "#engagement" } },
      { image: img("people/thiers-santos.jpg", "Portrait of Thiers Santos"), link: { label: "Talk to us", href: "#talk" } },
    ],
  },
  sections: [
    {
      type: "stats",
      theme: "paper",
      head: { label: "Engineering partners", statement: "A curated Brazilian engineering partner that works as an extension of your team — in your timezone, so you spend less time managing and more time shipping." },
      image: img("nearshore-usa/partners.jpg", "An engineer working at a large screen"),
      items: [
        { value: "60+", label: "Senior engineers, designers & product leaders", icon: "people" },
        { value: "15+", label: "Years working with US companies", icon: "calendar" },
        { value: "4.9/5", label: "On Clutch, from 50+ reviews", icon: "star" },
        { value: "93", label: "eNPS — a team that wants to be here", icon: "heart" },
      ],
      body: "Our roster isn't broad, it's handpicked: every engineer is vetted for technical mastery, communication and an ownership mindset.",
    },
    {
      type: "cardGrid",
      theme: "tint",
      id: "engagement",
      head: { label: "Engagement models", statement: "Flexible engagement models, shaped around what you need to ship." },
      cards: [
        { title: "IT staff augmentation", description: "Extend your team with vetted engineers who feel in-house, communicate in real time and ship with quality and speed.", icon: "users" },
        { title: "Web application development", description: "Secure, scalable, user-friendly web apps built on React, Vue, Node.js and Django.", icon: "code" },
        { title: "Custom mobile apps", description: "From MVPs to enterprise-grade apps for iOS, Android and cross-platform.", icon: "mobile" },
        { title: "AI & data solutions", description: "Machine learning, LLMs, generative AI, computer vision and analytics that learn, adapt and scale.", icon: "database" },
      ],
    },
    {
      type: "stickySplit",
      theme: "paper",
      head: { label: "AI @ 99x Americas", statement: "A software company first — we use AI deliberately, not by default." },
      image: img("nearshore-usa/ai.jpg", "A team working together around a laptop"),
      mediaSide: "right",
      heading: "Future-proof engineering with AI",
      body: "We're a software company first. AI is a powerful enabler — misapplied, it creates fragile systems and technical debt. We use it deliberately, inside a specs-first, modular architecture with human review, to get the speed without losing control.",
      link: { label: "AI at 99x", href: X("/ai-99x"), external: true },
    },
    {
      type: "numberedList",
      theme: "tint",
      head: { label: "Why choose us", statement: "More than a tech vendor: experts who think strategically, challenge assumptions and help you ship better products, faster." },
      items: [
        { title: "Selective, senior talent", description: "Every expert is vetted for technical mastery, communication and an ownership mindset." },
        { title: "Seamless team integration", description: "Culturally aligned teams in your timezone." },
        { title: "Proven nearshore expertise", description: "15+ years delivering high-quality software for clients worldwide." },
        { title: "A flexible approach to AI", description: "AI to accelerate development without compromising quality — or none at all, if you prefer." },
      ],
    },
    {
      type: "caseCards",
      theme: "paper",
      head: { label: "Customer stories", statement: "Products we've helped US and global companies build." },
      cards: [
        { title: "Giving a crowdfunding platform a competitive edge", tag: "Tech talent", image: img("nearshore-usa/case-crowdfunding.jpg", "Crowdfunding platform on a phone"), link: { label: "Crowdfunding", href: X("/case-studies/tech-experts/giving-a-crowdfunding-platform-a-competitive-edge"), external: true } },
        { title: "An operational intelligence platform for commercial real estate", tag: "Tech talent", image: img("nearshore-usa/case-cre.jpg", "Office buildings in a city centre"), link: { label: "CRE platform", href: X("/case-studies/tech-experts/operational-intelligence-platform-for-cre"), external: true } },
        { title: "Crafting a seamless printing experience", tag: "Tech talent", image: img("nearshore-usa/case-printly.jpg", "A printing app interface"), link: { label: "Printly", href: X("/case-studies/tech-experts/crafting-a-seamless-printing-experience"), external: true } },
        { title: "A user-friendly QR code management platform", tag: "Tech talent", image: img("nearshore-usa/case-qr.jpg", "A phone showing a QR code"), link: { label: "QR platform", href: X("/case-studies/tech-experts/user-friendly-qr-code-management-platform"), external: true } },
      ],
    },
    {
      type: "contactBlock",
      theme: "tint",
      id: "talk",
      head: { label: "Talk to us", statement: "Ready to discuss your needs? Talk to Thiers." },
      person: { name: "Thiers Santos", role: "EVP, 99x Americas", email: "ThiersS@99x.io", photo: img("people/thiers-santos.jpg", "Portrait of Thiers Santos") },
      source: "nearshore-usa",
    },
  ],
  next: { label: "Contact us", eyebrow: "Next", href: "/contact", image: img("home/hero.jpg", "99x team members collaborating in the Oslo office") },
};
