


export default class SoundPlayer {
    sounds = null

    constructor() {
        this.sounds = {

        }
    }

    addSound = (label, path) => {
        if (this.sounds[label] !== undefined)
            this.sounds[label].push(new Audio(path));
        else this.sounds[label] = [new Audio(path)];
    }

    playSound = (label) => {
        this.sounds[label].forEach(sound => sound.play());
    }

    stopPlayback = (label = null) => {
        if (label)
            this.sounds.label.forEach(sound => sound.stop());
        else {
            for (let label in this.sounds)
                this.sounds.label.forEach(sound => sound.stop());
        }
    }

}