const mineflayer = require('mineflayer')

const config = require('./input.json');


startbot()


const botlist = [];

function startbot() {
    const botcounter = 0;
    const botname = 'PCGI_Master';

    const bot = mineflayer.createBot({
        username: botname,
        password: '',
        host: config.server.ip,
        port: config.server.port,
        version: config.server.version
    })
    bot.once("spawn", function () {
        bot.chat('Bot is online!');
    })

    bot.on('chat', (username, message) => {
        const words = message.split(" ");
        //if (username !== botname) bot.chat(words[0] + words[1])
        if (words[0] == 'summon') summonBot(words[1])

    })
}

function summonBot(nameofbot) {
    let botcounter=botcounter+1;
    
    console.log(botcounter);
    
}