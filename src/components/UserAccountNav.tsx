import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";
import Image from "next/image";

import Link from "next/link";
import { Gem } from "lucide-react";

interface UserAccountNavProps {
  email: string | undefined;
  name: string | undefined;
  imageURL?: string | undefined;
}

const UserAccountNav = async ({
  email,
  imageURL,
  name,
}: UserAccountNavProps) => {
  return (
    <DropdownMenu >
      <DropdownMenuTrigger asChild className="overflow-visible">
        <Button className="rounded-full h-8 w-8 aspect-square bg-slate-400">
          <Avatar className="relative w-8 h-8">
            {imageURL ? (
              <div className="relative aspect-square h-full w-full">
                <Image
                  fill
                  alt="user profile image"
                  referrerPolicy="no-referrer"
                  src={imageURL}
                />
              </div>
            ) : (
              <AvatarFallback className="sr-only">{name}</AvatarFallback>
            )}
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className=" " align="end">
        <div className="flex items-center justify-start gap-2 p-2 ">
          <div className="flex flex-col space-y-0.5 leading-none ">
            {name && <p className="font-medium text-sm dark:text-white">{name}</p>}
            {email && (
              <p className="truncate w-[200px] text-xs dark:text-white/90">
                {" "}
                {email}
              </p>
            )}
          </div>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link className=" dark:text-white/90" href={"/agency"}>
            Dashboard
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserAccountNav;