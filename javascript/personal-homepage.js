'use strict';

window.addEventListener('load', () => {

    let token = localStorage.getItem('token');

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
    }).catch(error => {
        console.log(error);
    })


    //上传头像
    const addAvatar = document.querySelector('.add-change');//点击上传头像
    const avaForm = document.querySelector('.updataAva');
    const avatarBox = document.querySelector('.self-evaluation .page2 .avatar img');//头像
    //点击后表单出现
    addAvatar.addEventListener('click', () => {
        avaForm.classList.add('show-form');
    })







    // 点击侧边导航栏切换
    const selBtn = document.querySelectorAll('.sel-btn');
    const mainCont = document.querySelectorAll('.mainCont');
    selBtn.forEach((item, index) => {
        item.addEventListener('click', () => {
            // document.querySelector('.show2').classList.remove('show2');
            // mainCont[index].classList.add('show2');
            document.querySelector('.bgc').classList.remove('bgc');
            item.classList.add('bgc');
        })
    })



    const paintingBox = document.querySelector('.report-bottom .paintings-wrap .paintings');

    // //如果有存图片，则在个人主页新创建一个板块
    // if (localStorage.getItem('pictures')) {

    //     //将JSON格式转回来
    //     let pictures = JSON.parse(localStorage.getItem('pictures'));
    //     console.log(pictures);

    //     //动态添加
    //     pictures.forEach((item, index) => {
    //         let paint = document.createElement('div');
    //         paint.classList.add('painting')
    //         paint.innerHTML = `        
    //                     <div class="tit">来自：111</div>
    //                     <div class="item-box">
    //                         <div class="descs">
    //                             <div class="desc">执行力强</div>
    //                             <div class="desc">演讲很好</div>
    //                             <div class="desc">女强人</div>
    //                             <div class="desc">目标清晰</div>
    //                             <div class="desc">让人信服</div>
    //                         </div>
    //                         <div class="item"><img src="${item}"></div>
    //                     </div>
    //         `
    //         paintingBox.appendChild(paint);
    //     })

    // }



    //点击“我的动态”，出现二级导航
    const daily = document.querySelector('.daily-btn');//"我的动态"
    const likeBtn = document.querySelector('.like-btn');
    const storeBtn = document.querySelector('.store-btn');
    daily.addEventListener('click', () => {
        likeBtn.classList.toggle('shrink');
        storeBtn.classList.toggle('shrink');
    })

    //点击按钮，出现对应板块
    const contBtn = document.querySelectorAll('.cont-btn');//选择按钮
    const container = document.querySelectorAll('.mainCont');//对应板块
    for (let i = 0; i < contBtn.length; i++) {
        contBtn[i].addEventListener('click', () => {
            document.querySelector('.show3').classList.remove('show3');
            container[i].classList.add('show3');
        })

    }




    // const paint = document.querySelector('.paintings .painting:nth-child(1) .item');//画像

    // axios({
    //     method: 'GET',
    //     url: 'http://8.134.176.185:8866/homepage/report',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'token': `${token}`
    //     }
    // }).then(result => {
    //     console.log(result);
    //     console.log(111);

    //     //获取画像
    //     paint.style.backgroundImage= `url(data:image/png;base64,${result.data.data.whiteList[0].whiteboard})`;






    // })

})