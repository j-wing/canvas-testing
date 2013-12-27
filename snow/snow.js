  randint = function(min, max) {
    if (max == null) {
      max = min;
      min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
  };

var w = window.innerWidth;
var h = window.innerHeight;
var RATE = 1
var FLAKE_RADIUS = 4

// [[x, y]]
var snowflakes = [];

function createSnowflake() {
    snowflakes.push([randint(w), 0, randint(0, 2), FLAKE_RADIUS+randint(0, 1)])
}

function drawSnowflakes(context) {
    if (randint(100) % Math.pow(2, RATE) == 0) {
        createSnowflake();
    }
    for (var i in snowflakes) {
        var x = snowflakes[i][0];
        var y = snowflakes[i][1];

        if (y > h) {
            snowflakes.splice(i, 1);
            continue;
        }

        context.beginPath();
        context.moveTo(x, y);
        context.arc(x, y, snowflakes[i][3], 0, 2*Math.PI);
        context.fillStyle = "white";
        context.fill();
        context.closePath();
        snowflakes[i][1] += 1+snowflakes[i][2];

    }
}

function animate() {
    var c = document.getElementById("canvas");
    var context = c.getContext("2d");
    context.clearRect(0, 0, w, h);
    context.fillStyle = "#6b92b9";
    context.fillRect(0, 0, w, h);

    drawSnowflakes(context);
    window.requestAnimationFrame(animate)
}
function main() {
    var c = document.getElementById("canvas");
    c.width = window.innerWidth;
    c.height = window.innerHeight;
    var context = c.getContext("2d");

    document.body.addEventListener("click", function(e){
        if (RATE < 6) {
            RATE += 1;
        }
        else {
            RATE = 1;
        }
    })

    window.requestAnimationFrame(animate);
}
window.addEventListener("DOMContentLoaded", main);
