
import React from 'react'
import FunnelsDataTable from './data-table'
import { Plus } from 'lucide-react'
import BlurPage from '@/components/Blur-page'
import { CreateFunnelFormSchema } from '@/lib/types'
import { getFunnels } from '@/lib/querires'
import FunnelForm from '@/components/Funnel-form'
import { columns } from './[funnelId]/column'


const Funnels = async ({ params }: { params: { subaccountId: string } }) => {
  const funnels = await getFunnels(params.subaccountId)
  if (!funnels) return null

  return (
    <BlurPage>
      <FunnelsDataTable
        actionButtonText={
          <>
            <Plus size={15} />
            Create Funnel
          </>
        }
        modalChildren={
          <FunnelForm subAccountId={params.subaccountId}></FunnelForm>
        }
        filterValue="name"
        columns={columns}
        data={funnels}
      />
    </BlurPage>
  )
}

export default Funnels