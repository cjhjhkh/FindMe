'use strict';

window.addEventListener('load', () => {
    let token = localStorage.getItem('token');

    const invitePlate = document.querySelector('.invite');//邀请按钮
    const inviteBox = document.querySelector('.invite-code-wrap');//提供验证码的盒子


    //验证码盒子关闭按钮
    const closeBtn = document.querySelector('.invite-code-wrap .close');
    inviteBox.addEventListener('click', e => {
        if (e.target === closeBtn) {
            inviteBox.classList.remove('show2');
        }
    })














    //聊天区

    // 点击出现表情包
    const emoji = document.querySelector('.send-box .emoj');//按钮
    const emojiBox = document.querySelector('.emoji-tools');//表情包盒子
    emoji.addEventListener('click', () => {
        emojiBox.classList.toggle('show4');
    })

    const diaBox = document.querySelector(' .dialogue-cont');//对话ul
    const diaInput = document.querySelector('.send-box .dialogue-input');//对话输入框
    const sendBtn = document.querySelector('.create-share .send ');//发送按钮

    //房间号
    let senderId = 0;
    let invitation = '';
    //点击邀请按钮，获取并弹出验证码
    invitePlate.addEventListener('click', () => {
        //获取
        axios({
            method: 'GET',
            url: 'http://8.134.176.185:8866/room/create',
            headers: {
                'Content-Type': 'application/json',
                'token': `${token}`
            }
        }).then(result => {

            // 获取、存储房间号
            invitation = result.data.data.invitationCode;
            senderId = result.data.data.senderId;

            //显示邀请码
            document.querySelector('.invite-code-box .code').innerHTML = invitation;
            document.querySelector('.invite-code-wrap .invite-code').innerHTML = `邀请码：${invitation}`

            //一键复制邀请码
            const copyTextCont = document.querySelector('.invite-code-wrap textarea ');//装复制内容
            const copyText = document.querySelectorAll('.invite-code-wrap .copy-text');//
            let p = '';
            for (let i = 0; i < copyText.length; i++) {
                p += copyText[i].innerHTML;
            }
            copyTextCont.innerHTML = p;//将所有要复制的内容放在textarea里

            const clipboard = new ClipboardJS('.copy', { text: () => copyTextCont.innerHTML });
            // clipboard.on('success', () => {
            //     console.log('数据已复制到剪切板');
            // })
            // clipboard.on('error', () => { console.log('!复制失败。') });



            //发送信息

            let ws = null;

            //判断当前浏览器是否支持WebSocket
            if ('WebSocket' in window) {
                ws = new WebSocket("ws://8.134.176.185:8866/room/" + invitation);
            } else {
                // alert("Don't support websocket!")
            }

            //连接发生错误的回调方法
            ws.onerror = function () {
                // alert("Connect error!");
            };

            //连接成功建立的回调方法
            ws.onopen = function (event) {
                // setMessageInnerHTML();
                // alert("连接已建立！");
            }

            //接收到消息的回调方法
            ws.onmessage = function (event) {

                let result = event.data;
                let ob = JSON.parse(result);

                //判断对方已离开
                if (ob.message == "用户离开房间") {
                    tipText.innerHTML = '对 方 已 离 开 ~';
                }

                //判断用户状态
                if (ob.state != undefined && ob.state != "success") {
                    ws.close();
                }
                //判断是否有消息
                if (ob.msg != undefined) {
                    // alert(ob.msg);
                }


                //渲染对方的信息
                if (ob.fromId === 0) {
                    let li = document.createElement('li');
                    li.innerHTML = `
                            <div class="time"></div>
                            <div class="msg-box">
                                <div class="profile"></div>
                                <div class="cont">${ob.message}</div>                                            
                            </div>
                        `;
                    li.classList.add('msg');
                    li.classList.add('other-one');
                    diaBox.appendChild(li);
                }
            }

            // 连接关闭的回调方法
            ws.onclose = function () {
                console.log('close');
            }

            //监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
            window.onbeforeunload = function () {
                websocket.close();
            }

            //发送消息
            sendBtn.addEventListener('click', () => {
                if (diaInput.value != '') {

                    //发送信息
                    let id = 1;//代表是房主
                    let sendMsg = diaInput.value;
                    let a = JSON.stringify({ "fromId": id, "message": sendMsg });
                    ws.send(a);


                    //渲染
                    let li = document.createElement('li');
                    li.innerHTML = `
                        <div class="time"> </div>
                            <div class="msg-box">
                                <div class="cont">${diaInput.value}</div>
                                <div class="profile">
                            </div>
                        </div>
                        `
                    li.classList.add('msg');
                    li.classList.add('self');
                    diaBox.appendChild(li);

                    diaInput.value = '';//输入框清空
                }
            })

            //点击回车键发送
            document.addEventListener('keydown', e => {
                if (e.keyCode === 13) {
                    sendBtn.click();
                }
            })



        })

        //邀请码框出现
        inviteBox.classList.add('show2');
    })


































    //共享画板


    //画板切换
    let i = 0;//点击次数
    const preBtn = document.querySelector('.pre');//上一页
    const nextBtn = document.querySelector('.next');//下一页按钮
    const tips = document.querySelectorAll(' .tip-box .tip');//提示图标
    const tipText = document.querySelector('.drawing-board .tip-text');//提示文字
    const canvasBox = document.querySelectorAll('.canvas');

    let type = 'character';

    //改变提示
    let turn = index => {
        tips[index].classList.add(`active${index}`);
        // alert(index);
        canvasBox[index].classList.add('show5');
        if (index === 0) {
            tipText.innerHTML = '对 方 正 在 描 绘 你 的 画 像 ';
        } if (index === 1) {
            tipText.innerHTML = '对 方 正 在 描 绘 你 的 性 格 '
        } if (index === 2) {
            tipText.innerHTML = '对 方 正 在 描 绘 你 的 职 业 '
        }
    }

    //返回按钮
    preBtn.addEventListener('click', () => {
        i--;

        if (i === 1) {
            type = 'character';
        }

        if (i <= 0) {
            preBtn.classList.remove('show');
        }
        if (i <= 1) {
            nextBtn.classList.add('show');
        }
        if (document.querySelector(`.tips .active${i + 1}`)) {
            document.querySelector(`.tips .active${i + 1}`).classList.remove(`active${i + 1}`);
        }
        //画板
        document.querySelector('.show5').classList.remove('show5');
        //改变颜色
        turn(i);

    })

    //点击下一页按钮
    nextBtn.addEventListener('click', () => {
        i++;

        if (i === 1) {
            type = 'character';
        }
        if (i === 2) {
            type = 'job';
        }

        document.querySelector('.show5').classList.remove('show5');
        if (i >= 1) {
            preBtn.classList.add('show');
        }
        if (i >= 2) {
            nextBtn.classList.remove('show');
        }
        if (document.querySelector(`.tips .active${i - 1}`)) {
            document.querySelector(`.tips .active${i - 1}`).classList.remove(`active${i - 1}`);
        }
        //改变颜色
        turn(i);
    })


    //获取canvas画布和绘制的对象
    let canvas1 = document.querySelector('#c1');
    let canvas2 = document.querySelector('#c2');
    let canvas3 = document.querySelector('#c3');



    let ws1 = null;

    //判断当前浏览器是否支持WebSocket
    if ('WebSocket' in window) {
        ws1 = new WebSocket("ws://8.134.176.185:8866/instant/draw/" + token);
    } else {
        // console.log("Don't support websocket!");
    }

    //连接发生错误的回调方法
    ws1.onerror = function () {
        console.log("Connect error!");
    };

    //连接成功建立的回调方法
    ws1.onopen = function (event) {
        console.log('sucess');
    };


    //画笔
    let boldBtn = document.querySelector('.pen');
    //粗细
    const thickSelect = document.querySelectorAll('.sel .thick');
    //颜色
    let inputColor = document.querySelector('.color')
    // 保存
    let saveBtn = document.querySelector('.save')
    // 橡皮擦按钮
    let clearBtn = document.querySelector('.eraser');
    // 清空画布
    let nullBtn = document.querySelector('.clear');



    //揭晓关键词按钮
    const showAnswer = document.querySelector('.show-answer');

    let isDraw = false; // 是否为第一个坐标
    //接收到消息的回调方法
    ws1.onmessage = function (event) {
        let result = event.data;
        let ob = JSON.parse(result);
        //判断用户状态
        if (ob.state != undefined && ob.state != "success") {
            ws1.close();
        }
        let obj = JSON.parse(ob.message);
        console.log(obj);


        //判断对方是否进入
        if (obj.message == "sucess") {
            tipText.innerHTML = '对 方 已 进 入 ';
        }
        //判断对方刚开始绘画
        if (obj.firstDraw == "true") {
            tipText.innerHTML = '对 方 正 在 描 绘 你 的 画 像 ';
        }


        //选择画板绘画
        let getCanvas = (canvas) => {
            let x = ob.x;
            let y = ob.y;
            let ctx = canvas.getContext('2d');
            ctx.lineJoin = 'round';//让连接处圆润
            ctx.lineCap = 'round';//开端和结束端也是圆的
            if (obj.message == "start") {//对方鼠标按下
                isDraw = true;
                ctx.beginPath();
                ctx.moveTo(x, y);
            }
            if (obj.message == "over") {//鼠标离开、鼠标抬起
                isDraw = false;
                ctx.closePath();
                return;
            }
            if (isDraw) {
                ctx.lineTo(x, y);
                ctx.stroke();
            }

            //同步画笔颜色
            if (obj.message == "color") {
                isDraw = true;
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.strokeStyle = obj.color;
            }

            //调整粗细
            let changeStick = () => {
                if (obj.message == "big") {
                    ctx.lineWidth = 16;
                }
                if (obj.message == "middle") {
                    ctx.lineWidth = 8;
                }
                if (obj.message == "small") {
                    ctx.lineWidth = 1;
                }
            }
            changeStick();

            //画笔
            boldBtn.addEventListener('click', () => {
                ctx.globalCompositeOperation = 'destination-over';
                ctx.lineWidth = 1;
            })

            //橡皮擦
            clearBtn.addEventListener('click', () => {
                ctx.globalCompositeOperation = 'destination-out';
                ctx.lineWidth = 1;
            })


            //对方点击画笔
            if (obj.message == "pen") {
                boldBtn.click();
                // changeStick();
            }

            //对方点击橡皮擦
            if (obj.message == "earsea") {
                clearBtn.click();
            }

            //清空
            if (obj.message == "clearAll") {
                ctx.clearRect(0, 0, 800, 600);
                return
            }



            //保存(将图片地址放在数组里存在本地，在个人主页获取)
            saveBtn.addEventListener('click', () => {
                let urlData = canvas.toDataURL(); //将当前图片上的数据转化为URL地址
                let base64 = urlData.split(',')[1];

                console.log(base64);

                //上传
                axios({
                    method: 'PUT',
                    url: 'http://8.134.176.185:8866/room/save',
                    headers: {
                        'Content-Type': 'application/json',
                        'token': `${token}`
                    },
                    data: {
                        "invitationCode": `${invitation}`,
                        "whiteboard": `${base64}`
                    }
                }).then(result => {
                    console.log(result);
                    // alert(111);
                }).catch(error => {
                    console.log(error);
                })
            })
        }
        //判断对方点击的是哪个画板，这边就画哪个
        if (obj.canvasId === '1') {
            getCanvas(canvas1);
        }
        if (obj.canvasId === '2') {
            getCanvas(canvas2);
        }
        if (obj.canvasId === '3') {
            getCanvas(canvas3);
        }

        //画板同步切换
        if (obj.message == "next") {//切换下一个画板
            nextBtn.click();
        }
        if (obj.message == "pre") {//切换上一个画板
            preBtn.click();
        }


        //对方点击完成后，这边出现揭晓答案的按钮
        if (obj.finish == "true") {
            showAnswer.classList.add('active-show-answer');
            tipText.innerHTML = '对 方 已 完 成 绘 画 ';
        }

    }

    //连接关闭的回调方法
    ws1.onclose = function () {
        console.log('close');
    }

    //监听窗口关闭事件，当窗口关闭时，主动去关闭ws1连接，防止连接还没断开就关闭窗口，server端会抛异常。
    window.onbeforeunload = function () {
        ws1.close();
    }






















    //揭晓关键词盒子

    const closeAnsBtn = document.querySelector('.keyword-answer-box .close-btn');//关闭按钮
    const keywordAnsBox = document.querySelector(' .keyword-answer-box');//答案盒子
    const keywordBoxWrap = document.querySelector('.keyword-answer-wrap');//wrap

    //一键揭晓
    const showAllBtn = document.querySelector('.keyword-answer-box .show-all');//一键揭晓按钮



    showAnswer.addEventListener('click', () => {
        keywordBoxWrap.classList.add('show6');
    })

    //关闭
    keywordAnsBox.addEventListener('click', e => {
        if (e.target === closeAnsBtn) {
            keywordBoxWrap.classList.remove('show6');
        }
    })


    //刮开揭晓答案
    const scratch1 = document.querySelector('#k1');
    const scratch2 = document.querySelector('#k2');
    let aa = canvas => {
        let ctx1 = canvas.getContext('2d');
        ctx1.lineJoin = 'round';//让连接处圆润
        ctx1.lineCap = 'round';//开端和结束端也是圆的

        //刮开在图片
        let img = new Image();
        img.src = "./images/scratch.png";
        img.onload = function () {
            ctx1.drawImage(img, 0, 0, 364, 106);
        };

        //点击移动可以刮
        let isDraw1 = false;
        canvas.onmousedown = function () {
            isDraw1 = true;
        }
        canvas.onmouseup = function () {
            isDraw1 = false;
        }
        canvas.onmousemove = function (e) {
            if (isDraw1) {
                let x = e.pageX - keywordAnsBox.offsetLeft - canvas.offsetLeft;
                let y = e.pageY - keywordAnsBox.offsetTop - canvas.offsetTop;
                ctx1.globalCompositeOperation = "destination-out"
                ctx1.arc(x, y, 15, 0, 2 * Math.PI);
                ctx1.fill();
            }
        }
        showAllBtn.addEventListener('click', () => { //一键刮开
            ctx1.clearRect(0, 0, 800, 600);
        });
    }
    aa(scratch1);
    aa(scratch2);










    // 猜关键词
    //关键词
    const moreKeyWords = document.querySelector('.mian-word .more');//加号 按钮
    const inputMore = document.querySelector('.edit-box');//“更多”深入盒子
    const sendMore = document.querySelector('.edit-box button ');
    const moreInput = document.querySelector('.edit-box .edit');//自定义输入框
    const mainBox = document.querySelector('.mian-word');//关键词盒子

    //数量达到五个，不能再添加
    let limit = () => {
        const keyWords = document.querySelectorAll('.mian-word .key-word');//关键词
        if (keyWords.length === 5) {
            moreKeyWords.classList.add('hide');
        } else {
            moreKeyWords.classList.remove('hide');
        }
        console.log(keyWords);
    }
    limit();


    //点击删除关键词
    let del = () => {
        const keyWords = document.querySelectorAll('.key-word');//关键词
        keyWords.forEach((item, index) => {
            item.addEventListener('click', e => {
                //是否点击删除按钮
                if (e.target.classList.contains('del')) {
                    //删除节点
                    mainBox.removeChild(item);
                }

                limit();
            })
        })
    }
    del();

    let roomCode = [];

    //输入框出现
    moreKeyWords.addEventListener('click', () => {
        inputMore.classList.add('input-more');
    })

    //点击发送后输入框消失，清空输入框
    sendMore.addEventListener('click', () => {
        if (moreInput.value != '') {

            roomCode.push(invitation);

            //猜关键词
            let guess = [`${moreInput.value}`];//猜的关键词
            let type = 'character';

            axios({
                method: 'POST',
                url: 'http://8.134.176.185:8866/room/check_guess/' + type,
                headers: {
                    'Content-Type': 'application/json',
                    'token': `${token}`
                },
                data: {
                    guess,
                    roomCode
                }
            }).then(result => {
                console.log(result);
                // alert(111);
                console.log('a3:' + moreInput.value);
                //添加关键词
                let keyWord = document.createElement('div');
                keyWord.classList.add('key-word');
                if (result.data.data.intersection != '') {//(正确)
                    keyWord.style = "background-color: #91d4ce; color: #fff;"
                    keyWord.innerHTML = `${moreInput.value}<div class="del">×</div>`;
                    mainBox.insertBefore(keyWord, mainBox.children[mainBox.children.length - 1]);
                } else {//(错误)
                    keyWord.style = "background-color: #FF9C9C; color: #fff;"
                    keyWord.innerHTML = `${moreInput.value}<div class="del">×</div>`;
                    mainBox.insertBefore(keyWord, mainBox.children[mainBox.children.length - 1]);
                }

                inputMore.classList.remove('input-more');//输入框消失
                moreInput.value = '';//清空输入框
                del();

            }).catch(error => {
                console.log(error);
            })

        }
    })
})