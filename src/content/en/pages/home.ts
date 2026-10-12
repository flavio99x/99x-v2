import type { Page } from "../../schema";
import { img } from "../../img";

const X = (p: string) => `https://99x.io${p}`;

export const home: Page = {
  slug: "home",
  path: "/",
  meta: {
    title: "99x — Digital products, engineering teams and AI",
    description: "99x builds digital products, scales engineering teams and puts AI to work for companies in the Nordics, Europe and the US.",
    ogImage: img("home/hero.jpg", "99x team members collaborating in the Oslo office"),
  },
  hero: {
    eyebrow: "Product engineering · Tech talent · AI",
    lines: ["We build digital products,", "scale teams and put AI to work."],
    image: img("home/hero.jpg", "99x team members collaborating in the Oslo office"),
    metric: { label: "Since 2000", value: "600+ people" },
    cards: [
      { image: img("home/services-tile.jpg", "Engineers reviewing a product roadmap"), link: { label: "Our services", href: "/services" } },
      { image: img("home/ai.jpg", "A team working together at laptops"), link: { label: "AI at 99x", href: X("/ai-99x"), external: true } },
    ],
  },
  sections: [
    {
      type: "stats",
      theme: "paper",
      head: { label: "About us", statement: "For more than two decades, companies across the Nordics and beyond have trusted 99x to shape their products and scale their teams." },
      image: img("home/about-portrait.jpg", "A 99x engineer at work"),
      items: [
        { value: "20+", label: "Years building software", icon: "calendar" },
        { value: "600+", label: "Engineers, designers & advisors", icon: "people" },
        { value: "5", label: "Countries, one company", icon: "globe" },
        { value: "100+", label: "Companies transformed", icon: "chart" },
      ],
      body: "Rooted in Norwegian values — trust, openness and quality — we combine product strategy, design and engineering with the capacity to scale fast when a project demands it.",
      link: { label: "About us", href: "/about-us" },
    },
    {
      type: "cardGrid",
      theme: "tint",
      head: { label: "What we do", statement: "Four ways we help you build, scale and modernise — with AI where it makes the product better." },
      cards: [
        { title: "Product engineering", description: "Long-term product co-creation with facilitated teams that own outcomes, not just tickets.", icon: "layers", link: { label: "Product engineering", href: "/services#product-engineering" } },
        { title: "Web solutions", description: "Websites, e-commerce and integrations — designed, built, hosted and run end to end.", icon: "browser", link: { label: "Web solutions", href: "/services#web-solutions" } },
        { title: "Tech talent Europe", description: "Senior engineers from our European hubs, embedded in your team and your working hours.", icon: "users", link: { label: "Tech talent Europe", href: "/services#nearshore-europe" } },
        { title: "Tech talent USA & Canada", description: "AI-enabled nearshore engineers from Brazil, working in your timezone.", icon: "globe", link: { label: "Tech talent USA", href: "/services/nearshore-tech-talent-usa" } },
        { title: "AI at 99x", description: "Generative AI, agentic workflows and MCP, applied across the product lifecycle.", icon: "spark", link: { label: "AI at 99x", href: X("/ai-99x"), external: true } },
      ],
      photo: img("home/services-tile.jpg", "Engineers reviewing a product roadmap"),
      link: { label: "All services", href: "/services" },
    },
    {
      type: "logoStory",
      theme: "paper",
      head: { label: "Locations", statement: "One company, five countries. Each office brings its own strengths to the same team." },
    },
    {
      type: "stickySplit",
      theme: "paper",
      head: { label: "AI", statement: "We integrate AI into every stage of the product lifecycle." },
      image: img("home/ai.jpg", "A team working together at laptops"),
      mediaSide: "left",
      heading: "Smarter teams, smarter products with AI",
      body: "We build generative AI, agentic workflows and MCP into every stage of the product lifecycle — from digital products and web platforms to e-commerce and engineering productivity. The result: smarter software, faster delivery and higher quality.",
      link: { label: "AI at 99x", href: X("/ai-99x"), external: true },
    },
    {
      type: "caseCards",
      theme: "tint",
      head: { label: "Case studies", statement: "Solutions that work, and last." },
      display: { text: "100+ companies transformed", subline: "Global and Scandinavian companies" },
      cards: [
        { title: "A flourishing e-commerce solution for Interflora", tag: "Web solutions", image: img("home/case-interflora.jpg", "Interflora's online shop on a laptop"), link: { label: "Interflora", href: X("/case-studies/web-solutions/a-flourishing-e-commerce-solution-for-interflora"), external: true } },
        { title: "Boligmappa: the service booklet for 1.2 million Norwegian households", tag: "Product engineering", image: img("home/case-boligmappa.jpg", "A Norwegian family home"), link: { label: "Boligmappa", href: X("/case-studies/product-engineering/boligmappa"), external: true } },
        { title: "BagID: modern air travel with smarter baggage handling", tag: "Product engineering", image: img("home/case-bagid.jpg", "Luggage lined up at an airport"), link: { label: "BagID", href: X("/case-studies/product-engineering/bagid"), external: true } },
      ],
      link: { label: "All case studies", href: X("/case-studies"), external: true },
    },
    {
      type: "proofToggle",
      theme: "paper",
      head: { label: "Why 99x" },
      subline: "Why work with us",
      items: [
        { value: "90%", text: "of our clients say we met or exceeded their expectations." },
        { value: "Top 1%", text: "of engineering talent, selected across three continents." },
        { value: "100+", text: "global and Scandinavian companies transformed." },
      ],
    },
    {
      type: "insightCards",
      theme: "paper",
      head: { label: "Insights" },
      cards: [
        { kind: "Blog", title: "What is data science and why is it critical for business growth?", image: img("home/insight-data-science.jpg", "Data visualisation on a screen"), link: { label: "Read", href: X("/Insights/blog/what-is-data-science-and-why-is-it-critical-for-business-growth"), external: true } },
        { kind: "Webinar", title: "Adapting MCP for business applications", image: img("home/insight-mcp.jpg", "Webinar speakers discussing MCP"), imageFit: "contain", link: { label: "Watch", href: X("/events/2025/adapting-mcp-for-business-applications"), external: true } },
        { kind: "News", title: "99x reports breakthrough market traction for its agentic AI platform", image: img("home/insight-agentic.jpg", "99x team at a product launch"), link: { label: "Read", href: "https://www.ft.lk/it-telecom-tech/99x-reports-breakthrough-market-traction-for-new-Agentic-AI-platform/50-779890", external: true } },
      ],
      link: { label: "All insights", href: X("/Insights"), external: true },
    },
    {
      type: "namesCylinder",
      theme: "paper",
      head: { label: "Trusted by", statement: "Companies that build with us." },
      names: [
        "Adra", "Compello", "SuperOffice", "BUS", "Solwr", "Boligmappa", "Kahoot!", "Interflora", "Bygg 1", "Helsebiblioteket",
        "OBOS", "Patentstyret", "Q-Meieriene", "Gilde", "Glava", "NORCE", "Kavli", "Elite", "Reitan", "Eplehuset", "Urmaker Bjerke",
        "Britannia", "Göteborgsvarvet", "IFPA", "Maurten", "Skiguard", "Wingårdhs", "Techstep", "DNK", "Wilhelmsen", "Peppes Pizza", "Nettalliansen",
      ],
    },
  ],
  next: { label: "About us", eyebrow: "Next", href: "/about-us", image: img("about/hero.jpg", "The 99x team gathered together") },
};
