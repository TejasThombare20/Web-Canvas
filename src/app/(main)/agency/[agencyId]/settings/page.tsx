import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";

import AgencyDetails from "@/components/AgencyDetails";
import UserDetails from "@/components/User-details";

type Props = {
  params: { agencyId: string };
};

const Setting = async ({ params }: Props) => {
  const authUser = await getServerSession(authOptions);

  if (!authUser) {
    return null;
  }

  const userDetails = await db.user.findUnique({
    where: {
      email: authUser.user?.email!,
    },
  });

  if (!userDetails) {
    return null;
  }

  const agencyDetails = await db.agency.findUnique({
    where: {
      id: params.agencyId,
    },
    include: {
      SubAccount: true,
    },
  });

  if (!agencyDetails) return null;

  const subAccounts = agencyDetails.SubAccount;

  return (
    <div className="flex md:flex-row  flex-col gap-4">
      <AgencyDetails data={agencyDetails} />
      <UserDetails
        type="agency"
        id={params.agencyId}
        subAccounts={subAccounts}
        userData={userDetails}
      />
    </div>
  );
};

export default Setting;
