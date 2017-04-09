// /**
//  * Created by QING on 2017/3/9.
//  */
// var express = require('express');
// var mongoose = require('mongoose');
// var app = express();
//
// app.get('/',function(rq,res,next){
//     res.send('1111111');
// })
//
// mongoose.connect('mongodb://localhost:27018/gg', function(err){
//     if(err){
//         console.log('数据库连接失败');
//     }else{
//         console.log('数据库连接成功');
//         app.listen(8081);
//     }
// })
var path = require('path');
var express = require('express');
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var flash = require('connect-flash');
var config = require('config-lite');
var routes = require('./routes');
var package = require('./package');
var fs = require('fs');
mongoose.Promise = require('bluebird');
var pug = require('pug');

// mongoose.connect(config.mongodb);



//
// // 测试mongodb连接是否成功
// mongoose.connection.on('connected', function(){
//     console.log('Connection success!');
// });
// mongoose.connection.on('error', function(err){
//     console.log('Connection error: ' + err);
// });
// mongoose.connection.on('disconnected', function(){
//     console.log('Connection disconnected');
// });

var app = express();

// 读取数据库模型
var models_path = __dirname + '/models';
var walk = function(path) {
    fs
        .readdirSync(path)
        .forEach(function(file) {
            var newPath = path + '/' + file;
            var stat = fs.statSync(newPath);

            if(stat.isFile()) {
                if(/(.*)\.(js|coffee)/.test(file)) {
                    require(newPath);
                }
            }else if(stat.isDirectory()) {
                walk(newPath);
            }
        });
}
walk(models_path);

// 设置模板目录
app.set('views', path.join(__dirname, './views/pages'));
// 设置模板引擎为pug
app.set('view engine', 'pug');

//设置静态文件目录
app.use(express.static(path.join(__dirname, 'public')));
// session 中间件
app.use(session({
    name: config.session.key,// 设置 cookie 中保存 session id 的字段名称
    secret: config.session.secret,// 通过设置 secret 来计算 hash 值并放在 cookie 中，使产生的 signedCookie 防篡改
    resave: false,// 设置指每次请求不再重新设置session cookie
    saveUninitialized: true,// 设置指无论有没有session cookie，每次请求都设置个session cookie
    cookie: {
        maxAge: config.session.maxAge// 过期时间，过期后 cookie 中的 session id 自动删除
    },
    store: new MongoStore({// 将 session 存储到 mongodb
        url: config.mongodb// mongodb 地址
    })
}));

// flash 中间价，用来显示通知
app.use(flash());

// 处理表单及文件上传的中间件
app.use(require('express-formidable')({
    uploadDir: path.join(__dirname, 'public/upload'),// 上传文件目录
    keepExtensions: true// 保留后缀
}));

// 设置模板时间格式化常量
app.locals.moment = require('moment');

// 路由
routes(app);

// 监听端口，启动程序
// app.listen(config.port, function () {
//     console.log(package.name +'listening on port' +config.port);
// });
mongoose.connect('mongodb://localhost:27018/gg', function(err){
    if(err){
        console.log('数据库连接失败');
    }else{
        console.log('数据库连接成功');
        app.listen(8081);
    }
});

