"use client";

import {
  deleteubsAccount,
  getSubaccountDetails,
  saveActivityLogsNotification,
} from "@/lib/querires";
import { useRouter } from "next/navigation";

type Props = {
  subaccountId: string;
};

const DeleteButton = ({ subaccountId }: Props) => {
  const router = useRouter();

  return (
    <div
      onClick={async () => {
        const response = await getSubaccountDetails(subaccountId);
        await saveActivityLogsNotification({
          agencyId: undefined,
          description: `Deleted a subaccount | ${response?.name}`,
          subaccountId: subaccountId,
        });
        await deleteubsAccount(subaccountId);
        router.refresh()
      }}
    >
      delete-button 
    </div>
  );
};

export default DeleteButton;
