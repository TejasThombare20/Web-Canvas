'use client'
import CustomModal from '@/components/Custom-modal'
import SubscriptionFormWrapper from '@/components/Subscription-form-wrapper'
import { PriceList } from '@/lib/types'
import { useModal } from '@/provider/modal-provider'
import { useSearchParams } from 'next/navigation'
import React, { useEffect } from 'react'

type Props = {
  prices: PriceList['data']
  customerId: string
  planExists: boolean
}

const SubscriptionHelper = ({ customerId, planExists, prices }: Props) => {
  const { setOpen } = useModal()
  const searchParams = useSearchParams()
  const plan = searchParams.get('plan')

  useEffect(() => {
    if (plan)
      setOpen(
        <CustomModal
          title="Upgrade Plan!"
          subheading="Get started today to get access to premium features"
        >
          <SubscriptionFormWrapper
            planExists={planExists}
            customerId={customerId}
          />
        </CustomModal>,
        async () => ({
          plans: {
            defaultPriceId: plan ? plan : '',
            plans: prices,
          },
        })
      )
  }, [plan])

  return <div>SubscriptionHelper</div>
}

export default SubscriptionHelper