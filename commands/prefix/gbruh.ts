import { PrefixCommand } from "../../modules/commandutils";

export default new PrefixCommand({
  names: ["gbruh"],
  bypassPause: false,
  adminOnly: true,
  action: async ({ message, args }) => {
    var json = await gbSearch(args, 3);
    var str = json
      .map((entry) => entry.file_url)
      .reduce((allRows, nextRow) => allRows + "\n" + nextRow);
    message.channel.send(str);
  },
});

async function gbSearch(
  searchTerms: string[],
  limit: number
): Promise<{ file_url: string }[]> {
  var response = await fetch(
    `${process.env.GBLINK}limit=${limit}&tags=${searchTerms.join("+")}`
  );
  return await response.json();
}
