import { zeppelinPlugin } from "../ZeppelinPluginBlueprint";
import { ConfigSchema, TagsPluginType } from "./types";
import { PluginOptions } from "knub";
import { GuildArchives } from "src/data/GuildArchives";
import { GuildTags } from "src/data/GuildTags";
import { GuildSavedMessages } from "src/data/GuildSavedMessages";
import { GuildLogs } from "src/data/GuildLogs";
import { onMessageCreate } from "./util/onMessageCreate";
import { onMessageDelete } from "./util/onMessageDelete";
import { TagCreateCmd } from "./commands/TagCreateCmd";
import { TagDeleteCmd } from "./commands/TagDeleteCmd";
import { TagEvalCmd } from "./commands/TagEvalCmd";
import { TagListCmd } from "./commands/TagListCmd";
import { TagSourceCmd } from "./commands/TagSourceCmd";

const defaultOptions: PluginOptions<TagsPluginType> = {
  config: {
    prefix: "!!",
    delete_with_command: true,

    user_tag_cooldown: null,
    global_tag_cooldown: null,
    user_cooldown: null,
    global_cooldown: null,

    categories: {},

    can_create: false,
    can_use: false,
    can_list: false,
  },
  overrides: [
    {
      level: ">=50",
      config: {
        can_use: true,
        can_create: true,
        can_list: true,
      },
    },
  ],
};

export const TagsPlugin = zeppelinPlugin<TagsPluginType>()("tags", {
  configSchema: ConfigSchema,
  defaultOptions,

  // prettier-ignore
  commands: [
    TagEvalCmd,
    TagDeleteCmd,
    TagListCmd,
    TagSourceCmd,
    TagCreateCmd,
  ],

  onLoad(pluginData) {
    const { state, guild } = pluginData;

    state.archives = GuildArchives.getGuildInstance(guild.id);
    state.tags = GuildTags.getGuildInstance(guild.id);
    state.savedMessages = GuildSavedMessages.getGuildInstance(guild.id);
    state.logs = new GuildLogs(guild.id);

    state.onMessageCreateFn = msg => onMessageCreate(pluginData, msg);
    state.savedMessages.events.on("create", state.onMessageCreateFn);

    state.onMessageDeleteFn = msg => onMessageDelete(pluginData, msg);
    state.savedMessages.events.on("delete", state.onMessageDeleteFn);
  },

  onUnload(pluginData) {
    pluginData.state.savedMessages.events.off("create", pluginData.state.onMessageCreateFn);
    pluginData.state.savedMessages.events.off("delete", pluginData.state.onMessageDeleteFn);
  },
});
