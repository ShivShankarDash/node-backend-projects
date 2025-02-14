import * as readline from 'readline';
const process = require('process');
const fs = require('fs');

const rl = readline.createInterface({
    input : process.stdin,
    output : process.stdout
});

class Task {
    id: number;
    description: string;
    status : Status;
    createdAt : string;
    updatedAt : string;
}

enum Status {
    to_do = "to_do",
    in_progress = "in_progress",
    done = "done"
  };

const Commands : Record <string, () => void> = {
    add : addTask,
    update : updateTask,
    delete : deleteTask,
    mark_in_progress : markProgress,
    mark_done : markDone,
    list : list
}

const pathtoFile = __dirname + '/taskFile.json';
const lastTaskIdFile = __dirname + '/lastTaskId.json';

// Use an in memory variable to autoincrement id 

function addTask() {
    const arg = pickArgument();
    if(fileChecker(pathtoFile)){
            const taskId = fileChecker(lastTaskIdFile) ? Number(JSON.parse(fs.readFileSync(lastTaskIdFile, 'utf8'))) + 1 : 1;
            const task : Task = {
                id : taskId,
                description : arg,
                status : Status.to_do,
                createdAt : new Date().toLocaleString(),
                updatedAt : ""
            } 
            const existingTasks : Task[] = fileChecker(pathtoFile) ? JSON.parse(fs.readFileSync(pathtoFile,'utf-8')) : [];
            existingTasks.push(task);
            fs.writeFile(pathtoFile, JSON.stringify(existingTasks), (err : Error)=>{
                if(err) console.log(err);
                else {
                    fs.writeFile(lastTaskIdFile, JSON.stringify(taskId), (err : Error)=>{
                        if(err) console.log(err);
                    });
                    console.log("Task added successfully (ID: " + taskId + ")");
                }
            })
            
        }        
    }
 

function updateTask() {
    const taskNumber = pickArgument();
    const taskUpdatedDesc = process.argv[4];
    const existingTasks : Task[] = JSON.parse(fs.readFileSync(pathtoFile, 'utf-8'));
    const taskIndex = existingTasks.findIndex(task => task.id == taskNumber);
    existingTasks[taskIndex].description = taskUpdatedDesc;
    existingTasks[taskIndex].updatedAt = new Date().toLocaleString();
    writeToTaskFile(pathtoFile, existingTasks);
    
} 

function deleteTask() {
    const taskNumber = pickArgument();
    const existingTasks : Task[] = JSON.parse(fs.readFileSync(pathtoFile, 'utf-8'));
    const taskIndex = existingTasks.findIndex(task => task.id == taskNumber);
    existingTasks.splice(taskIndex, 1);
    writeToTaskFile(pathtoFile, existingTasks);
    
} 
function markProgress() {
    const taskNumber = pickArgument();
    const existingTasks : Task[] = JSON.parse(fs.readFileSync(pathtoFile, 'utf-8'));
    const taskIndex = existingTasks.findIndex(task => task.id == taskNumber);
    existingTasks[taskIndex].status = Status.in_progress;
    writeToTaskFile(pathtoFile, existingTasks);
    
} 
function markDone() {
    const taskNumber = pickArgument();
    const existingTasks : Task[] = JSON.parse(fs.readFileSync(pathtoFile, 'utf-8'));
    const taskIndex = existingTasks.findIndex(task => task.id == taskNumber);
    existingTasks[taskIndex].status = Status.done;
    writeToTaskFile(pathtoFile, existingTasks);
} 

function list() {
    const taskStatus = pickArgument();
    if(taskStatus in Status){
        const existingTasks : Task[] = JSON.parse(fs.readFileSync(pathtoFile, 'utf-8'));
        let filteredTasks : Task[] = [];
        if(taskStatus == "to_do"){
            filteredTasks = existingTasks.filter(task => task.status === Status.to_do);
        }
        else if(taskStatus == "in_progress"){
            filteredTasks = existingTasks.filter(task => task.status === Status.in_progress);
        }
        else{
            filteredTasks = existingTasks.filter(task => task.status === Status.done);
        }
        console.log(filteredTasks);
    }
    
}
function pickArgument(){
    const args = process.argv[3];
    return args;
}

function fileChecker(dir : string){
    if(fs.existsSync(dir)) return true;
    else return false;
}

function writeToTaskFile(pathtoFile : string, existingTasks : Task[]){
    fs.writeFile(pathtoFile, JSON.stringify(existingTasks), (err : Error)=>{
        if(err) console.log(err);
        else {
            
        }
    }) 
}

const command : string = process.argv[2]?.toLowerCase();
if(command && command in Commands){
    Commands[command]();
}
else {
    console.log("Command not found");
}


