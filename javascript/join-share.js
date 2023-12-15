'use strict';

window.addEventListener('load', () => {
    let token = localStorage.getItem('token');

    // 共享画板
    let ws1 = null;
    let senderId = localStorage.getItem('senderId');

    //判断当前浏览器是否支持WebSocket
    if ('WebSocket' in window) {
        ws1 = new WebSocket("ws://8.134.176.185:8866/instant/draw/" + token);
    } else {
        console.log("Don't support websocket!")
    }
    //连接发生错误的回调方法
    ws1.onerror = function () {
        console.log("Connect error!");
    };

    //连接成功
    ws1.onopen = function (event) {
        console.log('sucess');
        
        //发送已进入的信息给对方
        let sends = {
            "toId": `${senderId}`,
            "message": "sucess"
        };
        console.log(senderId);
        let sendsString = JSON.stringify(sends);
        ws1.send(sendsString);
    }

    //接收到消息的回调方法
    ws1.onmessage = function (event) {
        let result = event.data;
        let ob = JSON.parse(result);
        //判断用户状态
        if (ob.state != undefined && ob.state != "success") {
            console.log("非法连接！");
            ws1.close();
        }
        //判断是否有消息
        if (ob.msg != undefined) {
            // alert(ob.msg);
        }
    }
    //连接关闭的回调方法
    ws1.onclose = function () {
        console.log('close')
    }
    //监听窗口关闭事件，当窗口关闭时，主动去关闭ws1连接，防止连接还没断开就关闭窗口，server端会抛异常。
    window.onbeforeunload = function () {
        ws1.close();
    }

    





    //画板
    //展开工具栏
    const spreadBtn = document.querySelector('.drawing-board .spread');
    const toolBox = document.querySelector('.tool-box');//工具栏
    spreadBtn.addEventListener('click', () => {
        toolBox.classList.toggle('spread-box');
        spreadBtn.classList.toggle('shrank');
    })

    //画板切换
    let i = 0;//点击次数
    const preBtn = document.querySelector('.pre');//上一页
    const nextBtn = document.querySelector('.next');//下一页按钮
    const finish = document.querySelector('.finish');//完成按钮
    const tips = document.querySelectorAll('.tip');//提示图标
    const tipText = document.querySelector('.join-share .drawing-board .tip-text');//提示文字
    const canvasBox = document.querySelectorAll('.canvas');


    //改变提示
    let turn = index => {
        tips[index].classList.add(`active${index}`);
        canvasBox[index].classList.add('show5');
        if (index === 0) {
            tipText.innerHTML = '请 画 出 T A 的 画 像 ';
        } if (index === 1) {
            tipText.innerHTML = '请 画 出 T A 的 性 格 '
        } if (index === 2) {
            tipText.innerHTML = '请 画 出 T A 的 职 业 '
        }
    }

    //返回按钮
    preBtn.addEventListener('click', () => {
        i--;
        
        if(i === 1){
            type = 'character';
        }
        if (i <= 0) {
            preBtn.classList.remove('show');
        }
        if (i <= 1) {
            nextBtn.classList.add('show');
        }
        finish.classList.remove('show2');
        if(document.querySelector(`.tips .active${i+1}`)){
            document.querySelector(`.tips .active${i+1}`).classList.remove(`active${i+1}`);
        }
        //画板
        document.querySelector('.show5').classList.remove('show5');
        //改变颜色
        turn(i);

        let sends = {
            "toId": `${senderId}`,
            "message": "pre"
        };
        let sendsString = JSON.stringify(sends);
        ws1.send(sendsString);
    })

    //点击下一页按钮
    nextBtn.addEventListener('click', () => {
        i++;
        document.querySelector('.show5').classList.remove('show5');
        if(i === 1){
            type = 'character';
        }
        if(i === 2){
            type = 'job';
        }
        if (i >= 1) {
            preBtn.classList.add('show');
        }
        if (i >= 2) {
            nextBtn.classList.remove('show');
            finish.classList.add('show2');
        }
        if(document.querySelector(`.tips .active${i-1}`)){
            document.querySelector(`.tips .active${i-1}`).classList.remove(`active${i-1}`);
        }
        //改变颜色
        turn(i);

        let sends = {
            "toId": `${senderId}`,
            "message": "next"
        };
        let sendsString = JSON.stringify(sends);
        ws1.send(sendsString);
    })



    

    //画板
    // 1.获取canvas
    let canvas1 = document.querySelector('#c1');
    let canvas2 = document.querySelector('#c2');
    let canvas3 = document.querySelector('#c3');

    let pictures = [];//存放画像的数组





    const showColor = document.querySelector('.color-tool .show-color');//显示颜色的圆
    const colorBox = document.querySelector('.color-tool');//颜色选择 最外层盒子

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

    let fristDraw = true;//判断是否为第一次点击（第一次点击就开始将“对方已进入”的提示改为正在绘画的提示

    //封装画板函数
    let painting = (canvas,id) => {
        
        //获取画笔
        let ctx = canvas.getContext('2d');

        ctx.lineJoin = 'round';//让连接处圆润
        ctx.lineCap = 'round';//开端和结束端也是圆的

        //画笔、橡皮选中样式
        let selClick = (item) => {
            item.addEventListener('click', () => {
                if(document.querySelector('.active')){
                    document.querySelector('.active').classList.remove('active');
                }
                item.classList.add('active');
            })            
        }
        selClick(boldBtn);
        selClick(clearBtn);

        
        //设置允许绘制的变量
        let isDraw = false;

        let left = document.querySelector('.join-share-wrap').offsetLeft + canvas1.offsetLeft - canvas1.clientWidth * 0.5;//画板距离左边的 距离 (offosetLeft 还要减去transform：translaX(-50%)的)
        let top = document.querySelector(' .join-share-wrap').offsetTop + canvas1.offsetTop;//画板距离上方的距离
        canvas.addEventListener('mousedown', e => {  

            if(isClick)return
            let x = e.pageX - left;
            let y = e.pageY - top;
            ctx.moveTo(x, y);

            if(fristDraw){//判断为第一次点击
                //第一次点击时发送
                let sends = {
                    "toId": `${senderId}`,
                    "message": "start",
                    "x": x,
                    "y": y,
                    "canvasId":`${id}`,
                    "firstDraw": 'true'
                };
                let sendsString = JSON.stringify(sends);
                ws1.send(sendsString); 

                fristDraw = false;
            }else{
                let sends = {
                    "toId": `${senderId}`,
                    "message": "start",
                    "x": x,
                    "y": y,
                    "canvasId":`${id}`
                };
                let sendsString = JSON.stringify(sends);
                ws1.send(sendsString);                  
            }

            isDraw = true;
            ctx.beginPath(); 
        })

        canvas.addEventListener('mouseleave', e => {
            //发送坐标信息
            let x = e.pageX - left;
            let y = e.pageY - top;
            let sends = {
                "toId": `${senderId}`,
                "message": "over",
                "x": x,
                "y": y,
                "canvasId":`${id}`
            };
            let sendsString = JSON.stringify(sends);
             ws1.send(sendsString);
             console.log('mouseleave');

            isDraw = false;
            ctx.closePath();
        })
        canvas.addEventListener('mouseup', e => {
            //发送坐标信息
            let x = e.pageX - left;
            let y = e.pageY - top;
            let sends = {
                "toId": `${senderId}`,
                "message": "over",
                "x": x,
                "y": y,
                "canvasId":`${id}`
            };
            let sendsString = JSON.stringify(sends);
             ws1.send(sendsString);
             console.log('mouseup');

            isDraw = false;
            ctx.closePath();

        })

        canvas.addEventListener('mousemove', e => {
            if (isDraw) {
                let x = e.pageX - left;
                let y = e.pageY - top;
                //发送坐标信息
                let sends = {
                    "toId": `${senderId}`,
                    "message": "你猜我显示不？",
                    "x": x,
                    "y": y,
                    "canvasId":`${id}`
                };
                let sendsString = JSON.stringify(sends);
                ws1.send(sendsString);
            console.log('mousemove');
                
                ctx.lineTo(x, y)
                ctx.stroke();

            }
        })
        
        //调整粗细
        let changeStick = () => {
            thickSelect[0].addEventListener('click',() => {
                ctx.lineWidth = 16; 
                let sends = {
                    "toId": `${senderId}`,
                    "message": "big",
                    "canvasId":`${id}`
                };
                let sendsString = JSON.stringify(sends);
                ws1.send(sendsString);
            })        
            thickSelect[1].addEventListener('click',() => {
                ctx.lineWidth = 8;
                let sends = {
                    "toId": `${senderId}`,
                    "message": "middle",
                    "canvasId":`${id}`
                };
                let sendsString = JSON.stringify(sends);
                ws1.send(sendsString);
            })     
            thickSelect[2].addEventListener('click',() => {
                ctx.lineWidth = 1;
                let sends = {
                    "toId": `${senderId}`,
                    "message": "small",
                    "canvasId":`${id}`
                };
                let sendsString = JSON.stringify(sends);
                ws1.send(sendsString);
            })            
        }
        changeStick();

        //画笔
        boldBtn.addEventListener('click', () => {
            ctx.globalCompositeOperation = 'destination-over';
            ctx.lineWidth = 1;
            changeStick();

            let sends = {
                "toId": `${senderId}`,
                "message": "pen",
                "canvasId":`${id}`
            };
            let sendsString = JSON.stringify(sends);
            ws1.send(sendsString); 
        })

        //橡皮擦
        clearBtn.addEventListener('click', () => {
            ctx.globalCompositeOperation = 'destination-out';
            ctx.lineWidth = 1;//默认为1
            //可选择调整画笔大小
            changeStick();
            let sends = {
                "toId": `${senderId}`,
                "message": "earsea",
                "canvasId":`${id}`
            };
            let sendsString = JSON.stringify(sends);
            ws1.send(sendsString);
        })


        //清空画板
        nullBtn.addEventListener('click', () => {
            ctx.clearRect(0, 0, 800, 600);

            //发送清空画板信息
            let sends = {
                "toId": `${senderId}`,
                "message": "clearAll",
                "canvasId":`${id}`
            };
            let sendsString = JSON.stringify(sends);
            ws1.send(sendsString);
        })


        //先把已有的图片放回数组
            if (localStorage.getItem('pictures')) {
                //将JSON格式转回来
                let p = JSON.parse(localStorage.getItem('pictures'));
                p.forEach((item,index) => {
                    pictures.push(item);
                })
            }
            
        //保存
        saveBtn.addEventListener('click', () => {
            let urlData = canvas.toDataURL(); //将当前图片上的数据转化为URL地址
            let img = new Image();
            let imgSrc = urlData;//图片地址
            
            //图片地址数组添加元素
            pictures.push(imgSrc);
            console.log(pictures);

            //以JSON形式存储 图片地址数组
            localStorage.setItem('pictures',JSON.stringify(pictures));
            // let downloadA = document.createElement('a');
            // downloadA.setAttribute('download', '画像');
            // downloadA.href = urlData;
            // downloadA.click();

        })

        //改变颜色
        let isClick = false;
        inputColor.addEventListener('click', e => {
            ctx.globalCompositeOperation = 'destination-over';
            e.stopPropagation();
            isClick = true;
        })
        document.addEventListener('mousedown', () => {
            ctx.strokeStyle = inputColor.value;
            //圆形显示所选颜色
            showColor.style.backgroundColor = inputColor.value;
            if(!isClick)return
            let sends = {
                "toId": `${senderId}`,
                "message": "color",
                "color": `${inputColor.value}`,
                "canvasId":`${id}`
            };
            let sendsString = JSON.stringify(sends);
            ws1.send(sendsString);
            isClick = false
        })
        //点击最外侧就调用点击事件（因为input被上面圆形盖住了，但这样点击没被盖住的部分可能会调用两次？
        colorBox.addEventListener('click', () => {
            inputColor.click();
        })
    }

    painting(canvas1,1);
    painting(canvas2,2);
    painting(canvas3,3);























    let type = 'character';

    //关键词
    const moreKeyWords = document.querySelector('.mian-word .more');//加号 按钮
    const inputMore = document.querySelector('.edit-box');//“更多”深入盒子
    const sendMore = document.querySelector('.join-share .edit-box button ');
    const moreInput = document.querySelector('.join-share .edit-box .edit');//自定义输入框
    const mainBox = document.querySelector('.mian-word');//关键词盒子

    let words = [];//存关键词
    let roomCode = [`${localStorage.getItem('roomCode')}`];//邀请码

    //点击删除关键词
    let del = () => {
        const keyWords = document.querySelectorAll('.mian-word .key-word');//关键词
        for(let i = 0;i<keyWords.length;i++){
            keyWords[i].addEventListener('click', e => {
                //是否点击删除按钮
                if (e.target.classList.contains('del')) {
                    //删除节点
                    mainBox.removeChild(keyWords[i]);
                }
                //点击后从关键词从数组中移出（重新发送数据)
                words.splice(i,1);
                axios({
                    method: 'POST',
                    url: 'http://8.134.176.185:8866/room/set_guess' + type,
                    headers: {
                        'Content-Type': 'application/json',
                        'token': `${token}`
                    },
                    data: {
                        words,
                        roomCode
                    }
                }).then(result => {

                })
            })
        }
    }

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

    //输入框出现
    moreKeyWords.addEventListener('click', () => {
        inputMore.classList.add('input-more');
    })
    //点击发送后输入框消失，清空输入框
    sendMore.addEventListener('click', () => {
        if (moreInput.value != '') {
            //添加关键词
            let keyWord = document.createElement('div');
            keyWord.classList.add('key-word');
            keyWord.innerHTML = `${moreInput.value}<div class="del">×</div>`;
            mainBox.insertBefore(keyWord, mainBox.children[mainBox.children.length - 1]);
            words.push(`${moreInput.value}`);//关键词数组添加关键词
            console.log(roomCode);
            axios({
                method: 'POST',
                url: 'http://8.134.176.185:8866/room/set_guess/'+type,
                headers: {
                    'Content-Type': 'application/json',
                    'token': `${token}`
                },
                data: {
                    words,
                    roomCode
                }
            }).then(result => {
                console.log(result);
                // alert(111);
            }).catch(error => {
                console.log(error);
            })

            inputMore.classList.remove('input-more');//输入框消失
            moreInput.value = '';//清空输入框

            //数量达到五个，不能再添加
            limit();
            del();//点击删除
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
    const sendBtn = document.querySelector('.join-share .send ');//发送按钮

    const emojiIcon = document.querySelectorAll('.emoji-tools .tool-icon');//表情包

    //发送信息

    let websocket = null;

    //判断当前浏览器是否支持WebSocket
    if ('WebSocket' in window) {
        websocket = new WebSocket("ws://8.134.176.185:8866/room/" + localStorage.getItem('invitationCode'));
    } else {
        // alert("Don't support websocket!")
    }

    //连接发生错误的回调方法
    websocket.onerror = function () {
        // alert("Connect error!");
    };

    //连接成功建立的回调方法
    websocket.onopen = function (event) {
        // alert("连接已建立！");
    }

    //接收到消息的回调方法
    websocket.onmessage = function (event) {

        let result = event.data;
        console.log(result);
        let ob = JSON.parse(result);


        
        //判断对方已离开
        if (ob.message == "房主离开房间") {
            tipText.innerHTML = '对 方 已 离 开 ~';
        }



        //判断用户状态
        if (ob.state != undefined && ob.state != "success") {
            // alert("非法连接！")
            websocket.close();
        }
        //判断是否有消息
        if (ob.msg != undefined) {
            // alert(ob.msg);
        }

        //渲染对方的信息
        if(ob.fromId === 1){
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

    //连接关闭的回调方法
    websocket.onclose = function () {
        localStorage.removeItem('invitationCode');
        localStorage.removeItem('receiverId');
        localStorage.removeItem('senderId');
        localStorage.removeItem('roomCode');
        // setMessageInnerHTML("close");
        // alert('close');
    }

    //监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
    window.onbeforeunload = function () {
        websocket.close();

        //移除房间号
        localStorage.removeItem('invitationCode');
        localStorage.removeItem('receiverId');
        localStorage.removeItem('senderId');
    }


    // //关闭连接
    // function closeWebSocket() {
    //     websocket.close();
    // }




    sendBtn.addEventListener('click', () => {
        if (diaInput.value != '') {

            //发送信息
            let id = 0;//代表不是房主
            let sendMsg = diaInput.value;
            let a = JSON.stringify({ "fromId": id, "message": sendMsg });
            websocket.send(a);


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
        if(e.keyCode === 13){
            sendBtn.click();
        }
    })






















































































    //揭晓关键词盒子

    const closeAnsBtn = document.querySelector('.keyword-answer-box .close-btn');//关闭按钮
    const keywordAnsBox = document.querySelector(' .keyword-answer-box');//答案盒子
    const keywordBoxWrap = document.querySelector('.keyword-answer-wrap');//wrap

    //点击完成后出现
    const finishBtn = document.querySelector('.drawing-board .finish');
    finishBtn.addEventListener('click', () => {
        //点击完成，向对方发送信息，对方出现“揭晓答案”盒子
        let sends = {
            "toId": `${senderId}`,
            "finish": "true"
        };
        let sendsString = JSON.stringify(sends);
        ws1.send(sendsString); 

        keywordBoxWrap.classList.add('show6');
    })
    document.querySelector('.next-sel').addEventListener('click',() => {
        keywordBoxWrap.classList.remove('show6');
    })
    //关闭
    keywordAnsBox.addEventListener('click', e => {
        if (e.target === closeAnsBtn) {
            keywordBoxWrap.classList.remove('show6');
        }
    })















    // //禁止缩放
    // //键盘
    // document.addEventListener('keydown', function (event) {
    //     if (event.ctrlKey === true || event.metaKey === true) {
    //         event.preventDefault();
    //     }
    // }, false);
    // //鼠标滚轮
    // document.body.addEventListener('wheel', (e) => {
    //     if (e.ctrlKey) {
    //         if (e.deltaY < 0) {
    //             e.preventDefault();
    //             return false;
    //         }
    //         if (e.deltaY > 0) {
    //             e.preventDefault();
    //             return false;
    //         }
    //     }
    // }, { passive: false });


})































    // //选择表情并发送
    // emojiIcon.forEach((item,index) => {
    //     item.addEventListener('click',() => {
    //         let a = document.createElement('li');
            // alert();
    //         a.innerHTML = `<div class="tool-icon"></div>`;

    //     })
    // })

    //渲染聊天记录


    // //渲染聊天记录
    // // let token = `eyJhbGciOiJIUzI1NiJ9.eyJpZCI6NSwiZXhwIjoxNzAyODIyMjQzfQ.sUeuUiA3qBornB_pDW9DJPhahMKeP6pyTFtfuXpGI_Y`;
    // let showDialogue = () => {
    //     axios({
    //         method: 'POST',
    //         url: 'http://8.134.176.185:8866/chat',
    //         data: {
    //             "toId": 1
    //         },
    //         headers: {
    //             'Content-Type': 'application/json',
    //             'token': `${token}`
    //         }
    //     }).then(result => {
    //         console.log(result);
            // alert(111);
    //         // console.log(result.data.data.recipients);
    //         // console.log(result.data.data.senders.length);
    //         // console.log(result.data.data.senders[0].timestamp);
    //         // let i = 0;
    //         // let j = 0;
    //         // for(let i = 0;i<result.data.data.senders.length,i++){

    //         // }
    //         let reMsg = result.data.data.recipients;//对方信息数据
    //         let reTime = [];//对法发送的时间
    //         let reCont = [];//对法发送内容
    //         let seMsg = result.data.data.senders;//对方信息数据
    //         let seTime = [];//对法发送的时间
    //         let seCont = [];//对法发送内容
    //         for (let i = 0; i < reMsg.length; i++) {
    //             reTime.push(reMsg[i].timestamp);
    //             reCont.push(reMsg[i].messageContent);
    //         }
    //         console.log(reCont);
    //         for (let i = 0; i < seMsg.length; i++) {
    //             seTime.push(seMsg[i].timestamp);
    //             seCont.push(seMsg[i].messageContent);
    //         }
    //         console.log(seCont);
    //         let i = 0;//对方消息的下标
    //         let j = 0;//我方消息的下标


    //         //比较时间先后
    //         function compareTime(time1, time2) {
    //             const date1 = new Date(time1);
    //             const date2 = new Date(time2);
    //             if (date1 < date2) {
    //                 return true;
    //             } else if (date1 > date2) {
    //                 return false;
    //             }
    //         }

    //         //比较后按时间顺序渲染
    //         while (i != reTime.length && j != seTime.length) {
    //             if (compareTime(reTime[i], seTime[j])) {//如果第一个在第二个之前
    //                 let li = document.createElement('li');
    //                 li.innerHTML = `
    //                     <div class="time">${reMsg[i].timestamp}</div>
    //                     <div class="msg-box">
    //                         <div class="profile"></div>
    //                         <div class="cont">${reMsg[i].messageContent}</div>                                            
    //                     </div>
    //                 `;
    //                 li.classList.add('msg');
    //                 li.classList.add('other-one');
    //                 diaBox.appendChild(li);

    //                 //比较下一个元素
    //                 i++;
    //             } else {
    //                 let li = document.createElement('li');
    //                 li.innerHTML = `
    //                 <div class="time">${seMsg[j].timestamp}</div>
    //                     <div class="msg-box">
    //                         <div class="cont">${seMsg[j].messageContent}</div>
    //                         <div class="profile">
    //                     </div>
    //                 </div>
    //                 `
    //                 li.classList.add('msg');
    //                 li.classList.add('self');
    //                 diaBox.appendChild(li);
    //                 j++;
    //             }
    //         }
    //         //渲染一个数组剩下的
    //         if (i < reTime.length) {
    //             for (let rest = i; rest < reTime.length; rest++) {
    //                 let li = document.createElement('li');
    //                 li.innerHTML = `
    //                 <div class="time">${reMsg[rest].timestamp}</div>
    //                 <div class="msg-box">
    //                     <div class="profile"></div>
    //                     <div class="cont">${reMsg[rest].messageContent}</div>                                            
    //                 </div>
    //                     `;
    //                 li.classList.add('msg');
    //                 li.classList.add('other-one');
    //                 diaBox.appendChild(li);
    //             }
    //         }
    //         if (j < seTime.length) {
    //             for (let rest = j; rest < reTime.length; rest++) {
    //                 let li = document.createElement('li');
    //                 li.innerHTML = `
    //                 <div class="time">${seMsg[rest].timestamp}</div>
    //                     <div class="msg-box">
    //                         <div class="cont">${seMsg[rest].messageContent}</div>
    //                         <div class="profile">
    //                     </div>
    //                 </div>
    //                 `
    //                 li.classList.add('msg');
    //                 li.classList.add('self');
    //                 diaBox.appendChild(li);
    //             }
    //         }
    //     })
    // }


    // showDialogue();


