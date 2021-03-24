import { PrefixCommand } from "../../modules/commandutils";
import { Canvas, createCanvas } from "canvas";
import { GuildMember, Message, MessageAttachment } from "discord.js";

var canvasMap = new Map<GuildMember, Canvas>();

var canvas: Canvas;
export default new PrefixCommand({
    names: ["draw"],
    action: ({ message, args }) => {
        if (message.member && args.length > 0) {
            if (args[0] == 'init') {
                init(message, args);
            } else {
                processArgs(message, args)
            }


        }
    },
    description: 'lets you draw on a personal canvas'
});

function init(message: Message, args: string[]) {
    if (!message.member) return
    var w = numberOrDefault(args[1], 500)
    var h = numberOrDefault(args[2], 500)
    var color = args[3] ?? 'white'
    var canvas = initCanvas(w, h, color)
    canvasMap.set(message.member, canvas);
    message.channel.send(new MessageAttachment(canvas.toBuffer()));
}

function processArgs(message: Message, args: string[]) {
    if (!message.member) return
    var canvas = canvasMap.get(message.member)
    var stewpidFlag = false
    switch (args[0]) {
        case 'rect':
            if (!canvas) return
            var x = numberOrDefault(args[1], 0)
            var y = numberOrDefault(args[2], 0)
            var w = numberOrDefault(args[3], 100)
            var h = numberOrDefault(args[4], 100)
            var color = args[5] ?? 'black'
            fillRect({ canvas, x, y, w, h, color });
            break
        case 'hrect':
            if (!canvas) return
            var x = numberOrDefault(args[1], 0)
            var y = numberOrDefault(args[2], 0)
            var w = numberOrDefault(args[3], 100)
            var h = numberOrDefault(args[4], 100)
            var color = args[5] ?? 'black'
            var lineWidth = numberOrDefault(args[6], 1)
            drawRect({ canvas, x, y, w, h, color, lineWidth });
            break
        case 'line':
            if (!canvas) return
            var x1 = numberOrDefault(args[1], 0)
            var y1 = numberOrDefault(args[2], 0)
            var x2 = numberOrDefault(args[3], 0)
            var y2 = numberOrDefault(args[4], 0)
            var color = args[5] ?? 'black'
            var lineWidth = numberOrDefault(args[6], 1)
            drawLine({ canvas, x1, y1, x2, y2, color, lineWidth });
            break
        case 'transform':
            if (!canvas) return
            var a = numberOrDefault(args[1], 1)
            var b = numberOrDefault(args[2], 0)
            var c = numberOrDefault(args[3], 0)
            var d = numberOrDefault(args[4], 1)
            var e = numberOrDefault(args[5], 0)
            var f = numberOrDefault(args[6], 0)
            transform({canvas, a, b, c, d, e, f });
            break
        default:
            stewpidFlag = true
            break;
    }

    if (stewpidFlag) {
        message.channel.send('Invalid args')
    } else if (!canvas) {
        message.channel.send('You have not made a canvas yet')
    } else {
        message.channel.send(new MessageAttachment(canvas!.toBuffer()));
    }
}









function numberOrDefault(str: string, def: number) {
    var x = parseInt(str)
    if (isNaN(x)) x = def;
    return x;
}
function initCanvas(width: number, height: number, color: string) {
    var canvas = createCanvas(width, height);
    var ctx = canvas.getContext("2d");
    fillRect({ canvas, x: 0, y: 0, w: canvas.width, h: canvas.height, color })
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.scale(1, -1);
    return canvas;
}
function fillRect({ canvas, x, y, w, h, color }: { canvas: Canvas; x: number; y: number; w: number; h: number; color: string; }) {
    resetCanvasSettings(canvas);
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

function drawRect(
    { canvas, x, y, w, h, color, lineWidth }: { canvas: Canvas; x: number; y: number; w: number; h: number; color: string; lineWidth: number; }) {
    resetCanvasSettings(canvas);
    var ctx = canvas.getContext("2d");
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth
    ctx.strokeRect(x, y, w, h);
}

function drawLine({ canvas, x1, y1, x2, y2, color, lineWidth }: { canvas: Canvas; x1: number; y1: number; x2: number; y2: number; color: string; lineWidth: number; }) {
    resetCanvasSettings(canvas);
    var ctx = canvas.getContext("2d");
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth
    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
}

function transform({canvas, a, b, c, d, e, f }: {canvas: Canvas; a: number; b: number; c: number; d: number; e: number; f: number; }) {
    resetCanvasSettings(canvas);
    var ctx = canvas.getContext("2d");
    ctx.transform(a, b, c, d, e, f)
}

function resetCanvasSettings(canvas: Canvas) {
    var ctx = canvas.getContext("2d");
    ctx.lineWidth = 1.0
    ctx.lineCap = 'butt'
    ctx.lineJoin = 'miter'
    ctx.miterLimit = 10
    ctx.font = '10px sans-serif'
    ctx.textAlign = 'start'
    ctx.textBaseline = 'alphabetic'
    ctx.direction = 'inherit'
    ctx.fillStyle = '#000'
    ctx.strokeStyle = '#000'
    ctx.shadowBlur = 0
    ctx.shadowColor = 'rgba(0, 0, 0, 0)'
    ctx.shadowOffsetX = 0
    ctx.shadowOffsetY = 0
}