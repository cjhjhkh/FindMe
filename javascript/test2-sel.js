'use strict';

//mbti测试

window.addEventListener('load', () => {
    //选择题目
    const selectWrap = document.querySelector('.select-wrap');//选择题目板块
    const testWrap = document.querySelector('.test-wrap');//测试板块
    const selItem = document.querySelectorAll('.sel-item');//题目数选择按钮
    const startBtn = document.querySelector('.start .start-btn');//开始测试按钮

    //获取题目数
    let num = 0;
    const arrNum = [30, 60, 90];
    selItem.forEach((item, index) => {
        item.addEventListener('click', () => {
            num = arrNum[index];
            document.querySelector('.active').classList.remove('active');
            item.classList.add('active');
        })
    })

    //存放题目数组
    let titArr = [];
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
            axios({
                method: 'GET',
                url: 'http://8.134.176.185:8866/hld/' + num,
            }).then(result => {
                for (let i = 0; i < num; i++) {
                    let { content, id } = result.data.data[i];
                    titArr.push(content);
                    testId.push(id);//存放id
                }
                tit.innerHTML = titArr[0];
                progress.innerHTML = `${i}/${num}`;
            })
        }
    })


    //进入mbti测试
    const tit = document.querySelector('.test-wrap .tit-desc');//题目
    const selA = document.querySelector('.sel-box .sel-A');//A选项
    const selB = document.querySelector('.sel-box .sel-B');//B选项
    const preBtn = document.querySelector('.test-wrap .prev');//上一题按钮
    const viewBtn = document.querySelector('.test-wrap .view');//查看报告按钮


    let answer = [];

    const getNext = (btn, val) => {
        btn.addEventListener('click', () => {
            if (i <= num - 1) {
                i++;
                tit.innerHTML = titArr[i];
            }
            if (i > 0) {
                preBtn.style.display = 'block';
            }
            progress.innerHTML = `${i}/${num}`;
            if (i === num) {
                //“查看报告”出现
                viewBtn.style.display = 'block';

                tit.innerHTML = titArr[i - 1];
                progress.innerHTML = `${num}/${num}`;
            }
            else {
                viewBtn.style.display = 'none';
            }


            // 添加
            if (val === '是') {
                let id = testId[i - 1];
                answer.push(id);
            }

        });
    }
    getNext(selA,'是');
    getNext(selB,'否');

    let token = 'eyJhbGciOiJIUzI1NiJ9.eyJpZCI6NSwiZXhwIjoxNzAyODIyMjQzfQ.sUeuUiA3qBornB_pDW9DJPhahMKeP6pyTFtfuXpGI_Y';


    //点击查看报告
    viewBtn.addEventListener('click', () => {
        axios({
            method: 'POST',
            url: 'http://8.134.176.185:8866/hld/report',
            headers: {
                'Content-Type': 'application/json',
                'token': `${token}`
            },
            data: {
                answer
            }
        }).then(result => {

            // console.log(result);
            // //上传结果
            let hldReport = JSON.stringify(result.data.data);
            // console.log(hldReport);
            if (!localStorage.getItem('hldReport')) {
                localStorage.setItem('hldReport', hldReport);
            }
            location.href = './test2-report.html';
            // console.log(localStorage.getItem('hldReport'));

        })
    })




    //上一题
    preBtn.addEventListener('click', () => {
        i--;
        if (i <= 0) {
            preBtn.style.display = 'none';
        }
        tit.innerHTML = titArr[i];
        progress.innerHTML = `${i}/${num}`;
        if (i != num) {
            viewBtn.style.display = 'none';
        }
    })


})