// Movement per 10ms of a bar, in pixels
const BAR_MOVE_INC = 5;
const BALL_MOVE_INC = 5;
var GLOBAL_SPEED_MULT = 1;
var MAX_BALL_DISTANCE = (BALL_MOVE_INC * GLOBAL_SPEED_MULT);
var AUTO_TRACK_BALL = false;
var PLAYING = true;
var GLOBAL_TIMERS = [];


function centerElemHoriz(elem) {
    elem.css("left", (window.innerWidth/2)-(elem.width()/2));
}

function centerElemVert(elem) {
    elem.css("top", (window.innerHeight/2)-(elem.height()/2));
}

function centerElemInWindow(elem) {
    centerElemHoriz(elem);
    centerElemVert(elem);
}

function withinRange(value, target, range) {
    return (value > (target - range) & value < (target + range));
}


function Bar() {
    this.ctx = $("#main")[0].getContext("2d");
    
    setInterval(function() {
        this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        this.draw();
    }.bind(this), 1000);
}


Bar.prototype.draw = function() {
    var rightEdge = window.innerWidth;
    var bottomEdge = window.innerHeight;
    this.centerX = rightEdge/2;
    this.centerY = bottomEdge /2;
    
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, rightEdge, bottomEdge);

    this.ctx.strokeStyle = "white";
    this.ctx.fillStyle = "white";
    this.ctx.lineWidth = 2;
    
    this.ctx.beginPath();
    this.ctx.arc(this.centerX, this.centerY, 200, 0, Math.PI*2);
    this.ctx.stroke();
    this.ctx.closePath();
    
    this.drawTicks();
    var date = new Date();
    var seconds = date.getSeconds();
    var minutes = date.getMinutes();
    var hours = date.getHours();
    this.drawHands(hours, minutes, seconds)
}

Bar.prototype.drawHands = function(hours, minutes, seconds) {
    var LONG_HAND_LENGTH = 130;
    
    this.ctx.beginPath();
    this.ctx.arc(this.centerX, this.centerY, 3, 0, Math.PI*2);
    this.ctx.fill();
    this.ctx.closePath();

    var drawHand = function(angle, length, secondHand) {
        if (!secondHand) {
            this.ctx.lineWidth = 4;
        }
        else {
            this.ctx.lineWidth = 2;
        }
        var endX = this.centerX+length*Math.cos(angle);
        var endY = this.centerY+length*Math.sin(angle);
        this.ctx.beginPath();
        this.ctx.moveTo(this.centerX, this.centerY);
        this.ctx.lineTo(endX, endY);
        this.ctx.stroke();
        this.ctx.closePath();        
    }.bind(this);
    
    
    var hourAngle = (hours-15)*5+minutes/12;
    drawHand(this.getTickAngle(hourAngle), LONG_HAND_LENGTH-20);
    drawHand(this.getTickAngle(minutes-15), LONG_HAND_LENGTH);
    drawHand(this.getTickAngle(seconds-15), LONG_HAND_LENGTH, true);
}

Bar.prototype.drawTicks = function() {
    var tickHeight, endCoords, startCoords, textXOffset, textYOffset, textValue;
    this.ctx.font = "20px Helvetica";
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    for (var i = 1; i <= 60; i++) {
        this.ctx.beginPath();
        startCoords = this.getTickStartCoords(i);
        endCoords = this.getTickEndCoords(i);
        
        if ([15, 30, 45, 60].indexOf(i)> -1) {
            textXOffset = 0;
            textYOffset = 0;
            if (startCoords.x < this.centerX) {
                // 9
                textXOffset = 20;
            }
            else if (startCoords.x > this.centerX) {
                //3
                textXOffset = -20;
            }
            else {
                if (startCoords.y < this.centerY) {
                    textYOffset = 20;
                }
                else {
                    textYOffset = -20;
                }
            }
            textValue = (i/5)+3;
            if (textValue == 15) textValue = 3;
            
            this.ctx.fillText(textValue, endCoords.x+textXOffset, endCoords.y+textYOffset);
        }

        this.ctx.moveTo(startCoords.x, startCoords.y);
        this.ctx.lineTo(endCoords.x, endCoords.y);
        this.ctx.stroke();
        this.ctx.closePath();
    }
}

Bar.prototype.getTickLength = function(num) {
    if (num % 5) {
        return 20;
    }
    else {
        return 30;
    }
}

Bar.prototype.getTickAngle = function(num) {
    return num*(Math.PI*2/60);
}

Bar.prototype.getTickStartCoords = function(num) {
    var angle = this.getTickAngle(num);
    var startX = 200*Math.cos(angle)+this.centerX;
    var startY = 200*Math.sin(angle)+this.centerY;
    return {x:startX, y:startY}
}

Bar.prototype.getTickEndOffset = function(num, length) {
    if (!length) {
        length = this.getTickLength(num);
    }
    var angle = this.getTickAngle(num);
    return {x:length*Math.cos(angle), y:length*Math.sin(angle)}
}

Bar.prototype.getTickEndCoords = function(num, length) {
    var starts = this.getTickStartCoords(num);
    var ends = this.getTickEndOffset(num, length);
    return  {x:starts.x-ends.x, y:starts.y-ends.y};
}
    
window.addEventListener("DOMContentLoaded", function() { 
    $("#main").attr("width", window.innerWidth).attr("height", window.innerHeight);
    new Bar();
    $(document).keydown(function(e) {
        // Emergency stop
        if (e.which == 32) {
            GLOBAL_TIMERS.reverse();
            for (var i in GLOBAL_TIMERS) {
                clearTimeout(GLOBAL_TIMERS[i]);
            }
        }
    });
        
});
