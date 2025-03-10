import * as readline from 'readline'
import * as fs from 'fs';


const rl = readline.createInterface({
    input : process.stdin,
    output : process.stdout
})

const EventsDescription: Record<string, string> = {
    PushEvent: "Pushed ${count} commits to ${name}",
    CreateEvent: "Created repository ${name}",
    IssueEvent: "Opened ${count} issues in ${name}",
    PullRequestEvent: "Opened ${count} pull requests in ${name}",
    WatchEvent: "Watched ${name}",
};

interface Project{
    repositoryId : number,
    projectName : string,
    count : number
}

let record : Record<string, Project[]> = {}; 

const userName = process.argv[2];

const gitUrl = 'https://api.github.com/users/'

async function getGithubUserData(){
    try {
        const response = await fetch(gitUrl + userName + '/events');
        const json = await response.json();
        getRecordForEvents(json);
    }
    catch(error){
        console.log(error);
    }
}

function getRecordForEvents(json : any){
   
    for(let i = 0; i < json.length; i++){
        const obj = json[i];
        const event = obj.type;
        upsertProjects(event, obj.repo.id, obj.repo.name);
    }

    const result : any = formatOutputMessage(record);
    console.log(result);
}

function upsertProjects (event : string, repoId : number, projectName : string,  increment : number = 1){

 if(!record[event]){
    record[event] = [];
 }

 const projects = record[event];
 const project = projects.find(proj => proj.repositoryId === repoId);

 if(project){
    project.count += increment;
 }
 else {
    projects.push({ repositoryId : repoId, projectName, count : increment});
 }

}

function formatOutputMessage(record : Record<string, Project[]>){

const result : string[] = [];
for (const [event, projects] of Object.entries(record)){
    for(const project of projects){
        if(EventsDescription[event]){
        const message = EventsDescription[event]?.replace("${count}", project.count.toString()).replace("${name}", project.projectName);
        result.push(message);
        }
        
    }
}
return result;
}



getGithubUserData();