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