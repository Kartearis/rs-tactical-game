


export default class SoundPlayer {
    sounds = null

    constructor() {
        this.sounds = {

        }
    }

    // TODO: Add config argument.
    // Possible settings: start point, loop
    addSound = (label, path) => {
        if (this.sounds[label] !== undefined)
            this.sounds[label].push(new Audio(path));
        else this.sounds[label] = [new Audio(path)];
    }

    playSound = (label) => {
        this.sounds[label].forEach(sound => sound.play());
    }

    // TODO: add config so that it is possible to pause without resetting
    stopPlayback = (label = null) => {
        console.log("Stop");
        if (label)
            this.sounds[label].forEach(sound => {
                sound.pause();
                sound.currentTime = 0;
            });
        else {
            for (let label in this.sounds)
                this.sounds[label].forEach(sound => {
                    sound.pause();
                    sound.currentTime = 0;
                });
        }
    }

}