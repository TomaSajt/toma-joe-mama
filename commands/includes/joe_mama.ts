import { IncludesCommand } from "../../modules/commandutils"

export default new IncludesCommand({
    names: ['joe mama'],
    action: ({ message }) => {
        message.channel.send(`> You are almost as funny as me ${message.author}`, { files: [randomPicture()] })

        function randomPicture(): string {
            var pictures = [
                "https://i.imgur.com/Fl4DpvB.jpg",
                "https://i.imgur.com/Fl4DpvB.jpg",
                "https://i.imgur.com/6iueg8x.png"
            ]
            return pictures[Math.floor(Math.random() * pictures.length)]
        }
    }
})