import { mockRobots, RobotRow, type Robot } from "@/entities/robot";
import { Card, CardContent, CardHeader, Heading } from "@/shared/ui";

type RobotPanelProps = {
  warehouseName?: string;
  robots?: Robot[];
};

export function RobotPanel({
  warehouseName = "Центральный",
  robots = mockRobots,
}: RobotPanelProps) {
  return (
    <Card className="rounded-[14px]">
      <CardHeader>
        <Heading as="h3" variant="section" className="text-[15px]">
          Роботы · {warehouseName}
        </Heading>
      </CardHeader>
      <CardContent>
        <ul className="divide-y divide-border">
          {robots.map((robot) => (
            <li key={robot.id}>
              <RobotRow robot={robot} />
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
