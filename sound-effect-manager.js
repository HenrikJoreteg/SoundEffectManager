/* 
SoundEffectManager

Loads and plays sound effects useing
HTML5 Web Audio API (as only available in webkit, at the moment).

By @HenrikJoreteg from &yet
*/
/*global webkitAudioContext define*/
(function () {
    var root = this;

    function SoundEffectManager() {
        this.support = !!window.webkitAudioContext;
        if (this.support) {
            this.context = new webkitAudioContext();
            this.sounds = {};
        }
    }

    // async load a file at a given URL, store it as 'name'.
    SoundEffectManager.prototype.loadFile = function (url, name, optionalCallback) {
        if (!this.support) return;
        var self = this,
            request = new XMLHttpRequest();
        
        request.open("GET", url, true);
        request.responseType = "arraybuffer";
        request.onload = function () { 
            self.sounds[name] = self.context.createBuffer(request.response, true);
            if (optionalCallback) optionalCallback();
        };

        request.send();
    };

    SoundEffectManager.prototype.play = function (soundName) {
        if (!this.support) return;
        var buffer = this.sounds[soundName],
            source;

        if (!buffer) return;

        // creates a sound source
        source = this.context.createBufferSource();
        // tell the source which sound to play 
        source.buffer = buffer;                   
        // connect the source to the context's destination (the speakers) 
        source.connect(this.context.destination); 
        // play it
        source.noteOn(0); 
    };

    // attach to window or export with commonJS
    if (typeof module !== "undefined") {
        module.exports = SoundEffectManager;
    } else if (typeof root.define === "function" && define.amd) {
        root.define(SoundEffectManager);
    } else {
        root.SoundEffectManager = SoundEffectManager;
    }

})();