"use client";
import { useModal } from "@/provider/modal-provider";
import React from "react";
import { Button } from "./ui/button";
import CustomModal from "./Custom-modal";
import UploadMediaForm from "./UploadMediaForm";

type Props = {
  subacocoutId: string;
};

const MediaUploadButton = ({ subacocoutId }: Props) => {
  const { isOpen, setClose, setOpen } = useModal();

  return (
    <Button
      onClick={() => {
        setOpen(
          <CustomModal
            title="Upload Media"
            subheading="Upload a file to your media bucket"
          >
            <UploadMediaForm subaccountId={subacocoutId}/>
          </CustomModal>
        );
      }}
    >
      Upload media
    </Button>
  );
};

export default MediaUploadButton;
