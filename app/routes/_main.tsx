import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { json, Outlet } from "@remix-run/react";
import { AppSidebar } from "~/components/app-sidebar";
import { ModeToggle } from "~/components/mode-toggle";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import { Separator } from "~/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "~/components/ui/sidebar";
import db from "~/lib/db.server";

export const meta: MetaFunction = () => {
  return [
    { title: "SUAI Dream team | DevInsight" },
    { name: "description", content: "Welcome to app!" },
  ];
};

export const loader = async () => {
  const chats = await db.chats.findMany({
    select: {
      username: true,
      id: true,
    },
  });

  return { chats };
};

export default function MainLayout() {
  // const message = useEventSource(
  //   `/action/chats/${data.}/subscribe`,
  //   {
  //     enabled: true,
  //     event: 'new-message',
  //   },
  // );

  return (
    <SidebarProvider>
      <AppSidebar  />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex justify-between w-full items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <ModeToggle />
            {/* <Separator orientation="vertical" className="mr-2 h-4" /> */}
            {/* <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">Command name</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Username</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb> */}
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
