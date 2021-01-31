var context = new AudioContext()
var o = context.createOscillator()
var g = context.createGain()
var frequency = 440.0
o.frequency.value = frequency
o.connect(g)
g.connect(context.destination)
o.start(0)
function sound() {
    g.gain.exponentialRampToValueAtTime(1, context.currentTime + 0.04)
    frequency = 440.0 + deltaAlt * 100
    context.resume()
}
function stopsound() {
    g.gain.exponentialRampToValueAtTime(0.00001, context.currentTime + 0.04)
}
