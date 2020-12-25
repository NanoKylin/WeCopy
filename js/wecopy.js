var websocket = null;
var server = null;
var username = null;

function login() {
    server = document.getElementById("server").value;
    username = document.getElementById("username").value;
    //判断当前浏览器是否支持WebSocket  
    if ('WebSocket' in window) {
        websocket = new WebSocket("ws://" + server);
        websocket.onopen = e => {
            console.log('连接成功', e);
            websocket.send("GCSC01{\"username\":" + username + ",\"password\":\"null text\"}EE"); // 客户端与服务器端通信
            websocket.onmessage = e => {
                if (e.data == "GCSS01{\"context\":\"LOGIN SUCCESSFUL\"}EE") {
                    window.location.replace("./main.html")
                } else {
                    alert("登陆失败 请检查服务器地址和密码");
                }
            }
        }
    } else {
        alert('当前浏览器不支持WebSocket 请更换浏览器');
    }
}

function loadDefaultCopy() {
    document.write("<div class=\"row\"><div class=\"col s12 m6\"><div class=\"card blue-grey darken-1\"><div class=\"card-content white-text\"><span class=\"card-title\">卡片标题</span><p>我是一个很简单的卡片。我很擅长于包含少量的信息。我很方便，因为我只需要一个小标记就可以有效地使用。</p></div><div class=\"card-action\"><a href=\"#\">这是一个链接</a><a href=\"#\">这是一个链接</a></div></div></div></div>")
}