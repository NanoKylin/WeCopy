var websocket = null;
var server = null;
var username = null;
var id = 0;
var copyTemp = null;
const { clipboard } = require('electron')

function setSomething() {
    server = document.getElementById("server").value;
    username = document.getElementById("username").value;
}


function login() {
    //判断当前浏览器是否支持WebSocket  
    if ('WebSocket' in window) {
        websocket = new WebSocket("ws://" + server);
        websocket.onopen = e => {
            console.log('连接成功', e);
            websocket.send("GCSC01{\"username\":" + username + ",\"password\":\"null text\"}EE"); // 客户端与服务器端通信
            websocket.onmessage = e => {
                if (e.data == "GCSS01{\"context\":\"LOGIN SUCCESSFUL\"}EE") {
                    localStorage.setItem("username", username);
                    localStorage.setItem("server", server);
                    window.location.replace("./main.html");
                } else {
                    alert("登陆失败 请检查服务器地址和密码");
                }
            }
        }
    } else {
        alert('当前浏览器不支持WebSocket 请更换浏览器');
    }
}

function getContext() {
    if ('WebSocket' in window) {
        websocket = new WebSocket("ws://" + server);
        websocket.onopen = e => {
            console.log('连接成功', e);
            websocket.send("GCSC01{\"username\":" + username + ",\"password\":\"null text\"}EE"); // 客户端与服务器端通信
            websocket.onmessage = e => {
                if (e.data == "GCSS01{\"context\":\"LOGIN SUCCESSFUL\"}EE") {
                    websocket.send("GCSC03{\"username\":" + username + ",\"context\":\"Hello World\"}EE");
                    // 启动定时任务
                    var i;
                    var int = self.setTimeout(i = self.setInterval(getClipboardTimer, 1500), 1500);

                } else {
                    websocketTextExecuter(e.data);
                }
            }
        }
    } else {
        alert('当前浏览器不支持WebSocket 请更换浏览器');
    }
}

/**
 * 从存储器内获取服务器地址和用户名
 */
function setUsernameFromLocalStorage() {
    this.username = localStorage.getItem("username");
    this.server = localStorage.getItem("server");
}

/**
 * 裁剪收到的文字
 */
function websocketTextExecuter(message) {
    if (message.slice(0, 6) == "GCSS02") {
        var str = message.slice(6, -2);
        var text = message.slice(message.indexOf("context") + 9, message.indexOf("picture") - 2);
        id = id + 1;
        addCard(id, "blue", "WeCopy", text);
    }
}

/**
 * 添加一块卡片
 */
function addCard(id, color, title, text) {
    var html = document.createElement("div");
    html.innerHTML = '<div class=\"valign-wrapper\"><div class=\"row\"><div class=\"col s12 m12\"><div class=\"card ' + color + '\"><div class=\"card-content white-text\"><span class=\"card-title">' + title + '</span><p' + ' id=' + id + '>' + text + '</p></div><div class=\"card-action right-align\"><a' + ' id=' + id + ' onclick="getText(this.id);">复制</a></div></div></div></div></div>'
    document.body.appendChild(html);
}

/**
 * 获取块的文字
 */
function getText(id) {
    var text = document.getElementById(id).innerText;
    var aux = document.createElement("input");
    aux.setAttribute("value", text);
    document.body.appendChild(aux);
    aux.select();
    document.execCommand("copy");
    document.body.removeChild(aux);
}
//GCSC03{"username":"hanbings","context":"Hello World 1"}EE

/**
 * 定时获取剪切板
 */
function getClipboardTimer() {
    if (clipboard.readText('Text') != copyTemp && copyTemp != '' && clipboard.readText('Text') != '') {
        copyTemp = clipboard.readText('Text');
        websocket.send("GCSC02{\"username\":" + username + ",\"context\":\"" + copyTemp + "\"}EE");
    }
}