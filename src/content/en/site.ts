import type { Site } from "../schema";

const X = (path: string) => `https://99x.io${path}`;

export const site: Site = {
  name: "99x",
  url: "https://99x.io",
  nav: [
    {
      label: "What we do",
      links: [
        { label: "Services", href: "/services" },
        { label: "Tech talent USA", href: "/services/nearshore-tech-talent-usa" },
        { label: "Tech talent Europe", href: X("/services/tech-experts-Europe"), external: true },
        { label: "Product engineering", href: X("/services/product-engineering"), external: true },
        { label: "Web solutions", href: X("/services/web-solutions"), external: true },
        { label: "AI at 99x", href: X("/ai-99x"), external: true },
      ],
    },
    {
      label: "Knowledge",
      links: [
        { label: "Case studies", href: X("/case-studies"), external: true },
        { label: "Insights", href: X("/Insights"), external: true },
        { label: "Events", href: X("/events"), external: true },
      ],
    },
    {
      label: "Company",
      links: [
        { label: "About us", href: "/about-us" },
        { label: "Careers", href: X("/careers"), external: true },
        { label: "Contact", href: "/contact" },
      ],
    },
  ],
  cta: { label: "Contact us", href: "/contact" },
  languages: [
    { code: "en", label: "En", href: "/", active: true },
    { code: "no", label: "No", href: X("/no"), active: false },
  ],
  socials: [
    { label: "LinkedIn", href: "https://www.linkedin.com/company/99xio", icon: "linkedin" },
    { label: "YouTube", href: "https://www.youtube.com/@99xio", icon: "youtube" },
  ],
  footer: {
    columns: [
      {
        tag: "What we do",
        links: [
          { label: "Services", href: "/services" },
          { label: "Tech talent USA", href: "/services/nearshore-tech-talent-usa" },
          { label: "Tech talent Europe", href: X("/services/tech-experts-Europe"), external: true },
          { label: "Product engineering", href: X("/services/product-engineering"), external: true },
          { label: "Web solutions", href: X("/services/web-solutions"), external: true },
        ],
      },
      {
        tag: "Knowledge",
        links: [
          { label: "Case studies", href: X("/case-studies"), external: true },
          { label: "Insights", href: X("/Insights"), external: true },
          { label: "Events", href: X("/events"), external: true },
        ],
      },
      {
        tag: "Company",
        links: [
          { label: "About us", href: "/about-us" },
          { label: "Careers", href: X("/careers"), external: true },
          { label: "Contact", href: "/contact" },
        ],
      },
    ],
    contact: { address: "Dronning Eufemias gate 16, 0191 Oslo", email: "hello.norway@99x.io", phone: "+47 24 07 70 11" },
  },
  legal: [
    { label: "The Transparency Act", href: X("/compliance/the-transparency-act"), external: true },
    { label: "Privacy policy", href: X("/compliance/privacy-policy"), external: true },
    { label: "Cookie policy", href: X("/compliance/cookie-policy"), external: true },
  ],
  offices: [
    { id: "oslo", city: "Oslo", country: "Norway", countryCode: "NO", address: "Dronning Eufemias gate 16, 0191 Oslo", email: "hello.norway@99x.io", lat: 59.9075, lng: 10.7601 },
    { id: "colombo", city: "Colombo", country: "Sri Lanka", countryCode: "LK", address: "65 Walukarama Rd, Colombo 00300", email: "hello.srilanka@99x.io", lat: 6.8939, lng: 79.8553 },
    { id: "alges", city: "Algés", country: "Portugal", countryCode: "PT", address: "Alameda Fernão Lopes 16, 13º, 1495-190 Algés", email: "hello.portugal@99x.io", lat: 38.7036, lng: -9.2275 },
    { id: "vitoria", city: "Vitória", country: "Brazil", countryCode: "BR", address: "Av. Nossa Senhora da Penha 1495, Room 504, Vitória/ES", email: "hello.brazil@99x.io", lat: -20.3008, lng: -40.2958 },
    { id: "kuala-lumpur", city: "Kuala Lumpur", country: "Malaysia", countryCode: "MY", address: "Suite 802, Level 8, Menara Binjai, 50450 Kuala Lumpur", email: "hello.malaysia@99x.io", lat: 3.1587, lng: 101.7188 },
  ],
};
