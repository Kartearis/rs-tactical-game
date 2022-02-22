


export default class SoundPlayer {
    sounds = null

    constructor() {
        this.sounds = {

        }
    }

    promisedPlay = (audioObject) => {
        return new Promise(resolve => {
            audioObject.addEventListener('ended', resolve, {once: true});
            audioObject.play();
        });
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

    clearSounds = (label) => {
        if (this.sounds[label])
            this.sounds[label] = [];
    }

    playSound = (label) => {
        if (this.sounds[label])
            this.sounds[label].forEach(sound => sound.play());
        else console.log("Sound with label ", label, " is not set");
    }

    promisedPlaySound = async (label) => {
        if (!this.sounds[label]) {
            console.log("Sound with label ", label, " is not set");
            return null;
        }
        return await Promise.all(this.sounds[label].map(sound => this.promisedPlay(sound)));
    }

    stopPlayback = (label = null, config = {reset: true}) => {
        // console.log("Stop");
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