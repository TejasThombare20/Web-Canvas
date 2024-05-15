import Unauthorized from "@/components/Unauthorized";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import React from "react";

type Props = {
  params: { subaccountId: string };
};

const page = async ({ params }: Props) => {
  const pipelineExists = await db.pipeline.findFirst({
    where: { subAccountId: params.subaccountId },
  });

  if (pipelineExists) {
    return redirect(
      `/subaccount/${params.subaccountId}/pipelines/${pipelineExists.id}`
    );
  }

  try {
    const response = await db.pipeline.create({
      data: {
        name: "First Pipeline",
        subAccountId: params.subaccountId,
      },
    });
  } catch (error) {
    console.log("error", error);
  }

  return (
    <div>
      <Unauthorized />
    </div>
  );
};

export default page;
