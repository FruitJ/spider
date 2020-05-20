class Ajax {
    constructor(url, config = {}) {
        return new Promise((resolve, reject) => {
            let xhr = new XMLHttpRequest(); // 获取 XMLHttpRequest 实例
            xhr.open('GET', url, true);
            Object.keys(config).forEach((item, index) => {
                xhr.setRequestHeader(item, config[item]);
            });
            xhr.addEventListener('readystatechange', function () {
                if (xhr.readyState === 4) {
                    if (/^[2,3]\d{2}$/.test(xhr.status)) {
                        let suffix = xhr.getResponseHeader("Content-Type");
                        suffix = suffix.substring(suffix.indexOf("/") + 1);
                        resolve(xhr.response, suffix);
                    }
                }
            }, false);
            xhr.addEventListener('error', function (err) {
                reject(err);
            }, false);
            xhr.send(null);
        });
    }
}

exports.Ajax = Ajax;
