/*
SoundEffectManager

Loads and plays sound effects useing
HTML5 Web Audio API (as only available in webkit, at the moment).

By @HenrikJoreteg from &yet
*/


function SoundEffectManager () {
    this.AudioContext = window.AudioContext || window.webkitAudioContext;

    this.support = !!this.AudioContext;
    if (this.support) {
        this.context = new this.AudioContext();
    }

    this.sounds = {};
    this.sources = {};
}

// async load a file at a given URL, store it as 'name'.
SoundEffectManager.prototype.loadFile = function (url, name, delay, cb) {
    if (this.support) {
        this._loadWebAudioFile(url, name, delay, cb);
    } else {
        this._loadWaveFile(url.replace('.mp3', '.wav'), name, delay, 3, cb);
    }
};

// async load a file at a given URL, store it as 'name'.
SoundEffectManager.prototype._loadWebAudioFile = function (url, name, delay, cb) {
    if (!this.support) {
        return;
    }

    var self = this;
    var request = new XMLHttpRequest();

    request.open('GET', url, true);
    request.responseType = 'arraybuffer';
    request.onload = function () {
        self.context.decodeAudioData(request.response,
            function (data) { // Success
                self.sounds[name] = data;
                if (cb) {
                    cb(null, data);
                }
            },
            function (err) { // Error
                if (cb) {
                    cb(err);
                }
            }
        );
    };

    setTimeout(function () {
        request.send();
    }, delay || 0);
};

SoundEffectManager.prototype._loadWaveFile = function (url, name, delay, multiplexLimit, cb) {
    var self = this;
    var limit = multiplexLimit || 3;

    setTimeout(function () {
        var a, i = 0;

        self.sounds[name] = [];
        while (i < limit) {
            a = new Audio();
            a.src = url;
            // for our callback
            if (i === 0 && cb) {
                a.addEventListener('canplaythrough', cb, false);
            }
            a.load();
            self.sounds[name][i++] = a;
        }
    }, delay || 0);
};

SoundEffectManager.prototype._playWebAudio = function (soundName, loop) {
    var buffer = this.sounds[soundName];

    if (!buffer) {
        return;
    }

    if (loop && this.sources[soundName]) {
        // Only start the sound once if it's looping
        return;
    }

    var source = this.context.createBufferSource();
    source.buffer = buffer;
    source.loop = loop;
    source.connect(this.context.destination);

    if (loop) {
        this.sources[soundName] = source;
    }

    source.start(0);
};

SoundEffectManager.prototype._playWavAudio = function (soundName, loop) {
    var audio = this.sounds[soundName];
    var howMany = audio && audio.length || 0;
    var i = 0;
    var currSound;

    if (!audio) {
        return;
    }

    while (i < howMany) {
        currSound = audio[i++];
        // this covers case where we loaded an unplayable file type
        if (currSound.error) {
            return;
        }
        if (currSound.currentTime === 0 || currSound.currentTime === currSound.duration) {
            currSound.currentTime = 0;
            currSound.loop = !!loop;
            i = howMany;
            return currSound.play();
        }
    }
};

SoundEffectManager.prototype.play = function (soundName, loop) {
    if (this.support) {
        this._playWebAudio(soundName, loop);
    } else {
        return this._playWavAudio(soundName, loop);
    }
};

SoundEffectManager.prototype.stop = function (soundName) {
    if (this.support) {
        if (this.sources[soundName]) {
            this.sources[soundName].stop(0);
            delete this.sources[soundName];
        }
    } else {
        var soundArray = this.sounds[soundName];
        var howMany = soundArray && soundArray.length || 0;
        var i = 0;
        var currSound;

        while (i < howMany) {
            currSound = soundArray[i++];
            currSound.pause();
            currSound.currentTime = 0;
        }
    }
};


module.exports = SoundEffectManager;
