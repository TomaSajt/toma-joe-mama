import { PrefixCommand } from "../../modules/commandutils";
import fetch from 'node-fetch'

export default new PrefixCommand({
  names: ["gbruh", "gb-search"],
  bypassPause: false,
  adminOnly: true,
  hidden: true,
  action: async ({ message, args }) => {
    var json = await gbSearch(args, 3);
    var str = json
      .map((entry) => entry.file_url)
      .reduce((allRows, nextRow) => allRows + "\n" + nextRow);
    message.channel.send(str);
  },
  description:':)'
});

async function gbSearch(
  searchTerms: string[],
  limit: number
) {
  var response = await fetch(`${process.env.GB_LINK}limit=${limit}&tags=${searchTerms.join("+")}`);
  var json: { file_url: string }[] = await response.json()
  return json;
}
