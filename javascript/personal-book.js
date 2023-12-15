'use strict';

window.addEventListener('load', () => {
    let token = localStorage.getItem('token');
    const page = document.querySelectorAll('.page');//获取所有页面
    const book = document.querySelector('.book');


    //点击左右页面空白处翻页
    for (let i = 0; i < page.length; i++) {
        page[i].addEventListener('click', () => {
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
                        }, 1000);
                    }
                }, 2000);

            }
        })
    }

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








    book.addEventListener('click', () => {
        axios({
            method: 'POST',
            url: 'http://8.134.176.185:8866/cartoon',
            headers: {
                'Content-Type': 'application/json',
                'token': `${token}`
            }
        }).then(result => {
            console.log(result);
            const { myName, birth, ad, disAd, preMe, postMe, myJobList, area, userJob } = result.data.data;
            document.querySelector('.page2 .user-name').innerHTML = myName;
            document.querySelector('.page2 .user-job').innerHTML = userJob;
            document.querySelector('.page2 .year').innerHTML = birth.split('-')[0];
            document.querySelector('.page2 .month').innerHTML = birth.split('-')[1];
            document.querySelector('.page2 .data').innerHTML = birth.split('-')[2];
            document.querySelector('.page2 .area').innerHTML = area;

            const advCont = document.querySelectorAll('.adv-cont .cont');//优点
            const disadvCont = document.querySelectorAll('.disadv-cont .cont');//缺点

            advCont.forEach((item, index) => {
                item.innerHTML = ad[index];
            })
            disadvCont.forEach((item, index) => {
                item.innerHTML = disAd[index];
            })


            const nowMe = document.querySelector('.nowMe');
            const futureMe = document.querySelector('.futureMe');
            nowMe.src = `data:image/png;base64,${preMe}`;//现在的我的画板
            futureMe.src = `data:image/png;base64,${postMe}`;//将来的我的画板

            let nowJobPic1 = 'base64';
            let nowJobPic2 = 'base64';
            let futureJobPic1 = 'base64';
            let futureJobPic2 = 'base64';


            const jobName1 = document.querySelectorAll('.page6 .futureJob');
            const jobName2 = document.querySelectorAll('.page7 .futureJob');
            const des1 = document.querySelectorAll('.page6 .job-desc');
            const des2 = document.querySelectorAll('.page7 .job-desc');
            jobName1[0].src = myJobList[0].jobName;
            jobName1[1].src = myJobList[1].jobName;
            jobName2[0].src = myJobList[2].jobName;
            jobName2[1].src = myJobList[3].jobName;
            des1[0].innerHTML = myJobList[0].des;
            des1[1].innerHTML = myJobList[1].des;
            des2[0].innerHTML = myJobList[2].des;
            des2[1].innerHTML = myJobList[3].des;

            //头像未渲染



        })
    })
})