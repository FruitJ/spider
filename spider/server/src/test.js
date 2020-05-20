// 发起 http 请求来请求图片
let https = require("https");
let fs = require("fs");
/* let request = https.request("https://c-ssl.duitang.com/uploads/item/201506/24/20150624221209_LNha8.jpeg", {
    timeout: 6000
}, (res) => {
    res.pipe(fs.createWriteStream("./1.jpeg")).on('finish', () => {

    });
});
request.end(); */
let u1 = "https://c-ssl.duitang.com/uploads/item/201506/24/20150624221209_LNha8.jpeg";
let u2 = "https://c-ssl.duitang.com/uploads/item/201607/31/20160731191217_eGaPU.jpeg";
let u3 = "https://c-ssl.duitang.com/uploads/item/201506/24/20150624234558_Vj5sr.jpeg";
let queue = [u1, u2, u3];

queue.forEach((item, index) => {
    https.request(item, { timeout: 6000 }, (res) => {
        let suffix = res.headers['content-type'];
        suffix = suffix.substring(suffix.indexOf("/") + 1);
        res.pipe(fs.createWriteStream(`./images/${+new Date()}${Math.random()}.${suffix}`));
        console.log('ing ...');
        
    }).end();
    console.log('end');
});
