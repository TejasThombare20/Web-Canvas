import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  getLaneswithTicketAndTags,
  getPipelineDetails,
  updateLaneOrder,
  updateTicketsOrder,
} from "@/lib/querires";
import { LaneDetails } from "@/lib/types";
import { redirect } from "next/navigation";
import React from "react";
import PipelineInfobar from "../_components/Pipeline-infobar";
import { db } from "@/lib/db";
import PipelineSettings from "../_components/Pipeline-setting";
import PipelineView from "../_components/Pipeline-view";

type Props = {
  params: { subaccountId: string; pipelineId: string };
};

const page = async ({ params }: Props) => {
  const pipelineExists = await getPipelineDetails(params.pipelineId);

  if (!pipelineExists) {
    return redirect(`/subaccount/${params.subaccountId}/pipelines`);
  }
  const pipelines = await db.pipeline.findMany({
    where: {
      subAccountId: params.subaccountId,
    },
  });

  const lanes = (await getLaneswithTicketAndTags(
    params.pipelineId
  )) as LaneDetails[];

  return (
    <>
    <PipelineInfobar
          pipelineId={params.pipelineId}
          subAccountId={params.subaccountId}
          pipelines={pipelines}
        />

    <Tabs defaultValue="view" className="w-full">
      <TabsList className="bg-transparent border-b-2 h-16 w-full justify-between mb-4">
        
        <div>
          <TabsTrigger value="view" className="!bg-transparent w-40 ">
            Pipeline view
          </TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </div>
      </TabsList>
      <TabsContent value="view">
        <PipelineView
          lanes={lanes}
          pipelineDetails={pipelineExists}
          pipelineId={params.pipelineId}
          subaccountId={params.subaccountId}
          updateLanesOrder={updateLaneOrder}
          updateTicketsOrder={updateTicketsOrder}
        />
      </TabsContent>
      <TabsContent value="settings">
        <PipelineSettings
          pipelineId={params.pipelineId}
          pipelines={pipelines}
          subaccountId={params.subaccountId}
        />
      </TabsContent>
    </Tabs>
    </>
  );
};

export default page;
