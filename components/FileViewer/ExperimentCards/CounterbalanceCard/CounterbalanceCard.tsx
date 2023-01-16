import { Card, CardContent } from "@mui/material";

import { ExperimentJson } from "../../../../lib/common/types/models";
import { AssignLink } from "./AssignLink";
import { ParamOptions } from "./ParamOptions";
import { Quotas } from "./Quotas";

type CardProps = {
  exp: ExperimentJson;
};

export const CounterbalanceCard = ({ exp }: CardProps) => {
  return (
    <Card>
      <CardContent sx={{ gap: 2, display: "flex", flexDirection: "column" }}>
        <AssignLink expId={exp._id} />
        <ParamOptions expId={exp._id} />
        <Quotas expId={exp._id} />
      </CardContent>
    </Card>
  );
};
