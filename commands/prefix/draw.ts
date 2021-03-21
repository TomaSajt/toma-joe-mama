import { PrefixCommand } from "../../modules/commandutils";
import {Canvas} from 'canvas'
import { MessageAttachment } from "discord.js";
export default new PrefixCommand({
    names:['draw'],
    action:({message})=>{
        var canvas = new Canvas(300,300,'image')
        var ctx = canvas.getContext('2d');
        ctx.strokeText("pog",10,10)
        message.channel.send(new MessageAttachment(canvas.toBuffer()))
    }
})