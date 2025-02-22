function timeout(ms, promise) {
    return new Promise((resolve, reject) => {
        const timeoutId = setTimeout(() => {
            reject(new Error())
        }, ms);
        promise.then(
            (res) => {
                resolve(res)
            },
            (err) => {
                reject(err)
            }
        ).finally(() => {
            clearTimeout(timeoutId);
        })
    })
}

export default timeout;