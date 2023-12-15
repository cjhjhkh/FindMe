'use strict';

window.addEventListener('load', () => {

    let token = localStorage.getItem('token');

    //点击右上角按钮查看图鉴
    const spreadSel = document.querySelector('.stars .spread-sel');//图鉴按钮
    const spreadBox = document.querySelector('.spread-sel .spread-box');//图鉴盒子
    spreadSel.addEventListener('click',() => {
        spreadBox.classList.toggle('active');
    })

   
    //获取上一阶段选择的并渲染
    axios({
        method: 'GET',
        url: 'http://8.134.176.185:8866/explode/progress',
        headers: {
            'Content-Type': 'application/json',
            'token': `${token}`
        }
    }).then(result => {
        // alert(1);
        console.log(result);

        const star = document.querySelectorAll('.stars-wrap .stars-item');//所有星星
        for (let i = 0; i < star.length; i++) {
            star[i].innerText = result.data.data[0].valuesList[i];//获取已选六个
            if (star[i].innerHTML === '帮助他人') {
                star[i].id = 'icon1';
            }
            if (star[i].innerHTML === '美的追求') {
                star[i].id = 'icon2';
            }
            if (star[i].innerHTML === '创造发明') {
                star[i].id = 'icon3';
            }
            if (star[i].innerHTML === '智性激发') {
                star[i].id = 'icon4';
            }
            if (star[i].innerHTML === '成就满足') {
                star[i].id = 'icon5';
            }
            if (star[i].innerHTML === '独立自主') {
                star[i].id = 'icon6';
            }
            if (star[i].innerHTML === '名誉地位') {
                star[i].id = 'icon7';
            }
            if (star[i].innerHTML === '管理权力') {
                star[i].id = 'icon8';
            }
            if (star[i].innerHTML === '经济报酬') {
                star[i].id = 'icon9';
            }
            if (star[i].innerHTML === '安全稳定') {
                star[i].id = 'icon10';
            }
            if (star[i].innerHTML === '工作环境') {
                star[i].id = 'icon11';
            }
            if (star[i].innerHTML === '上级关系') {
                star[i].id = 'icon12';
            }
            if (star[i].innerHTML === '同事关系') {
                star[i].id = 'icon13';
            }
            if (star[i].innerHTML === '生活方式') {
                star[i].id = 'icon14';
            }
            if (star[i].innerHTML === '多样变化') {
                star[i].id = 'icon1';
            }
        }




    })




















    //月亮移动
    const body = document.querySelector('body');
    const moveItem = document.querySelector('.boat');
    const line = document.querySelector('.line');
    let preLine = line.clientHeight;//线的原始长度
    let stretchLine = preLine;//线变长的初值


    const contain = document.querySelector(' .value-frist-play-wrap');
    let disX = null;
    let lastX = null;

    //鼠标按下
    const mousedown = (e) => {
        const { clientX } = e;
        const { left } = moveItem.getBoundingClientRect();
        disX = clientX - left;
        body.addEventListener("mousemove", mousemove);
        body.addEventListener("mouseup", mouseup);
    };


    //线由有角度转为垂直线向下
    let goBack = setTimeout(() => {
        if (document.querySelector('.move-right')) {
            document.querySelector('.move-right').classList.remove('move-right');
        }
    }, 300);

    //鼠标移动
    const mousemove = (e) => {
        const { clientX } = e;
        const {
            left,
            width: cWidth
        } = contain.getBoundingClientRect();
        const { width: dWidth } = moveItem.getBoundingClientRect();
        moveItem.style.left = `${clientX - disX}px`;
        if (clientX - disX <= left) moveItem.style.left = `${left}px`;
        if (clientX - disX >= left + cWidth - dWidth)
            moveItem.style.left = `${left + cWidth - dWidth}px`;


        //判断鼠标移动方向
        if (lastX !== null) {
            if (clientX > lastX) {

                if (document.querySelector('.move-left')) {
                    document.querySelector('.move-left').classList.remove('move-left');
                }
                moveItem.classList.add('move-right');

                //一定时间后线回正
                goBack = setTimeout(() => {
                    if (document.querySelector('.move-right')) {
                        document.querySelector('.move-right').classList.remove('move-right');
                    }
                }, 500);
            }
            if (clientX < lastX) {

                if (document.querySelector('.move-right')) {
                    document.querySelector('.move-right').classList.remove('move-left');
                }
                moveItem.classList.add('move-left');

                //一定时间后线回正
                goBack = setTimeout(() => {
                    if (document.querySelector('.move-left')) {
                        document.querySelector('.move-left').classList.remove('move-left');
                    }
                }, 500);
            }
        }
        lastX = clientX;
    };

    let back = false;//判断是否返回
    const starPos = document.querySelectorAll(' .stars-item');//获取所有星星
    const hook = document.querySelector('.hook');//钩子

    const starWrap = document.querySelector('.stars-wrap');//装星星的盒子
    let valArr = [];//存放已选的
    const selItem = document.querySelectorAll('.sel-item');//放入已选的
    let j = 0;

    const valCount = document.querySelector('.mission .count');//选择的数量提示
    let i = 1;


    //鼠标抬起
    const mouseup = () => {
        body.removeEventListener("mousemove", mousemove);
        body.removeEventListener("mouseup", mouseup);
        moveItem.classList.add('stretch');



        //线伸长
        let starTarget = null;
        let stretch = setInterval(() => {
            if (!back) {//抓取过程
                stretchLine++;
                console.log(hook.offsetLeft);

                starPos.forEach((item, index) => {
                    //判断钩子是否位于其中某个星星的坐标范围内
                    if (moveItem.offsetLeft >= item.offsetLeft && moveItem.offsetLeft <= item.offsetLeft + item.clientWidth && stretchLine > item.offsetTop + 155 - line.offsetTop) {
                        back = true;//一触碰到就返回
                        starTarget = index;

                        item.style.display = 'none';//被抓取的消失

                        let itemId = item.id;//拿到该抓取元素的id

                        //创建一个新的盒子在钩上面
                        let newItem = document.createElement('div');
                        newItem.id = itemId;

                        newItem.classList.add('new-item');
                        hook.appendChild(newItem);




                        //拿到所抓取盒子的 背景图
                        var computedStyle = window.getComputedStyle(item);
                        let url = computedStyle.backgroundImage;
                        // console.log(url);
                        // console.log(url.split('/').pop());

                        //添加到上方盒子
                        selItem[j].style.backgroundImage = url;
                        if(j<3){
                            j++;
                        }

                        //添加到数组
                        valArr.push(item.innerText);//添加该价值观
                        
                        valCount.innerHTML = `0${i++}`;
                    }
                    if (stretchLine >= 500) {//长度大于500时什么也没钓到时 就返回
                        back = true;
                    }
                })
            }
            if (back) {//线返回时
                stretchLine--;
                if (stretchLine <= preLine) {//钩子回到原点
                    if (document.querySelector('.new-item')) {
                        let newItem = document.querySelector('.new-item');
                        hook.removeChild(newItem);
                    }
                    back = false;
                    clearInterval(stretch);
                    if (valArr.length === 3) {
                        console.log(valArr);
                        console.log(valArr.length);

                        //上传选择结果
                        axios({
                            method: 'POST',
                            url: 'http://8.134.176.185:8866/explode/save',
                            headers: {
                                'Content-Type': 'application/json',
                                'token': `${token}`
                            },
                            data: {
                                "valuesList": valArr,
                                "progress": "1"
                            }
                        }).then(result => {
                            // alert(1);
                            console.log(result);
                        })

                        //完成选择  出现提示
                        const tip = document.querySelector('.next-tip');
                        tip.style.display = 'block';
                        setTimeout(() => {
                            tip.classList.add('show3');
                        }, 1);




                        //跳转
                        setTimeout(() => {

                            location.href = './value-change2.html';
                        }, 3000);
                    }
                }
            }
            line.style.height = stretchLine + 'px';

        })
    };


    moveItem.addEventListener("mousedown", mousedown);
})