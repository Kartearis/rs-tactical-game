


export default function promiseSetTimeout(handler, delay) {
    return new Promise((resolve, reject) => {
        try {
            setTimeout(() => resolve(handler()), delay);
        }
        catch (e) {
            reject(e);
        }
    });
};