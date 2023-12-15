'use strict';


//mbti测试

window.addEventListener('load', () => {
    let token = localStorage.getItem('token');
    const axiosInstance = axios.create({
        baseURL: 'http://8.134.176.185:8866',
        headers: {
            'Content-Type': 'application/json',
            'token': `${token}`
        }
    })

    //选择题目
    const selectWrap = document.querySelector('.select-wrap');//选择题目板块
    const testWrap = document.querySelector('.test-wrap');//测试板块
    const selItem = document.querySelectorAll('.sel-item');//题目数选择按钮
    const startBtn = document.querySelector('.start .start-btn');//开始测试按钮

    //获取题目数
    let num = 0;
    const arrNum = [28, 52, 93];
    selItem.forEach((item, index) => {
        item.addEventListener('click', () => {
            num = arrNum[index];
            document.querySelector('.active').classList.remove('active');
            item.classList.add('active');
        })
    })

    //存放题目数组
    let titArr = [];
    let answerA = [];
    let answerB = [];
    let testId = [];

    //题目索引(也指已选题数)
    let i = 0;


    //显示答题进度
    const progress = document.querySelector('.test-wrap .tip .process');


    //点击按钮进入测试
    startBtn.addEventListener('click', () => {
        //判断是否已选
        if (num != 0) {
            // 选择板块变为测试板块
            selectWrap.classList.add('disable');
            testWrap.classList.remove('disable');


            //获取题目
            axiosInstance({
                method: 'GET',
                url: '/mbti/' + num,
            }).then(result => {
                // console.log(result.data.data[i]);
                for (let i = 0; i < num; i++) {
                    let { content, aanswer, banswer, id } = result.data.data[i];
                    titArr.push(content);
                    answerA.push(aanswer);
                    answerB.push(banswer);
                    testId.push(id);//存放id
                }
                mbtiTit.innerHTML = titArr[0];
                selA.innerHTML = answerA[0];
                selB.innerHTML = answerB[0];
                progress.innerHTML = `${i}/${num}`;
            })
        }
    })



    //进入mbti测试
    const mbtiTit = document.querySelector('.test-wrap .tit-desc');//题目
    const selA = document.querySelector('.sel-box .sel-A');//A选项
    const selB = document.querySelector('.sel-box .sel-B');//B选项
    const preBtn = document.querySelector('.test-wrap .prev');//上一题按钮
    const viewBtn = document.querySelector('.test-wrap .view');//查看报告按钮


    let map = {}; //键值对  id-选项

    const getNext = (btn, answer) => {
        btn.addEventListener('click', () => {
            if (i <= num - 1) {
                i++;
                mbtiTit.innerHTML = titArr[i];
                selA.innerHTML = answerA[i];
                selB.innerHTML = answerB[i];
            }
            if (i > 0) {
                preBtn.style.display = 'block';
            }
            progress.innerHTML = `${i}/${num}`;
            if (i === num) {
                //“查看报告”出现
                viewBtn.style.display = 'block';

                mbtiTit.innerHTML = titArr[i - 1];
                selA.innerHTML = answerA[i - 1];
                selB.innerHTML = answerB[i - 1];
                progress.innerHTML = `${num}/${num}`;
            }
            else {
                viewBtn.style.display = 'none';
            }

            // 添加
            map[testId[i - 1]] = answer;//i表示已选题数，所以这里获取的是显示的上一题的答案，i-1

        });
    }
    getNext(selA, 'A');
    getNext(selB, 'B');


    
    //点击查看报告(存储mbti、跳转)
    viewBtn.addEventListener('click', () => {
        axiosInstance({
            method: 'POST',
            url: '/mbti',
            data: map,
            headers: {
                'Content-Type': 'application/json',
                'token': `${token}`
            }
        }).then(result => {
            //上传结果
            let mbti = result.data.data.mbtiName;
            if (!localStorage.getItem('mbti')) {
                localStorage.setItem('mbti', mbti);
            }
            location.href = './test-report.html';
        })
    })




    //上一题
    preBtn.addEventListener('click', () => {
        i--;
        if (i <= 0) {
            preBtn.style.display = 'none';
        }
        mbtiTit.innerHTML = titArr[i];
        selA.innerHTML = answerA[i];
        selB.innerHTML = answerB[i];
        progress.innerHTML = `${i}/${num}`;
        if (i != num) {
            viewBtn.style.display = 'none';
        }
    })


})