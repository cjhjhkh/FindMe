// 'use strict';
window.addEventListener('load', () => {
    let token = localStorage.getItem('token');
    // const axiosInstance = axios.create({
    //     baseURL: 'http://8.134.176.185:8866'
    // })

    const page = document.querySelectorAll('.page');//所有页面
    const book = document.querySelector('.book');



    //书本中的提示宇航员
    const tip1 = document.querySelector('.book .tip1');
    const tip2 = document.querySelector('.book .tip2');


    //点击左右按钮翻页
    let turnPage = (pageIndex) => {

        //上一页按钮样式改变
        if (pageIndex === 6) {
            turnNextPage.classList.add('forbid');
        }
        else {
            turnNextPage.classList.remove('forbid');
        }


        if (pageIndex % 2 != 0) {//翻到上一页
            page[pageIndex].classList.remove(`turn-back-page${pageIndex}`);
            page[pageIndex - 1].classList.remove(`turn-front-page${pageIndex - 1}`);
        }
        if (pageIndex % 2 == 0) {//翻到下一页
            page[pageIndex].classList.add(`turn-front-page${pageIndex}`);
            page[pageIndex + 1].classList.add(`turn-back-page${pageIndex + 1}`);
        }

        //本子移动位置
        if (page[0].classList.contains('turn-front-page0')) {
            book.classList.add('move-book');
        }
        if (!page[0].classList.contains('turn-front-page0')) {
            book.classList.remove('move-book');
        }



        //点击任意位置继续
        let cliContinue = item => {
            document.addEventListener('click', () => {
                if (item.classList.contains('show')) {
                    item.classList.remove('show');//宇航员消失
                    // let a = setTimeout(() => {
                    item.style.display = 'none';
                    // }, 200)
                }

            })
        }
        //出现提示宇航员
        let showTip = (item) => {
            item.style.display = 'block';
            setTimeout(() => {
                item.classList.add('show');
                cliContinue(item);
            }, 1500)
        }
        if (pageIndex == 2) {
            showTip(tip1);
        }
        if (pageIndex == 4) {
            showTip(tip2);
        }


        if (pageIndex == 6) {


            book.classList.add('ro-book');//点击最后一页 回到中间

            const sum = document.querySelectorAll('.sum');
            let i = 0;

            //最后一页切图
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
                        for (let i = 0; i < 4; i++) {
                            turnPrePage.click();
                        }
                    }, 3000);
                }
            }, 2000);

        }
    }

    const turnNextPage = document.querySelector('.turn-next-page');
    const turnPrePage = document.querySelector('.turn-pre-page');

    let pageIndex = 1;//这里表示第几页，不是页面的下标
    turnNextPage.addEventListener('click', () => {
        if (pageIndex % 2 != 0) {//奇数
            turnPage(pageIndex - 1);//传下标
        }
        else {
            turnPage(pageIndex + 1 - 1);
        }
        pageIndex += 2;
    })

    turnPrePage.addEventListener('click', () => {
        if (pageIndex % 2 != 0) {//奇数
            turnPage(pageIndex - 1 - 1);
        } else {
            turnPage(pageIndex - 1);
        }
        pageIndex -= 2;
    })



    //第三页点击按钮后切换
    const changeBtn = document.querySelector('.change-btn');//切换按钮
    const slider = document.querySelector('.change-btn .slider');//按钮里的滑块
    const adv = document.querySelector('.adv'); //优势板块
    const disadv = document.querySelector('.disadv');//劣势板块
    let cliCount = 0;
    changeBtn.addEventListener('click', e => {
        cliCount++;
        e.stopPropagation();
        changeBtn.classList.toggle('active-btn');
        if (cliCount % 2 != 0) {//点击单数次切换为劣势
            document.querySelector('.show1').classList.remove('show1');
            disadv.classList.add('show1');

        } else {//切换为优势
            document.querySelector('.show1').classList.remove('show1');
            adv.classList.add('show1');
        }

    })







    // 绘画

    //工具
    const toolList = document.querySelector('.page4 .tool-list');//工具栏
    const draw = document.querySelector('.tool-list .draw');//绘画工具按钮
    const drawTools = document.querySelector('.tool-list .draw-tools')//绘画工具


    //选择工具
    toolList.addEventListener('click', e => {
        // e.stopPropagation();

        toolList.classList.add('spread-tool');//点击后展开工具栏

        if (e.target.classList.contains('tool')) {
            if (document.querySelector('.active')) {
                document.querySelector('.active').classList.remove('active');
            }
            e.target.classList.add('active');//按钮背景色改变/工具栏出现
        }

        if (e.target.classList.contains('close-list')) {
            toolList.classList.toggle('spread-tool');//关闭工具栏
        }

    })




    const nowCanvas1 = document.querySelector('#now');
    const futureCanvas1 = document.querySelector('#future');



    const tools = document.querySelector('.page6 .tool-list');
    const nowCanvas2 = document.querySelector('#now-job');
    const futureCanvas2 = document.querySelector('#future-job');

    //点击绘画按钮
    draw.addEventListener('click', e => {
        //点击出现绘画工具
        // drawTools.classList.add('show');



        //进行绘画

        const thickSelect = document.querySelectorAll('.pen-tool .tool-item');//三种粗细不同的画笔
        const colorBox = document.querySelector('.color-tool');//颜色选择 最外层盒子
        const inputColor = document.querySelector('.tool-list .draw-tools .color');//颜色选择
        const showColor = document.querySelector('.color-tool .show-color');//显示颜色的圆
        const clearBtn = document.querySelector('.page4 .earsea');//橡皮擦按钮
        const penBtn = document.querySelector('.page4 .pen');
        const nullBtn = document.querySelector('.page4 .clear');


        let left1 = document.querySelector('.main-cont').offsetLeft + book.offsetLeft - 13;
        // let left2 = document.querySelector('.main-cont').offsetLeft + book.offsetLeft;
        let left2 = left1 + 433;

        let top = book.offsetTop;

        const getCanvas = (canvas, left) => {
            const nowCtx1 = canvas.getContext('2d');//画笔
            nowCtx1.lineJoin = 'round';//让连接处圆润
            nowCtx1.lineCap = 'round';//开端和结束端也是圆的

            //设置允许绘制的变量
            let isDraw = false;
            // document.querySelector('.page4 .draw-tool').addEventListener('click', () => {

            // })
            canvas.addEventListener('mousedown', e => {
                let x = e.pageX - left;
                let y = e.pageY - top;
                nowCtx1.moveTo(x, y);
                isDraw = true;
                nowCtx1.beginPath();
            })
            canvas.addEventListener('mouseleave', e => {
                isDraw = false;
                nowCtx1.closePath();
            })
            canvas.addEventListener('mouseup', e => {
                isDraw = false;
                nowCtx1.closePath();

            })

            canvas.addEventListener('mousemove', e => {
                if (isDraw) {
                    let x = e.pageX - left;
                    let y = e.pageY - top;
                    nowCtx1.lineTo(x, y)
                    nowCtx1.stroke();
                }
            })




            //画笔粗细
            let changeStick = () => {
                let changeBgc = i => {
                    if (document.querySelector('.active')) {
                        document.querySelector('.active').classList.remove('active');
                    }
                    thickSelect[i].classList.add('active');
                }
                thickSelect[0].addEventListener('click', () => {
                    changeBgc(0);
                    nowCtx1.lineWidth = 1;
                })
                thickSelect[1].addEventListener('click', () => {
                    changeBgc(1);
                    nowCtx1.lineWidth = 8;
                })
                thickSelect[2].addEventListener('click', () => {
                    changeBgc(2);
                    nowCtx1.lineWidth = 16;
                })
            }
            changeStick();



            //改变颜色

            inputColor.addEventListener('click', e => {

                nowCtx1.globalCompositeOperation = 'destination-over';
                e.stopPropagation();
                document.addEventListener('mousedown', () => {
                    nowCtx1.strokeStyle = inputColor.value;

                    //圆形显示所选颜色
                    showColor.style.backgroundColor = inputColor.value;

                })
            })
            //点击最外侧就调用点击事件（因为input被上面圆形盖住了，但这样点击没被盖住的部分可能会调用两次？
            colorBox.addEventListener('click', () => {
                inputColor.click();
            })




            //橡皮擦
            clearBtn.addEventListener('click', () => {
                nowCtx1.globalCompositeOperation = 'destination-out';
                nowCtx1.lineWidth = 1;//默认为1
                //可选择调整画笔大小
                changeStick();
            })



            //画笔
            penBtn.addEventListener('click', () => {
                nowCtx1.globalCompositeOperation = 'destination-over';
                nowCtx1.lineWidth = 1;
                changeStick();
            })



            //清空
            nullBtn.addEventListener('click', () => {
                nowCtx1.clearRect(0, 0, 800, 600);
            })
        }

        getCanvas(nowCanvas1, left1);
        getCanvas(futureCanvas1, left2);



    })

    drawTools.addEventListener('click', e => {
        e.stopPropagation();
        //点击绘画工具中最上方一栏的工具，改变背景色
        if (e.target.classList.contains('bgc')) {
            if (document.querySelector('.active2')) {
                document.querySelector('.active2').classList.remove('active2');
            }
            e.target.classList.add('active2');
        }
    })








    //第二页点击加号出现输入框填写信息

    let showInput = item => {
        item.addEventListener('click', e => {
            if (e.target.classList.contains('add-box')) {
                let addInput = e.target.querySelector('input');
                addInput.classList.add('showInput');//输入框出现
                addInput.focus();//获取焦点
                addInput.addEventListener('blur', () => {
                    if (addInput.value.trim() === '') {//如果失去焦点时 无输入内容，则输入框消失
                        addInput.classList.remove('showInput');
                    }
                })
            }
        })
    }

    showInput(adv);
    showInput(disadv);




    //职业工具栏部分
    const jobList = document.querySelector('.page6 .tool-list');//工具栏
    const jobtool = document.querySelector(' .tool-list .tool ');//贴纸盒子
    const jobSel = document.querySelector('.page6 .job-sel');


    jobList.addEventListener('click', () => {
        jobSel.classList.toggle('active');
    })






    //拖到指定位置

    function allowDrop(ev) {
        ev.preventDefault();
    }

    function drag(ev) {
        ev.dataTransfer.setData("Text", ev.target.id);
    }

    function drop(ev) {
        ev.preventDefault();
        var data = ev.dataTransfer.getData("Text");
        ev.target.appendChild(document.getElementById(data));
    }

    const stickerList = document.querySelector('.tool-list .job .job-sel');//贴纸工具栏

    stickerList.addEventListener('dragstart', e => {
        if (e.target.classList.contains('sticker')) {
            drag(e);
        }
    })

    //获取所有被放置的盒子
    let stickerArea = document.querySelectorAll('.sticker-area:nth-child(1)');
    stickerArea.forEach(item => {
        item.addEventListener('drop', e => {
            drop(e);
        })
        item.addEventListener('dragover', e => {
            allowDrop(e);
        })
    })



    // 输入框获焦点后placeholder文字消失
    const inputList = document.querySelectorAll('input');
    for (let i = 0; i < inputList.length; i++) {
        let placeholderValue = inputList[i].placeholder;//先存起来
        inputList[i].addEventListener('focus', () => {
            inputList[i].placeholder = '';
        })
        inputList[i].addEventListener('blur', () => {
            inputList[i].placeholder = placeholderValue;
        })
    }





    // //拖拽部分
    const body = document.querySelector("body");

    const catchImg1 = document.querySelector(' .page4 .catch-img');//第一个截图图片的盒子
    const catchImg2 = document.querySelector('.page5 .catch-img2');//第二个截图图片的盒子

    const page4 = document.querySelector('.page4');//添加到的指定页面
    const page5 = document.querySelector('.page5');

    const stickers = document.querySelector('.tag-sel .stickers');


    //容器相对左边距离
    let cLeft1 = document.querySelector('.main-cont').offsetLeft + book.offsetLeft - 13;
    // let cLeft1 = document.querySelector('.main-cont').offsetLeft + book.offsetLeft + document.querySelector('.page4').offsetLeft + 13;
    // let cLeft2 = document.querySelector('.main-cont').offsetLeft + document.querySelector('.page4').offsetLeft  + book.offsetLeft;
    let cLeft2 = cLeft1 + page5.clientWidth;
    let cTop = book.offsetTop;//书本距离上方距离


    let canvas4 = document.querySelector('.page4 canvas');
    let canvas5 = document.querySelector('.page5 canvas');

    // let putSticker = false;
    let addTag = (page, left) => {
        let aStrick = false;//防止点击一次添加多个
        stickers.addEventListener('click', e => {//点击贴纸
            aStrick = true;
            if (page.querySelector('.canvas-sel') && aStrick && e.target.classList.contains('sticker')) {
                let drag = document.createElement('img');
                drag.classList.add('sticker-drag');

                drag.style.backgroundImage = `url(${e.target.src})`;
                // drag.style.backgroundImage = `url(./images/${e.target.src.split('/').pop()})`;
                // console.log(e.target.src.split('/').pop());//获取文件名（之后图片路径用相对路径

                page.appendChild(drag);//在指定页面中创建添加
                aStrick = false;
                playDrag(drag, page, left);
            }
            // putSticker = false;
        })
    }



    //点击可以文字编辑
    const write = document.querySelector('.page4 .tool-list .tool:nth-child(1)');
    write.addEventListener('click', () => {
        let inputArea = document.createElement('div');
        inputArea.classList.add('write-box');
        inputArea.innerHTML = '<textarea class="write-area"></textarea>';
        catchImg1.appendChild(inputArea);
        document.addEventListener('click', e => {
            if (!e.target.classList.contains('write-area') && !e.target.classList.contains('write-box') && !e.target.classList.contains('write')) {
                //点击其他地方样式消失
                document.querySelectorAll('.write-area').forEach(item=>{
                    item.classList.add('stick');
                })
            }
            if(e.target.classList.contains('write-area')){
                e.target.classList.remove('stick');
            }
        })
        // inputArea.addEventListener('click', () => {
            //点击输入区域，样式恢复
            // document.querySelector('.write-area').classList.remove('stick');
        // })

        //拖拽
        playDrag(inputArea,catchImg1, cLeft1);
    })




    //选择放在哪个板块
    canvas4.addEventListener('click', () => {
        // putSticker = true;
        if (canvas5.classList.contains('canvas-sel')) {
            canvas5.classList.remove('canvas-sel');
        }
        canvas4.classList.add('canvas-sel');
        addTag(catchImg1, cLeft1);
    })
    canvas5.addEventListener('click', () => {
        if (canvas4.classList.contains('canvas-sel')) {
            canvas4.classList.remove('canvas-sel');
        }
        canvas5.classList.add('canvas-sel');
        // putSticker = true;
        addTag(catchImg2, cLeft2);
    })

    //拖拽
    let playDrag = (drag, container, cleft) => {

        let disX = null;
        let disY = null;

        const mousedown = (e) => {
            // e.stopPropagation();//阻止冒泡
            const { clientX, clientY } = e;
            const { top, left } = drag.getBoundingClientRect();
            disX = clientX - left;
            disY = clientY - top;
            body.addEventListener("mousemove", mousemove);
            body.addEventListener("mouseup", mouseup);
        };

        const mousemove = (e) => {
            const { clientX, clientY } = e;
            const {
                top,
                left,
                width: cWidth,
                height: cHeight,
            } = container.getBoundingClientRect();
            const { width: dWidth, height: dHeight } = drag.getBoundingClientRect();

            //赋值left和top
            let moveLeft = clientX - cleft - disX;
            let moveTop = clientY - cTop - disY;
            drag.style.left = `${moveLeft}px`;
            drag.style.top = `${moveTop}px`;
            if (clientX - disX <= left) drag.style.left = `${left}px`;
            if (clientX - disX >= left + cWidth - dWidth)
                drag.style.left = `${left + cWidth - dWidth}px`;
            if (clientY - disY <= top) drag.style.top = `${top}px`;
            if (clientY - disY >= top + cHeight - dHeight)
                drag.style.top = `${top + cHeight - dHeight}px`;
        };



        const mouseup = () => {
            body.removeEventListener("mousemove", mousemove);
            body.removeEventListener("mouseup", mouseup);
        };

        drag.addEventListener("mousedown", mousedown);
    }




































    const saveBtn = document.querySelector('.save-btn');//保存按钮
    const shareBtn = document.querySelector('.share-btn');//分享按钮


    //上传数据
    const myName = document.querySelector('.page2 .user-name');
    const userJob = document.querySelector('.page2 .user-job');
    const year = document.querySelector('.page2 .year');
    const month = document.querySelector('.page2 .month');
    const data = document.querySelector('.page2 .data')
    const area = document.querySelector('.page2 .area');

    const advCont = document.querySelectorAll('.adv .add');//优点
    const disadvCont = document.querySelectorAll('.disadv .add');//缺点
    let ad = [];
    let disad = [];






    // //拿到职业图片的背景地址路径
    // let getBgiUrl = item => {
    //     let computedStyle = window.getComputedStyle(item);
    //     let url = computedStyle.backgroundImage;
    //     return url;
    // }

    // console.log(url);
    // console.log(url.split('/').pop());
















    // function captureScreenshot(element, item) {
    //     // 获取需要截图的元素
    //     // 使用html2canvas将元素转换为图片
    //     html2canvas(element).then(function (canvas) {
    //         alert('canvas');
    //         // canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);


    //         //赋值base64
    //         item = canvas.toDataURL('image/png');

    //         // 将生成的图片保存
    //         const link = document.createElement('a');
    //         link.href = canvas.toDataURL('image/png');
    //         link.download = 'mbti-report.png';
    //         link.click();



    //         // link.href = canvas.toDataURL('image/jpeg')
    //         // document.getElementById('screenshot').src = 
    //         // document.getElementById('screenshot').style.display = 'block';
    //     });
    // }







    // function captureScreenshot() {
    //     const container = document.querySelector('.catch-img');
    //     const options = {
    //         logging: true,
    //         filename: 'screenshot',
    //         type: 'image/png'
    //     };

    //     domtoimage.toPng(container, options)
    //         .then(function (dataUrl) {
    //             const link = document.createElement('a');
    //             link.href = dataUrl;
    //             link.download = 'screenshot.png';
    //             link.click();
    //         })
    //         .catch(function (error) {
    //             console.error('Error during conversion:', error);
    //         });
    // }

    //点击保存按钮，上传数据
    saveBtn.addEventListener('click', () => {
        const myName = document.querySelector('.page2 .user-name');
        // console.log(document.querySelector('.page6 .sticker-area .sticker').src.split('/').pop());//job-tag1.png
        const birth = `${year.value.trim()}-${month.value.trim()}-${data.value.trim()}`;

        let nowJobPic1 = null;
        let nowJobPic2 = null;
        let futureJobPic1 = null;
        let futureJobPic2 = null;
        if (document.querySelectorAll('.page6 .sticker-area .sticker')[0]) {
            nowJobPic1 = document.querySelectorAll('.page6 .sticker-area .sticker')[0].src.split('/').pop();
        }
        if (document.querySelectorAll('.page6 .sticker-area .sticker')[1]) {
            nowJobPic2 = document.querySelectorAll('.page6 .sticker-area .sticker')[1].src.split('/').pop();
        }
        if (document.querySelectorAll('.page7 .sticker-area .sticker')[0]) {
            futureJobPic1 = document.querySelectorAll('.page7 .sticker-area .sticker')[0].src.split('/').pop();
        }
        if (document.querySelectorAll('.page7 .sticker-area .sticker')[1]) {
            futureJobPic2 = document.querySelectorAll('.page7 .sticker-area .sticker')[1].src.split('/').pop();
        }


        const jobName1 = document.querySelectorAll('.page6 .futureJob');
        const jobName2 = document.querySelectorAll('.page7 .futureJob');
        const des1 = document.querySelectorAll('.page6 .job-desc');
        const des2 = document.querySelectorAll('.page7 .job-desc');
        //职业信息
        let myJobList = [
            {
                "jobName": `${jobName1[0].value.trim()}`,
                "des": `${des1[0].value.trim()}`,
                "picture": `${nowJobPic1}`,
                "isPost": 1
            },
            {
                "jobName": `${jobName1[1].value.trim()}`,
                "des": `${des1[1].value.trim()}`,
                "picture": `${nowJobPic2}`,
                "isPost": 1
            },
            {
                "jobName": `${jobName2[0].value.trim()}`,
                "des": `${des2[0].value.trim()}`,
                "picture": `${futureJobPic1}`,
                "isPost": 0
            },
            {
                "jobName": `${jobName2[1].value.trim()}`,
                "des": `${des2[1].value.trim()}`,
                "picture": `${futureJobPic2}`,
                "isPost": 0
            }
        ]
        //截图并获取base64
        // captureScreenshot(catchImg1, preMe);
        // captureScreenshot(catchImg2, postMe);

        let preMe = '';
        let postMe = '';

        for (let i = 0; i < advCont.length; i++) {
            if (advCont[i].value.trim() != '') {
                ad.push(advCont[i].value.trim());
            }
        }
        for (let i = 0; i < disadvCont.length; i++) {
            if (disadvCont[i].value.trim() != '') {
                disad.push(disadvCont[i].value.trim());
            }
        }
        console.log(ad);


        Promise.all([
            html2canvas(catchImg1).then(function (canvas) {
                // alert('canvas');
                //赋值base64
                preMe = canvas.toDataURL('image/png');
                // 将生成的图片保存
                // const link = document.createElement('a');
                // link.href = canvas.toDataURL('image/png');
                // link.download = 'mbti-report.png';
                // link.click();
            }),
            html2canvas(catchImg2).then(function (canvas) {
                // alert('canvas');
                //赋值base64
                postMe = canvas.toDataURL('image/png');
                // 将生成的图片保存
                // const link = document.createElement('a');
                // link.href = canvas.toDataURL('image/png');
                // link.download = 'mbti-report.png';
                // link.click();
            })
        ]).then(function () {
            let preMeBase64 = preMe;
            console.log(preMeBase64); // 拿到preMe的值
            console.log(postMe); // 拿到postMe的值



            axios({
                method: 'POST',
                url: 'http://8.134.176.185:8866/cartoon/add',
                headers: {
                    'Content-Type': 'application/json',
                    'token': `${token}`
                },
                data:
                {
                    "myName": `${myName.value.trim()}`,
                    "birth": `${birth}`,
                    "userJob": `${userJob.value.trim()}`,
                    "area": `${area.value.trim()}`,
                    "ad": ad,
                    "disAd": disad,
                    "preMe": `${preMe}`,
                    "postMe": `${postMe}`,
                    "myJobList": myJobList
                }
            }).then(result => {
                console.log(result);
                // alert('上传数据');
            })


        });




        // console.log(preMe);
        // setTimeout(() => {
        //     console.log(preMe);
        //     axios({
        //         method: 'POST',
        //         url: 'http://8.134.176.185:8866/cartoon/add',
        //         headers: {
        //             'Content-Type': 'application/json',
        //             'token': `${token}`
        //         },
        //         data:
        //         {
        //             "myName": `${myName.value.trim()}`,
        //             "birth": `${birth}`,
        //             "userJob": `${userJob.value.trim()}`,
        //             "area": `${area.value.trim()}`,
        //             "ad": ad,
        //             "disAd": disad,
        //             "preMe": `${preMe}`,
        //             "postMe": `${postMe}`,
        //             "myJobList": myJobList
        //         }
        //     }).then(result => {
        //         console.log(result);
        //         alert('上传数据');
        //     })
        // },1000)

    })






    // btn.addEventListener('click', () => {
    //     let preMe = '11';
    //     let postMe = '22';
    //     // setTimeout(() => {
    //     // console.log(preMe);
    //     setTimeout(() => {
    //         axios({
    //             method: 'POST',
    //             url: 'http://8.134.176.185:8866/cartoon/add',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 'token': `${token}`
    //             },
    //             data:
    //             {
    //                 "myName": "你好55",
    //                 "birth": "2023-11-13",
    //                 "ad": [
    //                     "5555",
    //                     "6666",
    //                     "7777",
    //                     "8888"
    //                 ],
    //                 "disAd": [
    //                     "1111",
    //                     "2222",
    //                     "3333",
    //                     "44444"
    //                 ],
    //                 "preMe": `${preMe}`,
    //                 "postMe": `${postMe}`,
    //                 "area": "广东",
    //                 "userJob": "计算机",
    //                 "myJobList": [
    //                     {
    //                         "jobName": "职业名称5",
    //                         "des": "职业简述1",
    //                         "picture": "职业的图1",
    //                         "isPost": 1
    //                     },
    //                     {
    //                         "jobName": "职业名称5",
    //                         "des": "职业简述2",
    //                         "picture": "职业的图2",
    //                         "isPost": 1
    //                     },
    //                     {
    //                         "jobName": "职业名称5",
    //                         "des": "职业简述3",
    //                         "picture": "职业的图3",
    //                         "isPost": 0
    //                     }
    //                 ]
    //             }
    //         }).then(result => {
    //             console.log(result);
    //             alert('上传数据');
    //         })

    //     }, 1000)

    // })


    const addAvatar = document.querySelector('.avatar .add-change');//点击上传头像
    const avaForm = document.querySelector('.page2 .updataAva');
    const avatarBox = document.querySelector('.self-evaluation .page2 .avatar img');//头像

    //获取头像
    let num = 0;
    axios({
        method: 'GET',
        url: 'http://8.134.176.185:8866/avatar/' + num,
        headers: {
            'Content-Type': 'application/json',
            'token': `${token}`
        }
    }).then(result => {
        console.log(result);
        // alert(111);
        // avatarBox.src = result.data.data
    }).catch(error => {
        console.log(error);
    })


    //上传头像

    //点击后表单出现
    addAvatar.addEventListener('click', () => {
        avaForm.classList.add('show-form');
    })
    // avaForm.addEventListener('click',e => {
    //     e.stopPropagation();
    // })

    document.getElementById('uploadForm').addEventListener('submit', function (event) {
        event.preventDefault(); // 阻止表单默认提交行为

        var fileInput = document.getElementById('avatar');
        var file = fileInput.files[0];
        if (!file) {
            // alert('请选择一个图片文件！');
            console.log('请选择一个图片文件！');
            return;
        }

        var reader = new FileReader();
        reader.onload = function (e) {
            var base64Image = e.target.result;
            // 将base64编码的图片发送给服务器端处理
            sendImageToServer(base64Image);
        };
        reader.readAsDataURL(file);

        avaForm.classList.remove('show-form');

    });

    function sendImageToServer(base64Image) {
        // 在这里编写将base64编码的图片发送给服务器端的代码
        console.log('发送给服务器端的base64编码的图片：', base64Image);
        avatarBox.src = base64Image;
        axios({
            method: 'POST',
            url: 'http://8.134.176.185:8866/avatar/upload',
            headers: {
                'Content-Type': 'application/json',
                'token': `${token}`
            },
            data: {
                "user_id": "1",
                "avatar64": base64Image
            }
        }).then(result => {
            console.log(result);
            // alert(111);
        }).catch(error => {
            console.log(error);
        })
    }

    // document.addEventListener('click',e => {
    //     if(!e.target.classList.contains('updataAva')||!e.target.classList.contains('add-change')){
    //         avaForm.classList.remove('show-form');
    //     }
    // })










})