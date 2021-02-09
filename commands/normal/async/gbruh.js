
















































const config = require('../../../config.json');
const { Message } = require('discord.js');
const fetch = require('node-fetch');
module.exports = async (message, client) => {
    if (message instanceof Message) {
        var text = message.content.toLowerCase()
        if (text.startsWith(`${config.prefix}gbruh`)) {
            if (message.member.id == config.members.toma) {
                var args = message.content.substring(`${config.prefix}gbruh`.length).trim().split().filter(str => str != "");
                var json = await search(args, 10)
                if (json instanceof Array) {
                    var urls = json.map(entry => entry.file_url)
                    message.channel.send(urls.reduce((allRows, nextRow) => allRows+"\n"+nextRow))
                }
            } else {
                message.channel.send("you can't know what this is")
            }
        }
    }
}

function apilessSearch(arr) {
    if (arr instanceof Array) {
        var formData = "page=post&s=list&tags=";
        arr.forEach(tag => {
            formData += tag + "+"
        })
        fetch("https://gelbooru.com/index.php", {
            body: formData,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            method: "post"
        }).then(res => res.text()).then(
            (html) => console.log(html)
        )
    }
}

async function search(arr, limit) {
    if (arr instanceof Array) {
        var tagsString = "";
        arr.forEach(tag => {
            tagsString += tag + "+"
        })
        var searchArgs = `page=dapi&s=post&q=index&json=1&api_key=69c6a9eec964e78c52f32440132168ea819e2b5947543ccce4589f487ad9ad09&user_id=731181&limit=${limit}&tags=${tagsString}`;
        var response = await fetch("https://gelbooru.com/index.php?" + searchArgs)
        return await response.json();
    }
}