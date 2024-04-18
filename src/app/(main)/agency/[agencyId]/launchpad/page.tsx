import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { db } from "@/lib/db";
import { CheckCircleIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

type Props = {
  params: {
    agencyId: string;
  };
  searchParams: { code: string };
};

const page = async ({ params, searchParams }: Props) => {
  const agencyDetails = await db.agency.findUnique({
    where: { id: params.agencyId },
  });

  if (!agencyDetails) return;
  const allDetailsExist =
    agencyDetails.address &&
    agencyDetails.address &&
    agencyDetails.agencyLogo &&
    agencyDetails.city &&
    agencyDetails.companyEmail &&
    agencyDetails.companyPhone &&
    agencyDetails.country &&
    agencyDetails.name &&
    agencyDetails.state &&
    agencyDetails.zipCode;

  return (
    <div className="flex flex-col justify-center items-center ">
      <div className="w-full h-full max-w-[800px]">
        <Card className="border-none">
          <CardHeader>
            <CardTitle>lets get started</CardTitle>
            <CardDescription>
              Follow the steps below to your account setup
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 ">
            <div className="flex justify-between items-center w-full border p-4 rounded-lg gap-2 ">
              <div className="flex md:items-center gap-4 flex-col md:!flex-row">
                <Image
                  src="/assets/appstore.png"
                  alt="appstore"
                  width={80}
                  height={80}
                  className="rounded-md object-contain"
                />
                <p>Save the website as a shortcut on your mobile device</p>
              </div>
              <Button>Start</Button>
            </div>
            <div className="flex justify-between items-center w-full border p-4 rounded-lg gap-2 ">
              <div className="flex md:items-center gap-4 flex-col md:!flex-row">
                <Image
                  src="/assets/stripelogo.png"
                  alt="stripelogo"
                  width={80}
                  height={80}
                  className="rounded-md object-contain"
                />
                <p>
                  Connect your stripe acccount to accept payment and see your
                  dashboard
                </p>
              </div>
              <Button>Start</Button>
            </div>
            <div className="flex justify-between items-center w-full border p-4 rounded-lg gap-2 ">
              <div className="flex md:items-center gap-4 flex-col md:!flex-row">
                <Image
                  src={agencyDetails.agencyLogo}
                  alt="agency logo"
                  width={80}
                  height={80}
                  className="rounded-md object-contain"
                />
                <p>Fill in all business details</p>
              </div>
              {allDetailsExist ? (
                <CheckCircleIcon
                  size={50}
                  className="text-primary p-2 flex-shrink-0"
                />
              ) : (
                <Link
                  className="text-primary p-2 px-4 rounded-md text-white cursor-pointer"
                  href={`/agency/${params.agencyId}/setting`}
                >
                  {" "}
                  Start
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default page;