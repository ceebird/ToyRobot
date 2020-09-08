// Max X,Y Coords
const maxY = 4;
const maxX = 4;

// Board values
var bWidth = 200;
var bHeight = 200;
var bGrid = 40; //40 by 40 Square

// Append canvas so script can run on it
var canvas = $('<canvas/>').attr({width: bWidth, height: bHeight}).appendTo($('#canvasArea'));
var ctx = canvas.get(0).getContext("2d");

class Robot {
    constructor(x,y,f) {
        this.placed = false
    }

    place(x,y,f){
        this.x = x;
        this.y = y;
        this.f = f.charAt(0).toUpperCase() + f.slice(1);
        this.placed = true
    }

    move(){
        var face = this.f;

        // Increase y
        if (face == 'North' && this.y < maxY){ 
            this.y += 1;
            $("#robotY").text(this.y)
        }
        // Increase x 
        else if (face == 'East' && this.x < maxX){
            this.x += 1;
            $("#robotX").text(this.x)
        }
        // Decrease y
        else if (face == 'South' && this.y > 0){
            this.y -= 1;
            $("#robotY").text(this.y)
        }
        // Decrease x
        else if (face == 'West' && this.x > 0){
            this.x -= 1;
            $("#robotX").text(this.x)
        }
    }

    left(){
        // N -> W -> S -> E
        var face = this.f;

        if (face == 'North'){ 
            this.f = 'West';
        }
        else if (face == 'East'){
            this.f = 'North';
        }
        else if (face == 'South'){
            this.f = 'East';
        }
        else if (face == 'West'){
            this.f = 'South';
        }
    }

    right(){
        // N -> E - > S -> W
        var face = this.f;

         if (face == 'North'){ 
            this.f = 'East';
        }
        else if (face == 'East'){
            this.f = 'South';
        }
        else if (face == 'South'){
            this.f = 'West';
        }
        else if (face == 'West'){
            this.f = 'North';
        }
    }

    report(){

        $("#report").text('Robot Position: X: ' + this.x + ', Y: ' + this.y + ', F: ' + this.f)
        $("#report").show()
    }

    getPlaced(){
        return this.placed
    }

    getX(){
        return this.x
    }

    getY(){
        return this.y
    }
    getF(){
        return this.f
    }

}


function checkCommand() {
    var command = $("#command").val().toLowerCase();

    runCommand(command)
    drawRobot()
}

function runCommand(command){
    // Hide report if still showing
    $("#report").hide()

    // Check if command in place format
    const regExp = /place\ [0-4]\,[0-4]\,(north|east|south|west)$/;
    const place = regExp.test(command);

    if (place == true){
        var coords = command.split(" ")[1].split(",");
        robot.place( parseInt(coords[0]), parseInt(coords[1]), coords[2])
    }
    else if (robot.getPlaced()){
        if (command == "move"){
            clearBoard()
            robot.move()
        }
        if (command == "left"){
            clearBoard()
            robot.left()
        }
        if (command == "right"){
            clearBoard()
            robot.right()
        }
        if (command == "report"){
            clearBoard()
            robot.report()
        }
        else{
            return
        }

    }
    drawRobot()
}

// Button movement
function checkButton(command){
    var accepted_commands = ['move','left','right','report']

    if (command == 'place'){
        var x = parseInt($("#buttonX").val())
        var y = parseInt($("#buttonY").val())
        var f = $("#buttonFace").val()
        // Position input check
        if (x !== null && y !== null && x >= 0 && x <= maxX && y >= 0 && y <= maxY){
            clearBoard()
            robot.place( x, y, f)
        }
    }
    else if (accepted_commands.includes(command)){
        runCommand(command)
    }
    else{
        return
    }
    drawRobot()
}

// Test file input functions
function checkFile() {
    // Remove old table
    emptyTraceTable()

    var file = $('#testFile')[0];
    
    if(file.files.length)
    {
        var reader = new FileReader();
        var fileTrace = document.getElementById("#fileTrace")
        
        reader.onload = function(e)
        {
            var file = e.target.result;
            var lines = file.split("\n");
            for (line in lines){
                if (lines[line].length > 0){
                    runCommand(lines[line])
                    fillTraceTable(lines[line])

                }
            }
        };
        
        reader.readAsBinaryString(file.files[0]);

        $("#fileTrace").show()

    }
}

function fillTraceTable(line) {
    var rowCount = $('#fileTrace tr').length

    var table = $("#fileTrace tbody");

    row = `
            <tr>
            <td>` + line +  `</td>
            <td>` + robot.getX() +  `</td>
            <td>` + robot.getY()  +  `</td>
            <td>` + robot.getF()  +  `</td>
            </tr>
        `
        table.append(row);
}

function emptyTraceTable(){
    $("#fileTrace tbody").replaceWith("<tbody></tbody>")
}

// Resets fields back to default
function resetView(){
    $("#fileInput").hide()
    $("#buttonInput").hide()
    $("#textCommands").hide()
    $("#report").hide()
    $("#fileTrace").hide()
    $("#commandInput").hide()
    emptyTraceTable()
}

// Input type selection
$("#inputType").change(function(){
    var type = $("#inputType").val();
    if (type == "file-input"){
        resetView()
        
        $("#fileInput").show()
    }
    else if (type == "command-input"){
        resetView()

        $("#commandInput").show()
    }
    else if (type == "button-input"){
        resetView()

        $("#buttonInput").show()
    }
});

$(function() {
    robot = new Robot(null, null, null);
    $("#inputType").val("command-input");
    resetView()
    $("#commandInput").show()
    drawBoard();
});

// Canvas functions
function drawBoard(){
   
    for (var y = 0; y <= bHeight; y+= bGrid){
        ctx.moveTo(0, y);
        ctx.lineTo(bWidth, y);
    }

    for (var x = 0; x <= bWidth; x+= bGrid){
        ctx.moveTo(x, 0);
        ctx.lineTo(x, bHeight);
    }

    ctx.strokeStyle = "black";
    ctx.stroke();
}

function clearBoard(){
    ctx.clearRect( 0, 0, bWidth, bHeight);
}

function drawRobot(){
    if (robot.placed){
        // Board has to be cleared or it leaves an outline of last indicator
        clearBoard()

        ctx.fillStyle = 'red';
        // Flip y coord as origin starts from top left
        y = (bHeight - bGrid) - robot.getY() * bGrid
        ctx.fillRect(robot.getX() * bGrid, y , bGrid, bGrid);

        // Draw direction indicator
        var direction = robot.getF()
        var offset = bGrid/4
        var x = robot.getX() * bGrid
        ctx.beginPath()
        if (direction == "North"){
            ctx.moveTo(x + offset, y);
            ctx.lineTo(x + bGrid-offset, y);
            ctx.lineTo(x + bGrid/2, y- bGrid/2);
        }
        else if (direction == "East"){
            ctx.moveTo(x + bGrid + bGrid/2, y + bGrid/2 );
            ctx.lineTo(x + bGrid, y + offset);
            ctx.lineTo(x + bGrid, y + bGrid - offset);
        }
        else if (direction == "South"){
            ctx.moveTo(x + offset, y + bGrid);
            ctx.lineTo(x + bGrid - offset, y + bGrid);
            ctx.lineTo(x + bGrid/2, y + bGrid*2 - bGrid/2);
        }
        else if (direction == "West"){
            ctx.moveTo(x - bGrid/2, y + bGrid/2 );
            ctx.lineTo(x, y + offset);
            ctx.lineTo(x, y + bGrid - offset);
        }
        ctx.closePath();
        ctx.fillStyle = 'green';
        ctx.fill();

        drawBoard()
    }
}