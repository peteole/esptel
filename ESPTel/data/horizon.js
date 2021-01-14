
var pitch = 0;
var bank = 0;
var ctx;
var factor = 2;
var c;
var width = 300;
var height = 200;
var fwidth = factor * width;
var fheight = factor * height;


function drawHor(pitch, bank) {
    ctx.clearRect(0, 0, width, height);
    ctx.translate(width / 2, height / 2 + pitch);
    ctx.rotate(-bank * Math.PI / 180);
    ctx.fillStyle = "brown";
    ctx.fillRect(-fwidth / 2, 0, fwidth, fheight / 2);
    ctx.fillStyle = "blue";
    ctx.fillRect(-fwidth / 2, -fheight / 2, fwidth, fheight / 2);
    for (let i = -30; i <= 30; i = i + 10) {
        ctx.lineWidth = 1;
        ctx.moveTo(-10, 2.5 * i);
        ctx.lineTo(10, 2.5 * i);
        ctx.strokeStyle = "white";
        ctx.stroke();
    }
    for (let i = -25; i <= 25; i = i + 10) {
        ctx.moveTo(-5, 2.5 * i);
        ctx.lineTo(5, 2.5 * i);
        ctx.stroke();
    }
    for (let i = -27.5; i <= 27.5; i = i + 5) {
        ctx.moveTo(-3, 2.5 * i);
        ctx.lineTo(3, 2.5 * i);
        ctx.stroke();
    }
    //ctx.translate(0, -pitch);
    ctx.rotate(bank * Math.PI / 180);
    ctx.translate(-width / 2, -height / 2 - pitch);
}
function drawScale() {
    ctx = c.getContext("2d");

    ctx.beginPath();
    ctx.arc(width / 2, height / 2, height / 2.2, 0, 2 * Math.PI);
    ctx.lineWidth = 1;
    ctx.strokeStyle = "black";
    ctx.stroke();

    ctx.beginPath();
    ctx.rect(width / 2 - 3, height / 2 - 3, 6, 6);
    ctx.lineWidth = 2;
    ctx.strokeStyle = "yellow";
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(-50 + width / 2, height / 2);
    ctx.lineTo(-30 + width / 2, height / 2);
    ctx.lineTo(-30 + width / 2, height / 2 + 10);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(50 + width / 2, height / 2);
    ctx.lineTo(30 + width / 2, height / 2);
    ctx.lineTo(30 + width / 2, height / 2 + 10);
    ctx.stroke();


}
function drawArtHor() {
    getData();
    pitch = 180 * Math.atan(parseInt(data.ax) / parseInt(data.az)) / Math.PI;
    bank = 180 * Math.atan(parseInt(data.ay) / parseInt(data.az)) / Math.PI;
    c = document.getElementById("myCanvas");
    const text = "pitch: " + pitch;
    document.getElementById("pitch-text").innerHTML = text;
    const text2 = "bank: " + bank;
    document.getElementById("bank-text").innerHTML = text2;
    ctx = c.getContext("2d");
    ctx.clearRect(0, 0, 300, 150);
    drawHor(pitch, bank);
    drawScale();
}



function start() {
    setInterval(drawArtHor, 100);

}


