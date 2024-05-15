import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import BlurPage from "@/components/Blur-page";
import SubAccountDetails from "@/components/SubAccount-deatils";
import UserDetails from "@/components/User-details";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import React from "react";

type Props = {
  params: {
    subaccountId: string;
  };
};

const page = async ({ params }: Props) => {
  const authUser = await getServerSession(authOptions);

  if (!authUser) return;

  const userDetails = await db.user.findUnique({
    where: {
      email: authUser.user?.email!,
    },
  });

  if (!userDetails) return;

  const subAccount = await db.subAccount.findUnique({
    where: {
      id: params.subaccountId,
    },
  });

  if (!subAccount) return null;

  const agencyDetails = await db.agency.findUnique({
    where: { id: subAccount.agencyId },
    include: { SubAccount: true },
  });

  if (!agencyDetails) return;

  const subAccounts = agencyDetails.SubAccount;

  return (
    <BlurPage>
      <div className="flex lg:!flex-row flex-col gap-4">
        <SubAccountDetails
          agencyDetails={agencyDetails}
          details={subAccount}
          userId={userDetails.id}
          userName={userDetails.name}
        />

        <UserDetails
          type="subaccount"
          id={params.subaccountId}
          subAccounts={subAccounts}
          userData={userDetails}
        />
      </div>
    </BlurPage>
  );
};

export default page;
