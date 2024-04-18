import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import AgencyDetails from "@/components/AgencyDetails";
import { getAuthUserDetails, verifyAndAcceptInvitation } from "@/lib/querires";
import { Plan } from "@prisma/client";
import { getServerSession } from "next-auth";

import { redirect } from "next/navigation";
import React from "react";

const page = async ({
  searchParams,
}: {
  searchParams: { plan: Plan; state: string; code: string };
}) => {
  const session = await getServerSession(authOptions);
  const authUser = session?.user;
  console.log("session", session);

  const agencyId = await verifyAndAcceptInvitation();

  console.log("agencyId", agencyId);

  const user = await getAuthUserDetails();


  if (agencyId) {
    if (user?.role === "SUBACCOUNT_GUEST" || user?.role === "SUBACCOUNT_USER") {
      return redirect("/subaccount");
    } else if (user?.role === "AGENCY_ADMIN" || user?.role === "AGENCY_OWNER") {
      if (searchParams.plan) {
        return redirect(
          `/agency/${agencyId}/billing?plan=${searchParams.plan}`
        );
      }
      if (searchParams.state) {
        const statePath = searchParams.state.split("___")[0];
        const stateAgencyId = searchParams.state.split("___")[1];

        if (!stateAgencyId) {
          return <div>Not authorized</div>;
        }
        return redirect(
          `/agency/${stateAgencyId}/${statePath}?code=${searchParams.code}`
        );
      } else {
        return redirect(`/agency/${agencyId}`);
      }
    } else {
      return <div>Not Authorized</div>;
    }
  }

  return (
    <div className="flex justify-center items-center mt-4">
      <div className="max-w-[850px] border-[1px] p-4 rounded-xl">
        <h1 className="text-4xl">Create an Agency</h1>
        <AgencyDetails data={{ companyEmail: authUser?.email! }} />
      </div>
    </div>
  );
};

export default page;