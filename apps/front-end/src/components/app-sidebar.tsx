"use client";

import {
  Building2,
  Compass,
  Home,
  Package,
  Percent,
  Settings,
  Store,
  Ticket,
  TicketPercent,
  UserPlus,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";

type NavItem = {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  match?: (pathname: string) => boolean;
};

type NavSection = {
  label: string;
  items: NavItem[];
};

function getSections(): NavSection[] {
  return [
    {
      label: "Visão Geral",
      items: [
        {
          title: "Dashboard",
          href: "/dashboard",
          icon: Home,
          match: (p) => p === "/dashboard" || p.startsWith("/dashboard?"),
        },
        {
          title: "Produtos",
          href: "/dashboard/products",
          icon: Package,
          match: (p) => p.startsWith("/dashboard/products"),
        },
        {
          title: "Cupons",
          href: "/dashboard/coupons",
          icon: TicketPercent,
          match: (p) => p.startsWith("/dashboard/coupons"),
        },
        {
          title: "Promoções",
          href: "/dashboard/promotions",
          icon: Percent,
          match: (p) => p.startsWith("/dashboard/promotions"),
        },
        {
          title: "Store Front",
          // using Store icon if available else Building2 fallback
          href: "/dashboard/store-front",
          icon: Store ?? Building2,
          match: (p) => p.startsWith("/dashboard/store-front"),
        },
      ],
    },
    {
      label: "Organização",
      items: [
        {
          title: "Membros",
          href: "/dashboard/members",
          icon: Users,
          match: (p) => p.startsWith("/dashboard/members"),
        },
        {
          title: "Convites",
          href: "/dashboard/invitations",
          icon: UserPlus,
          match: (p) => p.startsWith("/dashboard/invitations"),
        },
        {
          title: "Configurações",
          href: "/dashboard/settings",
          icon: Settings,
          match: (p) => p.startsWith("/dashboard/settings"),
        },
      ],
    },
    {
      label: "Marketplace",
      items: [
        {
          title: "Explorar",
          href: "/products",
          icon: Compass,
          match: (p) => p.startsWith("/products"),
        },
        {
          title: "Meus Cupons",
          href: "/my-coupons",
          icon: Ticket,
          match: (p) => p.startsWith("/my-coupons"),
        },
      ],
    },
  ];
}

// Wrapper to avoid widespread 'any' casts while Next.js RouteImpl inference not available for dynamic paths created later.
function NavLink(props: { href: string; children: React.ReactNode }) {
  return <Link href={{ pathname: props.href }}>{props.children}</Link>;
}

export function AppSidebar() {
  const pathname = usePathname();
  const sections = getSections();

  return (
    <Sidebar>
      <SidebarContent className="mt-20">
        {sections.map((section) => (
          <SidebarGroup key={section.label}>
            <SidebarGroupLabel>{section.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => {
                  const active = item.match
                    ? item.match(pathname)
                    : pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={active}
                        tooltip={item.title}
                      >
                        <NavLink href={item.href}>
                          <Icon />
                          <span>{item.title}</span>
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
            <SidebarSeparator />
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
