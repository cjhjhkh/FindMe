'use strict';


window.addEventListener('load', () => {
    let token = localStorage.getItem('token');

    const close1 = document.querySelector('.close1');
    //选择匹配模式
    const randomBtn = document.querySelector('.random-btn');//随机电波按钮
    const customBtn = document.querySelector('.custom-btn');//自定义电波按钮
    const selMod = document.querySelector('.sel-mod');//选择电波板块

    const customCont = document.querySelector('.custom-contain');//自定义mbti板块
    const mbtiItem = document.querySelectorAll('.mbti-item');//自定义mbti选项
    const enterBtn = document.querySelector('.custom-contain .enter');//自定义确认按钮

    const stars = document.querySelector('.stars');//星球板块
    const star = document.querySelectorAll('.star');//星球
    // const userMsg = document.querySelector('.user-msg');//个人信息卡

    const book = document.querySelector('.bridge-plate .self-evaluation');//绘本




    // //对方个人信息卡资料
    // const proHead = document.querySelector('.user-msg .user .head');//用户头像
    // const perMbti = document.querySelector('.correlation .left .mbti');//用户mbti
    // const interst = document.querySelector('.interest .icon-name');//兴趣爱好
    // const jobName = document.querySelector('.job .icon-name');//职业
    // const nickName = document.querySelector('.means .nick-name');//昵称
    // const motto = document.querySelector('.user-msg .user .means .motto');//个性签名


    // // 清除缓存（发送电波之前）
    // let clear = () => {
    //     axios({
    //         method: 'GET',
    //         url: 'http://8.134.176.185:8866/match',
    //     }).then(result => {
    //         console.log(result);
    //         // alert('clear');
    //     }).catch(error => {
    //         console.log(error);
    //     })
    // }


    // 自定义电波， 点击自定义按钮，出现mbti选项
    customBtn.addEventListener('click', () => {
        document.querySelectorAll('.star .intro').forEach(item => {
            item.style.opacity = 1;
        })
        customCont.classList.add('active1');

        //呈现表格选项（待完善
        axios({
            method: 'GET',
            url: 'http://8.134.176.185:8866/match/degree',
            headers: {
                'Content-Type': 'application/json',
                'token': `${token}`
            }
        }).then(result => {
            let obj = result.data.data//获取到的对象
            //转为键名组成的数组 key：键名 obj[key]:值
            Object.keys(obj).forEach((key, index) => {
                // console.log(`${key}, ${obj[key]}`);
                //渲染匹配度表格
                mbtiItem[index].innerHTML = `
                <div class="mbtiName">${key}</div>
                <div class="match">${obj[key]}%</div>
            `
            });
        })


        //用户选择mbti

        let mbtiArr = [];//存放已选mbti
        let sum = 0;//选择次数

        //只能选1-5个（待完善

        mbtiItem.forEach((item, index) => {
            let clickSum = 0;//点击次数
            let flag = false;//判断是否选中
            item.addEventListener('click', () => {//点击奇数次为选中
                sum++;//选中题目数量
                clickSum++;//点击次数加一
                //点击后样式改变
                item.classList.toggle('select');

                if (clickSum % 2 === 1) {//点击奇数次为选中
                    flag = true;//选中
                }
                else {//点击偶数次为取消选中，从数组中移出，选中题目数减一
                    flag = false;
                    sum--;
                    mbtiArr.splice(index, 1)
                    // mbtiArr.pop(document.querySelectorAll('.mbtiName')[index].innerHTML);
                }

                if (sum <= 5 && flag) {
                    mbtiArr.push(document.querySelectorAll('.mbtiName')[index].innerHTML);
                }
                console.log(mbtiArr);
            })
        })

        //发送 获取mbti用户数据
        let MBTI = mbtiArr;//所选mbti数组
        enterBtn.addEventListener('click', () => {
            let status1 = ['1'];
            let getCustoms = (status) => {
                axios({
                    method: 'POST',
                    url: 'http://8.134.176.185:8866/match',
                    data: {
                        MBTI,
                        status
                    },
                    headers: {
                        'token': token
                    }
                }).then(result => {
                    console.log(result);
                    // alert('自定义电波， 渲染对方个人信息卡');
                    //渲染对方个人信息卡
                    star.forEach((item, index) => {
                        item.addEventListener('click', () => {
                            // proHead.innerHTML = //头像
                            // perMbti.innerHTML = result.data.data[index].mbti;//mbti
                            // nickName.innerHTML = result.data.data[index].username;//用户名
                            // jobName.innerHTML = result.data.data[index].job;//职业
                            // interst.innerHTML = result.data.data[index].interest;//兴趣爱好
                            // motto.innerHTML = result.data.data[index].signature;//签名
                        })
                    })

                })
            }
            getCustoms(status1);
            //在自定义电波里 点击“换一批”按钮
            const updataBtn = document.querySelector('.updata');
            updataBtn.addEventListener('click', () => {
                let status2 = ['0'];
                // randomBtn.click();
                getCustoms(status2);//更新五个随机用户
            })
        })

        //点击确定按钮后 
        showBox(enterBtn);
    })




    let getUser = () => {
        //随机电波，随机获取5个用户
        randomBtn.addEventListener('click', () => {

            // //清除缓存
            // clear();
            //随机电波里面获取五个随机用户
            let status1 = ['1'];
            let getRandoms = (status) => {
                // let status = ['1'];
                axios({
                    method: 'POST',
                    url: 'http://8.134.176.185:8866/match',
                    data: {
                        status
                    },
                    headers: {
                        'token': token
                    }
                }).then(result => {
                    console.log(result);
                    // alert('随机电波，渲染对方个人信息卡 ')
                    //渲染对方个人信息卡
                    star.forEach((item, index) => {
                        item.addEventListener('click', () => {
                            // proHead.innerHTML = //头像
                            // perMbti.innerHTML = result.data.data[index].mbti;//mbti
                            // nickName.innerHTML = result.data.data[index].username;//用户名
                            // jobName.innerHTML = result.data.data[index].job;//职业
                            // interst.innerHTML = result.data.data[index].interest;//兴趣爱好
                            // motto.innerHTML = result.data.data[index].signature;//签名
                        })
                    })
                })
            }
            getRandoms(status1);

            //在随机电波里 点击“换一批”按钮
            const updataBtn = document.querySelector('.updata');
            updataBtn.addEventListener('click', () => {
                let status2 = ['0'];
                // randomBtn.click();
                getRandoms(status2);//更新五个随机用户
            })
        })
    }
    randomBtn.addEventListener('click',() => {

        //点击随机不会出现那些mbti
        document.querySelectorAll('.star .intro').forEach(item => {
            item.style.opacity = 0;
        })
    })





    //选择之后 选择板块消失 星球板块出现
    let showBox = btn => {
        btn.addEventListener('click', () => {
            selMod.classList.add('turnSmall');
            setTimeout(() => {
                selMod.style.display = 'none';
                stars.style.display = 'block';
            }, 400);
        })
    }
    showBox(randomBtn);//点击随机按钮
    // showBox(customBtn)//点击绘本按钮


    // //点击关闭电波按钮
    const closeStar = document.querySelector('.close-star');
    closeStar.addEventListener('click', () => {
        //清除缓存
        // clear();
        selMod.style.display = 'flex';
        stars.style.display = 'none';
        selMod.classList.remove('turnSmall');
        // customCont.classList.remove('active');
        // alert(1);
        customCont.classList.remove('active1');
    })




    // //关闭信息卡
    // let closeBox = btn => {
    //     userMsg.addEventListener('click', e => {
    //         if (e.target === btn) {
    //             // userMsg.style.display = 'none';

    //             userMsg.classList.add('turnSmall2');
    //             setTimeout(() => {
    //                 userMsg.style.display = 'none';
    //                 // stars.style.display = 'block';
    //             }, 400);
    //         }
    //     })
    // }

    // closeBox(close1);









    // //原地更新
    // let updataUser = (starItem) => {
    //     // let token = 'eyJhbGciOiJIUzI1NiJ9.eyJpZCI6NSwiZXhwIjoxNzAyODIyMjQzfQ.sUeuUiA3qBornB_pDW9DJPhahMKeP6pyTFtfuXpGI_Y';
    //     axios({
    //         method: 'POST',
    //         url: 'http://8.134.176.185:8866/match/1',
    //         headers: {
    //             'Content-Type': 'application/json',
    //             'token': `${token}`
    //         }
    //     }).then(result => {
    //         console.log(result);
    //         // alert('原地更新');
    //         //starItem为所点击星球
    //         starItem.addEventListener('click', () => {
    //             // proHead.innerHTML = //头像
    //             perMbti.innerHTML = result.data.data.mbti;//mbti
    //             nickName.innerHTML = result.data.data.username;//用户名
    //             jobName.innerHTML = result.data.data.job;//职业
    //             interst.innerHTML = result.data.data.interest;//兴趣爱好
    //             motto.innerHTML = result.data.data.signature;//签名
    //         })
    //         console.log(result);
    //         // alert(111);
    //     }).catch(error => {
    //         console.log(error);
    //     })
    // }



    //绘本翻页

    const page = document.querySelectorAll('.page');//获取所有页面

    for (let i = 0; i < page.length; i++) {
        page[i].addEventListener('click', e => {
            if (i % 2 != 0) {//翻到上一页
                page[i].classList.remove(`turn-back-page${i}`);
                page[i - 1].classList.remove(`turn-front-page${i - 1}`);
            }
            if (i % 2 == 0) {//翻到下一页
                page[i].classList.add(`turn-front-page${i}`);
                page[i + 1].classList.add(`turn-back-page${i + 1}`);
            }

            //本子移动位置
            if (page[0].classList.contains('turn-front-page0')) {
                book.classList.add('move-book');
            }
            if (!page[0].classList.contains('turn-front-page0')) {
                book.classList.remove('move-book');
            }
            if (i == 6) {
                // 如果标签不在右边，就移除类
                // if (document.querySelector('.move-left')) {
                // setTimeout(() => {
                document.querySelector('.except-wrap').classList.add('move-left');
                document.querySelector('.reject-wrap').classList.add('move-left');
                // }, -3000)
                // }
                // if (!e.target.classList.contains('except') && !e.target.classList.contains('reject')) {
                // alert(1);
                book.classList.add('ro-book');//点击最后一页 回到中间

                const sum = document.querySelectorAll('.sum');
                let i = 0;

                // //最后一页切图
                let showSum = setInterval(() => {
                    i++;
                    if (document.querySelector('.show2')) {
                        const hideItem = document.querySelector('.show2');
                        hideItem.classList.remove('show2');
                        setTimeout(() => {
                            hideItem.style.display = 'none';
                        }, 2000);
                    }

                    sum[i].style.display = 'block';
                    setTimeout(() => {
                        sum[i].classList.add('show2');
                    }, 20);

                    if (i === 2) {
                        //图片播放结束清除定时器
                        clearInterval(showSum);
                        //书本回到一开始
                        setTimeout(() => {
                            book.classList.remove('ro-book');//回到中间
                            //翻回到第一页
                            for (let i = 7; i > 0; i -= 2) {
                                page[i].click();
                            }


                            //加动画（在1684行
                            document.querySelector('.except-wrap').classList.add('book-ani');
                            document.querySelector('.reject-wrap').classList.add('book-ani');

                            setTimeout(() => {
                                //如果标签不在右边，就移除类
                                if (document.querySelector('.move-left')) {
                                    document.querySelector('.except-wrap').classList.remove('move-left');
                                    document.querySelector('.reject-wrap').classList.remove('move-left');
                                }
                            }, 1000)

                        }, 1000);
                    }
                }, 2000);
                // }


            }
        })
    }




    //点击星球 出现个人信息
    const yes = document.querySelector('.except');//接受按钮
    const no = document.querySelector('.reject');//拒绝按钮
    star.forEach((item, index) => {
        item.addEventListener('click', () => {

            //如果标签不在右边，就移除类
            if (document.querySelector('.move-left')) {
                document.querySelector('.move-left').classList.remove('move-left');
            }
            //翻回到第一页(有可能上一次翻一半，防止此次打开是已经翻开的
            for (let i = 7; i > 0; i -= 2) {
                page[i].click();
            }
            //绘本出现
            book.style.display = 'block';

            // yes.innerHTML = '接受';
            // no.innerHTML = '拒绝';

            //点击接受，加入等待列表
            yes.addEventListener('click', () => {
                // yes.innerHTML = '已接受';


                //在好友列表添加
                const li = document.createElement('li');
                li.classList.add('awa-item');
                li.innerHTML = `
                    <img class="profile" src="./images/搞笑头像.png">
                    <div class="main-cont">
                        <div class="fix">
                            <div class="nick-name">nickName.innerHTML</div>
                            <div class="cond">等待验证</div>
                        </div>
                        <div class="apply">10我可以学</div>
                    </div>`;
                document.querySelector('.awa-item-box').appendChild(li);

                // setTimeout(() => {
                // close1.click();
                book.style.display = 'none';
                // }, 200);
                book.classList.remove('ro-book');//回到中间
                //翻回到第一页
                for (let i = 7; i > 0; i -= 2) {
                    page[i].click();

                }
                //原地更新
                // updataUser(item);
            })
            no.addEventListener('click', () => {
                // no.innerHTML = '已拒绝';
                // setTimeout(() => {
                // close1.click();
                book.style.display = 'none';

                // }, 200);

                //原地更新
                // updataUser(item);

            })

            //考虑点击接收拒绝要不要关闭
            // closeBox(yes);
            // closeBox(no);



        })
    })















    // 列表框

    //好友列表,等待列表 切换操作
    const turnAwait = document.querySelector('.await');//等待列表按钮
    const turnFri = document.querySelector('.friends');//好友列表按钮
    const slideBox = document.querySelector('.slide-box');//滑块

    turnFri.addEventListener('click', () => {
        slideBox.style.left = 1 + '%';
        document.querySelector('.awa').classList.remove('show1');

        // document.querySelector('.show1').classList.remove('show1');
        document.querySelector('.fri').classList.add('show1');
    })
    turnAwait.addEventListener('click', () => {
        // alert(1);
        slideBox.style.left = 48 + '%';
        document.querySelector('.fri').classList.remove('show1');

        // document.querySelector('.show1').classList.remove('show1');
        document.querySelector('.awa').classList.add('show1');
    })



    //展开申请内容
    //点击“展开”or“收起”   对应文本框移除or添加省略号样式
    const spreadBtn = document.querySelectorAll('.spread');//展开
    spreadBtn.forEach((item, index) => {
        item.addEventListener('click', () => {
            const textCont = document.querySelectorAll(`.apply`)[index];
            item.innerHTML == '展开' ? item.innerHTML = '收起' : item.innerHTML = '展开';
            textCont.classList.toggle('text-ellipsis');//classList.toggle(类）已经有该类则删除该类名,否则添加
        })
    })









    //点击好友列表出现对话框
    let dialogueBox = () => {
        let friSelect = document.querySelectorAll('.list-box .fri-item');//每一个好友
        let nick_nmae = document.querySelectorAll('.fix .nick-name');//列表里的昵称
        let diaArea = document.querySelector('.chat-box .dialogue-cont');//对话区域
        const tipDot = document.querySelectorAll('.text-box .msg-tip');//消息小红点
        //渲染对话框
        let showDia = selItem => {
            selItem.forEach((item, index) => {
                item.addEventListener('click', () => {
                    chatBox.style.display = 'block';   //点击列表中的好友 出现对话框
                    tipDot[index].style.display = 'none';
                    //显示对应昵称
                    document.querySelector('.chat-box .nickName-box .name').innerHTML = nick_nmae[index].innerHTML;//昵称
                    //显示与该好友聊天记录

                });

            })
        }

        showDia(friSelect);
    }



    //渲染好友列表
    let getFri = () => {
        axios({
            method: 'GET',
            url: 'http://8.134.176.185:8866/wave/query/friends',
            headers: {
                'Content-Type': 'application/json',
                'token': `${token}`
            }
        }).then(result => {
            // console.log(result.data.data[0].username);
            // alert('渲染好友列表');

            result.data.data.forEach((item, index) => {
                let li = document.createElement('li');
                li.classList.add('.fri-item');
                li.innerHTML = `
                    <li class="fri-item">
                    <img class="profile" src="./images/搞笑头像.png">
                    <div class="main-cont">
                        <div class="fix">
                            <div class="nick-name">${result.data.data[index].username}</div>
                            <div class="time">12:00</div>
                        </div>
                        <div class="text-box">
                            <div class="chat-cont text-ellipsis">我可以学我可以学我可以学我可以学我可以学我可以学我可以学</div>
                            <div class="msg-tip">1</div>
                        </div>
                    </div>
                </li>
                    `;
                document.querySelector('.fri-item-box').appendChild(li);

            })
            dialogueBox();//点击出现对话框
        })
    }
    getFri();//渲染好友列表




    //添加“等待列表”里的好友到“好友列表”

    let addFri = () => {
        const awaitList = document.querySelector('.awa-item-box');//等待列表
        const friList = document.querySelector('.fri-item-box');//好友列表
        const addFriBtn = document.querySelectorAll('.add-bgc1');//添加按钮


        addFriBtn.forEach((item, index) => {
            item.addEventListener('click', () => {

                awaitList.addEventListener('click', function (e) {
                    // 检查点击的元素是否为删除按钮
                    if (e.target.classList.contains('add-bgc1')) {
                        // 获取点击按钮所在的li元素
                        const listItem = e.target.closest('li');

                        // 删除li元素
                        if (listItem) {
                            awaitList.removeChild(listItem);
                            //在好友列表添加
                            const li = document.createElement('li');
                            li.classList.add('fri-item');
                            li.innerHTML = `
                        <img class="profile" src="./images/搞笑头像.png">
                        <div class="main-cont">
                            <div class="fix">
                                <div class="nick-name">Samuel Thibault</div>
                                <div class="time">12:00</div>
                            </div>
                            <div class="chat-cont">我可以学</div>
                        </div>`;
                            friList.appendChild(li);
                        }
                    }
                });
            })
        })

    }




    //获取等待我方“同意”的用户
    let getAwait = () => {
        axios({
            method: 'GET',
            url: 'http://8.134.176.185:8866/wave/query/wait',
            headers: {
                'Content-Type': 'application/json',
                'token': `${token}`
            }
        }).then(result => {
            // console.log(result.data.data[0].username);

            //添加在等待列表头部(data未渲染)
            result.data.data.forEach((item, index) => {
                const li = document.createElement('li');
                li.classList.add('awa-item');
                li.innerHTML = `
                <img class="profile" src="./images/搞笑头像.png">
                <div class="main-cont">
                    <div class="fix">
                        <div class="nick-name">${result.data.data[index].username}</div>
                        <div class="cond add-bgc1">添加</div>
                    </div>
                    <div class="text-box">
                        <div class="apply text-ellipsis">耶耶耶我可以学我可以学我可以学我可以学我可以学</div>
                        <div class="spread">展开</div>                                        
                    </div>
                </div>`;
                document.querySelector('.awa-item-box').prepend(li);
            })
            addFri();
        })
    }
    getAwait();















    // //渲染聊天记录
    // let showDialogue = () => {
    //     // btn.addEventListener('click', () => {
    //         axios({
    //             method: 'POST',
    //             url: 'http://8.134.176.185:8866/chat',
    //             data:{
    //                 "toId": 1 
    //             },
    //             headers: {
    //                 'Content-Type':'application/json',
    //                 'token':`${token}`
    //             }
    //         }).then(result => {
    //             console.log(result);
    // alert(111);
    //             // console.log(result.data.data.recipients);
    //             // console.log(result.data.data.senders.length);
    //             // console.log(result.data.data.senders[0].timestamp);
    //             // let i = 0;
    //             // let j = 0;
    //             // for(let i = 0;i<result.data.data.senders.length,i++){

    //             // }
    //         }).catch(error => {
    //             console.log(error);
    //         })
    //     // })
    // }


    // showDialogue();





    // //渲染聊天记录(未检查)
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
























    // 对话框


    //点击切换对话框大小
    const turnBig = document.querySelector('.full');//缩放按钮
    const chatBox = document.querySelector('.chat-box');//对话框
    turnBig.addEventListener('click', () => {
        chatBox.classList.toggle('active');
        turnBig.classList.toggle('.cancel');
    })






    // //拖拽
    const body = document.querySelector("body");
    // const container = document.querySelector(".container");
    // const chatBox = document.querySelector(".chatBox");
    let disX = null;
    let disY = null;

    const mousedown = (e) => {
        const { clientX, clientY } = e;
        const { top, left } = chatBox.getBoundingClientRect();
        disX = clientX - left;
        disY = clientY - top;
        body.addEventListener("mousemove", mousemove);
        body.addEventListener("mouseup", mouseup);
    };

    const mousemove = (e) => {
        const { clientX, clientY } = e;
        chatBox.style.left = `${clientX - disX}px`;
        chatBox.style.top = `${clientY - disY}px`;
    };

    const mouseup = () => {
        body.removeEventListener("mousemove", mousemove);
        body.removeEventListener("mouseup", mouseup);
    };

    chatBox.addEventListener("mousedown", mousedown);

    //关闭
    const closeBtn = document.querySelector('.chat-box .close');
    closeBtn.addEventListener('click', () => {
        chatBox.style.display = 'none';
    })































    // //发送信息
    // const sendMsg = document.querySelector('.send-msg');//发送按钮
    // const msgInput = document.querySelector('.msg-text');//输入框
    // const dialogue = document.querySelector('.dialogue-cont');//对话框









    // sendMsg.addEventListener('click', () => {

    //     //判断输入是否为空
    //     if(msgInput.value.trim() != ''){
    //         //创建
    //         const msg = document.createElement('self');
    //         msg.innerHTML = `
    //             <li class="msg self">
    //                 <div class="cont">${msgInput.value}</div>
    //                 <div class="profile"></div>
    //             </li>
    //             `
    //         dialogue.appendChild(msg);

    //         //发送后清除输入框内容
    //         msgInput.value = '';            
    //     }
    //     else{
    // alert('输入不能为空');
    //     }
    // })









    // //websocket


    // // eyJhbGciOiJIUzI1NiJ9.eyJpZCI6NSwiZXhwIjoxNzAyODIyMjQzfQ.sUeuUiA3qBornB_pDW9DJPhahMKeP6pyTFtfuXpGI_Y
    // // 5
    // // eyJhbGciOiJIUzI1NiJ9.eyJpZCI6MSwiZXhwIjoxNzAyNjUzODIwfQ.50xv0SxjVAS1PdVizxTq9DF6tB8qsmwZOD7chQt1NlI
    // // 1
    // let websocket = null;

    // let userId = null;

    // //判断当前浏览器是否支持WebSocket
    // if ('WebSocket' in window) {
    //     websocket = new WebSocket("ws://8.134.176.185:8866/instant/draw/eyJhbGciOiJIUzI1NiJ9.eyJpZCI6NSwiZXhwIjoxNzAyODIyMjQzfQ.sUeuUiA3qBornB_pDW9DJPhahMKeP6pyTFtfuXpGI_Y");
    // }
    // else {
    // alert("Don't support websocket!")
    // }

    // //连接发生错误的回调方法
    // websocket.onerror = function () {
    // alert("Connect error!");
    // };

    // //连接成功建立的回调方法
    // websocket.onopen = function (event) {
    //     // setMessageInnerHTML("连接已建立！");
    // alert('链接已建立');
    // }

    // //接收到消息的回调方法
    // websocket.onmessage = function (event) {

    //     let result = event.data;
    //     let ob = JSON.parse(result);
    //     //判断用户状态
    //     if (ob.state != undefined && ob.state != "success") {
    //         // setMessageInnerHTML("非法连接！");
    // alert('非法连接');
    //         websocket.close();
    //     }
    // alert(result);
    //     //判断是否有消息
    //     if (ob.msg != undefined) {
    //         // setMessageInnerHTML(ob.msg);
    // alert('有消息');
    //     }
    // }

    // //连接关闭的回调方法
    // websocket.onclose = function () {
    //     // setMessageInnerHTML("close");
    // alert('close');
    // }

    // //监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
    // window.onbeforeunload = function () {
    //     websocket.close();
    // }

    // //将消息显示在网页上
    // let showMsg = () => {
    //     //创建
    //     const msg = document.createElement('self');
    //     msg.innerHTML = `
    //             <li class="msg self">
    //                 <div class="cont">${msgInput.value}</div>
    //                 <div class="profile"></div>
    //             </li>
    //             `
    //     dialogue.appendChild(msg);

    //     //发送后清除输入框内容
    //     msgInput.value = '';
    // }

    // //关闭连接
    // function closeWebSocket() {
    //     websocket.close();
    // }

    // //发送消息
    // function send() {
    //     // var sendMsg = $("#sendMsg").val();
    //     showMsg();
    //     websocket.send(msgInput.value);
    // alert(1);
    //     // $("#sendMsg").val("");
    // }

    // sendMsg.addEventListener('click', () => {
    //     if (msgInput.value.trim() != '') {
    //         send();
    //     }
    // });
})