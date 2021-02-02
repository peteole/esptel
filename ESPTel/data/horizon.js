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
    ctx.strokeText("20", -17 * factor, -18 * factor);
    ctx.strokeText("20", 10 * factor, -18 * factor);
    ctx.strokeText("20", -17 * factor, 22 * factor);
    ctx.strokeText("20", 10 * factor, 22 * factor);


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
function drawScale(alt) {

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
    /**alt band */
    for (let i = (alt - altBias - 15); i <= (alt - altBias + 15); i++) {
        ctx.strokeStyle = "white";
        if (i % 10 == 0) {
            ctx.strokeText(i, width * 0.87, height / 2 + 12 - (i - alt + altBias) * 4 * factor);
        }
        else if (i % 5 == 0) {
            ctx.beginPath();
            ctx.moveTo(width * 0.87, height / 2 - (i - alt + altBias) * 4 * factor);
            ctx.lineTo(width * 0.95, height / 2 - (i - alt + altBias) * 4 * factor);
            ctx.stroke();
        }
    }
    ctx.clearRect(width * 0.83, height / 2 - 25, width * 0.17, 50); //Alt on PFD
    ctx.strokeText(alt - altBias + " m", width * 0.85, height / 2 + 12);

    ctx.clearRect(width * 0.5 - 30, height - 25, 60, 25); //HDG on PFD
    ctx.strokeText(mhdg, width * 0.5 - 25, height);

}

function drawArtHor() {

    getData();
    pitch = parseFloat(data.pitch) * 180 / Math.PI;
    bank = parseFloat(data.bank) * 180 / Math.PI - 180;
    altfloat = parseFloat(44330 * (1.0 - Math.pow(data.pressure / 1013.25, 0.1903)));
    vs = (vs * 4 + (altfloat - altfloat0) * 6) / 10; //Glättung der vertical speed
    if (vs > 0.3 || vs < -0.3) {
        sound();
    }
    altfloat0 = altfloat;
    alt = parseInt(altfloat);
    mhdg = parseInt(Math.atan2(-(data.my), -(data.mx)) * 180 / Math.PI + 180);
    ax = parseFloat(data.ax);
    ay = parseFloat(data.ay);
    az = parseFloat(data.az);
    gload = (Math.sqrt(ax * ax + ay * ay + az * az)) / 9.81;
    const text = "G-Load: " + gload.toFixed(2);
    document.getElementById("gload-text").innerHTML = text;
    const text2 = "v/s: " + vs.toFixed(1) + " m/s";
    document.getElementById("vs-text").innerHTML = text2;

    c = document.getElementById("myCanvas");
    ctx = c.getContext("2d");
    ctx.clearRect(0, 0, width, height);
    ctx.font = "30px Arial";

    drawHor(pitch, bank);
    drawScale(alt);
}


function start() {
    setInterval(drawArtHor, 100);
}


