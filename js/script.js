
gamestate = []

function create() {
    var table = "<table class='othelloBoard' >";
    for (var x = 1; x < 9; ++x) {
        table += '<tr>';
        for (var y = 1; y < 9; ++y) {
            table += "<td class='othelloSquare'"+  'id=' + x + y + '>' + "</td>";
        }
    }
    table += " </table>";
    document.getElementById('othello').innerHTML = table;
    document.getElementById('44').classList.add("white")
    document.getElementById('55').classList.add("white")
    document.getElementById('45').classList.add("black")
    document.getElementById('54').classList.add("black")
    //console.log(document.getElementById('74').classList[1])
}
//.setAttribute("onclick", "onclick_handler(event);");
//.setAttribute("class", "empty"); document.getElementById(empty).classList.remove("empty")
function setUp(){
    create();
    var playblack = true;
    var gameContinue = true;

    while(gameContinue){
        emptyadjacent("44");
        gameContinue = false;
    }
}

function checkAllowedMoves(playblack){
    
}

function emptyadjacent(curID){
    curID = parseInt(curID);
    movesID = [];
    adjacent = [curID-1,curID+1,curID-10,curID+10,curID-11,curID-9,curID+9,curID+11];
    //left = curID-1; right = curID+1; up = curID-10; down = curID+10; uleft = curID-11; uright = curID-9; dleft = curID+9; dright = curID+11;
    for(let i = 0; i < adjacent.length; i++) {
        if (adjacent[i]>=11 && adjacent[i]<=88 && adjacent[i]%10 != 9 && adjacent[i]%10 != 0){
            //check tile if undefined, undefined means empty adjacent
            ID = adjacent[i].toString();
            if(typeof document.getElementById(ID).classList[1] == 'undefined'){
                movesID.push(ID);
            }
        }
    }
    console.log(movesID);
    return movesID;
}