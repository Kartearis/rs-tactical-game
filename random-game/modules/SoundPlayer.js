


export default class SoundPlayer {
    sounds = null

    constructor() {
        this.sounds = {

        }
    }

    addSound = (label, path, config = {}) => {
        let newAudio = new Audio(path);
        if (config.loop === true)
            newAudio.loop = true;
        if (config.offset)
            newAudio.currentTime = config.offset;
        if (config.volume)
            newAudio.volume = config.volume;
        if (this.sounds[label] !== undefined)
            this.sounds[label].push(newAudio);
        else this.sounds[label] = [newAudio];
    }

    playSound = (label) => {
        if (this.sounds[label])
            this.sounds[label].forEach(sound => sound.play());
        else console.log("Sound with label ", label, " is not set");
    }

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