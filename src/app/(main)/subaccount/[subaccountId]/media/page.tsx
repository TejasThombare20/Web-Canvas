import BlurPage from "@/components/Blur-page";
import MediaComponent from "@/components/MediaComp";
import { getMedia } from "@/lib/querires";

type Props = {
  params: { subaccountId: string };
};

const page = async ({ params }: Props) => {
  const data = await getMedia(params.subaccountId);

  return (
    <BlurPage>
      <MediaComponent data={data} subaccountId={params.subaccountId} />
    </BlurPage>
  );
};

export default page;
