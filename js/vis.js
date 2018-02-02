var playing = 0;
var pausing = 1;
var t0 = 0;
var vx;
var vy;
var vsteps = 32;
var cx;
var cy;

var font;

function preload() {
    font = loadFont('assets/AveriaSerifGWF-Regular.ttf');
}


function setup() {
    var myCanvas = createCanvas(windowWidth, windowHeight*0.9);
    myCanvas.parent('visContainer');

    background(0);

    textFont(font);

    vx = new Array(frequencyData.length);
    vy = new Array(frequencyData.length);

    for (var i = 0; i < frequencyData.length; i++) {
        vx[i] = new Array(vsteps).fill(-1);
        vy[i] = new Array(vsteps).fill(-1);
    }
}


function draw() {
    background(0);
    noStroke();

    cx = width*0.5;
    cy = height*0.5;

    fill(100);
    noStroke();
    textSize(24);
    text('Dynamische Akustische Forschung', cx - 0.5*textWidth('Dynamische Akustische Forschung'), 0.9*height);
    textSize(16);
    text('Akademie der Bildenden K\u00FCnste N\u00FCrnberg', cx - 0.5*textWidth('Akademie der Bildenden K\u00FCnste N\u00FCrnberg'), 0.9*height+30);


    if (pausing) {

        noFill();
        strokeWeight(2);
        stroke(180);

        var e2 = height*0.2;
        var h3 = e2*sqrt(3)/3.0;

        translate(cx-h3*0.33, cy);

        triangle(-h3, -e2, -h3, e2, 2*h3, 0);

        for (var i = 0; i < 32; i++) {
            rotate(PI/(46)*(1.0-constrain((millis()-t0)*0.05, 0, 1.0)));
            //rotate(PI/46);
            scale(0.9);
            triangle(-h3, -e2, -h3, e2, 2*h3, 0);
        }
    }
    else if (playing) {

        noFill();
        strokeWeight(2);

        var e2 = height*0.2;
        var h3 = e2*sqrt(3)/3.0;

        translate(cx-h3*0.33, cy);

        stroke(221*(0.8 + 0.2*sin(millis()*0.003 - 0.25)));
        triangle(-h3, -e2, -h3, e2, 2*h3, 0);

        for (var i = 0; i < 32; i++) {
            rotate(PI/(46 + 3*sin(millis()*0.0005))*constrain((millis()-t0)*0.008, 0, 1.0));
            //rotate(PI/(46 + 12*sin(millis()*0.0005))*constrain((millis()-t0)*0.008, 0, 1.0));
            //scale(0.9);
            //scale(0.9 + 0.2*frequencyData[i]/255);
            scale(0.9 + 0.02*frequencyData[i]/255);
            stroke(221*(0.8 + 0.2*sin(millis()*0.002 + 0.25*i)));
            triangle(-h3, -e2, -h3, e2, 2*h3, 0);
        }

        //drawPlaying();
    }

    
}


function visPlay() {
    t0 = millis();
    pausing = 0;
    playing = 1;
}


function visPause() {
    t0 = millis();
    pausing = 1;
    playing = 0;
}


function drawPlaying() {
    var n = frequencyData.length;
    var elength = height/vsteps*0.5;


    stroke(221);
    strokeWeight(1);
    fill(70);

    translate(cx, cy);

    for (var i = 0; i < n; i++) {

        var f = floor(frequencyData[i]/256.0*vsteps);

        beginShape(TRIANGLE_FAN);

        for (var j = 0; j < f; j++) {
            if (vy[i][j] == -1) {

                var angle = random(-PI*0.25, PI*0.25);
                
                if (j == 0) {
                    vx[i][j] = floor(elength*sin(angle));
                    vy[i][j] = floor(elength*cos(angle));
                }
                else {
                    vx[i][j] = floor(vx[i][j-1] + elength*sin(angle));
                    vy[i][j] = floor(vy[i][j-1] + elength*cos(angle));
                }

            }
           
            if (j == 0)
                vertex(0, 0);
            
            if (j % 2 == 0) {
                vertex(vx[i][j], vy[i][j]);
                vertex(-vx[i][j], vy[i][j]);
            }
            else {
                vertex(vx[i][j], vy[i][j]);
            }
                
        }

        endShape();

        for (var j = f; j < vsteps; j++) {
            vy[i][j] = -1;
        }
        
        rotate(TWO_PI/n*3);
    }
}