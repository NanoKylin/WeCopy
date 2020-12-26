var websocket = null;
var server = null;
var username = null;

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
                    alert(e.data);
                }
            }
        }
    } else {
        alert('当前浏览器不支持WebSocket 请更换浏览器');
    }
}

function setUsernameFromLocalStorage() {
    alert(getClipboard());
    this.username = localStorage.getItem("username");
    this.server = localStorage.getItem("server");
}

function checkCloudCopyThread() {
    websocket.send("GCSC02{\"username\":" + username + ",\"context\":\"null text\"}EE");
}

/**
 * 读取剪切板内容
 */
function getClipboard() {
    if (window.clipboardData) {
        return (window.clipboardData.getData('Text'));
    } else if (window.netscape) {
        netscape.security.PrivilegeManager.enablePrivilege('UniversalXPConnect');
        var clip = Components.classes['@mozilla.org/widget/clipboard;1'].createInstance(Components.interfaces.nsIClipboard);
        if (!clip) return;
        var trans = Components.classes['@mozilla.org/widget/transferable;1'].createInstance(Components.interfaces.nsITransferable);
        if (!trans) return;
        trans.addDataFlavor('text/unicode');
        clip.getData(trans, clip.kGlobalClipboard);
        var str = new Object();
        var len = new Object();
        try {
            trans.getTransferData('text/unicode', str, len);
        } catch (error) {
            return null;
        }
        if (str) {
            if (Components.interfaces.nsISupportsWString) str = str.value.QueryInterface(Components.interfaces.nsISupportsWString);
            else if (Components.interfaces.nsISupportsString) str = str.value.QueryInterface(Components.interfaces.nsISupportsString);
            else str = null;
        }
        if (str) {
            return (str.data.substring(0, len.value / 2));
        }
    }
    return null;
}

function readClipboardData() {
    var str = getClipboard();
    var len = str.split("\n"); //获取行数

    document.getElementById("txtContent").value = str;
}