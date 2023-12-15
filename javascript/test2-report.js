'use strict';


window.addEventListener('load', () => {


    let hldReport = localStorage.getItem('hldReport');//测试结果data
    console.log(hldReport);

    //将json 转回来
    let report = JSON.parse(hldReport);
    console.log(report);

    //获取数据
    let { a, c, e, i, r } = report;
    let commonCharacter = [];
    let type = [];
    let typeName = [];
    let typicalJob = [];
    for (let i = 0; i < 3; i++) {
        commonCharacter.push(report.reports[i].commonCharacter);
        type.push(report.reports[i].type);
        typeName.push(report.reports[i].typeName);
        typicalJob.push(report.reports[i].typicalJob);
    }

    const descCont = document.querySelectorAll('.test2-report .value-desc .cont ');
    commonCharacter.forEach((item, index) => {
        descCont[index].innerHTML = commonCharacter[index];
    })


    //最上面三个字母
    document.querySelector('.test2-report .value:nth-child(1) .item').innerHTML = type[0];
    document.querySelector('.test2-report .value:nth-child(2) .item').innerHTML = type[1];
    document.querySelector('.test2-report .value:nth-child(3) .item').innerHTML = type[2];


    //卡片字母
    document.querySelectorAll('.value-wrap1 .watermark')[0].innerHTML = type[0];
    document.querySelectorAll('.value-wrap1 .watermark')[1].innerHTML = type[0];
    document.querySelectorAll('.value-wrap2 .watermark')[0].innerHTML = type[1];
    document.querySelectorAll('.value-wrap2 .watermark')[1].innerHTML = type[1];
    document.querySelectorAll('.value-wrap3 .watermark')[0].innerHTML = type[2];
    document.querySelectorAll('.value-wrap3 .watermark')[1].innerHTML = type[2];
    //类型
    document.querySelectorAll('.test2-report .desc')[0].innerHTML = typeName[0];
    document.querySelectorAll('.test2-report .desc')[1].innerHTML = typeName[1];
    document.querySelectorAll('.test2-report .desc')[2].innerHTML = typeName[2];
    //职业相关


    document.querySelectorAll('.test2-report .ralate .cont')[0].innerHTML = typicalJob[0];
    document.querySelectorAll('.test2-report .ralate .cont')[1].innerHTML = typicalJob[1];
    document.querySelectorAll('.test2-report .ralate .cont')[2].innerHTML = typicalJob[2];







    //雷达图

    const radarBox = document.querySelector('.radar-map');//装雷达图的盒子
    let mCharts = echarts.init(radarBox);

    // 准备配置项 (一个对象)

    //定义各个维度的最大值，通过radar属性配置
    let dataMax = [
        {
            name: '艺术(A)',
            max: 10
        },
        {
            name: '传统(C)',
            max: 10
        },
        {
            name: '企业(E)',
            max: 10
        },
        {
            name: '研究(I)',
            max: 10
        },
        {
            name: '社会(S)',
            max: 10

        }
    ]

    let option = {
        //配置雷达属性
        radar: {
            indicator: dataMax,  //指示器（每个维度的最大值要通过indecator这个节点来进行配置
        },
        series: [
            {
                type: 'radar',//radar 此图标是一个雷达图
                label: {//设置标签的样式
                    // textStyle: { // 设置文字样式
                    //     color: '#fff', // 文字颜色
                    //     fontSize: 14, // 字体大小
                    //     fontWeight: 'bold' // 字体粗细
                    // }
                },
                areaStyle: {
                    color: 'rgba(201, 180, 240, 0.6)',
                    // // borderColor: '#fff',
                    // shadowColor: '#fff',
                    // color: 'rgba(0, 0, 255, 0.1)', // 设置雷达图区域的颜色
                    // shadowColor: 'rgba(0, 0, 255, 0.3)' // 设置雷达图区域的阴影颜色
                },//阴影面积
                data: [
                    {
                        name: 'hld',
                        value: [a, c, e, i, r]
                    }
                ]
            }
        ]
    }
    // 步骤5: 将配置项设置给echarts实例对象
    mCharts.setOption(option);






    //卡片移动
    const card = document.querySelector('.cards');//卡片
    const swBtn = document.querySelector('.switch-btn');
    swBtn.addEventListener('click', () => {
        card.classList.toggle('scroll-to-top');
        radarBox.classList.toggle('shrink');
        swBtn.classList.toggle('btn-rotate');
    })
})