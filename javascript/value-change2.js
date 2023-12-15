'use strict';

window.addEventListener('click', () => {
    let token = localStorage.getItem('token');

    const swapVal = document.querySelector('.value-change .swap-value');//供待交换的价值观的盒子
    const tipCont = document.querySelector('.value-change .tip-desc');//点击任意位置继续盒子
    let isContinue = false;
    if (!isContinue) {
        document.addEventListener('click', () => {
            tipCont.classList.remove('cont-active');
            swapVal.classList.add('cli-continue');
            setTimeout(() => {
                swapVal.style.opacity = 1;
            }, 300);
            isContinue = true;
        })
    }

    const alValue = document.querySelectorAll('.already-value .sel-value');//上一阶段选择的价值观(盒子
    const swapValue = document.querySelectorAll('.swap-value .sel-value');//待交换的价值观（盒子
    let allVal = ['工作环境', '成就满足', '智性激发', '帮助他人', '美的追求', '创造发明', '独立自主', '名誉地位', '管理权力', '经济报酬', '上级关系', '安全稳定', '同事关系', '生活方式', '多样变化']//总的15个价值观

    let selValues = [];//已选价值观数组

    let isGet = false;
    if (!isGet) {

        //获取上一阶段选择的并渲染
        axios({
            method: 'GET',
            url: 'http://8.134.176.185:8866/explode/progress',
            headers: {
                'Content-Type': 'application/json',
                'token': `${token}`
            }
        }).then(result => {
            // alert(1);
            console.log(result);
            alValue.forEach((item, index) => {
                // 添加已选价值观
                selValues.push(result.data.data.valuesList[index]);
                item.innerHTML = result.data.data.valuesList[index];
            })

            //获取除原有价值观以外价值观
            let swap = allVal.filter(item => !result.data.data.valuesList.includes(item));

            //渲染待交换
            swapValue.forEach((item, index) => {
                item.innerHTML = swap[index]
            })

            isGet = true;
        })

    }



    //拖放

    function allowDrop(ev) {
        ev.preventDefault();
    }

    function drag(ev) {
        ev.dataTransfer.setData("Text", ev.target.id);
    }

    function drop(ev) {
        ev.preventDefault();
        // alert(22);
        var data = ev.dataTransfer.getData("Text");
        // let a = ev.target.innerHTML;
        // console.log(a);
        ev.target.innerHTML = '';
        setTimeout(() => {
            ev.target.appendChild(document.getElementById(data));
        }, 1)
    }

    const stickerList = document.querySelector('.already-value .value-box');//已选价值观
    const swapList = document.querySelector('.value-change .swap-value');//待选价值观

    stickerList.addEventListener('dragstart', e => {
        if (e.target.classList.contains('sel-value')) {
            drag(e);
        }
    })
    swapList.addEventListener('dragstart', e => {
        if (e.target.classList.contains('sel-value')) {
            drag(e);
        }
    })

    //获取所有被放置的盒子
    let stickerArea = document.querySelectorAll('.value-change .already-value .drop-area');
    // stickerArea.forEach(item => {
    //     item.addEventListener('drop', e => {
    //         // alert('drop');
    //         drop(e);
    //     })
    //     item.addEventListener('dragover', e => {
    //         alert('dragover');
    //         allowDrop(e);
    //     })
    // })

    stickerArea[0].addEventListener('drop', e => {
        // alert('drop');
        drop(e);
    })
    stickerArea[0].addEventListener('dragover', e => {
        // alert('dragover');
        allowDrop(e);
    })

    stickerArea[1].addEventListener('drop', e => {
        // alert('drop');
        drop(e);
    })
    stickerArea[1].addEventListener('dragover', e => {
        // alert('dragover');
        allowDrop(e);
    })








    const exchange = document.querySelector('.already-value .exchange-btn');//交换按钮
    exchange.addEventListener('click',() => {
        console.log(selValues);
        let al = document.querySelector('.al .sel-value');//拖动到方框里的已选
        let wa = document.querySelector('.wait .sel-value');//拖动到方框里的待选
        selValues.push(wa.innerHTML);//原数组里添加这个新选的
        // let newSel = [];//交换后新数组
        for(let i = 0;i<selValues.length;i++){
            if(selValues[i] === al.innerHTML){
                selValues = selValues.filter(item => item != selValues[i])//去除被交换元素的数组
            }
        }
        console.log(selValues);


        //
        // let reSel = document.createElement('div');
        // reSel.classList.add('sel-value')
        // let reSel = `<div class="" draggable="true" id="d11">工作环境<//div>`;
        
        stickerList.appendChild(wa);//已选价值观里添加这个被交换的
        swapList.appendChild(al);//待选里添加这个被替代的
        
        
        const alBox = document.querySelector('.al');
        const waitBox = document.querySelector('.wait');
        alBox.innerHTML = '拖动已有<br>价值观至此';
        waitBox.innerHTML = '拖动想交换的<br>价值观至此';
    })






    const nextBtn = document.querySelector('.next-btn');
    nextBtn.addEventListener('click', () => {
        
        axios({
            method: 'POST',
            url: 'http://8.134.176.185:8866/explode/result',
            headers: {
                'Content-Type': 'application/json',
                'token': `${token}`
            },
            data: {
                "valuesList": selValues,
                "progress": "1"
            }
        }).then(result => {
            // alert(1);
            console.log(result);
        })

        //跳转
        location.href = './value-report.html';
    })


})


