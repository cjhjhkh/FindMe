'use strict';


window.addEventListener('load', () => {

    let discReport = localStorage.getItem('discReport');//测试结果data

    console.log(discReport);
    const discClass = document.querySelector('.value-box ');//disc类型
    const desc = document.querySelector('.desc');//简单分析
    const textDesc = document.querySelectorAll('.detail-desc .descb ');//各方面文字分析

    //将json 转回来
    let report = JSON.parse(discReport);

    let { id, info, emotion, work, relation, description } = report;
    console.log(emotion);

    discClass.innerHTML = report.emotion.substring(0,2);
    desc.innerHTML = info;
    textDesc[0].innerHTML = emotion.split(`}人`).join('');
    textDesc[1].innerHTML = work;
    textDesc[2].innerHTML = relation;
    textDesc[3].innerHTML = description;


})