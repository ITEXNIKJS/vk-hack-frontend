import * as React from "react";
import { GalleryVerticalEnd, Map } from "lucide-react";

import { NavUsersChats } from "~/components/nav-users-chats";
import { NavUser } from "~/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "~/components/ui/sidebar";
import { Form, useLoaderData } from "@remix-run/react";
import { loader } from "~/routes/_main";
import { TeamSwitcher } from "./team-switcher";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";

// This is sample data.
const test_data = {
  user: {
    name: "SUAI Team",
    email: "suai@guap.ru",
    avatar: "/avatars/avatar.png",
  },
  teams: [
    {
      name: "Стандартная группа",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const data = useLoaderData<typeof loader>();
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={test_data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavUsersChats chats={data.chats} />
      </SidebarContent>
      <SidebarFooter>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Добавить</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Добавить нового пользователя</DialogTitle>
              <DialogDescription>
                <Form
                  method="post"
                  action="/action/chats/create"
                  className="space-y-4"
                  navigate={false}
                >
                  <div className="space-y-2">
                    <Input
                      type="text"
                      name="chatName"
                      placeholder="Введите ссылку на github аккаунт"
                      className="w-full"
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button type="submit">Сохранить</Button>
                  </div>
                </Form>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
        <NavUser user={test_data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
