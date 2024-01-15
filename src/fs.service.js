
const fs= require('node:fs/promises')
const path = require('node:path')

const usersPathToFile = path.join(process.cwd(), 'db.json');
const read = async () => {
    const json = await fs.readFile(usersPathToFile, 'utf-8');
    return JSON.parse(json)
}

const write = async (users) => {
    await fs.writeFile(usersPathToFile,JSON.stringify(users));
}

module.exports = {read,write}