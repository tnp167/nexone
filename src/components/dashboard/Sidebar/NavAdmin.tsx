"use client";

import { DashboardSidebarMenuInterface } from "@/components/lib/types";
import { adminDashboardSidebarOptions } from "@/components/constants/data";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { icons } from "@/components/constants/icons";
import { usePathname } from "next/navigation";
export const SidebarNavAdmin = ({
  options,
}: {
  options: DashboardSidebarMenuInterface[];
}) => {
  const pathname = usePathname();
  return (
    <nav className="relative grow">
      <Command className="rounded-lg overflow-visible">
        <CommandInput placeholder="Search..." />
        <CommandList className="py-2 overflow-visible">
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup className="overflow-visible pt-0 relative">
            {options.map((option, index) => {
              let icon;
              const iconSearch = icons.find(
                (icon) => icon.value === option.icon
              );
              if (iconSearch) {
                icon = <iconSearch.path />;
              }
              return (
                <CommandItem
                  key={index}
                  className={cn("w-full h-12 cursor-pointer mt-1", {
                    "bg-accent text-accent-foreground":
                      pathname === option.link,
                  })}
                >
                  <Link
                    href={option.link}
                    className="flex items-center gap-2 hover:bg-transparent transition-all w-full"
                  >
                    {icon}
                    <span>{option.label}</span>
                  </Link>
                </CommandItem>
              );
            })}
          </CommandGroup>
          <CommandSeparator />
        </CommandList>
      </Command>
    </nav>
  );
};
