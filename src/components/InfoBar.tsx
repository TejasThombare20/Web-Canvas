"use client";
import { NotificationWithUser } from "@/lib/types";
import { Item } from "@radix-ui/react-dropdown-menu";
import React, { useState } from "react";
import { twMerge } from "tailwind-merge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTrigger,
} from "./ui/sheet";
import { Bell } from "lucide-react";
import { Role } from "@prisma/client";
import { Card } from "./ui/card";
import { Switch } from "./ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { ModeToggle } from "./ToggleMode";
import Link from "next/link";

type Props = {
  notifications: NotificationWithUser | [];
  role?: Role;
  className?: string;
  subAccountId?: string;
};

const InfoBar = ({ notifications, className, subAccountId, role }: Props) => {
  const [allNotifications, setAllNotifications] = useState(notifications);
  const [showAll, setshowAll] = useState(true);

  const handleClick = () => {
    if (!showAll) {
      setAllNotifications(notifications);
    } else {
      if (notifications?.length !== 0) {
        setAllNotifications(
          notifications?.filter((item) => item.subAccountId === subAccountId) ??
            []
        );
      }
    }

    setshowAll((prev) => !prev);
  };

  return (
    <>
      <div
        className={twMerge(
          "fixed z-[20] md:left-[300] left-0 right-0 top-0 p-4 bg-background/80 backdrop-blur-md flex gap-4 items-center border-b-[1px]",
          className
        )}
      >
        <Link href={"/"} className="text-3xl max-sm:mx-10 font-bold">WebCanvas.</Link>
        <div className="flex items-center gap-2 ml-auto">
          <Sheet>
            <SheetTrigger>
              <div className="rounded-full w-8 h-8 bg-primary flex items-center justify-center text-white ">
                <Bell size={17} />
              </div>
            </SheetTrigger>
            <SheetContent className="mt-4 mr-4 pr-4 overflow-scroll">
              <SheetHeader>
                Notifications
                <SheetDescription>
                  {(role === "AGENCY_ADMIN" || role === "AGENCY_OWNER") && (
                    <Card className="flex items-center justify-between p-4 ">
                      Current Subaccount
                      <Switch onCheckedChange={handleClick} />
                    </Card>
                  )}
                </SheetDescription>
              </SheetHeader>
              {allNotifications?.map((notification) => (
                <div
                  key={notification.id}
                  className="flex flex-col gap-y-2 overflow-x-scroll text-ellipsis"
                >
                  <div className="flex gap-2 ">
                    <Avatar>
                      <AvatarImage
                        src={notification.User.avatarUrl}
                        alt="Profile Picture"
                      ></AvatarImage>
                      <AvatarFallback className="bg-primary">
                        {notification.User.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col ">
                      <p>
                        <span className="font-bold">
                          {notification.notification.split("|")[0]}
                        </span>
                        <span className="text-muted-foreground">
                          {notification.notification.split("|")[1]}
                        </span>
                        <span className="font-bold">
                          {notification.notification.split("|")[2]}
                        </span>
                      </p>
                      <small className="text-xs text-muted-foreground ">
                        {new Date(notification.createdAt).toLocaleDateString()}
                      </small>
                    </div>
                  </div>
                </div>
              ))}
              {allNotifications?.length === 0 && (
                <div className="flex items-center justify-center mb-4 text-muted-foreground">
                  You have no notifications
                </div>
              )}
            </SheetContent>
          </Sheet>
          <ModeToggle />
        </div>
      </div>
    </>
  );
};

export default InfoBar;
