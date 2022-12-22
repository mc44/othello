
//dictionary representation of gamestate
gamestate = {}

function create() {
    var table = "<table class='othelloBoard' >";
    for (var x = 1; x < 9; ++x) {
        table += '<tr>';
        for (var y = 1; y < 9; ++y) {
            table += "<td class='othelloSquare'"+  'id=' + x + y + '>' + "</td>";
            gamestate[x.toString()+y.toString()]="empty";
        }
    }
    table += " </table>";
    document.getElementById('othello').innerHTML = table;
    //document.getElementById('34').classList.add("white")
    document.getElementById('44').classList.add("white")
    document.getElementById('55').classList.add("white")
    document.getElementById('45').classList.add("black")
    document.getElementById('54').classList.add("black")
    gamestate['44']="white";
    gamestate['54']="white";
    gamestate['45']="black";
    gamestate['54']="black";
    console.log(gamestate);
    countscore()
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

async function checkAllowedMoves(playblack){
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
                            if(!allowed.includes(moves[i])){
                                allowed.push(moves[i]);
                            }
                        }
                    }
                }
                
            }
        }
    }
    for (var i = 0; i<allowed.length;i++){
        if(playblack){
            document.getElementById(allowed[i].toString()).classList.add("blacksuggest");
        }else{
            document.getElementById(allowed[i].toString()).classList.add("whitesuggest");
        }
        document.getElementById(allowed[i].toString()).setAttribute("onclick", "onclick_handler(event);");
    }

    if(allowed.length === 0){
        text = countscore();
        showModal(text);
    }
    //AI STEPS
    move = [];
    aiscore = [];
    countscore();
    if (!playblack){
        
        // for (var i = 0; i < allowed.length;i++){
        //     clicked = allowed[i];
        //     move.push(clicked);
        //     lineups = adjacentopposite(clicked);
        //     cscore = 0;
        //     for (j = 0; j<lineups.length;j++){
        //         cscore+= AIlineupflip(clicked,clicked-parseInt(lineups[j]))
        //     }
        //     aiscore[i]=cscore;
        // }
        // bestvalue = Math.max.apply(null, aiscore);
        // goodscoremoves = [];
        // for (var i = 0; i < move.length;i++){
        //     if(aiscore[i]==bestvalue){
        //         goodscoremoves.push(move[i]);
        //     }
        // }
        // //Find Click
        // click = goodscoremoves[Math.floor(Math.random() * goodscoremoves.length)];
        // console.log("FOUND", click);
        // //Click
        // const result = await resolveAfter2Seconds();
        // document.getElementById(click.toString()).click();
        // document.getElementById(click.toString()).classList.add("highlight");
    }
}
const onclick_handler = ev => {
    //get clicked value
    clicked = ev.target.id;
    clickedval = ev.target.classList[1];
    lineups = adjacentopposite(clicked);
    //console.log(lineups,"lineups");
    for (i = 0; i<lineups.length;i++){
        //console.log("FLIpu", clicked,clicked-parseInt(lineups[i]));
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
    countscore()
    if(!playblack){
        minimax(gamestate, 5, playblack);
    }
}
function resolveAfter2Seconds() {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve('resolved');
      }, 2000);
    });
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
            document.getElementById(currentID).classList.remove("highlight");
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
                //console.log(curID,ID,"checkthis one")
                if (checklineups(curID.toString(),ID,playblack)){
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
        //console.log(setID,"IN asljdlasjdlas",tile);
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

//returns physical board winner, also changes gamestate
function countscore(){
    whitescore = 0;
    blackscore = 0;
    whitemoves = 0;
    blackmoves = 0;
    for (var x = 1; x < 9; ++x) {
        for (var y = 1; y < 9; ++y) {
            locID = x.toString()+y.toString();
            if(document.getElementById(locID).classList[1] == "white"){
                whitescore++;
            }else if (document.getElementById(locID).classList[1] == "black"){
                blackscore++;
            }
            gamestate[locID]=document.getElementById(locID).classList[1];
        }
    }
    document.getElementById("white").innerHTML = whitescore.toString();
    document.getElementById("black").innerHTML = blackscore.toString();
    if (whitescore>blackscore){
        return "White Wins!";
    }else if (whitescore<blackscore){
        return "Black Wins!";
    }else{
        return "Tie!";
    }
}

const showModal = (text) => {
    document.getElementById('message').innerText = text;
    document.getElementById('modal').classList.remove("hide");

}

const hideModal = () => {
    document.getElementById('modal').classList.add("hide");
}

//AI BRAIN DOWN HERE
//countscore updates gamestate

function minimax(board, depth, player){
    if (depth==0 || children.length === 0){
        return getboardscore(board);
    }

    //player true is black
    if(player){
        maxnum = -10000;
        for(i = 0; i < children.length; i++){
            pseudoclick(board,)
            eval = minimax()
        }
    }

}

//check allowable moves on current game state, renames current gamestate variables to white suggest black suggest
function checkAILIST(playblack,curgame){
    allowed = [];
    if(playblack){
        pair = "white";
    }else{
        pair = "black";
    }
    for (var x = 1; x < 9; ++x) {
        for (var y = 1; y < 9; ++y) {
            locID = x.toString()+y.toString();
            tile = curgame[locId];
            if(typeof  tile != 'undefined' && tile != "whitesuggest" && tile != "blacksuggest"){ //check if tile has content
                //categorize moves, if black play, check white tiles, if white play, check black tiles
                if(tile.toString()==pair.toString()){
                    moves = AIemptyadjacent(curgame, locID);
                    for (var i = 0; i < moves.length; i++) {
                        if(AIchecklineups(moves[i],locID,playblack)){
                            if(!allowed.includes(moves[i])){
                                allowed.push(moves[i]);
                            }
                        }
                    }
                }
                
            }
        }
    }
    return allowed;
}

function AIemptyadjacent(board,curID){
    curID = parseInt(curID);
    movesID = [];
    adjacent = [curID-1,curID+1,curID-10,curID+10,curID-11,curID-9,curID+9,curID+11];
    //left = curID-1; right = curID+1; up = curID-10; down = curID+10; uleft = curID-11; uright = curID-9; dleft = curID+9; dright = curID+11;
    for(let i = 0; i < adjacent.length; i++) {
        //check if within 11 and 88, also if it ends with 9 or 0 to make sure its within playable area ids are within 11-18, 21-28, ...
        if (adjacent[i]>=11 && adjacent[i]<=88 && adjacent[i]%10 != 9 && adjacent[i]%10 != 0){
            //check tile if not white,black,whitesuggest,blacksuggest, then it must be empty
            ID = adjacent[i].toString();
            if(!"white,black,whitesuggest,blacksuggest".includes(board[ID])){
                movesID.push(ID);
            }
        }
    }
    return movesID;
}

function pseudoclick(board, clicked,black){
    //get clicked value
    clickedval = ev.target.classList[1];
    lineups = AIadjacentopposite(board, clicked);
    //console.log(lineups,"lineups");
    for (i = 0; i<lineups.length;i++){
        //console.log("FLIpu", clicked,clicked-parseInt(lineups[i]));
        AIpseudoflip(clicked,clicked-parseInt(lineups[i]),board,black)
    }
    black = !black;
    return board;
}

//for a selected move and direction, it will return the number of flips, or score obtained
function AIlineupflip(clickedID, direction, board, black){
    if(black){
        endon = "black";
        find = "white";
    }else{
        endon = "white";
        find = "black";
    }
    score = 0;
    clickedID-=direction;
    tile = board[clickedID.toString()];
    //console.log(clickedID,direction,"FLIP",endon);
    while(clickedID>=11 && clickedID<=88 && clickedID%10 != 9 && clickedID%10 != 0 && typeof tile != undefined && tile != endon){
        if(tile==find){
            score++;
        }
        clickedID-=direction;
        tile = board[clickedID.toString()];
    }
    return score;
}

//for a selected move and direction, it will flip a sent board parameter
function AIpseudoflip(clickedID, direction, board, black){
    if(black){
        endon = "black";
        find = "white";
    }else{
        endon = "white";
        find = "black";
    }
    score = 0;
    clickedID-=direction;
    tile = board[clickedID.toString()];
    //console.log(clickedID,direction,"FLIP",endon);
    while(clickedID>=11 && clickedID<=88 && clickedID%10 != 9 && clickedID%10 != 0 && !"white,black,whitesuggest,blacksuggest".includes(tile) && tile != endon){
        if(tile==find){
            board[clickedID.toString()]=endon;
        }
        clickedID-=direction;
        tile = board[clickedID.toString()];
    }
    return board;
}


//if return positive white leaning (max), if negative black leaning (min)
function getboardscore(board){
    whitescore = 0;
    blackscore = 0;
    whitemoves = 0;
    blackmoves = 0;
    for (var x = 1; x < 9; ++x) {
        for (var y = 1; y < 9; ++y) {
            locID = x.toString()+y.toString();
            if(board[locID] == "white"){
                whitescore++;
            }else if (board[locID] == "black"){
                blackscore++;
            }
        }
    }
    return whitescore+(blackscore*-1); 
}

//returns all potential moves adjacent to curID
function AIadjacentopposite(board, curID,black){
    if (black){
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
            if(board[ID] == find){
                //console.log(curID,ID,"checkthis one")
                if (AIchecklineups(board, curID.toString(),ID,black)){
                    movesID.push(ID);
                }
            }
        }
    }
    return movesID;
}

function AIchecklineups(board, curID1,ID1,black){
    if(black){
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
    tile = board[setID];
    while(curID1>=11 && curID1<=88 && curID1%10 != 9 && curID1%10 != 0 && !"white,black,whitesuggest,blacksuggest".includes(tile) && tile != "whitesuggest" && tile != "blacksuggest"){
        //console.log(setID,"IN asljdlasjdlas",tile);
        setID = curID1.toString();
        color = board[curID1.toString()];;
        if(color==pair1){
            return true;    
        }
        curID1-=step;
        tile = board[setID];
    }
    return false;
}

function AIcheckAllowedMoves(board, playblack){
    allowed = [];
    if(playblack){
        pair = "white";
    }else{
        pair = "black";
    }
    for (var x = 1; x < 9; ++x) {
        for (var y = 1; y < 9; ++y) {
            locID = x.toString()+y.toString();
            tile = board[locID];
            if(typeof  tile != 'undefined' && tile != "whitesuggest" && tile != "blacksuggest"){ //check if tile has content
                //categorize moves, if black play, check white tiles, if white play, check black tiles
                if(tile.toString()==pair.toString()){
                    moves = AIemptyadjacent(locID);
                    for (var i = 0; i < moves.length; i++) {
                        if(AIchecklineups(moves[i],locID,playblack)){
                            if(!allowed.includes(moves[i])){
                                allowed.push(moves[i]);
                            }
                        }
                    }
                }
                
            }
        }
    }
    return allowed;
}