import { User } from "discord.js";
import { GlobalPluginData } from "knub";
import { GuildInvite } from "../../../utils";
import { BotControlPluginType } from "../types";

const REQUIRED_MEMBER_COUNT = 50;

export async function isEligible(
  pluginData: GlobalPluginData<BotControlPluginType>,
  user: User,
  invite: GuildInvite,
): Promise<{ result: boolean; explanation: string }> {
  const memberCount = invite.memberCount || 0;
  if (memberCount >= REQUIRED_MEMBER_COUNT) {
    return {
      result: true,
      explanation: `Server has ${memberCount} members, which is equal or higher than the required ${REQUIRED_MEMBER_COUNT}`,
    };
  }

  return {
    result: false,
    explanation: "Server does not meet requirements",
  };
}
