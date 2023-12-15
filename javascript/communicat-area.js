'use strict';

window.addEventListener('load', () => {

    let token = localStorage.getItem('token');

    const ItemWrap = document.querySelector('.communicat-area .comItem-wrap');//总的大盒子
    const sliders = document.querySelectorAll('.slider');





    let setLike = item => {
        item.forEach(item => {
            item.addEventListener('click', () => {
                item.classList.toggle('isLike');

            })
        });
    }

    //生成随机数
    function getRandom(N, M) {
        return Math.floor(Math.random() * (M - N + 1) + N);
    }

    //获取随机位置
    let ranPos = (item, mark, index) => {

        // let getRanPos = getRandom(1, 2);
        // if(getRanPos === 1){
        //     item.classList.add(`pos${index+1}`);
        // }
        // else{
        //     item.classList.add(`pos${(index+1)*1}`);
        // }

        if (mark % 2 === 0) {
            item.classList.add(`pos${index + 1}`);
        }
        if (mark % 2 != 0) {
            item.classList.add(`pos${index + 1 + 6}`);
        }
    }





    //设置随机过渡时间
    let getRanTime = (item) => {

        let getR = getRandom(0, 2);//获取0-4的随机数
        // 设置不同的过渡时间
        let x = 0;
        if (getR === 0) {
            x = 45;
        }
        if (getR === 1) {
            x = 60;
        }
        if (getR === 2) {
            x = 30;
        }

        console.log(getR);
        item.style.transition = `all ${x}s ease-in`;
        item.style.transform = `rotate(-15deg) translateX(-986%) scale(1.8)`;
    }




    let mark = 0;


    //一开始不用等待就出现
    for (let i = 0; i < 6; i++) {
        let getComSel = getRandom(0, 1);//获取0-1的随机数，若为0，则获取帖子，若为1，则获取职业内容
        let item = null;
        if (getComSel === 0) {
            item = document.createElement('div');
            item.classList.add('slider');
            item.classList.add('job-item');
            item.innerHTML = `
            <div class="text">前端开发工程师</div>
            <div class="like"><div class="icon"></div>3</div>
        `;
            ranPos(item, mark, i);
            ItemWrap.appendChild(item);


            setTimeout(() => {
                //     getRanTime(item);//随机过渡时间
                //一开始直接出现不用等待
                item.style.transition = `all 27s ease-in`;
                item.style.transform = `rotate(-15deg) translateX(-986%) scale(1.8)`;
            }, 1);



            item.addEventListener('click', e => {
                // alert(1);
                if (!e.target.classList.contains('like')) {
                    location.href = './qAndA.html';
                }
                else {
                    e.target.classList.toggle('isLike');
                    // alert(111222);
                }
            })
        }
        else if (getComSel === 1) {
            let item = document.createElement('div');
            item.classList.add('slider');
            item.classList.add('com-item');
            item.innerHTML = `
            <div class="text">怎么了解自己</div>
            <div class="like"><div class="icon"></div>32</div>
            `
            ranPos(item, mark, i);

            ItemWrap.appendChild(item);
            // setTimeout(() => {
            //     getRanTime(item);
            // }, 1);

            setTimeout(() => {
                //     getRanTime(item);//随机过渡时间
                //一开始直接出现不用等待
                item.style.transition = `all 20s ease-in`;
                item.style.transform = `rotate(-15deg) translateX(-986%) scale(1.8)`;
            }, 1);


            //点击帖子
            item.addEventListener('click', e => {
                // alert(1);
                if (!e.target.classList.contains('like')) {
                    location.href = './comment.html';

                }
                else {
                    e.target.classList.toggle('isLike');
                    // alert(111222);
                }
            })
        }

    }




    // let postId = 5;

    // axios({
    //     method: 'GET',
    //     url: 'http:/8.134.176.185:8866/forum/post/' + postId,
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'token': `${token}`
    //     }
    // }).then(result => {
    //     console.log(result);
    //     alert(111);
    // }).catch(error => {
    //     console.log(error);
    // })






    setInterval(() => {
        mark++;//判断是第几批（控制不同位置
        // 一次获取6个
        let postId = 6;
        axios({
            method: 'GET',
            url: 'http://8.134.176.185:8866/forum/post/' + postId,
            headers: {
                'Content-Type': 'application/json',
                'token': `${token}`
            }
        }).then(result => {
            console.log(result);
            // alert(111);
            //一次创建6个
            for (let i = 0; i < 6; i++) {
                let getComSel = getRandom(0, 1);//获取0-1的随机数，若为0，则获取帖子，若为1，则获取职业内容
                let item = null;

                //职业
                if (getComSel === 0) {
                    item = document.createElement('div');
                    item.classList.add('slider');
                    item.classList.add('job-item');
                    item.innerHTML = `
                        <div class="text">前端开发工程师</div>
                        <div class="like"><div class="icon"></div>3</div>
                    `;
                    ranPos(item, mark, i);
                    ItemWrap.appendChild(item);
                    setTimeout(() => {
                        getRanTime(item);//随机过渡时间
                    }, 1);





                    // //点击职业
                    // item.addEventListener('click', e => {
                    //     if (!e.target.classList.contains('inLike')) {
                    //         location.href = './qAndA.html';
                    //     }
                    //     // alert(1);
                    // })

                    item.addEventListener('click', e => {
                        // alert(1);
                        if (!e.target.classList.contains('like')) {
                            location.href = './qAndA.html';
                        }
                        else {
                            e.target.classList.toggle('isLike');
                            // alert(111222);
                        }
                    })

                }


                //普通帖子
                else if (getComSel === 1) {
                    item = document.createElement('div');
                    item.classList.add('slider');
                    item.classList.add('com-item');
                    item.innerHTML = `
                        <div class="text">${result.data.data[i].title}</div>
                        <div class="like"><div class="icon"></div>32</div>
                        `
                    // ranPos(item,i);


                    ranPos(item, mark, i);

                    ItemWrap.appendChild(item);
                    setTimeout(() => {
                        getRanTime(item);
                    }, 1);



                    //点击帖子
                    item.addEventListener('click', e => {
                        // alert(1);
                        if (!e.target.classList.contains('like')) {
                            location.href = './comment.html';

                        }
                        else {
                            e.target.classList.toggle('isLike');
                            // alert(111222);
                        }
                    })
                }


                // //点赞、取消点赞
                // item.addEventListener('click', e => {
                //     e.stopPropagation();
                //     if (e.target.classList.contains('icon')) {
                //     }
                // })

            }
        })

    }, 9000);




    //发布
    const addCom = document.querySelector('.add-communi');//发布按钮
    addCom.addEventListener('click', () => {
        addCom.classList.add('active');
        setTimeout(() => {
            addCom.classList.remove('active');
            location.href = './issue-plate.html';
        }, 1500);
    })
})