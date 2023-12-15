'use strict';

//desc测试

window.addEventListener('load', () => {

    let num = 40;

    //存放题目数组
    let ansA = [];
    let ansB = [];
    let ansC = [];
    let ansD = [];
    let testId = [];

    //题目索引(也指已选题数)
    let i = 0;


    //显示答题进度
    const progress = document.querySelector('.test-wrap .tip .process');




    //获取题目

    let test = () => {
        axios({
            method: 'GET',
            url: 'http://8.134.176.185:8866/disc',
        }).then(result => {
            console.log(result);
            for (let i = 0; i < num; i++) {
                let { aanswer, banswer, canswer, danswer, id } = result.data.data[i];
                ansA.push(aanswer);
                ansB.push(banswer);
                ansC.push(canswer);
                ansD.push(danswer);
                testId.push(id);//存放id
            }
            selA.innerHTML = ansA[0];
            selB.innerHTML = ansB[0];
            selC.innerHTML = ansC[0];
            selD.innerHTML = ansD[0];
            progress.innerHTML = `${i}/${num}`;
        })
    }


    test();



    //进入mbti测试
    const selA = document.querySelector('.sel-box3 .sel-A');//A选项
    const selB = document.querySelector('.sel-box3 .sel-B');//B选项
    const selC = document.querySelector('.sel-box3 .sel-C');//B选项
    const selD = document.querySelector('.sel-box3 .sel-D');//B选项
    const preBtn = document.querySelector('.test-wrap .prev');//上一题按钮
    const viewBtn = document.querySelector('.test-wrap .view');//查看报告按钮


    let report = {};

    const getNext = (btn, ans) => {
        btn.addEventListener('click', () => {
            if (i <= num - 1) {
                i++;
                selA.innerHTML = ansA[i];
                selB.innerHTML = ansB[i];
                selC.innerHTML = ansC[i];
                selD.innerHTML = ansD[i];
            }
            if (i > 0) {
                preBtn.style.display = 'block';
            }
            progress.innerHTML = `${i}/${num}`;
            if (i === num) {
                //“查看报告”出现
                viewBtn.style.display = 'block';
                selA.innerHTML = ansA[i-1];
                selB.innerHTML = ansB[i-1];
                selC.innerHTML = ansC[i-1];
                selD.innerHTML = ansD[i-1];
                progress.innerHTML = `${num}/${num}`;
            }
            else {
                viewBtn.style.display = 'none';
            }


            // 添加
            report[testId[i - 1]] = ans;//i表示已选题数，所以这里获取的是显示的上一题的答案，i-1
        });
    }

    getNext(selA,'A');
    getNext(selB,'B');
    getNext(selC,'C');
    getNext(selD,'D');

    let token = 'eyJhbGciOiJIUzI1NiJ9.eyJpZCI6NSwiZXhwIjoxNzAyODIyMjQzfQ.sUeuUiA3qBornB_pDW9DJPhahMKeP6pyTFtfuXpGI_Y';
    //点击查看报告
    viewBtn.addEventListener('click', () => {
        axios({
            method: 'POST',
            url: 'http://8.134.176.185:8866/disc/report',
            headers: {
                'Content-Type': 'application/json',
                'token': `${token}`
            },
            data: report
        }).then(result => {
            console.log(result);
            //上传结果
            let discReport = JSON.stringify(result.data.data);

            if (!localStorage.getItem('discReport')) {
                localStorage.setItem('discReport', discReport);
            }
            location.href = './test3-report.html';
        })
    })




    //上一题
    preBtn.addEventListener('click', () => {
        i--;
        if (i <= 0) {
            preBtn.style.display = 'none';
        }
        selA.innerHTML = ansA[i];
        selB.innerHTML = ansB[i];
        selC.innerHTML = ansC[i];
        selD.innerHTML = ansD[i];
        progress.innerHTML = `${i}/${num}`;
        if (i != num) {
            viewBtn.style.display = 'none';
        }
    })


})