const mineflayer = require('mineflayer')
const autoeat = require('mineflayer-auto-eat')
const config = require('./settings.json');

const bot = mineflayer.createBot({
      
    host: 'diebanned2.ploudos.me',
    port: 25565,
    username: 'Raider',
    version: config.server.version,
    password:''
})

bot.loadPlugin(autoeat)

bot.on('autoeat_started', (item, offhand) => {
    console.log(`Eating ${item.name} in ${offhand ? 'offhand' : 'hand'}`)
})

bot.on('autoeat_error', (error) => {
    console.error(error)
})

bot.on('autoeat_finished', (item, offhand) => {
    console.log(`Finished eating ${item.name} in ${offhand ? 'offhand' : 'hand'}`)
})