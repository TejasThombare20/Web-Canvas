'use client'
import ContactUserForm from '@/components/Contact-user-form'
import CustomModal from '@/components/Custom-modal'
import { Button } from '@/components/ui/button'
import { useModal } from '@/provider/modal-provider'
import React from 'react'

type Props = {
  subaccountId: string
}

const CraeteContactButton = ({ subaccountId }: Props) => {
  const { setOpen } = useModal()

  const handleCreateContact = async () => {
    setOpen(
      <CustomModal
        title="Create Or Update Contact information"
        subheading="Contacts are like customers."
      >
        <ContactUserForm  subaccountId={subaccountId} />
      </CustomModal>
    )
  }

  return <Button onClick={handleCreateContact}>Create Contact</Button>
}

export default CraeteContactButton