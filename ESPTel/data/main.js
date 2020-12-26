
function sayaword() {
    var msg = new SpeechSynthesisUtterance();
    msg.text = "Hello World";
    window.speechSynthesis.speak(msg);
}
async function saydata() {
    let response = await fetch("/data")
    let data = await response.json()
    console.log(data)
    var msg = new SpeechSynthesisUtterance();
    msg.text = "Temperature " + data.temperature + "degrees celsius";
    const header = document.getElementById("temperature-text");
    header.innerHTML = "Temperature: " + data.temperature;
    window.speechSynthesis.speak(msg);
}