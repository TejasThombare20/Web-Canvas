import Unauthorized from "@/components/Unauthorized";
import { getAuthUserDetails, verifyAndAcceptInvitation } from "@/lib/querires";
import { redirect } from "next/navigation";

type Props = {
  searchParams: { state: string; code: string };
};

const page = async ({ searchParams }: Props) => {
  const agencyId = await verifyAndAcceptInvitation();

  // console.log("agencyId for verification", agencyId);

  if (!agencyId) {
    return <Unauthorized />;
  }

  const user = await getAuthUserDetails();

  if (!user) return;

  // console.log("user for per", user);

  const getFirstSubaccountwithAccess = user.Permissions.find(
    (permission) => permission.access === true
  );

  // console.log("getFirstSubaccountwithAccess", getFirstSubaccountwithAccess);

  if (searchParams.state) {
    const statePath = searchParams.state.split("___")[0];
    const stateSubaccountId = searchParams.state.split("___")[1];

    if (!stateSubaccountId) return <Unauthorized />;

    return redirect(
      `/subaccount/${stateSubaccountId}/${statePath}?code=${searchParams.code}`
    );
  }

  if (getFirstSubaccountwithAccess) {
    return redirect(`/subaccount/${getFirstSubaccountwithAccess.subAccountId}`);
  }

  return <Unauthorized />;
};

export default page;
