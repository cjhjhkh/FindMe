'use strict';

window.addEventListener('load', () => {

    // //获取MBTI
    let mbti = localStorage.getItem('mbti');


    //测试结果

    let a = () => {
        axios({
            method: 'GET',
            url: 'http://8.134.176.185:8866/mbti/report/' + mbti,
        }).then(result => {
            let data = result.data.data;
            console.log(data);
            const { abbreviation, advantage, analysis, bookList, briefIntroduction, careerReference, disadvantage, eitypeIntroduction, jptypeIntroduction, mbtiName, movieList, postSecondaryProgram, sntypeIntroduction, songList, tftypeIntroduction, undergraduateProgram } = data;

            //mbti中文简称
            document.querySelector('.conclusion .summary .name').innerHTML = abbreviation;
            //简介
            document.querySelector('.summary .describe').innerHTML = briefIntroduction;

            //mbti名称(bug)
            mbtiName.split('').forEach((item, index) => {
                document.querySelectorAll(`.letter`)[index].innerHTML = item;
            });

            //特征
            const dimension = document.querySelectorAll('.conclusion .dimensions .dimension');
            let trait = (item, index) => {
                dimension[index].innerHTML = `
                <div class="dimen-tit">${item.split('）')[0].split('的人').join('').substring(0, 2)}型</div>
                <div class="desc">${item.split('）')[1]}</div>`;
            }
            trait(tftypeIntroduction, 0);
            trait(eitypeIntroduction, 1);
            trait(jptypeIntroduction, 2);
            trait(sntypeIntroduction, 3);

            // 优点
            let adv = '';
            for (let i = 0; i < advantage.split(' ').length; i++) {
                adv += `<li class="trait-item">(${i + 1})${advantage.split(' ')[i]}</li>`;
            }
            document.querySelector(`.adv`).innerHTML = `
                    <div class="tit">优 点</div>
                    <ul class="trait-ul">${adv}</ul>
                `;
            //缺点
            let disadv = '';
            for (let i = 0; i < disadvantage.split(' ').length; i++) {
                disadv += `<li class="trait-item">(${i + 1})${disadvantage.split(' ')[i]}</li>`;
            }
            document.querySelector(`.disadv`).innerHTML = `
                    <div class="tit">缺 点</div>
                    <ul class="trait-ul">${disadv}</ul>
                `;

            //职业
            let job = '';
            careerReference.split('、').forEach((item, index) => {
                job += `<li class="calling-item">(${index + 1}) ${item}</li>`
            })
            document.querySelector('.calling .relate .calling-list').innerHTML = job;
            //专业
            document.querySelector('.relate:nth-child(2) .calling-item:nth-child(1)').innerHTML = `专科：${undergraduateProgram}`;
            document.querySelector('.relate:nth-child(2) .calling-item:nth-child(2)').innerHTML = `本科：${postSecondaryProgram}`;
            //书单
            let book = '';
            let song = '';
            let movie = '';
            let recond = (item, newStr, i) => {
                item.split('、').forEach((item) => {
                    newStr += `<li class="rec-item">${item}</li>`
                })
                document.querySelectorAll('.rec-list')[i].innerHTML = newStr;
            }
            recond(bookList, book, 0);
            recond(songList, song, 1);
            recond(movieList, movie, 2);



        })
    }
    a();





    //保存截图
    const saveBtn = document.querySelector('.save');
    saveBtn.addEventListener('click', () => {
        captureScreenshot();
    })

    // function captureScreenshot() {
    //     const container = document.querySelector('.contain');
    //     const options = {
    //         logging: true,
    //         filename: 'mbti-report',
    //         type: 'image/png'
    //     };

    //     domtoimage.toPng(container, options)
    //         .then(function (dataUrl) {
    //             const link = document.createElement('a');
    //             link.href = dataUrl;
    //             link.download = 'mbti-report.png';
    //             link.click();
    //         })
    //         .catch(function (error) {
    //             console.error('Error during conversion:', error);
    //         });
    // }




    function captureScreenshot() {
        // 获取需要截图的元素
        var element = document.querySelector('.contain');
        // 使用html2canvas将元素转换为图片
        html2canvas(element).then(function (canvas) {
            // alert('canvas');
            // canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
            // 将生成的图片插入到页面中
            const link = document.createElement('a');
                link.href = canvas.toDataURL('image/png');
                link.download = 'mbti-report.png';
                link.click();
        });
    }
})
