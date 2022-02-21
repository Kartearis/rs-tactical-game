


export default class SoundPlayer {
    sounds = null

    constructor() {
        this.sounds = {

        }
    }

    // TODO: Add config argument.
    // Possible settings: start point, loop
    addSound = (label, path, config = {}) => {
        let newAudio = new Audio(path);
        if (config.loop === true)
            newAudio.loop = true;
        if (config.offset)
            newAudio.currentTime = config.offset;
        if (this.sounds[label] !== undefined)
            this.sounds[label].push(newAudio);
        else this.sounds[label] = [newAudio];
    }

    playSound = (label) => {
        this.sounds[label].forEach(sound => sound.play());
    }

    // TODO: add config so that it is possible to pause without resetting
    stopPlayback = (label = null, config = {reset: true}) => {
        console.log("Stop");
        if (label)
            this.sounds[label].forEach(sound => {
                sound.pause();
                if (config.reset === true)
                    sound.currentTime = 0;
            });
        else {
            for (let label in this.sounds)
                this.sounds[label].forEach(sound => {
                    sound.pause();
                    if (config.reset === true)
                        sound.currentTime = 0;
                });
        }
    }

}