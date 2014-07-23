# SoundEffectManager

Is just that. It's a simple sound effect manager for playing sounds using the awesome HTML 5 Web Audio API.

If you think I'm talking about `<audio>` tags, go read this: http://www.html5rocks.com/en/tutorials/webaudio/intro/

It's significantly better than `<audio>` tags for several reasons:

- You don't have to create a tag for each sound you want to play
- You can multiplex an effect without having to create duplicate tags
- You can also control volume and add other effects

<!-- starthide -->
Part of the [Ampersand.js toolkit](http://ampersandjs.com) for building clientside applications.
<!-- endhide -->

## Installing

`npm install sound-effect-manager`

## Using it

```js
// just init the sound effect manager
var SoundEffectManager = require('sound-effect-manager');

var sm = new SoundEffectManager();

// load some files by passing it a url and a name
sm.loadFile('taps.mp3', 'taps');
sm.loadFile('rocket.wav', 'rocket');

// then play the sounds like so:
sm.play('rocket');

// or play a sound in looping mode:
sm.play('taps', true);

// and to stop a loop:
sm.stop('taps');

// that's it!
```

## License

MIT

## Credits

Built (rather hastily) by [@HenrikJoreteg](http://twitter.com/henrikjoreteg) for use in [And Bang](http://andbang.com). Which you should totally check out if you work with a team, for anything, ever.
