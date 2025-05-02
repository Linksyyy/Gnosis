import { ChatInputCommandInteraction } from "discord.js";

export default async function chainReply(
  msg: ChatInputCommandInteraction,
  output: string,
  begin: number = 0,
  limit: number = 2000,
) {
  let limitCounter: number = limit;
  try {
    await msg.reply(output.slice(begin, limit));
  } catch {
    await msg.followUp(output.slice(begin, limitCounter));
  }
  if (output.length > limit) {
    limitCounter += limit;
    begin += limit;
    chainReply(msg, output, begin, limitCounter);
  }
}
