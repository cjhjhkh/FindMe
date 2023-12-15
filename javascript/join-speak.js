
window.addEventListener('load', () => {

    //点击开启or关闭语音
    const speakBtn = document.querySelector('.join-share .speak');

    //(默认关闭)
    let clickCount = 0;
    speakBtn.addEventListener('click', () => {
        clickCount++;

        if (clickCount % 2 != 0) {//点击为第单数次
            // alert(1);
            startAudio();//打开麦克风
        }
        else {//点击为第偶数次
            hangUp();//断开连接
            // alert(1);
        }
        //改变图标
        speakBtn.classList.toggle('close-speak');
    })



    //    获取随机id提供给后端
    let user = Math.round(Math.random() * 1000) + "";
    let socketUrl = "ws://192.168.22.164:8080/msgServer/" + user;
    // 192.168.137.1     本机ip
    // 记得关闭防火墙开热点，不能运行到服务器上


    let socket = null
    let socketRead = false

    socket = new WebSocket(socketUrl)
    socket.onopen = function () {
        console.log("成功连接到服务器...")
        socketRead = true
    }
    socket.onclose = function (e) {
        console.log('与服务器连接关闭: ' + e.code)
        socketRead = false
    }


    let isStream = false;

    // 点击后获取当前媒体流并且赋值给localStream里面
    let startAudio = () => {
        navigator.mediaDevices.getUserMedia(
        // navigator.webkitGetUserMedia(
            { audio: true },
            function (stream) { // success
                localStream = stream;
                isStream = true;
            },
            function (error) { // error
                console.error('发生了一个错误: [错误代码：' + error.code + ']');
                return;
            });
        socket.send('1');
    }

    // 信令转换，作为一个信令判断去调用返回sdp的函数
    socket.onmessage = function (res) {
        let evt = JSON.parse(res.data)
        console.log(evt)

        if (evt == '1') {
            connect();//建立连接
        }




        if (evt.type === 'offer') {
            console.log("接收到offer,设置offer,发送answer....")
            onOffer(evt);
        } else if (evt.type === 'answer' && peerStarted) {
            console.log('接收到answer,设置answer SDP');
            onAnswer(evt);
        } else if (evt.type === 'candidate' && peerStarted) {
            console.log('接收到ICE候选者..');
            onCandidate(evt);
        } else if (evt.type === 'bye' && peerStarted) {
            console.log("WebRTC通信断开");
            stop();
        }
    }
    // 上面是WebSocket的使用

    let localStream = null;
    let peerConnection = null;
    let peerStarted = false;
    // 设置音频
    let mediaConstraints = {
        'mandatory': {
            'OfferToReceiveAudio': true,
            'OfferToReceiveVideo': false
        }
    };

    //ice协议交换信息，获取到对方的后设置到自己的里面，然后发送回复
    // 整个流程a 发送offer并且包含sdp信息  b 接受设置，b发送answer   a 接受设置

    let onOffer = (evt) => {
        console.log("接收到offer...")
        console.log(evt);
        setOffer(evt);
        sendAnswer(evt);
        peerStarted = true
    }

    let onAnswer = (evt) => {
        console.log("接收到Answer...")
        console.log(evt);
        setAnswer(evt);
    }

    // 获得到对方的candidate后也要建立后添加到对等链接里面，相等与两边都需要添加对方的
    let onCandidate = (evt) => {
        let candidate = new RTCIceCandidate({
            sdpMLineIndex: evt.sdpMLineIndex,
            sdpMid: evt.sdpMid, candidate: evt.candidate
        });
        console.log("接收到Candidate...")
        console.log(candidate);
        peerConnection.addIceCandidate(candidate);
    }

    // 发送sdp
    let sendSDP = (sdp) => {
        let text = JSON.stringify(sdp);
        console.log('发送sdp.....')
        console.log(text);
        socket.send(text)
    }
    let sendCandidate = (candidate) => {
        let text = JSON.stringify(candidate);
        console.log(text);// "type":"candidate","sdpMLineIndex":0,"sdpMid":"0","candidate":"....
        socket.send(text)// socket发送
    }





    //这里不做ice服务器的设置
    let prepareNewConnection = () => {
        let pc_config = { "iceServers": [] };
        let peer = null;
        try {
            peer = new webkitRTCPeerConnection(pc_config);
        }
        catch (e) {
            console.log("建立连接失败，错误：" + e.message);
        }




        //1点击后还没有存到本地连接就放到通道上面
        //2已经获取但没有放到通道上面


        
        // 发送所有ICE候选者给对方
        peer.onicecandidate = function (evt) {
            if (evt.candidate) {
                console.log(evt.candidate);
                sendCandidate({
                    type: "candidate",
                    sdpMLineIndex: evt.candidate.sdpMLineIndex,
                    sdpMid: evt.candidate.sdpMid,
                    candidate: evt.candidate.candidate
                });
            }
        };
        // 但监听添加到本地流后创建网页元素音频并且设置自动播放
        peer.onaddstream = function (event) {
            const audio = document.createElement('audio');
            audio.srcObject = event.stream;
            audio.autoplay = true;
            document.body.appendChild(audio);
        };



        //好像加了定时器就没用了
        
        if (isStream) {
            // console.log('添加本地视频流...');
            peer.addStream(localStream)
        }
        // console.log('添加本地视频流...');

        return peer;
    }


    // 获取对等连接，(获取语音的媒体流
    let sendOffer = () => {
        peerConnection = prepareNewConnection();
        peerConnection.createOffer(function (sessionDescription) { //成功时调用
            peerConnection.setLocalDescription(sessionDescription);
            console.log("发送: SDP");
            console.log(sessionDescription);
            sendSDP(sessionDescription);
        }, function (err) {  //失败时调用
            console.log("创建Offer失败");
        }, mediaConstraints);
    }

    let setOffer = (evt) => {
        if (peerConnection) {
            console.error('peerConnection已存在!');
            return;
        }
        peerConnection = prepareNewConnection();
        peerConnection.setRemoteDescription(new RTCSessionDescription(evt));
    }

    let sendAnswer = (evt) => {
        console.log('发送Answer,创建远程会话描述...');
        if (!peerConnection) {
            console.error('peerConnection不存在!');
            return;
        }

        peerConnection.createAnswer(function (sessionDescription) {//成功时
            peerConnection.setLocalDescription(sessionDescription);
            console.log("发送: SDP");
            console.log(sessionDescription);
            sendSDP(sessionDescription);
        }, function () {
            console.log("创建Answer失败");
        }, mediaConstraints);
    }

    // 设置远程描述
    let setAnswer = (evt) => {
        if (!peerConnection) {
            console.error('peerConnection不存在');
            return;
        }
        peerConnection.setRemoteDescription(new RTCSessionDescription(evt));
    }

    // 开始建立连接
    let connect = () => {
        if (!peerStarted && socketRead && localStream) {
            sendOffer();
            peerStarted = true;
        } else {
            // alert("这个按钮只需要点一次获取，第二次会报错哦，请刷新");
        }
    }

    // 停止连接
    let hangUp = () => {
        console.log("挂断");
        stop();
    }

    let stop = () => {
        peerConnection.close();
        peerConnection = null;
        peerStarted = false;
    }
})



