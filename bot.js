const mineflayer = require('mineflayer')

const autoeat = require('mineflayer-auto-eat').plugin
const config = require('./settings.json');

var pi = 3.14159;

var reconnect = 0;
const botlist = [];





createBot()

//BOT UTAMA ADMIN
function createBot() {
  const bot = mineflayer.createBot({
    username: config['bot-account']['username'],
    password: config['bot-account']['password'],
    auth: config['bot-account']['type'],
    host: config.server.ip,
    port: config.server.port,
    version: config.server.version
  })



  bot.on('playerJoined', function () { bot.chat(`Hardcore Server, DIE = Spectator. PROJECT BARU ketik 'info' `) })



  //login DONT WORRY
  bot.once("spawn", function () {

    console.log("\x1b[33m[BotLog] Bot joined to the server", '\x1b[0m')

    if (config.utils['auto-auth'].enabled) {
      console.log("[INFO] Started auto-auth module")

      var password = config.utils['auto-auth'].password
      setTimeout(function () {
        bot.chat(`/register ${password} ${password}`)
        bot.chat(`/login ${password}`)
      }, 500);

      console.log(`[Auth] Authentification commands executed.`)
    }

    //CEK CHAT FUNCTION
    if (config.utils['chat-messages'].enabled) {
      console.log("[INFO] Started chat-messages module")
      var messages = config.utils['chat-messages']['messages']

      if (config.utils['chat-messages'].repeat) {
        var delay = config.utils['chat-messages']['repeat-delay']
        let i = 0

        let msg_timer = setInterval(() => {
          bot.chat(`${messages[i]}`)

          if (i + 1 == messages.length) {
            i = 0
          } else i++
        }, delay * 1000)
      } else {
        messages.forEach(function (msg) {
          bot.chat(msg)
        })
      }
    }






    //ANTI AFK
    bot.on('time', function (time) {
      var yaw = Math.random() * pi - (0.5 * pi);
      var pitch = Math.random() * pi - (0.5 * pi);
      bot.look(yaw, -90, false);



    });
    bot.loadPlugin(autoeat)
    afk(10000);




    function afk(waktu) {
      setTimeout(() => {

        if ((bot.health < 20) && (bot.food < 20)) {
          timing = 10000;
          bot.autoEat.enable()
          bot.autoEat.eat()

        } else {
          bot.attack(bot.nearestEntity(e => e.mobType == 'Armor Stand'));
          bot.autoEat.disable();
          timing = 10000;
        }
        afk(timing);
      }, waktu)
    }
  })

  function healthcheck() {

    bot.chat(`I have ${bot.health} health ${bot.food} food and ${bot.experience.level} level XP`)
  }





  bot.on("chat", function (username, message) {
    //CHAT LOGGER
    if (config.utils['chat-log']) {
      console.log(`[ChatLog] <${username}> ${message}`)
    }
  })
  //BOT MOVE
  bot.on("goal_reached", function () {
    console.log(`\x1b[32m[BotLog] Bot arrived to target location. ${bot.entity.position}\x1b[0m`)
  })
  //BOT DEAD
  bot.on("death", function () {
    console.log(`\x1b[33m[BotLog] Bot has been died and was respawned ${bot.entity.position}`, '\x1b[0m')
    bot.chat(`BOT has been died, respawn location ${bot.entity.position}`)
  })


  //RECONNECT HARUSNYA CUMA ON DI BOT UTAMA DOANG
  if (config.utils['auto-reconnect'] && reconnect == 0) {
    bot.on('end', function () {
      createBot()


    })
  }



  //retry login
  bot.on('kicked', (reason) => console.log('\x1b[33m', `[BotLog] Bot was kicked from the server. Reason: \n${reason}`, '\x1b[0m'))
  bot.on('error', err => console.log(`\x1b[31m[ERROR] ${err.message}`, '\x1b[0m'))






  //bot chat
  bot.on('chat', (username, message) => {
    if (message == 'reset lists') {
      botlist = [];
    }
    //check health
    if (message === 'health') healthcheck()



    //SUMMON OTHER BOT
    const arrmessage = message.split(" ");
    if (arrmessage[0] == 'summon') {//arrmsg0=masage index start from 0
      botlist.push(arrmessage[1])
      bot.chat(`Bot List: ${botlist}`)
      botbaru(arrmessage[1], 'unknown'); //command for new bot

    }
    //OTHER BOT ACTIVITY

    let index = botlist.indexOf(arrmessage[0]);
    if (index != -1) {//force TP working
      if (arrmessage[1] == 'forcetp') { bot.chat(`/tp ${arrmessage[0]} ${arrmessage[2]}`) }


    }












    if (message === 'console') { console.log('test') }
    if (message === 'list bot') { bot.chat(`Bot List: ${botlist}`) }
    if (message == 'info') { bot.chat(`${config.quest}`) }

  })

  bot.on('entitySpawn', (entity) => {
    if (entity.name === 'vex') {
      console.log('ADA VEX');
      bot.chat(`${entity.mobType} spawned at ${entity.position}, ADA VEX COEG BYEEE!!!`)
      reconnect = 1;
      bot.quit('');
    }

  })















}




//BOT SPAWNAN
function botbaru(botname) {
  const bot = mineflayer.createBot({
    username: botname,
    password: '',
    auth: config['bot-account']['type'],
    host: config.server.ip,
    port: config.server.port,
    version: config.server.version
  })
  bot.loadPlugin(autoeat)

  bot.on('chat', (username, message) => {
    const arrmessage = message.split(" ");
    if (message == 'health') { healthcheck() };
    let index = botlist.indexOf(arrmessage[0]);
    if (index != -1) {

      //specific bot
      if (botname == arrmessage[0]) {
        if (arrmessage[1] == 'quit') {
          bot.quit('')
          reconnect = 1;
          botlist.splice(index, 1)
        }
        if (arrmessage[1] == 'attack') {
          let tipeattack = ''
          if (arrmessage[2] == 1) { tipeattack = 'Armor Stand' }
          if (arrmessage[2] == 2) { tipeattack = 'Cave Spider' }
          let target = bot.nearestEntity(e => e.mobType == tipeattack && bot.entity.position.distanceTo(e.position) < 2)
          if (!target) { bot.chat(`gaada ${tipeattack} bgst!`) }
          else {
            bot.chat(`jotos  ${tipeattack} sekali`)
            bot.attack(target)
          }
          if ((arrmessage[3] == 'setiap') && (target)) {
            console.log(`ada command`)
            bot.chat(`Attck ${tipeattack} selamanya`)
            Targeting(tipeattack, arrmessage[4]);
          }

        }
        if (arrmessage[1] == 'afk') {
          afk(10000);
          bot.chat('AFK, pastikan ada armorstand');




          function afk(waktu) {
            setTimeout(() => {

              if ((bot.health < 20) && (bot.food < 20)) {
                timing = 10000;
                bot.autoEat.enable()
                bot.autoEat.eat()

              } else {
                bot.attack(bot.nearestEntity(e => e.mobType == 'Armor Stand'));
                bot.autoEat.disable();
                timing = 10000;
              }
              afk(timing);
            }, waktu)
          }

        }






      }

    }
  })


  function itemByName(name) {
    return bot.inventory.items().filter(item => item.name === name)[0]
  }

  function equipItem(name, destination) {
    const item = itemByName(name)
    if (item) {
      bot.equip(item, destination, checkIfEquipped)
    } else {
      console.log(`I have no ${name}`)
    }

    function checkIfEquipped(err) {
      if (err) {
        console.log(`cannot equip ${name}: ${err.message}`)
      } else {
        console.log(`equipped ${name}`)
      }
    }
  }



  function Targeting(tipemobs, delay) {
    let timing = delay;
    loop(timing);
    function mainAttack(tipemobs) {
      equipItem('netherite_sword', 'hand')
      let targetmobs = bot.nearestEntity(e => e.mobType == tipemobs && bot.entity.position.distanceTo(e.position) < 2)
      if (!targetmobs) {
        bot.chat(`${tipemobs}nya ilang boss! Izin off`)
        let index = botlist.indexOf(botname);
        botlist.splice(index, 1)
        bot.quit('');
        reconnect=1;

      }
      else {
        bot.attack(targetmobs)
        //bot.chat(`ada target!`)
      }
    }
    //keep eating

    function loop(waktu) {
      setTimeout(() => {

        if ((bot.health < 20) && (bot.food < 20)) {
          timing = 5000;
          bot.autoEat.enable()
          bot.autoEat.eat()

        } else {
          mainAttack(tipemobs);
          bot.autoEat.disable();
          timing = delay;
        }
        loop(timing);
      }, waktu)
    }

    bot.on('health', () => { console.log(`${bot.name} HP ${bot.health} Hunger ${bot.food} XP ${bot.experience.level}`) })
  };

  bot.on('entitySpawn', (entity) => {
    if (entity.name === 'vex') {
      console.log('ADA VEX');
      let index = botlist.indexOf(botname);
      reconnect = 1;
      bot.chat(`${entity.mobType} spawned at ${entity.position}, ADA VEX COEG BYEEE!!!`)
      botlist.splice(index, 1)
      bot.quit('');
    }

  })
  function healthcheck() {

    bot.chat(`I have ${bot.health} health ${bot.food} food and ${bot.experience.level} level XP`)
  }




  bot.on('autoeat_error', (error) => {
    console.error(error)
  })


  bot.on('end', function () {
    if (config.utils['auto-reconnect'] && reconnect == 0) {
      botbaru(botname);

    }




  });



}


