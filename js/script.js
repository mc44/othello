
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
}
//.setAttribute("onclick", "onclick_handler(event);");
//.setAttribute("class", "empty"); document.getElementById(empty).classList.remove("empty")
function setUp(){
    create();
    var playblack = true;
    var gameContinue = true;

    while(gameContinue){

        gameContinue = false;
    }
}