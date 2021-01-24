
var pitch = 0;
var bank = 0;
var ctx;
var factor = 5;
var c;
var width = 600;
var height = 400;
var fwidth = 2.5 * width;
var fheight = factor * height;


function drawHor(pitch, bank) {

    ctx.translate(width / 2, height / 2);
    ctx.rotate(-bank * Math.PI / 180);
    ctx.translate(0, factor * pitch);
    ctx.fillStyle = "brown";
    ctx.fillRect(-fwidth / 2, 0, fwidth, fheight / 2);
    ctx.fillStyle = "blue";
    ctx.fillRect(-fwidth / 2, -fheight / 2, fwidth, fheight / 2);
    for (let i = -60; i <= 60; i = i + 10) {
        ctx.lineWidth = 1;
        ctx.moveTo(-10 * factor, factor * i);
        ctx.lineTo(10 * factor, factor * i);
        ctx.strokeStyle = "white";
        ctx.stroke();
    }
    for (let i = -25; i <= 25; i = i + 10) {
        ctx.moveTo(-5 * factor, factor * i);
        ctx.lineTo(5 * factor, factor * i);
        ctx.stroke();
    }
    for (let i = -27.5; i <= 27.5; i = i + 5) {
        ctx.moveTo(-3 * factor, factor * i);
        ctx.lineTo(3 * factor, factor * i);
        ctx.stroke();
    }
    ctx.strokeText("10", -17 * factor, -8 * factor);
    ctx.strokeText("10", 10 * factor, -8 * factor);
    ctx.strokeText("10", -17 * factor, 12 * factor);
    ctx.strokeText("10", 10 * factor, 12 * factor);


    ctx.translate(0, -factor * pitch);
    /**scale bank */
    ctx.rotate(30 * Math.PI / 180);
    for (let i = -30; i <= 30; i = i + 10) {
        ctx.beginPath();
        ctx.moveTo(0, -height / 2.2);
        ctx.lineTo(0, -height / 2.1);
        if (i == 0) {
            ctx.lineTo(0, -height / 2.01);
        }
        ctx.stroke();
        ctx.rotate(-10 * Math.PI / 180);
    }
    ctx.rotate(40 * Math.PI / 180);

    ctx.rotate(bank * Math.PI / 180);
    ctx.translate(-width / 2, -height / 2);
}
function drawScale() {

    ctx.beginPath();
    ctx.arc(width / 2, height / 2, height / 2.2, 0, 2 * Math.PI);
    ctx.lineWidth = 1;
    ctx.strokeStyle = "black";
    ctx.stroke();
    /**triangle marker for bank */
    ctx.translate(width / 2, height / 2);
    ctx.beginPath();
    ctx.moveTo(0, -height / 2.2);
    ctx.lineTo(-5, -height / 2.3);
    ctx.lineTo(5, -height / 2.3);
    ctx.lineTo(0, -height / 2.2);
    ctx.strokeStyle = "yellow";
    ctx.stroke();
    ctx.translate(-width / 2, -height / 2);

    ctx.beginPath();
    ctx.rect(width / 2 - factor, height / 2 - factor, 2 * factor, 2 * factor);
    ctx.lineWidth = 3;
    ctx.strokeStyle = "yellow";
    ctx.stroke();
    /**aircraft symbol */
    ctx.beginPath();
    ctx.moveTo(-height / 2.3 + width / 2, height / 2);
    ctx.lineTo(-height / 4 + width / 2, height / 2);
    ctx.lineTo(-height / 4 + width / 2, height / 2 + 5 * factor);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(height / 2.3 + width / 2, height / 2);
    ctx.lineTo(height / 4 + width / 2, height / 2);
    ctx.lineTo(height / 4 + width / 2, height / 2 + 5 * factor);
    ctx.stroke();


}
function drawArtHor() {

    getData();
    pitch = parseFloat(data.pitch)*180/Math.PI;
    bank = parseFloat(data.bank)*180/Math.PI;
    const text = "pitch: " + pitch;
    document.getElementById("pitch-text").innerHTML = text;
    const text2 = "bank: " + bank;
    document.getElementById("bank-text").innerHTML = text2;

    c = document.getElementById("myCanvas");
    ctx = c.getContext("2d");
    ctx.clearRect(0, 0, width, height);
    ctx.font = "30px Arial";

    drawHor(pitch, bank);
    drawScale();
}



function start() {
    setInterval(drawArtHor, 100);

}


