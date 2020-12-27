var websocket = null;
var server = null;
var username = null;
var id = 0;

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
                    websocket.send("GCSC02{\"username\":" + username + ",\"context\":\"null text\"}EE"); // 客户端与服务器端通信
                } else {
                    websocketTextExecuter(e.data);
                }
            }
        }
    } else {
        alert('当前浏览器不支持WebSocket 请更换浏览器');
    }
}

function setUsernameFromLocalStorage() {
    this.username = localStorage.getItem("username");
    this.server = localStorage.getItem("server");
}

function checkCloudCopyThread() {
    websocket.send("GCSC02{\"username\":" + username + ",\"context\":\"null text\"}EE");
}

function websocketTextExecuter(message) {
    addCard(1, "blue", "WeCopy", message);
}

function addCard(id, color, title, text) {
    var html = document.createElement("div");
    html.innerHTML = '<div class=\"valign-wrapper\"' + 'id=' + id + '><div class=\"row\"><div class=\"col s12 m12\"><div class=\"card ' + color + '\"><div class=\"card-content white-text\"><span class=\"card-title">' + title + '</span><p>' + text + '</p></div><div class=\"card-action right-align\"><a href=\"#\">复制</a></div></div></div></div></div>'
    document.body.appendChild(html);
}