// Pick up the desired functionality (based on the argument type)
// Pick up subsequent arguments based on the primary argument which was passed
// Store the date in a json file

interface Expense {
    id : number,
    date : string
    description : string,
    amount : number
    category : string
}

function pickArgument(){
    const arg = process.argv[2];
}