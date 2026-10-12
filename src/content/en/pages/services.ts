import type { Page } from "../../schema";
import { img } from "../../img";

const X = (p: string) => `https://99x.io${p}`;


export const services: Page = {
  slug: "services",
  path: "/services",
  meta: {
    title: "Services",
    description: "Product engineering, web solutions and nearshore tech talent for Europe and the US — four ways 99x helps you build, scale and modernise.",
    ogImage: img("services/hero.jpg", "Engineers collaborating at a desk"),
  },
  hero: {
    eyebrow: "Services",
    lines: ["Stay ahead in a", "fast-moving tech landscape."],
    image: img("services/hero.jpg", "Engineers collaborating at a desk"),
    cards: [
      { image: img("nearshore-usa/hero.jpg", "Nearshore engineers in Brazil"), link: { label: "Tech talent USA", href: "/services/nearshore-tech-talent-usa" } },
      { image: img("services/product-engineering.jpg", "A product team in a planning session"), link: { label: "Product engineering", href: "#product-engineering" } },
    ],
  },
  sections: [
    {
      type: "cardGrid",
      theme: "tint",
      head: { label: "What we do", statement: "Four lines of business, one standard of quality." },
      cards: [
        { title: "Tech talent USA & Canada", description: "AI-enabled nearshore engineers from Brazil, in your timezone.", icon: "globe", link: { label: "Tech talent USA", href: "#nearshore-usa" } },
        { title: "Tech talent Europe", description: "Senior engineers from our European hubs, embedded in your team.", icon: "users", link: { label: "Tech talent Europe", href: "#nearshore-europe" } },
        { title: "Product engineering", description: "Facilitated teams that co-create products with market fit.", icon: "layers", link: { label: "Product engineering", href: "#product-engineering" } },
        { title: "Web solutions", description: "Web and e-commerce, built, hosted and run end to end.", icon: "browser", link: { label: "Web solutions", href: "#web-solutions" } },
      ],
    },
    {
      type: "numberedList",
      theme: "paper",
      id: "nearshore-usa",
      head: { label: "Tech talent USA", statement: "Scale your US engineering team with senior nearshore engineers — in your timezone, at your pace." },
      image: img("nearshore-usa/hero.jpg", "Nearshore engineers in Brazil"),
      items: [
        { title: "Staff augmentation", description: "Vetted engineers who feel in-house and ship from week one." },
        { title: "Web applications", description: "Secure, scalable web apps on React, Vue, Node.js and Django." },
        { title: "Mobile apps", description: "From MVP to enterprise apps on iOS, Android and cross-platform." },
        { title: "AI & data", description: "Machine learning, LLMs, computer vision and analytics that scale." },
      ],
      link: { label: "Tech talent USA", href: "/services/nearshore-tech-talent-usa" },
    },
    {
      type: "numberedList",
      theme: "tint",
      id: "nearshore-europe",
      head: { label: "Tech talent Europe", statement: "Engineering capacity from our European hubs, close to your culture and your working day." },
      image: img("about/office.jpg", "Engineers at work in a 99x office"),
      items: [
        { title: "Software development", description: "Dedicated developers and full teams across modern stacks." },
        { title: "QA & testing", description: "Manual and automated testing that keeps releases safe." },
        { title: "Cloud engineering", description: "Cloud platforms, DevOps and infrastructure that scale." },
        { title: "Data science & AI", description: "From data foundations to production AI features." },
      ],
      link: { label: "Tech talent Europe", href: X("/services/tech-experts-Europe"), external: true },
    },
    {
      type: "numberedList",
      theme: "paper",
      id: "product-engineering",
      head: { label: "Product engineering", statement: "We co-create products that reach market fit and drive adoption — with facilitated teams built for the long term." },
      image: img("services/product-engineering.jpg", "A product team in a planning session"),
      items: [
        { title: "Full lifecycle engineering" },
        { title: "Artificial intelligence" },
        { title: "Quality engineering & test automation" },
        { title: "Cloud consulting" },
        { title: "Product discovery" },
        { title: "Due diligence assessments" },
        { title: "Optimaxer AI Web" },
      ],
      link: { label: "Product engineering", href: X("/services/product-engineering"), external: true },
    },
    {
      type: "numberedList",
      theme: "tint",
      id: "web-solutions",
      head: { label: "Web solutions", statement: "Custom websites and business-critical platforms, with end-to-end responsibility from build to hosting and support." },
      image: img("services/web-solutions.jpg", "Colleagues reviewing a website design"),
      items: [
        { title: "E-commerce", description: "Online stores and platforms that grow with your business." },
        { title: "Websites & platforms", description: "Design, development and integrations tailored to what fits." },
        { title: "Lifecycle management", description: "Hosting, maintenance and support after launch." },
      ],
      link: { label: "Web solutions", href: X("/services/web-solutions"), external: true },
    },
  ],
  next: { label: "Tech talent USA", eyebrow: "Next", href: "/services/nearshore-tech-talent-usa", image: img("nearshore-usa/hero.jpg", "Nearshore engineers in Brazil") },
};
