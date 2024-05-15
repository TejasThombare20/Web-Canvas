"use server";

import { clerkClient } from "@clerk/nextjs";
import { db } from "./db";
import { redirect } from "next/navigation";
import {
  Agency,
  Lane,
  Plan,
  Prisma,
  Role,
  SubAccount,
  Tag,
  Ticket,
  User,
} from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { v4 } from "uuid";
import SubAccountDetails from "@/components/SubAccount-deatils";
import {
  CreateFunnelFormSchema,
  CreateMediaType,
  UpsertFunnelPage,
} from "./types";
import { string, z } from "zod";
import { revalidatePath } from "next/cache";

export const getUserRole = async (email: string) => {
  const userData = await db.user.findUnique({
    where: {
      email: email,
    },
  });

  return userData;
};

export const getAuthUserDetails = async () => {
  const user = await getServerSession(authOptions);

  // console.log("data", data);

  if (!user) {
    return;
  }

  const userData = await db.user.findUnique({
    where: {
      email: user.user?.email!,
    },
    include: {
      Agency: {
        include: {
          SidebarOption: true,
          SubAccount: {
            include: {
              SidebarOption: true,
            },
          },
        },
      },
      Permissions: true,
    },
  });

  return userData;
};

export const createTeamUser = async (agencyId: string, user: User) => {
  if (user.role === "AGENCY_OWNER") return null;

  const response = await db.user.create({ data: { ...user } });

  return response;
};

// export const saveActivityLogNotification = async ({
//   agencyId,
//   description,
//   subaccountId,
// }: {
//   agencyId?: string;
//   description: string;
//   subaccountId?: string;
// }) => {
//   const authUser = await currentUser();
//   let userData;

//   if (!authUser) {
//     const response = await db.user.findFirst({
//       where: {
//         Agency: {
//           SubAccount: {
//             some: { id: subaccountId },
//           },
//         },
//       },
//     });

//     if (response) {
//       userData = response;
//     } else {
//       userData = await db.user.findUnique({
//         where: {
//           email: authUser?.emailAddresses[0].emailAddress,
//         },
//       });
//     }
//     if (!userData) {
//       console.log("Could not find user");
//       return;
//     }
//   }
// };

export const saveActivityLogsNotification = async ({
  agencyId,
  description,
  subaccountId,
}: {
  agencyId?: string;
  description: string;
  subaccountId?: string;
}) => {
  const authUser = await getServerSession(authOptions);
  let userData;
  if (!authUser) {
    const response = await db.user.findFirst({
      where: {
        Agency: {
          SubAccount: {
            some: { id: subaccountId },
          },
        },
      },
    });
    if (response) {
      userData = response;
    }
  } else {
    userData = await db.user.findUnique({
      where: { email: authUser.user?.email! },
    });
  }

  if (!userData) {
    console.log("Could not find a user");
    return;
  }

  let foundAgencyId = agencyId;
  if (!foundAgencyId) {
    if (!subaccountId) {
      throw new Error(
        "You need to provide atleast an agency Id or subaccount Id"
      );
    }
    const response = await db.subAccount.findUnique({
      where: { id: subaccountId },
    });
    if (response) foundAgencyId = response.agencyId;
  }
  if (subaccountId) {
    await db.notification.create({
      data: {
        notification: `${userData.name} | ${description}`,
        User: {
          connect: {
            id: userData.id,
          },
        },
        Agency: {
          connect: {
            id: foundAgencyId,
          },
        },
        SubAccount: {
          connect: { id: subaccountId },
        },
      },
    });
  } else {
    await db.notification.create({
      data: {
        notification: `${userData.name} | ${description}`,
        User: {
          connect: {
            id: userData.id,
          },
        },
        Agency: {
          connect: {
            id: foundAgencyId,
          },
        },
      },
    });
  }
};

export const verifyAndAcceptInvitation = async () => {
  const user = await getServerSession(authOptions);
  // console.log("user activate", user);
  if (!user) return redirect("/sign-in");

  const invitationExists = await db.invitation.findUnique({
    where: {
      email: user.user?.email!,
      status: "PENDING",
    },
  });

  // console.log("invitationExists", invitationExists);

  if (invitationExists) {
    const userDetails = await createTeamUser(invitationExists.agencyId, {
      email: invitationExists.email,
      agencyId: invitationExists.agencyId,
      avatarUrl: user.user?.image!,
      //@ts-ignore
      id: user.user?.id,
      name: user.user?.name!,
      role: invitationExists.role,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await saveActivityLogsNotification({
      agencyId: invitationExists?.agencyId,
      description: "Joined",
      subaccountId: undefined,
    });

    if (userDetails) {
      // await clerkClient.users.updateUserMetadata(user.id , {
      //   privateMetadata : {
      //     role : userDetails.role  || "SUBACCOUNT_USER",
      //   }
      // })
      await db.invitation.delete({
        where: { email: userDetails.email },
      });

      return userDetails.agencyId;
    } else {
      return null;
    }
  } else {
    const agency = await db.user.findUnique({
      where: {
        email: user.user?.email!,
      },
    });

    return agency ? agency.agencyId : null;
  }
};

export const updateAgencyDetails = async (
  agencyId: string,
  agencyDetails: Partial<Agency>
) => {
  const response = await db.agency.update({
    where: { id: agencyId },
    data: { ...agencyDetails },
  });

  return response;
};

export const deleteAgency = async (agencyId: string) => {
  const response = await db.agency.delete({
    where: { id: agencyId },
  });

  return response;
};

export const initUser = async (newUser: Partial<User>) => {
  // const user = await currentUser();
  const user = await getServerSession(authOptions);
  if (!user) return;

  const userData = await db.user.upsert({
    where: { email: user.user?.email! },
    update: newUser,
    create: {
      //@ts-ignore
      id: user.user?.id,
      avatarUrl: user.user?.image!,
      email: user.user?.email!,
      name: user.user?.name!,
      role: newUser.role || "SUBACCOUNT_USER",
    },
  });
  // update usermetadata
  // await clerkClient.users.updateUserMetadata(user.id, {
  //   privateMetadata: {
  //     role: newUser.role || 'SUBACCOUNT_USER',
  //   },
  // })
  return userData;
};

export const upsertAgency = async (agency: Agency, price?: Plan) => {
  console.log("agency", agency);
  if (!agency.companyEmail) return null;
  try {
    const agencyDetails = await db.agency.upsert({
      where: {
        id: agency.id,
      },
      update: agency,
      create: {
        users: {
          connect: { email: agency.companyEmail },
        },
        ...agency,
        SidebarOption: {
          create: [
            {
              name: "Dashboard",
              icon: "category",
              link: `/agency/${agency.id}`,
            },
            {
              name: "Launchpad",
              icon: "clipboardIcon",
              link: `/agency/${agency.id}/launchpad`,
            },
            {
              name: "Billing",
              icon: "payment",
              link: `/agency/${agency.id}/billing`,
            },
            {
              name: "Settings",
              icon: "settings",
              link: `/agency/${agency.id}/settings`,
            },
            {
              name: "Sub Accounts",
              icon: "person",
              link: `/agency/${agency.id}/all-subaccounts`,
            },
            {
              name: "Team",
              icon: "shield",
              link: `/agency/${agency.id}/team`,
            },
          ],
        },
      },
    });
    return agencyDetails;
  } catch (error) {
    console.log(error);
  }
};

export const getNotificationandUser = async (agencyId: string) => {
  try {
    const response = await db.notification.findMany({
      where: { agencyId },

      include: {
        User: true,
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    return response;
  } catch (error) {
    console.log(error);
  }
};

export const upsertSubAccount = async (subAccount: SubAccount) => {
  if (!subAccount.companyEmail) return null;

  try {
    const agencyOwner = await db.user.findFirst({
      where: {
        Agency: {
          id: subAccount.agencyId,
        },
        role: "AGENCY_OWNER",
      },
    });

    if (!agencyOwner) {
      return console.log("Error could not create subaccount");
    }

    const permissionId = v4();
    const response = await db.subAccount.upsert({
      where: {
        id: subAccount.id,
      },
      update: subAccount,
      create: {
        ...subAccount,
        Permissions: {
          create: {
            access: true,
            email: agencyOwner.email,
            id: permissionId,
          },
          connect: {
            subAccountId: subAccount.id,
            id: permissionId,
          },
        },
        Pipeline: {
          create: {
            name: "Lead Cycle",
          },
        },
        SidebarOption: {
          create: [
            {
              name: "Launchpad",
              icon: "clipboardIcon",
              link: `/subaccount/${subAccount.id}/launchpad`,
            },
            {
              name: "Settings",
              icon: "settings",
              link: `/subaccount/${subAccount.id}/settings`,
            },
            {
              name: "Funnels",
              icon: "pipelines",
              link: `/subaccount/${subAccount.id}/funnels`,
            },
            {
              name: "Media",
              icon: "database",
              link: `/subaccount/${subAccount.id}/media`,
            },
            {
              name: "Automations",
              icon: "chip",
              link: `/subaccount/${subAccount.id}/automations`,
            },
            {
              name: "Pipelines",
              icon: "flag",
              link: `/subaccount/${subAccount.id}/pipelines`,
            },
            {
              name: "Contacts",
              icon: "person",
              link: `/subaccount/${subAccount.id}/contacts`,
            },
            {
              name: "Dashboard",
              icon: "category",
              link: `/subaccount/${subAccount.id}`,
            },
          ],
        },
      },
    });
    return response;
  } catch (error) {
    console.log("error", error);
  }
};

export const getUserPermissions = async (userId: string) => {
  try {
    const response = await db.user.findUnique({
      where: { id: userId },
      select: {
        Permissions: {
          include: {
            SubAccount: true,
          },
        },
      },
    });
    return response;
  } catch (error) {
    console.log("error", error);
  }
};

export const updateUser = async (user: Partial<User>) => {
  const session = await getServerSession(authOptions);
  const AuthUser = session?.user;

  try {
    const response = await db.user.update({
      where: { email: user.email },
      data: { ...user },
    });

    return response;
  } catch (error) {
    console.log("error", error);
  }
};

export const changeUserPermissions = async (
  permissionId: string,
  userEmail: string,
  subAccountId: string,
  permission: boolean
) => {
  try {
    const response = await db.permissions.upsert({
      where: { id: permissionId },
      update: { access: permission },
      create: {
        access: permission,
        email: userEmail,
        subAccountId: subAccountId,
      },
    });
    return response;
  } catch (error) {
    console.log("error", error);
  }
};

export const getSubaccountDetails = async (subaccountId: string) => {
  const response = await db.subAccount.findUnique({
    where: {
      id: subaccountId,
    },
  });
  return response;
};

export const deleteubsAccount = async (subaccountId: string) => {
  try {
    const response = await db.subAccount.delete({
      where: {
        id: subaccountId,
      },
    });
    return response;
  } catch (error) {
    console.log("error", error);
  }
};

export const deleteUser = async (userId: string) => {
  const deletedUser = await db.user.delete({
    where: { id: userId },
  });

  return deletedUser;
};

export const getUser = async (id: string) => {
  const user = await db.user.findUnique({
    where: {
      id,
    },
  });
};

export const sendInvitations = async (
  role: Role,
  email: string,
  agencyId: string
) => {
  const response = await db.invitation.create({
    data: { email, agencyId, role },
  });

  // send invitation mail to organization

  return response;
};

export const getMedia = async (subaccountId: string) => {
  const mediafiles = await db.subAccount.findUnique({
    where: {
      id: subaccountId,
    },
    include: {
      Media: true,
    },
  });

  return mediafiles;
};

export const createMedia = async (
  subacccountId: string,
  mediafile: CreateMediaType
) => {
  const response = await db.media.create({
    data: {
      link: mediafile.link,
      name: mediafile.name,
      subAccountId: subacccountId,
    },
  });

  return response;
};

export const deleteMedia = async (mediaId: string) => {
  const response = await db.media.delete({
    where: {
      id: mediaId,
    },
  });

  return response;
};

export const getPipelineDetails = async (pipelineId: string) => {
  const response = await db.pipeline.findUnique({
    where: {
      id: pipelineId,
    },
  });

  return response;
};

export const getLaneswithTicketAndTags = async (pipelineId: string) => {
  const response = await db.lane.findMany({
    where: {
      pipelineId: pipelineId,
    },
    orderBy: {
      order: "asc",
    },
    include: {
      Tickets: {
        orderBy: {
          order: "asc",
        },
        include: {
          Tags: true,
          Assigned: true,
          Customer: true,
        },
      },
    },
  });

  return response;
};

export const upsertFunnel = async (
  subAccountId: string,
  funnel: z.infer<typeof CreateFunnelFormSchema> & { liveProducts: string },
  funnelId: string
) => {
  const response = await db.funnel.upsert({
    where: {
      id: funnelId,
    },
    update: funnel,
    create: {
      ...funnel,
      id: funnelId || v4(),
      subAccountId: subAccountId,
    },
  });

  return response;
};

export const upsertPipeline = async (
  pipeline: Prisma.PipelineUncheckedCreateInput
) => {
  const response = await db.pipeline.upsert({
    where: { id: pipeline.id || v4() },
    update: pipeline,
    create: pipeline,
  });

  return response;
};

export const deletePipeline = async (pipelineId: string) => {
  const response = await db.pipeline.delete({
    where: { id: pipelineId },
  });

  return response;
};

export const updateLaneOrder = async (lanes: Lane[]) => {
  try {
    const updateTrans = lanes.map((lane) =>
      db.lane.update({
        where: {
          id: lane.id,
        },
        data: {
          order: lane.order,
        },
      })
    );
    await db.$transaction(updateTrans);
  } catch (error) {
    console.log("error", error);
  }
};

export const updateTicketsOrder = async (tickets: Ticket[]) => {
  try {
    const updateTrans = tickets.map((ticket) =>
      db.ticket.update({
        where: {
          id: ticket.id,
        },
        data: {
          order: ticket.order,
          laneId: ticket.laneId,
        },
      })
    );

    await db.$transaction(updateTrans);
  } catch (error) {
    console.log("error", error);
  }
};

export const upsertlane = async (lane: Prisma.LaneUncheckedCreateInput) => {
  let order: number;

  if (!lane.order) {
    const lanes = await db.lane.findMany({
      where: {
        pipelineId: lane.pipelineId,
      },
    });

    order = lanes.length;
  } else {
    order = lane.order;
  }

  const response = await db.lane.upsert({
    where: { id: lane.id || v4() },
    update: lane,
    create: { ...lane, order },
  });

  return response;
};

export const deletelane = async (laneId: string) => {
  const response = await db.lane.delete({
    where: {
      id: laneId,
    },
  });

  return response;
};

export const getTicketsWithTags = async (pipelineId: string) => {
  const response = await db.ticket.findMany({
    where: {
      Lane: {
        pipelineId,
      },
    },
    include: {
      Tags: true,
      Assigned: true,
      Customer: true,
    },
  });
  return response;
};

export const _getTicketsWithAllRelations = async (laneId: string) => {
  const response = await db.ticket.findMany({
    where: { laneId },
    include: {
      Assigned: true,
      Customer: true,
      Lane: true,
      Tags: true,
    },
  });

  return response;
};

export const getSubAccountTeamMembers = async (subaccountId: string) => {
  // console.log(subaccountId);
  const subaccountUsersWithAccess = await db.user.findMany({
    where: {
      Agency: {
        SubAccount: {
          some: {
            id: subaccountId,
          },
        },
      },
      role: "SUBACCOUNT_USER",
      // Permissions: {
      //   some: {
      //     subAccountId: subaccountId,
      //     access: true,
      //   },
      // },
    },
  });
  // console.log("subaccountUsersWithAccess", subaccountUsersWithAccess);
  return subaccountUsersWithAccess;
};

export const searchContacts = async (searchTerms: string) => {
  const response = await db.contact.findMany({
    where: {
      name: {
        contains: searchTerms,
      },
    },
  });
  return response;
};

export const upsertTicket = async (
  ticket: Prisma.TicketUncheckedCreateInput,
  tags: Tag[]
) => {
  let order: number;
  console.log("ticket", ticket);

  if (!ticket.order) {
    const tickets = await db.ticket.findMany({
      where: {
        laneId: ticket.laneId,
      },
    });
    console.log("tickets", tickets);
    order = tickets.length;
  } else {
    order = ticket.order;
  }

  const response = await db.ticket.upsert({
    where: {
      id: ticket.id,
    },
    update: {
      ...ticket,
      Tags: {
        set: tags,
      },
    },
    create: {
      ...ticket,
      Tags: {
        connect: tags,
      },
      order,
    },
    include: {
      Assigned: true,
      Customer: true,
      Tags: true,
      Lane: true,
    },
  });
  return response;
};

export const deleteTickets = async (ticketId: string) => {
  const response = await db.ticket.delete({
    where: {
      id: ticketId,
    },
  });

  return response;
};

export const upsertTag = async (
  subaccountId: string,
  tag: Prisma.TagUncheckedCreateInput
) => {
  const response = await db.tag.upsert({
    where: {
      id: tag.id || v4(),
      subAccountId: subaccountId,
    },
    update: tag,
    create: {
      ...tag,
      subAccountId: subaccountId,
    },
  });

  return response;
};

export const deleteTag = async (tagId: string) => {
  const response = await db.tag.delete({
    where: { id: tagId },
  });

  return response;
};

export const getTagsForSubaccount = async (subacccountId: string) => {
  const response = await db.subAccount.findUnique({
    where: {
      id: subacccountId,
    },
    select: {
      Tags: true,
    },
  });
  return response;
};

export const upsertContact = async (
  contact: Prisma.ContactUncheckedCreateInput
) => {
  const response = await db.contact.upsert({
    where: { id: contact.id || v4() },
    update: contact,
    create: contact,
  });

  return response;
};

export const getFunnels = async (subacccountId: string) => {
  const funnels = await db.funnel.findMany({
    where: {
      subAccountId: subacccountId,
    },
    include: {
      FunnelPages: true,
    },
  });

  return funnels;
};

export const getFunnel = async (funnelId: string) => {
  const funnel = await db.funnel.findUnique({
    where: {
      id: funnelId,
    },
    include: {
      FunnelPages: {
        orderBy: {
          order: "asc",
        },
      },
    },
  });
  return funnel;
};

export const upsertFunnelPage = async (
  subaccountId: string,
  funnelPage: UpsertFunnelPage,
  funnelId: string
) => {
  if (!subaccountId || !funnelId) return;
  const response = await db.funnelPage.upsert({
    where: { id: funnelPage.id || "" },
    update: { ...funnelPage },
    create: {
      ...funnelPage,
      content: funnelPage.content
        ? funnelPage.content
        : JSON.stringify([
            {
              content: [],
              id: "__body",
              name: "Body",
              styles: { backgroundColor: "white" },
              type: "__body",
            },
          ]),
      funnelId,
    },
  });

  revalidatePath(`/subaccount/${subaccountId}/funnels/${funnelId}`, "page");
  return response;
};

export const deleteFunnelePage = async (funnelPageId: string) => {
  const response = await db.funnelPage.delete({ where: { id: funnelPageId } });

  return response;
};

export const updateFunnelProducts = async (
  products: string,
  funnelId: string
) => {
  const data = await db.funnel.update({
    where: { id: funnelId },
    data: { liveProducts: products },
  });
  return data;
};

export const getFunnelPageDetails = async (funnelPageId: string) => {
  const response = await db.funnelPage.findUnique({
    where: {
      id: funnelPageId,
    },
  })

  return response
}

export const getDomainContent = async (subDomainName: string) => {
  const response = await db.funnel.findUnique({
    where: {
      subDomainName,
    },
    include: { FunnelPages: true },
  })
  return response
}

export const getPipelines = async (subaccountId: string) => {
  const response = await db.pipeline.findMany({
    where: { subAccountId: subaccountId },
    include: {
      Lane: {
        include: { Tickets: true },
      },
    },
  })
  return response
}

