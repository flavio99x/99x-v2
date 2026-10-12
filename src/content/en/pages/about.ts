import type { Page } from "../../schema";
import { img } from "../../img";

const person = (name: string, role: string, file: string, email?: string) => ({
  name, role, ...(email ? { email } : {}), photo: img(`people/${file}.jpg`, `Portrait of ${name}`),
});

export const about: Page = {
  slug: "about",
  path: "/about-us",
  meta: {
    title: "About us",
    description: "Advisors, builders and innovators: 600+ people across Norway, Sri Lanka, Portugal, Brazil and Malaysia, building digital products since 2000.",
    ogImage: img("about/hero.jpg", "The 99x team gathered together"),
  },
  hero: {
    eyebrow: "About us",
    lines: ["Advisors, builders,", "innovators."],
    image: img("about/hero.jpg", "The 99x team gathered together"),
    metric: { label: "Founded", value: "2000, Sri Lanka" },
  },
  sections: [
    {
      type: "mediaStatement",
      theme: "paper",
      head: { label: "This is 99x", statement: "We help businesses build digital solutions that work — for users, for the organisation and for the bottom line." },
      body: "Our clients range from ambitious startups to leading players in the private and public sector, healthcare, education, retail and culture. What they share: they want a long-term partner, not a vendor. Lately that means more AI — in testing, in data and in how we build teams.",
      images: [img("about/management.jpg", "99x group leadership in conversation"), img("about/office.jpg", "Engineers at work in a 99x office")],
      video: { youtubeId: "0O8WkFGaLw4", label: "Watch: This is 99x" },
    },
    {
      type: "displayLine",
      theme: "tint",
      head: { label: "Our values" },
      text: "Norwegian values, global capacity",
      fill: "image",
      image: img("about/tab-culture.jpg", "Two 99x colleagues outside a timber-clad office entrance"),
      subline: "Trust · Openness · Quality",
      body: "99x combines product strategy, design and engineering with 600+ experts across our hubs in Europe, Asia and South America — so we can scale quickly when a project demands it.",
    },
    {
      type: "timeline",
      theme: "dark",
      head: { label: "Our journey" },
      items: [
        { year: "2000", title: "Eurocenter DDC is founded in Sri Lanka", image: img("about/t-2000.jpg", "Early days of Eurocenter in Sri Lanka") },
        { year: "2006", title: "Seeds Consulting is founded in Norway", image: img("about/t-2006.jpg", "Seeds Consulting founders") },
        { year: "2012", title: "Eurocenter becomes 99x Technology", image: img("about/t-2012.jpg", "The 99x Technology office") },
        { year: "2021", title: "Seeds and 99x merge", image: img("about/management.jpg", "99x group leaders seated together around a table") },
        { year: "2023", title: "Cleverti and Nextly join, and 99x opens in Malaysia", image: img("about/t-2023.jpg", "The new 99x team in Kuala Lumpur") },
        { year: "2025", title: "Solvr, Gture and Republic join the group", image: img("about/t-2025.jpg", "Gture and 99x teams together") },
        { year: "2026", title: "Increo joins — 11 companies, 600+ people", image: img("about/t-2026.jpg", "Increo and 99x teams together") },
      ],
    },
    {
      type: "tabs",
      theme: "tint",
      id: "how-we-work",
      head: { label: "How we work", statement: "A partner that stays for the long run." },
      items: [
        { label: "Trusted partner", heading: "Long-term, not transactional", body: "We work as an extension of your organisation: shared goals, shared accountability and teams that stay with your product as it grows.", image: img("about/tab-partner.jpg", "A client workshop with the 99x team") },
        { label: "Ways of working", heading: "Facilitated teams", body: "Cross-functional teams combine strategy, design and engineering, with the capacity, competence and compliance to deliver — and AI built into how we work.", image: img("about/tab-work.jpg", "A cross-functional team planning a sprint") },
        { label: "Culture", heading: "Scandinavian at heart", body: "Trust, openness and quality come first. Every office, from Oslo to Kuala Lumpur, lives by the same values every day.", image: img("about/tab-culture.jpg", "99x colleagues at a company gathering") },
      ],
    },
    {
      type: "officeRows",
      theme: "paper",
      id: "offices",
      head: { label: "Global presence", statement: "Specialised units serving different markets under one global umbrella." },
      body: "Full-service web and e-commerce across the Nordics, product engineering for Scandinavia and beyond, and technology teams building for European and American companies.",
    },
    {
      type: "namesCylinder",
      theme: "paper",
      head: { label: "The 99x group", statement: "A network of specialised tech companies, united by one culture." },
      names: ["99x Technology", "Seeds", "Cleverti", "LeanOn", "Clave Consulting", "Solvr", "Nextly", "Gture", "Republic", "Increo", "Digital Solutions"],
    },
    {
      type: "cardGrid",
      theme: "tint",
      head: { label: "Our divisions", statement: "Product engineering, tech talent and web solutions — each built for the market it serves." },
      cards: [
        { title: "Product engineering", description: "Long-term product co-creation for companies across Scandinavia and global markets.", icon: "layers", link: { label: "Product engineering", href: "/services#product-engineering" } },
        { title: "Tech talent Europe", description: "Engineering teams from our European hubs for companies across Europe.", icon: "users", link: { label: "Tech talent Europe", href: "/services#nearshore-europe" } },
        { title: "Tech talent Americas", description: "Nearshore engineers from Brazil for US and Canadian companies.", icon: "globe", link: { label: "Tech talent USA", href: "/services/nearshore-tech-talent-usa" } },
        { title: "Web solutions", description: "Full-service web and e-commerce for businesses in Norway.", icon: "browser", link: { label: "Web solutions", href: "/services#web-solutions" } },
      ],
    },
    {
      type: "peopleGrid",
      theme: "paper",
      head: { label: "Leadership", statement: "The group leadership team guiding the 99x ecosystem." },
      people: [
        person("Odd Sverre Østlie", "Group CEO, 99x", "odd-sverre-ostlie"),
        person("Trygve Moe", "Group CFO, 99x", "trygve-moe"),
        person("Stein Eric Moe", "CEO, Gture", "stein-eric-moe"),
        person("Carlos Coutinho Silva", "EVP 99x Europe & CEO 99x Tech Portugal", "carlos-coutinho-silva"),
        person("Hasith Yaggahavita", "CEO, 99x Product Engineering", "hasith-yaggahavita"),
        person("Eiliv Mæhle Liljevik", "EVP 99x Nordics & CEO Digital Solutions", "eiliv-liljevik"),
        person("Thiers Santos", "EVP, 99x Americas", "thiers-santos", "ThiersS@99x.io"),
        person("Terje Aasgaard", "Managing Director, Clave Consulting", "terje-aasgaard"),
      ],
    },
  ],
  next: { label: "Our services", eyebrow: "Next", href: "/services", image: img("services/hero.jpg", "Engineers collaborating at a desk") },
};
