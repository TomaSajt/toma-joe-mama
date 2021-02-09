const config = require('../../../config.json');
const { Message } = require('discord.js');
module.exports = (message, client) => {
    var text = message.content.toLowerCase()
    if (text == `${config.prefix}shuffle`) {
        if (message instanceof Message) {
            var member = message.member;
            var arr = member.displayName.split('');
            shuffle(arr)
            var newNick = "";
            arr.forEach(c => newNick += c)
            member.setNickname(newNick).catch(() => { })
        }
    }
}
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}