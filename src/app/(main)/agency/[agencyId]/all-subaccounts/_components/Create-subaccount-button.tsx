"use client";
import CustomModal from "@/components/Custom-modal";
import SubAccountDetails from "@/components/SubAccount-deatils";
import { Button } from "@/components/ui/button";
import { useModal } from "@/provider/modal-provider";
import { Agency, AgencySidebarOption, SubAccount, User } from "@prisma/client";
import { PlusCircleIcon } from "lucide-react";
import { twMerge } from "tailwind-merge";

type Props = {
  user: User & {
    Agency:
      | (
          | Agency
          | (null & {
              SubAccount: SubAccount[];
              SideBarOption: AgencySidebarOption;
            })
        )
      | null;
  };
  id: string;
  className: string;
};

const CreateSubaccountButton = ({ className, id, user }: Props) => {
  const { setOpen } = useModal();

  const agencyDetails = user.Agency;

  if (!agencyDetails) return;

  return (
    <Button
      className={twMerge("w-full flex gap-4 ", className)}
      onClick={() => {
        setOpen(
          <CustomModal
            title="Create a SubAccount"
            subheading="You can switch between"
          >
            <SubAccountDetails
              agencyDetails={agencyDetails}
              userId={user.id}
              userName={user.name}
            />
          </CustomModal>
        );
      }}
    >
      <PlusCircleIcon size={15} />
      Create Sub Accout
    </Button>
  );
};

export default CreateSubaccountButton;
