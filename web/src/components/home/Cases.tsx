import { USE_CASES } from "../use-cases";
import { CaseCard } from "../CaseCard";
import { Words } from "../Words";
import { CasesPin } from "./CasesPin";

// 03: the use cases in a pinned gallery that scrolls sideways.
export function Cases() {
  return (
    <CasesPin count={USE_CASES.length} head={<><p className="eyebrow"><b>03</b> Use cases</p><h2 className="display h2" data-split><Words>Six screens, one icon set</Words></h2></>}>
      {USE_CASES.map((c, i) => <CaseCard key={c.id} c={c} i={i} />)}
    </CasesPin>
  );
}
