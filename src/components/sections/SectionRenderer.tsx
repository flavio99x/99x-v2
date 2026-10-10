import type { Section, Site } from "@/content/schema";
import { StatsSection } from "./StatsSection";
import { CardGrid } from "./CardGrid";
import { StickySplit } from "./StickySplit";
import { NumberedList } from "./NumberedList";
import { DisplayLine } from "./DisplayLine";
import { CaseCards } from "./CaseCards";
import { InsightCards } from "./InsightCards";
import { MediaStatement } from "./MediaStatement";
import { Tabs } from "./Tabs";
import { ProofToggle } from "./ProofToggle";
import { NamesCylinder } from "./NamesCylinder";
import { Timeline } from "./Timeline";
import { OfficeRows } from "./OfficeRows";
import { PeopleGrid } from "./PeopleGrid";
import { ContactBlock } from "./ContactBlock";
import { ContactMain } from "./ContactMain";
import { DivisionContacts } from "./DivisionContacts";
import { LogoStorySection } from "./LogoStorySection";

function render(s: Section, site: Site) {
  switch (s.type) {
    case "stats": return <StatsSection section={s} />;
    case "cardGrid": return <CardGrid section={s} />;
    case "stickySplit": return <StickySplit section={s} />;
    case "numberedList": return <NumberedList section={s} />;
    case "displayLine": return <DisplayLine section={s} />;
    case "caseCards": return <CaseCards section={s} />;
    case "insightCards": return <InsightCards section={s} />;
    case "mediaStatement": return <MediaStatement section={s} />;
    case "tabs": return <Tabs section={s} />;
    case "proofToggle": return <ProofToggle section={s} />;
    case "namesCylinder": return <NamesCylinder section={s} />;
    case "timeline": return <Timeline section={s} />;
    case "officeRows": return <OfficeRows section={s} offices={site.offices} />;
    case "peopleGrid": return <PeopleGrid section={s} />;
    case "contactBlock": return <ContactBlock section={s} />;
    case "contactMain": return <ContactMain section={s} offices={site.offices} />;
    case "divisionContacts": return <DivisionContacts section={s} />;
    case "logoStory": return <LogoStorySection section={s} offices={site.offices} />;
    default: {
      const exhaustive: never = s;
      return exhaustive;
    }
  }
}

export function SectionRenderer({ sections, site }: { sections: Section[]; site: Site }) {
  return <>{sections.map((s, i) => <div key={`${s.type}-${i}`} className="contents">{render(s, site)}</div>)}</>;
}
