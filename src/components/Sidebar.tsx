import { getAuthUserDetails } from "@/lib/querires";
import MenuOptions from "./MenuOptions";

type Props = {
  id: string;
  type: "agency" | "subaccount";
};

const Sidebar = async ({ id, type }: Props) => {
  const user = await getAuthUserDetails();

  if (!user) return null;

  if (!user.Agency) return;

  const details =
    type === "agency"
      ? user?.Agency
      : user?.Agency.SubAccount.find((sb) => sb.id === id);

  const isWhiteLabeledAgency = user.Agency.whiteLabel;

  let sidebarLogo = user.Agency.agencyLogo || "assets/next.svg";

  if (!details) return;

  if (!isWhiteLabeledAgency) {
    if (type === "subaccount") {
      sidebarLogo =
        user.Agency.SubAccount.find((sb) => sb.id === id)?.subAccountLogo ||
        user.Agency.agencyLogo;
    }
  }

  const sidebarOptions =
    type === "agency"
      ? user.Agency.SidebarOption || []
      : user.Agency.SubAccount.find((sb) => sb.id === id)?.SidebarOption || [];

  const subAccouts = user.Agency.SubAccount.filter((sb) =>
    user.Permissions.find((p) => p.subAccountId === sb.id && p.access)
  );

  return (
    <>
      <MenuOptions
        defaultOpen={true}
        details={details}
        sidebarOpt={sidebarOptions}
        subAccounts={subAccouts}
        user={user}
        id={id}
        sidebarLogo={sidebarLogo}
      />
      <MenuOptions
        details={details}
        id={id}
        sidebarLogo={sidebarLogo}
        sidebarOpt={sidebarOptions}
        subAccounts={subAccouts}
        user={user}
      />
    </>
  );
};

export default Sidebar;
