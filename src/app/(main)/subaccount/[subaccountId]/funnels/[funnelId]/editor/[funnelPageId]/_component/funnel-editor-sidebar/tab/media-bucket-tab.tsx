"use client";

import MediaComponent from "@/components/MediaComp";
import { getMedia } from "@/lib/querires";
import { getMediaFiles } from "@/lib/types";
import React, { useEffect, useState } from "react";

type Props = {
  subaccountId: string;
};

const MediaBucketTab = (props: Props) => {
  const [data, setdata] = useState<getMediaFiles>(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getMedia(props.subaccountId);
      setdata(response);
    };
    fetchData();
  }, [props.subaccountId]);

  return (
    <div className="h-[900px] overflow-scroll p-4">
      <MediaComponent data={data} subaccountId={props.subaccountId} />
    </div>
  );
};

export default MediaBucketTab;
