const mineflayer = require('mineflayer')
const Movements = require('mineflayer-pathfinder').Movements
const pathfinder = require('mineflayer-pathfinder').pathfinder
const { GoalBlock} = require('mineflayer-pathfinder').goals

const config = require('./settings.json');
var pi = 3.14159;

function createBot () {
  const bot = mineflayer.createBot({
      username: config['bot-account']['username'],
      password: config['bot-account']['password'],
      auth: config['bot-account']['type'],
      host: config.server.ip,
      port: config.server.port,
      version: config.server.version
  })

  

  bot.loadPlugin(pathfinder)
  const mcData = require('minecraft-data')(bot.version)
  const defaultMove = new Movements(bot, mcData)
  bot.settings.colorsEnabled = false

  bot.once("spawn", function(){

      console.log("\x1b[33m[BotLog] Bot joined to the server", '\x1b[0m')

      if(config.utils['auto-auth'].enabled){
        console.log("[INFO] Started auto-auth module")

          var password = config.utils['auto-auth'].password
          setTimeout(function() {
              bot.chat(`/register ${password} ${password}`)
              bot.chat(`/login ${password}`)
          }, 500);

          console.log(`[Auth] Authentification commands executed.`)
      }
      

      if(config.utils['chat-messages'].enabled){
        console.log("[INFO] Started chat-messages module")
        var messages = config.utils['chat-messages']['messages']

          if(config.utils['chat-messages'].repeat){
            var delay = config.utils['chat-messages']['repeat-delay']
            let i = 0

            let msg_timer = setInterval(() => {
                bot.chat(`${messages[i]}`)

                if(i+1 == messages.length){
                    i = 0
                } else i++
            }, delay * 1000)
          } else {
              messages.forEach(function(msg){
                  bot.chat(msg)
              })
        }
      }
      

      const pos = config.position

      if (config.position.enabled){
          console.log(`\x1b[32m[BotLog] Starting moving to target location (${pos.x}, ${pos.y}, ${pos.z})\x1b[0m`)
          bot.pathfinder.setMovements(defaultMove)
          bot.pathfinder.setGoal(new GoalBlock(pos.x, pos.y, pos.z))
      }
      
      if(config.utils['anti-afk'].enabled){
        bot.setControlState('jump', true)
        if(config.utils['anti-afk'].sneak){
            bot.setControlState('sneak', true)
        }
      }

      bot.on('chat', (username, message) => {
        
        if (message === 'health') healthcheck()
        if (message === 'afkbase') baseafk()
        
      })

      
  bot.on('time', function(time) {
                var yaw = Math.random()*pi - (0.5*pi);
                var pitch = Math.random()*pi - (0.5*pi);
                bot.look(yaw,-90,false);
                
                
        
  });

  
      
      
  })

  
  function healthcheck () {
      
        bot.chat(`I have ${bot.health} health and ${bot.food} food`)
      
    

  }
  function baseafk () {
    setInterval(function() {bot.attack(bot.nearestEntity())}, 10000);
      

}
  


  

  bot.on("chat", function(username, message){
      if(config.utils['chat-log']){
          console.log(`[ChatLog] <${username}> ${message}`)
      }
  })

  bot.on("goal_reached", function(){
      console.log(`\x1b[32m[BotLog] Bot arrived to target location. ${bot.entity.position}\x1b[0m`)
  })

  bot.on("death", function(){
      console.log(`\x1b[33m[BotLog] Bot has been died and was respawned ${bot.entity.position}`, '\x1b[0m')
      bot.chat(`BOT has been died, respawn location ${bot.entity.position}`)
  })

  if(config.utils['auto-reconnect']){
      bot.on('end', function(){
        createBot()
        createBot1()
        
      })
  }

  bot.on('kicked', (reason) => console.log('\x1b[33m',`[BotLog] Bot was kicked from the server. Reason: \n${reason}`, '\x1b[0m'))
  bot.on('error', err => console.log(`\x1b[31m[ERROR] ${err.message}`, '\x1b[0m'))

  createBot1()
}



function createBot1 () {
  const bot = mineflayer.createBot({
      username: config['bot-account1']['username'],
      password: config['bot-account1']['password'],
      auth: config['bot-account1']['type'],
      host: config.server.ip,
      port: config.server.port,
      version: config.server.version
  })

  

  bot.loadPlugin(pathfinder)
  const mcData = require('minecraft-data')(bot.version)
  const defaultMove = new Movements(bot, mcData)
  bot.settings.colorsEnabled = false

  bot.once("spawn", function(){
      console.log("\x1b[33m[BotLog] Bot joined to the server", '\x1b[0m')

      if(config.utils['auto-auth'].enabled){
        console.log("[INFO] Started auto-auth module")

          var password = config.utils['auto-auth'].password
          setTimeout(function() {
              bot.chat(`/register ${password} ${password}`)
              bot.chat(`/login ${password}`)
          }, 500);

          console.log(`[Auth] Authentification commands executed.`)
      }

      if(config.utils['chat-messages'].enabled){
        console.log("[INFO] Started chat-messages module")
        var messages = config.utils['chat-messages']['messages']

          if(config.utils['chat-messages'].repeat){
            var delay = config.utils['chat-messages']['repeat-delay']
            let i = 0

            let msg_timer = setInterval(() => {
                bot.chat(`${messages[i]}`)

                if(i+1 == messages.length){
                    i = 0
                } else i++
            }, delay * 1000)
          } else {
              messages.forEach(function(msg){
                  bot.chat(msg)
              })
        }
      }
      

      const pos = config.position

      if (config.position.enabled){
          console.log(`\x1b[32m[BotLog] Starting moving to target location (${pos.x}, ${pos.y}, ${pos.z})\x1b[0m`)
          bot.pathfinder.setMovements(defaultMove)
          bot.pathfinder.setGoal(new GoalBlock(pos.x, pos.y, pos.z))
      }
      
      if(config.utils['anti-afk'].enabled){
        bot.setControlState('jump', true)
        if(config.utils['anti-afk'].sneak){
            bot.setControlState('sneak', true)
        }
      }

      bot.on('chat', (username, message) => {
        
        if (message === 'health') healthcheck()
        if (message === 'afknether') netherafk()
        
      })
      
      bot.on('time', function(time) {
        var yaw = Math.random()*pi - (0.5*pi);
        var pitch = Math.random()*pi - (0.5*pi);
        bot.look(yaw,-90,false);
        bot.activateItem()
});

      
      
  })
  function netherafk () {
    setInterval(function() {bot.attack(bot.nearestEntity())}, 10000);
      

}
  
  function healthcheck () {
      
        bot.chat(`I have ${bot.health} health and ${bot.food} food`)
      
    

  }
  


  

  bot.on("chat", function(username, message){
      if(config.utils['chat-log']){
          console.log(`[ChatLog] <${username}> ${message}`)
      }
  })

  bot.on("goal_reached", function(){
      console.log(`\x1b[32m[BotLog] Bot arrived to target location. ${bot.entity.position}\x1b[0m`)
  })

  bot.on("death", function(){
      console.log(`\x1b[33m[BotLog] Bot has been died and was respawned ${bot.entity.position}`, '\x1b[0m')
      bot.chat(`BOT has been died, respawn location ${bot.entity.position}`)
  })

  

  bot.on('kicked', (reason) => console.log('\x1b[33m',`[BotLog] Bot was kicked from the server. Reason: \n${reason}`, '\x1b[0m'))
  bot.on('error', err => console.log(`\x1b[31m[ERROR] ${err.message}`, '\x1b[0m'))

}

createBot()
