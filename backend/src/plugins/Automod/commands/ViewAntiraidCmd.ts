import { guildPluginMessageCommand } from "knub";
import { AutomodPluginType } from "../types";

export const ViewAntiraidCmd = guildPluginMessageCommand<AutomodPluginType>()({
  trigger: "antiraid",
  permission: "can_view_antiraid",
  description: "Sets the antiraid level",

  async run({ pluginData, message }) {
    if (pluginData.state.cachedAntiraidLevel) {
      message.channel.send(`Anti-raid is set to **${pluginData.state.cachedAntiraidLevel}**`);
    } else {
      message.channel.send(`Anti-raid is **off**`);
    }
  },
});
