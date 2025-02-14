import { LibraryBig, Home, UsersRound, Upload, DatabaseZap } from "lucide-react";
import { Link } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";
import LangSwitch from "./LangSwitch";
import { useTranslation } from "react-i18next";

// Definišemo items koristeći prevodne ključeve
const items = [
  {
    titleKey: "menu.home",    
    url: "/home",
    icon: Home,
  },
  {
    titleKey: "menu.about",  
    url: "/about",
    icon: UsersRound,
  },
  {
    titleKey: "menu.library",
    url: "/library",
    icon: LibraryBig,
  },
  {
    titleKey: "menu.upload",
    url: "/upload",
    icon: Upload,
  },
  {
    titleKey: "menu.manage",
    url: "/manage",
    icon: DatabaseZap,
  },
];

export function AppSidebar() {
  const { t } = useTranslation();

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="my-10 text-2xl font-bold text-darkpurple">
            {t("sidebarTitle")}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-4 text-accentDark">
              {items.map((item) => (
                <SidebarMenuItem key={item.titleKey}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url}>
                      <item.icon />
                      <span className="font-bold">{t(item.titleKey)}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <div className="flex items-center justify-center mb-10">
        <LangSwitch />
      </div>
    </Sidebar>
  );
}
