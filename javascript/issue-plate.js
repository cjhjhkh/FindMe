'use strict';

window.addEventListener('load', () => {
    let token = localStorage.getItem('token');

    let inputPla = input => {
        let pla = input.placeholder;
        input.addEventListener('focus', () => {
            input.placeholder = '';
        })
        input.addEventListener('blur', () => {
            input.placeholder = pla;
        })
    }

    // alert

    //标题字数
    const titInput = document.querySelector('.tit-input');//标题输入框
    const titLen = document.querySelector('.tit-box .total');//统计字数的框
    titInput.addEventListener('input', () => {
        titLen.innerHTML = `${titInput.value.length}/10`;
    })


    //内容字数
    const contInput = document.querySelector('.cont-input');//内容输入框
    const contLen = document.querySelector('.cont-box .total');//统计字数的框
    contInput.addEventListener('input', () => {
        contLen.innerHTML = `${contInput.value.length}/200`;
    })


    inputPla(titInput);
    inputPla(contInput);





    //发布过程
    const contBtn = document.querySelectorAll('.issue-box .btn');//获取继续、完成按钮
    const issueBox = document.querySelectorAll('.issue-box');//获取所有发布盒子
    const boat = document.querySelector('.boat');//船

    const recTag = document.querySelectorAll('.tag-box:nth-child(5) .tag-item');

    contBtn[0].addEventListener('click', () => {
        if (titInput.value.trim() != '' && contInput.value.trim() != '') {
            let text = contInput.value.trim();

            //上传帖子内容（获取关键词
            axios({
                method: 'POST',
                url: 'http://8.134.176.185:8866/extract/3',
                headers: {
                    'Content-Type': 'application/json',
                    'token': `${token}`
                },
                data: {
                    "text": `${text}`
                }
            }).then(result => {
                console.log(result);
                // alert(111);
                console.log(result.data.data);

                //渲染到三个推荐

                //推荐标签选择
                if (result.data.data.length != 0) {
                    recTag.forEach((item, index) => {
                        item.innerHTML = `${result.data.data[index]}`;
                    })

                }

            })




            //该“继续”按钮消失(高度变为0，内容为空)
            contBtn[0].classList.add('hide');
            contBtn[0].innerHTML = '';

            //动画
            boat.classList.add('boat2');
            //下一个发布板块出现

            setTimeout(() => {
                //下一个发布板块出现
                issueBox[1].classList.add('show');
            }, 2000)

        }
    })
    recTag.forEach((item, index) => {
        let count = 0;
        item.addEventListener('click', () => {
            count++;
            item.classList.toggle('disCli');

            if (count % 2 != 0) {
                //添加
                let newTag = document.createElement('div');
                newTag.classList.add('tag-item');
                newTag.id = index;//标记id
                newTag.innerHTML = `${item.innerHTML}`;
                // tagBox.appendChild(newTag);
                tagBox.insertBefore(newTag, tagBox.children[tagBox.children.length - 1])
            }
            else {
                tagBox.removeChild(document.getElementById(`${index}`));
            }

        })
    })






    let labelsList = [];//标签数组



    contBtn[1].addEventListener('click', () => {


        // 保存已选标签
        if (document.querySelectorAll('.al .tag-item')) {
            let alTag = document.querySelectorAll('.al .tag-item');
            for (let i = 0; i < alTag.length; i++) {
                labelsList.push(alTag[i].innerHTML);
            }
        }
        else {
            labelsList = null;
        }






        //该“继续”按钮消失(高度变为0，内容为空)
        contBtn[1].classList.add('hide');
        contBtn[1].innerHTML = '';
        //动画
        boat.classList.add('boat3');

        setTimeout(() => {
            //下一个发布板块出现
            issueBox[2].classList.add('show');

        }, 2000)


    })

    //第二个框，点击添加标签
    const addTag = document.querySelector('.add-tag');//添加按钮
    const addInput = document.querySelector('.add-label');//添加输入框
    const confirm = document.querySelector('.confirm');//确定按钮
    const tagBox = document.querySelector('.tag-box');//标签盒子

    document.addEventListener('click', () => {
        if (addInput.value.trim() === '') {
            addInput.classList.remove('active');
            confirm.classList.remove('active');
            confirm.innerHTML = '';
        }
        showInput = false;
    })

    let showInput = false;
    addTag.addEventListener('click', e => {
        e.stopPropagation();
        showInput = true;
        addInput.classList.add('active');
        confirm.classList.add('active');
        confirm.innerHTML = '确定';
    })

    addInput.addEventListener('click', e => {
        e.stopPropagation();
    })


    confirm.addEventListener('click', e => {
        e.stopPropagation();
        if (addInput.value.trim() != '') {
            //添加
            let newTag = document.createElement('div');
            newTag.classList.add('tag-item');
            newTag.innerHTML = `${addInput.value.trim()}`;
            // tagBox.appendChild(newTag);
            tagBox.insertBefore(newTag, tagBox.children[tagBox.children.length - 1])
            addInput.value = '';// 清空输入框


            addInput.classList.remove('active');
            confirm.classList.remove('active');
            confirm.innerHTML = '';
        }

    })

    //可见范围
    const checkLimit = document.querySelectorAll('input[name="check-limit"]');
    const issueTime = document.querySelectorAll('input[name="issue-time"]');
    let visibleScope = null;//可见范围
    let createTime = null;//定时发布


    contBtn[2].addEventListener('click', () => {

        //判断表单是否选中
        if (checkLimit[0].checked === true || checkLimit[1].checked === true) {
            if (issueTime[0].checked === true || issueTime[1].checked === true) {
                // 提交
                if (checkLimit[0].checked) {//所有人可见
                    visibleScope = 1;
                }
                else if (checkLimit[1].checked) {//仅自己可见
                    visibleScope = -1;
                }

                if (issueTime[1].checked) {//定时发布
                    createTime = '';//所设置的时间的字符串
                }




                //提交
                axios({
                    method: 'POST',
                    url: 'http://8.134.176.185:8866/forum/post',
                    headers: {
                        'Content-Type': 'application/json',
                        'token': `${token}`
                    },
                    data: {
                        "title": `${title}`,
                        "words": `${words}`,
                        "labelsList": labelsList,
                        "visibleScope": 1,
                        "createTime": "2023-11-07T04:13Z"
                    }

                }).then(result => {
                    console.log(result);
                    // alert(111);
                }).catch(error => {
                    console.log(error);
                })











                //动画
                boat.classList.add('boat4');


                setTimeout(() => {
                    //提交后跳转
                    location.href = './communicat-area.html';
                }, 1300);

            }
        }
    })






    const title = titInput.value.trim();//标题
    const words = contInput.value.trim();//内容





})