// Generate a random number for the user
// Based on the selection of difficulty, start the loop for guessing
// Exit if the answer is correct , display attempts and the time taken
// Exit if all the chances run out

import * as readline from 'readline'
const rl = readline.createInterface({
    input : process.stdin,
    output : process.stdout
})

async function numberGuesser(){

    let randomNumber = 0;
    console.log("\nWelcome to the Number Guessing Game!\n");
    console.log("I'm thinking of a number between 1 and 100.\n");
    randomNumber = Math.floor(Math.random() * 100);
    await new Promise(resolve => setTimeout(resolve,2000));
    console.log("Please select the difficulty level:\n1. Easy (10 chances)\n2. Medium (5 chances)\n3. Hard (3 chances)")
    rl.question("Enter your choice:", (answer)=>{
        let choice = parseInt(answer);
        let attemptsForUsers = 0;
        if(choice === 1){
            console.log("\nGreat! You have selected the Easy difficulty level.")    
            attemptsForUsers = 10;
        }
        
        else if(choice === 2){
            console.log("\nGreat! You have selected the Medium difficulty level.")   
            attemptsForUsers = 5;
        }
        

        else if(choice === 3){
            console.log("\nGreat! You have selected the Hard difficulty level.")
            attemptsForUsers = 3;  
        }
       
        console.log("\nLet's start the game!");
        askQuestion(randomNumber,attemptsForUsers,0);
    })
}

function askQuestion(randomNumber : number, attemptsForUsers : number, attempts : number){
    if(attempts === attemptsForUsers){
        console.log("\nYou exhaused all your attempts.Try again next time");
        return;
    } 
    rl.question("Enter your guess:", (answer)=>{
        attempts++;
        if(parseInt(answer) === randomNumber){
            console.log(`Congratulations! You guessed the correct number in ${attempts} attempts.`);
            return;
        }
        else{
            parseInt(answer) > randomNumber ? console.log(`Incorrect! The number is less than ${answer}`) : console.log(`Incorrect! The number is greater than ${answer}`);
            askQuestion(randomNumber, attemptsForUsers, attempts);
        }
    })
}

numberGuesser();