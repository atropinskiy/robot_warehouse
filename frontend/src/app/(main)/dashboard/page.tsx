import type { Metadata } from "next";
import { routes } from "@/shared/config";
import { Heading, SectionHeader, Text } from "@/shared/ui";
import { EventLog } from "@/widgets/event-log";
import { RobotPanel } from "@/widgets/robot-panel";
import { Stats } from "@/widgets/stats";
import { WarehouseList } from "@/widgets/warehouse-list";

export const metadata: Metadata = { title: "Главное меню · Robot Warehouse" };

export default function DashboardPage() {
  return (
    <>
      <Heading as="h1" variant="page" className="mb-1.5">
        Главное меню
      </Heading>
      <Text tone="muted" className="mb-6 text-[15px]">
        Сводка по вашим складам и роботам в реальном времени.
      </Text>

      <Stats />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <section aria-labelledby="my-warehouses">
          <SectionHeader
            id="my-warehouses"
            title="Мои склады"
            link={{ href: routes.warehouses, label: "Все склады" }}
          />
          <WarehouseList />
        </section>

        <section aria-labelledby="live-now">
          <SectionHeader
            id="live-now"
            title="Сейчас"
            link={{ href: routes.dispatch, label: "Диспетчерская" }}
          />
          <div className="flex flex-col gap-3.5">
            <RobotPanel />
            <EventLog />
          </div>
        </section>
      </div>
    </>
  );
}
