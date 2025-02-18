"use client";

import { FC, useState, ComponentPropsWithoutRef } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown, PlusCircle, StoreIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { useParams, useRouter } from "next/navigation";

type PopoverTriggerProps = ComponentPropsWithoutRef<typeof PopoverTrigger>;

interface StoreSwitcherProps extends PopoverTriggerProps {
  stores: Record<string, any>[];
}

const StoreSwitcher: FC<StoreSwitcherProps> = ({ stores, className }) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);

  const formattedStores = stores.map((store) => ({
    label: store.name,
    url: store.url,
  }));

  const activeStore = formattedStores.find(
    (store) => store.url === params.storeUrl
  );
  const onStoreSelect = (store: { label: string; url: string }) => {
    setOpen(false);
    router.push(`/dashboard/seller/stores/${store.url}`);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          role="combobox"
          aria-expanded={open}
          aria-label="Select a store"
          className={cn("w-[250px] justify-between", className)}
        >
          <StoreIcon className="h-4 w-4 mr-2" />
          {activeStore?.label}
          <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-0">
        <Command>
          <CommandInput placeholder="Search store..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Stores">
              {formattedStores.map((store) => (
                <CommandItem
                  key={store.url}
                  onSelect={() => onStoreSelect(store)}
                  className="text-sm cursor-pointer"
                >
                  <StoreIcon className="h-4 w-4 mr-2" />
                  {store.label}
                  <Check
                    className={cn("ml-auto h-4 w-4 opacity-0", {
                      "opacity-100": activeStore?.url === store.url,
                    })}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          <CommandSeparator />
          <CommandList>
            <CommandItem
              className="cursor-pointer"
              onSelect={() => {
                setOpen(false);
                router.push(`/dashboard/seller/stores/new`);
              }}
            >
              <PlusCircle className="mr-2 h-5 w-5" />
              Create Store
            </CommandItem>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default StoreSwitcher;
