
const { PORT, HOST, TELEGRAMBOTTOKEN } = process.env;


//env variables
const connection = {
    port: PORT || 5000,
    host: HOST
}
const botToken = TELEGRAMBOTTOKEN


export default { connection, botToken }