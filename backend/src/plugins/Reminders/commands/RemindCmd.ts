import humanizeDuration from "humanize-duration";
import moment from "moment-timezone";
import { commandTypeHelpers as ct } from "../../../commandTypes";
import { registerUpcomingReminder } from "../../../data/loops/upcomingRemindersLoop";
import { sendErrorMessage, sendSuccessMessage } from "../../../pluginUtils";
import { convertDelayStringToMS, messageLink } from "../../../utils";
import { TimeAndDatePlugin } from "../../TimeAndDate/TimeAndDatePlugin";
import { remindersCmd } from "../types";

export const RemindCmd = remindersCmd({
  trigger: ["remind", "remindme", "reminder", "r"],
  usage: "!remind 3h Remind me of this in 3 hours please",
  permission: "can_use",

  signature: {
    time: ct.string(),
    reminder: ct.string({ required: false, catchAll: true }),
  },

  async run({ message: msg, args, pluginData }) {
    const timeAndDate = pluginData.getPlugin(TimeAndDatePlugin);

    const now = moment.utc();
    const tz = await timeAndDate.getMemberTz(msg.author.id);

    let reminderTime: moment.Moment;
    if (args.time.match(/^\d{4}-\d{1,2}-\d{1,2}$/)) {
      // Date in YYYY-MM-DD format, remind at current time on that date
      reminderTime = moment.tz(args.time, "YYYY-M-D", tz).set({
        hour: now.hour(),
        minute: now.minute(),
        second: now.second(),
      });
    } else if (args.time.match(/^\d{4}-\d{1,2}-\d{1,2}T\d{2}:\d{2}$/)) {
      // Date and time in YYYY-MM-DD[T]HH:mm format
      reminderTime = moment.tz(args.time, "YYYY-M-D[T]HH:mm", tz).second(0);
    } else {
      // "Delay string" i.e. e.g. "2h30m"
      const ms = convertDelayStringToMS(args.time);
      if (ms === null) {
        sendErrorMessage(pluginData, msg.channel, "Invalid reminder time");
        return;
      }

      reminderTime = moment.utc().add(ms, "millisecond");
    }

    if (!reminderTime.isValid() || reminderTime.isBefore(now)) {
      sendErrorMessage(pluginData, msg.channel, "Invalid reminder time");
      return;
    }

    const reminderBody = args.reminder || messageLink(pluginData.guild.id, msg.channel.id, msg.id);
    const reminder = await pluginData.state.reminders.add(
      msg.author.id,
      msg.channel.id,
      reminderTime.clone().tz("Etc/UTC").format("YYYY-MM-DD HH:mm:ss"),
      reminderBody,
      moment.utc().format("YYYY-MM-DD HH:mm:ss"),
    );

    registerUpcomingReminder(reminder);

    const msUntilReminder = reminderTime.diff(now);
    const timeUntilReminder = humanizeDuration(msUntilReminder, { largest: 2, round: true });

    sendSuccessMessage(
      pluginData,
      msg.channel,
      `I will remind you in **${timeUntilReminder}** at <t:${reminderTime.unix()}:f>`,
    );
  },
});
