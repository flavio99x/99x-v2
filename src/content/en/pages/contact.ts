import type { Page } from "../../schema";
import { img } from "../../img";

const person = (name: string, role: string, file: string, email: string, phone?: string) => ({
  name, role, email, ...(phone ? { phone } : {}), photo: img(`people/${file}.jpg`, `Portrait of ${name}`),
});

export const contact: Page = {
  slug: "contact",
  path: "/contact",
  meta: {
    title: "Contact",
    description: "Working on a new product, growing your team or curious about AI? Talk to 99x — offices in Oslo, Colombo, Algés, Vitória and Kuala Lumpur.",
    ogImage: img("home/hero.jpg", "99x team members collaborating in the Oslo office"),
  },
  sections: [
    {
      type: "contactMain",
      theme: "paper",
      heading: "Let's talk.",
      intro: "Working on a new product, growing your team or just curious about collaborating? Tell us a little about it and the right team will get back to you.",
      source: "contact",
    },
    {
      type: "divisionContacts",
      theme: "tint",
      head: { index: "S.01", label: "Direct lines", statement: "Prefer email? Reach the team that fits your question." },
      divisions: [
        { label: "Product engineering", heading: "Let's talk about your product.", email: "productengineering@99x.io" },
        { label: "Tech talent Europe", heading: "Let's discuss your tech needs in Europe.", email: "techexperts.europe@99x.io" },
        { label: "Tech talent Americas", heading: "Let's talk about your US team.", email: "techexperts.americas@99x.io" },
        { label: "Web solutions", heading: "Let's talk about your project.", email: "websolutions@99x.io" },
      ],
      people: [
        person("Guilherme Ramos Pereira", "Head of Strategic Development, 99x Europe", "guilherme-ramos-pereira", "guilherme.pereira@99x.io", "+351 919 557 786"),
        person("Steinar Magnussen", "Sales Director, 99x Norway", "steinar-magnussen", "steinar@99x.io", "+47 957 31 083"),
        person("Thiers Santos", "EVP, 99x Americas", "thiers-santos", "ThiersS@99x.io"),
        person("Chrishan de Mel", "Chief Marketing & Corporate Affairs Officer", "chrishan-de-mel", "ChrishanD@99x.io"),
        person("Dag Honningsvåg", "Chairman of the Board", "dag-honningsvag", "dag@99x.io", "+47 907 44 810"),
      ],
      internships: { heading: "Internships at 99x", body: "Interested in joining 99x as an intern? Send us an email — we'd love to hear from you.", email: "careers@99x.io" },
    },
    {
      type: "officeRows",
      theme: "paper",
      head: { index: "S.02", label: "Offices", statement: "Five offices, one team." },
    },
  ],
  next: { label: "Back to home", eyebrow: "Start over", href: "/", image: img("home/hero.jpg", "99x team members collaborating in the Oslo office") },
};
