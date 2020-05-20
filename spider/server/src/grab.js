let https = require("https");
let fs = require("fs");
const { v4: uuidv4 } = require("uuid");

/*
    1. 保证后台搭建好【可以抓取数据(cookie、token、refer、正常、百度图片 - 防盗链) -> 破解】
    2. 抓取数据【核心图片、评论、点赞(可以表现大众心理的数据)】
        -1). 抓下来的数据是 xml、json 格式
        -2). html
    3. 基于 http 可并发性并发下载图片并保存到本地【保存到指定的磁盘目录、当前服务器目录】
*/

let getPicsURL = function getPicsURL(data) {

    data = JSON.parse(data.replace(/\n/g, "").replace(/---*---/g, ""), (key, val) => {
        if (typeof val === "string") {
            val = val.trimRight();
        }
        return val;
    });
    data = data.data.object_list.map((item, index) => item.photo.path);
    return data;
};

let request = https.request("https://www.duitang.com/napi/blog/list/by_search/?kw=%E7%A7%A6%E6%97%B6%E6%98%8E%E6%9C%88&type=feed&include_fields=top_comments%2Cis_root%2Csource_link%2Citem%2Cbuyable%2Croot_id%2Cstatus%2Clike_count%2Clike_id%2Csender%2Calbum%2Creply_count%2Cfavorite_blog_id&_type=&start=0&_=1589860099983", {
    timeout: 999999,
    agent: false,
}, (res) => {
        res.pipe(fs.createWriteStream("./data.json")).on("finish", () => {
            // 读取 json 文件
            fs.promises.readFile("./data.json").then((data) => {
                console.log('数据读取成功');
                    let pics = getPicsURL(data.toString());
                    pics.forEach((item, index) => {
                        https.request(item, {
                            timeout: 9999999,
                            agent: false,
                        },(res) => {
                            let suffix = res.headers['content-type'];
                            suffix = suffix.substring(suffix.indexOf("/") + 1);
                            res.pipe(fs.createWriteStream(`./images/${uuidv4()}.${suffix}`));
                            console.log('ing ...');
                            
                        }).end();
                        console.log('end');
                    });
            }).catch((err) => {
                console.log(err);
                console.log('数据读取失败');
            });
        });
});
request.end();
