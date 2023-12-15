'use strict';

window.addEventListener('load', () => {

    let token = localStorage.getItem('token');

    const container = document.querySelector('.value-report-wrap');
    const reportCard = document.querySelectorAll('.report-card');
    container.addEventListener('click', e => {
        if (e.target.classList.contains('report-card')) {
            e.target.classList.toggle('active');
        }
    })



    let valList = null;



    //获取上一阶段选择的
    axios({
        method: 'GET',
        url: 'http://8.134.176.185:8866/explode/progress',
        headers: {
            'Content-Type': 'application/json',
            'token': `${token}`
        }
    }).then(result => {
        console.log(result);
        valList = result.data.data.valuesList;





        axios({
            method: 'POST',
            url: 'http://8.134.176.185:8866/explode/result',
            headers: {
                'Content-Type': 'application/json',
                'token': `${token}`
            },
            data: {
                "valuesList": ['同事关系', '生活方式', '多样变化'],
                "progress": "2"
            }
        }).then(result => {
            console.log(result);

            const valueItem = document.querySelectorAll('.report-tit .text');
            const desc = document.querySelectorAll('.report-card .desc1');
            const desc2 = document.querySelectorAll('.report-card .desc2');

            for(let i = 0;i<3;i++){
                valueItem[i].innerHTML = result.data.data[i].valuesDes;
                desc[i].innerHTML = result.data.data[i].des;
                desc2[i].innerHTML = result.data.data[i].valuesReferences;
            }
        })
    })






})