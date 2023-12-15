'use strict';

window.addEventListener('load', () => {

    let token = localStorage.getItem('token');

    const sideResult = document.querySelector('.side-result');//侧边搜索结果板块
    const detailCont = document.querySelector('.detail-cont');//职业详情页
    const spreadBtn = document.querySelector('.spread-btn');//收起、展开按钮
    spreadBtn.addEventListener('click', () => {
        sideResult.classList.toggle('active');
    })
    detailCont.addEventListener('click', e => {
        if (e.target.classList.contains('spread-btn')) {
            detailCont.classList.toggle('active2');
        }
    })







    //搜索框获得焦点后出现搜索历史
    const searchBox = document.querySelector('.search');//搜索框
    const resultBox = document.querySelector('.search-result-box');//搜索历史外面盒子
    const historyBox = document.querySelector('.search-result-box .history-box');//搜索历史框
    const relateBox = document.querySelector('.relate-box');
    const relateWrap = document.querySelector('.relate-wrap');



    //渲染搜索相关
    let relateCont = keyword => {
        axios({
            method: 'POST',
            url: 'http://8.134.176.185:8866/explode/associate',
            headers: {
                'Content-Type': 'application/json',
                'token': `${token}`
            },
            data: {
                "keyword": `${keyword}`
            }
        }).then(result => {
            console.log(result);

            //判断有相关结果再让盒子显示
            if (result.data.data.length != 0) {
                //显示搜索相关盒子
                let relate = () => {
                    //历史搜索盒子消失，搜索相关盒子出现
                    if (searchBox.value.trim() != '') {
                        resultBox.classList.remove('focus');
                        relateBox.classList.add('show-relate');
                    }
                }
                relate();
            }
            let relate = '';
            for (let i = 0; i < result.data.data.length; i++) {
                relate += `<div class="relate">${result.data.data[i]}</div>`
            }
            relateWrap.innerHTML = relate;



            //点击下方搜索相关的盒子可以直接进行搜索
            if (document.querySelector('.relate')) {
                const relateItem = document.querySelectorAll('.relate');
                otherSearch(relateItem);
            }

        })
    }



    //渲染搜索历史
    let showHis = () => {
        axios({
            method: 'GET',
            url: 'http://8.134.176.185:8866/explode/history',
            headers: {
                'Content-Type': 'application/json',
                'token': `${token}`
            }
        }).then(result => {
            console.log(result);
            //数组去重，根据时间排序
            let historyArr = [];//搜索历史数组
            let cont = '';
            for (let i = 0; i < result.data.data.length; i++) {
                historyArr.push(result.data.data[i].content);
            }
            let hisSet = new Set(historyArr);
            let newHis = Array.from(hisSet);//将集合转为数组
            //将数组内容拼接
            for (let i = 0; i < newHis.length; i++) {
                cont += `
                <div class="history">${newHis[i]}
                 <div class="close"></div>
                </div>`;
            }
            historyBox.innerHTML = cont;


            //点击搜索历史的盒子可以直接进行搜索
            if (document.querySelector('.history')) {
                const historyItem = document.querySelectorAll('.history');
                otherSearch(historyItem);
            }
        })
    }

    //输入时显示搜索相关
    searchBox.addEventListener('input', () => {
        let keyword = searchBox.value.trim();
        // relate();
        relateCont(keyword);


        if (searchBox.value.trim() === '') {
            // resultBox.classList.add('focus');
            relateBox.classList.remove('show-relate');
        }
    })

    //点击后搜索历史出现
    searchBox.addEventListener('click', e => {

        //如果输入框为空,就出现搜索历史
        if (searchBox.value.trim() === '') {
            showHis();//搜索历史
            e.stopPropagation();
            searchBox.placeholder = '';
            resultBox.classList.add('focus');
        }
    })
    //点击后搜索历史出现
    resultBox.addEventListener('click', e => {
        e.stopPropagation();
        resultBox.classList.add('focus');
    })
    //点击其他地方后搜索历史消失/搜索相关消失
    document.addEventListener('click', () => {
        searchBox.placeholder = 'What do you want to konw about your profession?';
        resultBox.classList.remove('focus');

        relateBox.classList.remove('show-relate');
    })

    const jobList = document.querySelector('.side-result .result-list');//职业列表



    //点赞后重新获取点赞数
    let getLike = (item, index, keyword,cond) => {
        axios({
            method: 'POST',
            url: 'http://8.134.176.185:8866/explode/search',
            headers: {
                'Content-Type': 'application/json',
                'token': `${token}`
            },
            data: {
                "keyword": `${keyword}`
            }
        }).then(result => {
            // alert(1);
            // alert(`${result.data.data[index].likes},${dLike}`);
            //下面+1是赞数静态+1
            if(cond === 'add'){//如果是添加就加1
                item[index].innerHTML = result.data.data[index].likes + 1;
            }
            if(cond === 'sub'){//如果是添加就加1
                item[index].innerHTML = result.data.data[index].likes;
            }
        })
    }
    //收藏后重新获取收藏数
    let getStore = (item, index, keyword,cond) => {
        axios({
            method: 'POST',
            url: 'http://8.134.176.185:8866/explode/search',
            headers: {
                'Content-Type': 'application/json',
                'token': `${token}`
            },
            data: {
                "keyword": `${keyword}`
            }
        }).then(result => {
            
            if(cond === 'add'){//如果是添加就加1
                item[index].innerHTML = result.data.data[index].collection + 1;
            }
            if(cond === 'sub'){//如果是添加就加1
                item[index].innerHTML = result.data.data[index].collection;
            }
        })
    }


    //搜索并得出结果
    const searchBtn = document.querySelector('.search-btn');//搜索按钮
    searchBtn.addEventListener('click', () => {
        if (searchBox.value.trim() != '') {
            let keyword = searchBox.value.trim();

            //搜索结果
            axios({
                method: 'POST',
                url: 'http://8.134.176.185:8866/explode/search',
                headers: {
                    'Content-Type': 'application/json',
                    'token': `${token}`
                },
                data: {
                    "keyword": `${keyword}`
                }
            }).then(result => {
                console.log(result);
                let jobItem = result.data.data;
                let jobStr = '';
                if (jobItem.length === 0) {
                    jobList.innerHTML = '<div class="blank">暂无搜索结果/(ㄒoㄒ)/~~</div>';
                } else {


                    let showDetail = () => {

                        //点击显示详细内容
                        let jobDesc = document.querySelectorAll('.result-item .desc');
                        jobDesc.forEach((item, i) => {
                            item.addEventListener('click', () => {
                                document.querySelector(' .detail-cont .tit').innerHTML = jobItem[i].job;//职业名称
                                document.querySelector('.detail-cont .def').innerHTML = jobItem[i].info;//职业定义

                                document.querySelector('.detail-cont .work-content').innerHTML = jobItem[i].duties;//工作内容

                                document.querySelector('.detail-cont .skills').innerHTML = jobItem[i].skills;
                                document.querySelector('.detail-cont .course').innerHTML = jobItem[i].course;
                                document.querySelector('.detail-cont .commonTools').innerHTML = jobItem[i].commonTools;
                                document.querySelector('.detail-cont .environment').innerHTML = jobItem[i].environment;
                                document.querySelector('.detail-cont .knowledgeBg').innerHTML = jobItem[i].knowledgeBg;
                                document.querySelector('.detail-cont .professionalEthics').innerHTML = jobItem[i].professionalEthics;
                                document.querySelector('.detail-cont .prospect').innerHTML = jobItem[i].prospect;
                                document.querySelector('.detail-cont .requirements').innerHTML = jobItem[i].requirements;
                                document.querySelector('.detail-cont .salary').innerHTML = jobItem[i].salary;

                                detailCont.classList.add('active');
                                sideResult.classList.add('show');

                                //点击后显示时，默认出现第一个板块
                                navBox[0].click();




                                // //点击详情页里面的点赞收藏


                                // const detailLike = document.querySelector('.detail-cont .like');
                                // const detailStore = document.querySelector('.detail-cont .store');


                                // let dLike = false;

                                // detailLike.addEventListener('click', () => {
                                //     //未点赞状态
                                //     if (!dLike) {
                                //         axios({
                                //             method: 'PUT',
                                //             url: 'http://8.134.176.185:8866/explode/add_like',
                                //             headers: {
                                //                 'Content-Type': 'application/json',
                                //                 'token': `${token}`
                                //             },
                                //             data: {
                                //                 "occupationId": `${occupationId[i]}`
                                //             }
                                //         }).then(result => {
                                //             console.log(result);
                                //             dLike = true;//标记为已点赞
                                //             //重新获取赞数
                                //             getLike(likeBtns, i, keyword);
                                //         })
                                //     }
                                //     else {//已点赞状态（取消点赞
                                //         axios({
                                //             method: 'PUT',
                                //             url: 'http://8.134.176.185:8866/explode/cancel_like',
                                //             headers: {
                                //                 'Content-Type': 'application/json',
                                //                 'token': `${token}`
                                //             },
                                //             data: {
                                //                 "occupationId": `${occupationId[i]}`
                                //             }
                                //         }).then(result => {
                                //             console.log(result);
                                //             dLike = false;//标记为未点赞
                                //             //重现获取赞数
                                //             // getLike(i,keyword);
                                //             getLike(likeBtns, i, keyword);


                                //         }).catch(error => {
                                //             console.log(error);
                                //         })
                                //     }

                                // })
                            })
                        })
                    }




                    for (let i = 0; i < jobItem.length; i++) {
                        // let resultItem = document.createElement('li');
                        // resultItem.classList.add('result-item');
                        // resultItem.innerHTML =
                        // jobList.appendChild(resultItem);
                        jobStr += `
                        <li class="result-item">
                        <div class="tit">${jobItem[i].job}</div>
                        <div class="desc">${jobItem[i].info}
                        </div>
                        <div class="sel-box">
                            <div class="sel like">${jobItem[i].likes}</div>
                            <div class="sel store">${jobItem[i].collection}</div>
                        </div>
                        </li>
                    `
                    }
                    jobList.innerHTML = jobStr;


                    //点赞部分
                    let likeBtns = document.querySelectorAll('.like');
                    let storeBtns = document.querySelectorAll('.store');
                    let occupationId = [];
                    for (let i = 0; i < jobItem.length; i++) {
                        occupationId.push(jobItem[i].id);//获取当前各个职业的id
                    }
                    //点赞
                    likeBtns.forEach((item, index) => {
                        let dLike = false;
                        item.addEventListener('click', () => {
                            //未点赞状态
                            if (!dLike) {
                                axios({
                                    method: 'PUT',
                                    url: 'http://8.134.176.185:8866/explode/add_like',
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'token': `${token}`
                                    },
                                    data: {
                                        "occupationId": `${occupationId[index]}`
                                    }
                                }).then(result => {
                                    console.log(result);
                                    dLike = true;//标记为已点赞
                                    item.classList.add('isLike');//添加点赞样式
                                    // item.innerHTML = '22';
                                    //重新获取赞数（好像没办法即时渲染，上面先写个静态...
                                    getLike(likeBtns, index, keyword,'add');
                                })
                            }
                            else {//已点赞状态（取消点赞
                                axios({
                                    method: 'PUT',
                                    url: 'http://8.134.176.185:8866/explode/cancel_like',
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'token': `${token}`
                                    },
                                    data: {
                                        "occupationId": `${occupationId[index]}`
                                    }
                                }).then(result => {
                                    console.log(result);
                                    dLike = false;//标记为未点赞
                                    item.classList.remove('isLike');//移除点赞样式
                                    //重现获取赞数
                                    // getLike(index,keyword);
                                    getLike(likeBtns, index, keyword,'sub');


                                }).catch(error => {
                                    console.log(error);
                                })
                            }

                        })
                    })

                    //收藏
                    storeBtns.forEach((item, index) => {
                        let dStore = false;
                        item.addEventListener('click', () => {
                            //未点赞状态
                            if (!dStore) {
                                axios({
                                    method: 'PUT',
                                    url: 'http://8.134.176.185:8866/explode/add_collection',
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'token': `${token}`
                                    },
                                    data: {
                                        "occupationId": `${occupationId[index]}`
                                    }
                                }).then(result => {
                                    console.log(result);
                                    dStore = true;//标记为已点赞
                                    item.classList.add('isStore');//添加点赞样式
                                    //重新获取赞数
                                    getStore(storeBtns, index, keyword,'add');
                                })
                            }
                            else {//已点赞状态（取消点赞
                                axios({
                                    method: 'PUT',
                                    url: 'http://8.134.176.185:8866/explode/cancel_collection',
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'token': `${token}`
                                    },
                                    data: {
                                        "occupationId": `${occupationId[index]}`
                                    }
                                }).then(result => {
                                    console.log(result);
                                    dStore = false;//标记为未点赞
                                    item.classList.remove('isStore');//移除点赞样式
                                    //重现获取赞数
                                    // getStore(index,keyword);
                                    getStore(storeBtns, index, keyword,'sub');


                                }).catch(error => {
                                    console.log(error);
                                })
                            }

                        })
                    })



                    showDetail();





                }
                //搜索结果在侧边出现
                // spreadBtn.click();
                sideResult.classList.add('active');

            })
        }
    })


    //点击盒子自动搜索
    let otherSearch = (searchCont) => {
        searchCont.forEach((item, index) => {
            item.addEventListener('click', () => {
                //输入框自动输入
                searchBox.value = item.innerText;
                //点击搜索按钮
                searchBtn.click();
            })
        })
    }




    //职业详情框
    //点击选择不同板块
    const navBox = document.querySelectorAll('.sel-btn');//选择的框
    const resultList = document.querySelectorAll('.detail-cont .result-list');
    navBox.forEach((item, index) => {
        item.addEventListener('click', () => {
            document.querySelector('.nav-box .active').classList.remove('active');
            item.classList.add('active');
            document.querySelector('.detail-cont .select').classList.remove('select');
            resultList[index].classList.add('select');
        })
    })

    //详情页点击返回
    const preBtn = document.querySelector('.detail-cont .pre-btn');
    preBtn.addEventListener('click', () => {
        detailCont.classList.toggle('active');
        sideResult.classList.toggle('show');
    })



































    //todo-list

    //星球图片
    let planetArr = ['./images/planet1.png', './images/planet2.png', './images/planet2.png', './images/planet2.png'];
    const planet = document.querySelector('.planet');//星球


    // 点击介绍按钮，出现规则介绍
    const tipBtn = document.querySelector('.todo-bingo .index-tip');
    const descBox = document.querySelector('.plate-desc-wrap');
    tipBtn.addEventListener('click', () => {
        descBox.classList.add('showDesc');
    })
    descBox.addEventListener('click', e => {
        if (e.target.classList.contains('close')) {
            descBox.classList.remove('showDesc');
        }
    })

    //点击切换总计划
    const preListBtn = document.querySelector('.preListBtn');//切换上一个按钮
    const nextListBtn = document.querySelector('.nextListBtn');//切换下一个按钮
    const planList = document.querySelector('.todo-bingo .doing .todo-plan');//计划列表

    const todoPlan = document.querySelector('.todo-list-wrap');//计划播放列表
    const tidoList = document.querySelectorAll('.todo-list');//所有计划盒子


    let moveCount = 0;//判断移动
    preListBtn.addEventListener('click', () => {
        moveCount = moveCount-- > 0 ? moveCount-- : 0;
        // alert(moveCount);
        planList.style.left = `-${planList.clientWidth * moveCount}px`;
        todoPlan.style.left = `-${(tidoList[0].clientWidth + 30) * moveCount}px`;
        planet.style.backgroundImage = `url(${planetArr[moveCount]})`;
    })
    nextListBtn.addEventListener('click', () => {
        moveCount = moveCount++ < planList.children.length - 1 ? moveCount++ : planList.children.length - 1;
        // alert(moveCount);
        planList.style.left = `-${planList.clientWidth * moveCount}px`;
        todoPlan.style.left = `-${(tidoList[0].clientWidth + 30) * moveCount}px`;
        planet.style.backgroundImage = `url(${planetArr[moveCount]})`;

    })



    const todoBox = document.querySelector('.todo-bingo');//计划板块
    const todoBtn = document.querySelector('.todo-btn');//计划板块开启按钮
    const closeBtn = document.querySelector('.todo-bingo .close ');//计划关闭按钮
    let showHide = btn => {//计划显示隐藏
        btn.addEventListener('click', () => {
            todoBox.classList.toggle('show2');
            todoBtn.classList.toggle('hide');
        })
    }
    showHide(todoBtn);
    showHide(closeBtn);







    // const showTime = document.querySelector('.start-time .show-time');//显示日期的框
    // const startInput = document.querySelector('.start-time input');
    // startInput.addEventListener('click',() => {
    //     showTime.innerHTML = startInput.value;
    // })

    const showTime = document.querySelectorAll('.show-time');//时间文本
    const dataEdit = document.querySelectorAll('.data-edit');//时间编辑盒子
    const todoWrap = document.querySelectorAll('.todo-item');//计划盒子最外层
    const editBtn = document.querySelector('.edit-btn');//编辑按钮
    const inadequate = document.querySelector('.inadequate');//没有填完整时出现的提示框


    const todoItem = document.querySelectorAll('#stage1 .text');//第一阶段每个计划文本内容
    const editArea = document.querySelectorAll('#stage1 .todo-edit');//第一阶段编辑区域
    const editArea2 = document.querySelectorAll('#stage2 .todo-edit');//第二阶段编辑区域
    const todoItem2 = document.querySelectorAll('#stage2 .text');//第二个阶段的
    // let firstSet = true;//第一次设置计划
    let stage = 1;//任务阶段
    // if (document.querySelector('#stage2')) {
    //     alert(11111);
    // }


    //查看计划表
    let check = (stage,todoItem) => {
        axios({
            method: 'GET',
            url: 'http://8.134.176.185:8866/explode/my-plan/' + stage,
            headers: {
                'Content-Type': 'application/json',
                'token': `${token}`
            }
        }).then(result => {
            console.log('查看：');
            console.log(result);

            if (result.data.data != null) {//（未设置之前为null
                //转为二维数组后转为一维数组
                let markArr = result.data.data.finishArray.toString().split(',');
                // console.log(markArr);

                let taskArr = result.data.data.desArray;
                let tasks = [];
                for (let i = 0; i < taskArr.length; i++) {
                    tasks.push(...taskArr[i]);
                }

                console.log('设置的计划：');
                console.log(tasks);
                todoItem.forEach((item, index) => {
                    item.innerHTML = tasks[index];

                    if (markArr[index] == 1) {
                        // alert(3);
                        todoWrap[index].classList.add('click');//圈
                    }
                })
            }

        })

    }


    // //（第一次设置之后才可以
    check(1,todoItem);
    check(2,todoItem2);



    const planEdit = document.querySelectorAll('.plan-edit');//总计划编辑框
    const planText = document.querySelectorAll('.plan-text');//总计划内容

    //星球盒子
    const planetWrap = document.querySelector('.planet-wrap');
    const attentionBox = document.querySelector('.attention');//圣光


    //完成后出现的动画
    let finish = () => {
        setTimeout(() => {
            planetWrap.classList.add('finish-plan');
            setTimeout(() => {
                attentionBox.classList.add('show-attention');
            }, 1500)
        }, 1000)
    }

    //如果全部完成了：
    let finishPlan = () => {
        finish();
        const contiBtn = document.querySelector('.conti');
        contiBtn.classList.add('show-conti');

        contiBtn.addEventListener('click', () => {
            contiBtn.classList.remove('show-conti');
            attentionBox.classList.remove('show-attention');
            planetWrap.classList.remove('finish-plan');

            nextListBtn.click();//点击继续后出现下一计划表

            stage++;//阶段+1

            //背景图更换
        })
    }

    //保存or编辑

    editBtn.addEventListener('click', () => {

        let showHide2 = () => {
            showTime[0].classList.toggle('showHide');
            showTime[1].classList.toggle('showHide');
            dataEdit[0].classList.toggle('showHide');
            dataEdit[1].classList.toggle('showHide');
        }
        //转为已保存状态
        if (editBtn.innerHTML === '保存') {


            planText.forEach((item, index) => {
                item.innerHTML = planEdit[index].value;
                item.classList.toggle('show-planEdit');
                planEdit[index].classList.toggle('show-planEdit');
            })




            let isSet = true;//判断是否都填了
            if (dataEdit[0].value.trim() === '' || dataEdit[1].value.trim() === '') {
                isSet = false;
            }
            editArea.forEach((item, index) => {
                if (item.value.trim() === '' && !todoWrap[index].classList.contains('click')) {
                    isSet = false;
                }
            })

            if (isSet) {//都填了

                const setVals = [];
                //保存时间
                showHide2();
                showTime[0].innerHTML = dataEdit[0].value;
                showTime[1].innerHTML = dataEdit[1].value;







                editArea.forEach((item, index) => {
                    //判断是没圈过的
                    if (!todoWrap[index].classList.contains('click')) {
                        //输入框消失
                        item.classList.toggle('turn-edit');
                        //原来的文本框赋值后出现
                        todoItem[index].innerHTML = item.value.trim();
                        todoItem[index].classList.remove('hide-text');
                    }
                    setVals.push(todoItem[index].innerHTML);
                })
                //保存状态下文本显示“编辑”
                editBtn.innerHTML = '编辑';


                //保存到5*5数组
                let desArray = [];
                for (let i = 0; i < 5; i++) {
                    desArray.push(setVals.slice(i * 5, i * 5 + 5));
                }





                //设置or更新
                axios({
                    method: 'PUT',
                    url: 'http://8.134.176.185:8866/explode/plan',
                    headers: {
                        'Content-Type': 'application/json',
                        'token': `${token}`
                    },
                    data: {
                        "task": "打游戏",
                        "startTime": `${showTime[0].innerHTML}`,
                        "endTime": `${showTime[1].innerHTML}`,
                        "stage": stage,
                        "desArray": desArray
                    }
                }).then(result => {
                    console.log('设置：');
                    console.log(result);
                    // alert(111);
                })
            }
            else {//有未填的
                inadequate.classList.add('showInad');//提示框出现
                setTimeout(() => {
                    inadequate.classList.remove('showInad');//提示框消失
                }, 2000);
            }
        }
        //转为编辑状态
        else {
            //编辑时间
            showHide2();
            dataEdit[0].value = showTime[0].innerHTML;
            dataEdit[1].value = showTime[1].innerHTML;


            planEdit.forEach((item, index) => {
                item.value = planText[index].innerHTML;
                item.classList.toggle('show-planEdit');
                planText[index].classList.toggle('show-planEdit');
            })


            editArea.forEach((item, index) => {
                //判断是否已完成（已完成的就不能再编辑
                if (!todoWrap[index].classList.contains('click')) {
                    //把原有内容赋值到输入框里
                    item.value = todoItem[index].innerHTML;
                    //输入框出现
                    item.classList.toggle('turn-edit');
                    //原来的文本框消失
                    todoItem[index].classList.add('hide-text');
                }
            })
            editBtn.innerHTML = '保存';
        }
    })

    const finishBtn = document.querySelector('.finish-btn');//完成按钮
    const askBox = document.querySelector('.ask');//确认盒子
    const cancle = document.querySelector('.cancle');//取消
    const conf = document.querySelector('.conf');//确定


    let angle = 18;//星球一开始的角度的值

    todoWrap.forEach((item, index) => {
        let isSel = false;
        item.addEventListener('click', () => {
            //判断是否已完成 或者 处于编辑状态 （点击后不改变样式
            if (!item.classList.contains('click') && editBtn.innerHTML != '保存') {
                item.classList.toggle('active');//盒子选中样式
            }
            //（通过判断是否有这个类来判断是否选中
            if (document.querySelector('.todo-list .active')) { //选中时
                isSel = true;//是否是所点击的
                finishBtn.classList.add('show-finish');//完成按钮出现
                //点击完成按钮
                finishBtn.addEventListener('click', () => {
                    //询问确认盒子出现
                    askBox.classList.add('show-ask');
                    //点击取消按钮
                    cancle.addEventListener('click', () => {
                        askBox.classList.remove('show-ask');//询问盒子消失
                        if (isSel) {
                            item.click();//再自动选一次（取消-->选中样式消失
                        }
                        finishBtn.classList.remove('show-finish');//完成按钮消失
                        isSel = false;//取消点击标记
                    })
                    //点击确认按钮
                    conf.addEventListener('click', () => {
                        askBox.classList.remove('show-ask');//询问盒子消失
                        if (isSel) {
                            item.classList.add('click');//圈起来

                            check();//调用一次查看（判断是否连线

                            //获取该计划所在坐标
                            let row = Math.floor(index / 5);//行
                            let col = index % 5;//列

                            //发送已完成的
                            axios({
                                method: 'POST',
                                url: 'http://8.134.176.185:8866/explode/finish',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'token': `${token}`
                                },
                                data: {
                                    "coordinate": `${row},${col}`,
                                    "stage": stage
                                }
                            }).then(result => {
                                console.log('完成：');
                                console.log(result);
                                // alert(122211);

                                //判断连线了(连线成功会返回一个数组
                                if (Array.isArray(result.data.data)) {
                                    // alert(2);
                                    //星球旋转
                                    planet.style.transform = `rotate(${angle -= 30}deg)`;
                                }


                                //全部完成，呈现整个星球
                                if (result.data.data === 2) {
                                    finishPlan();
                                }




                            })

                        }
                        item.classList.remove('active');//选中样式消失
                        finishBtn.classList.remove('show-finish');//完成按钮消失
                        isSel = false;
                    })
                })
            }
            else {
                //取消选中时“完成”按钮消失
                finishBtn.classList.remove('show-finish');//完成按钮出现
                isSel = false;
            }

        })
    })




    // /*宇航员行走*/
    const man = document.querySelector('.man');
    // setInterval(() => {
    //     // man.style.backgroundImage = `url(./images/man-wolk1.png)`;
    //     man.style.backgroundPosition = 'top';
    //     setTimeout(() => {
    //         // man.style.backgroundImage = `url(./images/man-walk2.png)`;
    //         man.style.backgroundPosition = 'bottom';
    //     }, 125)
    // }, 250)
    setTimeout(() => {
        man.classList.add('man-float');
    }, 3000)
})