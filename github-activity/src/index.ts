import * as readline from 'readline'
import * as fs from 'fs';


const rl = readline.createInterface({
    input : process.stdin,
    output : process.stdout
})

const userName = process.argv[2];

const gitUrl = 'https://api.github.com/users/'
const result = fetch(gitUrl + userName + '/events');

