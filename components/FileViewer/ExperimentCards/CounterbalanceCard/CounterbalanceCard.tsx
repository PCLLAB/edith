import { Card, CardContent } from "@mui/material";
import { useBoundStore } from "../../../../lib/client/hooks/stores/useBoundStore";

import { ExperimentJson } from "../../../../lib/common/types/models";
import { AssignLink } from "./AssignLink";
import { ParamOptions } from "./ParamOptions";
import { Quotas } from "./Quotas";

type CardProps = {
  exp: ExperimentJson;
};

export const CounterbalanceCard = ({ exp }: CardProps) => {
  const cb = useBoundStore((state) => state.counterbalanceMap[exp._id]);

  return (
    <Card>
      <CardContent
        sx={{ gap: 2, display: "flex", flexDirection: "column" }}
        // Use key to remount, because form state set on initial render via defaultValues
        // Otherwise, forms aren't reset when switching between experiments
        key={cb?.experiment}
      >
        <AssignLink expId={exp._id} cb={cb} />
        <ParamOptions cb={cb} />
        <Quotas cb={cb} />
      </CardContent>
    </Card>
  );
};
