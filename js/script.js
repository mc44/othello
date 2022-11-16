
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
    //document.getElementById('34').classList.add("white")
    document.getElementById('44').classList.add("white")
    document.getElementById('55').classList.add("white")
    document.getElementById('45').classList.add("black")
    document.getElementById('54').classList.add("black")
    //document.getElementById('64').classList.add("black")
    //test
    //document.getElementById('34').classList.add("black")
    //document.getElementById('45').classList.add("black")
    //document.getElementById('55').classList.add("black")
    //document.getElementById('65').classList.add("black")
    //document.getElementById('35').classList.add("white")
    //document.getElementById('44').classList.add("white")
    //document.getElementById('54').classList.add("white")
    //document.getElementById('53').classList.add("white")
    //console.log(document.getElementById('74').classList[1])
}
//.setAttribute("onclick", "onclick_handler(event);");
//.setAttribute("class", "empty"); document.getElementById(empty).classList.remove("empty")

var playblack = true;
function setUp(){
    create();
    var gameContinue = true;

    checkAllowedMoves(playblack);
    //gameContinue = false;
}

function checkAllowedMoves(playblack){
    allowed = [];
    if(playblack){
        pair = "white";
    }else{
        pair = "black";
    }
    for (var x = 1; x < 9; ++x) {
        for (var y = 1; y < 9; ++y) {
            locID = x.toString()+y.toString();
            tile = document.getElementById(locID).classList[1];
            if(typeof  tile != 'undefined' && tile != "whitesuggest" && tile != "blacksuggest"){ //check if tile has content
                //categorize moves, if black play, check white tiles, if white play, check black tiles
                if(tile.toString()==pair.toString()){
                    moves = emptyadjacent(locID);
                    for (var i = 0; i < moves.length; i++) {
                        if(checklineups(moves[i],locID,playblack)){
                            allowed.push(moves[i]);
                        }
                    }
                }
                
            }
        }
    }
    console.log(allowed);
    for (var i = 0; i<allowed.length;i++){
        if(playblack){
            document.getElementById(allowed[i].toString()).classList.add("blacksuggest");
        }else{
            document.getElementById(allowed[i].toString()).classList.add("whitesuggest");
        }
        document.getElementById(allowed[i].toString()).setAttribute("onclick", "onclick_handler(event);");
    }
}

const onclick_handler = ev => {
    //get clicked value
    clicked = ev.target.id;
    clickedval = ev.target.classList[1];
    lineups = adjacentopposite(clicked);
    console.log(lineups,"lineups");
    for (i = 0; i<lineups.length;i++){
        console.log("FLIpu", clicked,clicked-parseInt(lineups[i]));
        lineupflip(clicked,clicked-parseInt(lineups[i]))
    }
    playblack = !playblack;
    //clean clicks
    cleansuggest()
    if(!playblack){
        add = "black";
        remove = "blacksuggest";
    }else{
        add = "white";
        remove = "whitesuggest";
    }
    ev.target.classList.remove(remove);
    ev.target.classList.add(add);
    //run next
    checkAllowedMoves(playblack);
}

function cleansuggest(){
    for (var x = 1; x < 9; ++x) {
        for (var y = 1; y < 9; ++y) {
            currentID = x.toString()+y.toString();
            document.getElementById(currentID).setAttribute("onclick", "");
            if(document.getElementById(currentID).classList[1] == "blacksuggest"){
                document.getElementById(currentID).classList.remove("blacksuggest");
            }
            if(document.getElementById(currentID).classList[1] == "whitesuggest"){
                document.getElementById(currentID).classList.remove("whitesuggest");
            }
        }
    }
}

function lineupflip(clickedID, direction){
    if(playblack){
        endon = "black";
        find = "white";
    }else{
        endon = "white";
        find = "black";
    }
    clickedID-=direction;
    tile = document.getElementById(clickedID.toString()).classList[1];
    //console.log(clickedID,direction,"FLIP",endon);
    while(clickedID>=11 && clickedID<=88 && clickedID%10 != 9 && clickedID%10 != 0 && typeof tile != undefined && tile != endon){
        if(tile==find){
            document.getElementById(clickedID.toString()).classList.remove(find);
            document.getElementById(clickedID.toString()).classList.add(endon);
        }
        clickedID-=direction;
        tile = document.getElementById(clickedID.toString()).classList[1];
    }
}

function adjacentopposite(curID){
    if (playblack){
        find = "white";
    }else{
        find = "black";
    }
    curID = parseInt(curID);
    movesID = [];
    adjacent = [curID-1,curID+1,curID-10,curID+10,curID-11,curID-9,curID+9,curID+11];
    //left = curID-1; right = curID+1; up = curID-10; down = curID+10; uleft = curID-11; uright = curID-9; dleft = curID+9; dright = curID+11;
    for(let i = 0; i < adjacent.length; i++) {
        //check if within 11 and 88, also if it ends with 9 or 0 to make sure its within playable area ids are within 11-18, 21-28, ...
        if (adjacent[i]>=11 && adjacent[i]<=88 && adjacent[i]%10 != 9 && adjacent[i]%10 != 0){
            //check tile if its opposite the current player color
            ID = adjacent[i].toString();
            if(document.getElementById(ID).classList[1]  == find){
                console.log(curID,ID,"checkthis one")
                if (checklineups(curID.toString(),ID,playblack)){
                    console.log("IN");
                    movesID.push(ID);
                }
            }
        }
    }
    return movesID;
}

function checklineups(curID1,ID1,playblack){
    if(playblack){
        pair1 = "black";
    }else{
        pair1 = "white";
    }
    curID1 = parseInt(curID1);
    ID1 = parseInt(ID1);
    step = curID1-ID1;
    curID1-=step*2;
    setID = curID1.toString();
    //console.log(setID);
    if(curID1<11 || curID1>88 || curID1%10 == 9 || curID1%10 == 0){
        return false
    }
    tile = document.getElementById(setID).classList[1];
    while(curID1>=11 && curID1<=88 && curID1%10 != 9 && curID1%10 != 0 && typeof  tile != 'undefined' && tile != "whitesuggest" && tile != "blacksuggest"){
        console.log(setID,"IN asljdlasjdlas",tile);
        setID = curID1.toString();
        color = document.getElementById(curID1).classList[1];
        if(color==pair1){
            return true;    
        }
        curID1-=step;
        tile = document.getElementById(setID).classList[1];
    }
    return false;
}

function emptyadjacent(curID){
    curID = parseInt(curID);
    movesID = [];
    adjacent = [curID-1,curID+1,curID-10,curID+10,curID-11,curID-9,curID+9,curID+11];
    //left = curID-1; right = curID+1; up = curID-10; down = curID+10; uleft = curID-11; uright = curID-9; dleft = curID+9; dright = curID+11;
    for(let i = 0; i < adjacent.length; i++) {
        //check if within 11 and 88, also if it ends with 9 or 0 to make sure its within playable area ids are within 11-18, 21-28, ...
        if (adjacent[i]>=11 && adjacent[i]<=88 && adjacent[i]%10 != 9 && adjacent[i]%10 != 0){
            //check tile if undefined, undefined means empty adjacent
            ID = adjacent[i].toString();
            if(typeof document.getElementById(ID).classList[1] == 'undefined'){
                movesID.push(ID);
            }
        }
    }
    return movesID;
}

