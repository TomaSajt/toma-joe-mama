import { PrefixCommand, PrefixCommandActionArgs } from "../../modules/commandutils";

export default new PrefixCommand({
    names: ["eval","e","evaluate","evaluation","run"],
    bypassPause: false,
    adminOnly: true,
    action: async (pcargs) => {
      var remaining = pcargs.message.content;
      var codeblocks: string[] = [];
      while (remaining.includes('```') && remaining.substring(remaining.indexOf("```") + 3).includes('```')) {
        remaining = remaining.substring(remaining.indexOf("```") + 3);
        codeblocks.push(remaining.substring(0, remaining.indexOf("```") - 1));
        remaining = remaining.substring(remaining.indexOf("```") + 3)
      }
      for (const codeblock of codeblocks) {
        evalCodeBlock(codeblock.substring(codeblock.indexOf('\n')+1),pcargs)
      }
      
    },
  })

  function evalCodeBlock(toEval:string, {args,client,message,name,pch}:PrefixCommandActionArgs) {
    eval(toEval)
}