import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import BlurPage from "@/components/Blur-page";
import InfoBar from "@/components/InfoBar";
import Sidebar from "@/components/Sidebar";
import Unauthorized from "@/components/Unauthorized";
import {
  getAuthUserDetails,
  getNotificationandUser,
  verifyAndAcceptInvitation,
} from "@/lib/querires";
import { Role } from "@prisma/client";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";

type Props = {
  children: React.ReactNode;
  params: { subaccountId: string };
};

const layout = async ({ children, params }: Props) => {
  const agencyId = await verifyAndAcceptInvitation();

  if (!agencyId) return <Unauthorized />;

  const session = await getServerSession(authOptions);

  const user = session?.user;

  if (!user) {
    return redirect("/");
  }

  let notifications: any = [];
  //@ts-ignore
  if (!user.role) {
    return <Unauthorized />;
  } else {
    const allPermissions = await getAuthUserDetails();
    const hasPermission = allPermissions?.Permissions.find(
      (permission) =>
        permission.access && permission.subAccountId === params.subaccountId
    );

    if (!hasPermission) {
      return <Unauthorized />;
    }
  }

  //   let allNotifications: any = [];
  const allNotifications = await getNotificationandUser(agencyId);

  // @ts-ignore
  if (user.role === "AGENCY_ADMIN" || user.role === "AGENCY_OWNER") {
    notifications = allNotifications;
  } else {
    const fileteredNotification = allNotifications?.filter(
      (item) => item.subAccountId === params.subaccountId
    );

    if (fileteredNotification) notifications = fileteredNotification;
  }

  return (
    <div className="h-screen overflow-hidden">
      <Sidebar id={params.subaccountId} type="subaccount" />

      <div className="md:pl-[300px]">
        <InfoBar
          //@ts-ignore
          role={user?.role as Role}
          subAccountId={params.subaccountId as string}
          notifications={notifications}
        />
        <div className="relative">
         
          {children}
        </div>
      </div>
    </div>
  );
};

export default layout;
