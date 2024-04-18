import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import BlurPage from "@/components/Blur-page";
import InfoBar from "@/components/InfoBar";
import Sidebar from "@/components/Sidebar";
import Unauthorized from "@/components/Unauthorized";
import {
  getNotificationandUser,
  verifyAndAcceptInvitation,
} from "@/lib/querires";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";

type Props = {
  params: { agencyId: string };
  children: React.ReactNode;
};

const layout = async ({ children, params }: Props) => {
  const agencyId = await verifyAndAcceptInvitation();
  const session = await getServerSession(authOptions);

  const user = session?.user;

  if (!user) {
    return redirect("/");
  }

  if (!agencyId) {
    return redirect("/sign-in");
  }

  //@ts-ignore
  if (user.role !== "AGENCY_OWNER" && user.role !== "AGENCY_ADMIN")
    return (
      <div>
        <Unauthorized />
      </div>
    );

  let allNotifications: any = [];
  const notifications = await getNotificationandUser(agencyId);

  if (notifications) allNotifications = notifications;

  return (
    <div className="h-screen overflow-hidden">
      <Sidebar id={params.agencyId} type="agency" />

      <div className="md:pl-[300px]">
        <InfoBar 

        role={allNotifications?.user?.role}
        notifications = {allNotifications}/>
        <div className="relative">
          <BlurPage>{children}</BlurPage>
        </div>
      </div>
    </div>
  );
};

export default layout;
