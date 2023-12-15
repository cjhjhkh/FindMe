'use strict';

window.addEventListener('load', () => {

    const signUpBtn = document.querySelector('.signUp-btn');
    const myPlanet = document.querySelector('.myPlanet');
    const homepage = document.querySelector('.homepage');//“我的星球”按钮
    const leave = document.querySelector('.leave');//“退出登录”按钮

    //判断是否已经登录
    if (localStorage.getItem('token')) {

        //将登陆按钮换为头像
        signUpBtn.classList.remove('show3');
        myPlanet.classList.add('show3');
    }

    //点击“我的星球”按钮，跳转到我的星球
    homepage.addEventListener('click', () => {
        location.href = './personal-homepage.html';
    })

    //点击退出登录
    leave.addEventListener('click', () => {
        //删 token start
        localStorage.removeItem('token');
        localStorage.removeItem('start');

        //测试结果
        localStorage.removeItem('mbti');
        localStorage.removeItem('discReport');
        localStorage.removeItem('hldReport');

        if (!localStorage.getItem('token')) {
            //恢复登录按钮
            signUpBtn.classList.add('show3');
            myPlanet.classList.remove('show3');

        }

    })










    const spaShip = document.querySelector('.spaShip a');//测试空间站
    const spaMenu = document.querySelector('.spaShip .dropdown-menu');//测试空间站下拉菜单
    const enterMine = document.querySelector('.tools .myPlanet a');//头像所在盒子
    const eMenu = document.querySelector('.tools .myPlanet .drop-down');//下拉菜单

    let hideMenu = (item, menu) => {
        item.addEventListener('mouseleave', () => {//得要是b是a的子级
            setTimeout(() => {
                if (!menu.matches(':hover') && !item.matches(':hover')) {
                    menu.style.display = 'none';
                }
            }, 1000);
        })
    }
    let showMenu = (item, menu, display) => {
        item.addEventListener('mouseenter', () => {
            menu.style.display = display;
        hideMenu(item,menu);
        hideMenu(menu,menu);
        });
    }
    showMenu(spaShip, spaMenu, 'block');        
    showMenu(enterMine, eMenu, 'flex');







    const sideNav = document.querySelector('.side-nav');//侧边导航栏
    const goBack = document.querySelector('.go-back');//回到顶部按钮
    const sideNavBgc = document.querySelector('.side-nav .detail-bgc');//侧边导航栏item背景色

    //滚动事件
    const indexCont = document.querySelector('.index-contain');
    let boxHeight = indexCont.children[0].clientHeight;//滚动一个板块的高度
    let halfH = boxHeight * 0.5;
    indexCont.addEventListener('scroll', () => {
        //侧边导航栏出现
        if (indexCont.scrollTop >= boxHeight * 1) {
            sideNav.classList.add('show-nav');
            sideNavBgc.style.transform = `translateY(${41 * 0}px)`;
        } else {
            sideNav.classList.remove('show-nav');
        }


        if (indexCont.scrollTop >= boxHeight * 1 + halfH) {//到一半就改变位置
            sideNavBgc.style.transform = `translateY(${41 * 1}px)`;
        }

        if (indexCont.scrollTop >= boxHeight * 2 + halfH) {
            sideNavBgc.style.transform = `translateY(${41 * 2}px)`;
        }

        if (indexCont.scrollTop >= boxHeight * 3 + halfH) {
            sideNavBgc.style.transform = `translateY(${41 * 3}px)`;
        }












        //匹配动画
        //匹配板块的文字盒子
        const textBoxs = document.querySelectorAll('.mbti-wrap .test-desc-contain .text');
        if (indexCont.scrollTop >= boxHeight * 1 + halfH && indexCont.scrollTop < boxHeight * 2 + halfH) {

            let index = 0;//出现的下标
            let showText = setInterval(() => {
                textBoxs[index].style.opacity = 1;
                textBoxs[index].classList.add('show-text');
                index++;
                if (index === textBoxs.length) {
                    clearInterval(showText);
                }
            }, 250);
        }
        //移出匹配板块动画
        if (indexCont.scrollTop < boxHeight * 1 + halfH || indexCont.scrollTop >= boxHeight * 2 + halfH) {
            textBoxs.forEach((item, index) => {
                item.style.opacity = 0;
                setTimeout(() => {
                    item.classList.remove('show-text');
                }, 200)
            })
}




        //搜索板块动画出现(待完善)
        //出现
        const searchBox = document.querySelector('.search-box');
        const inputTip = document.querySelectorAll('.input-tip');
        const track = document.querySelectorAll('.track-box');//gan
        if (indexCont.scrollTop >= boxHeight * 3) {
            //搜索框出现
            searchBox.classList.add('show-input');
            searchBox.addEventListener('focus', () => {
                searchBox.placeholder = '';
            })
            searchBox.addEventListener('blur', () => {
                searchBox.placeholder = 'What do you want to konw about your profession?';
            })
            //四周提示文字出现
            setTimeout(() => {
                searchBox.classList.add('show-input1');
                let i = 0;//出现的下标
                let showTip1 = setInterval(() => {
                    inputTip[i].classList.add(`show${i + 1}`);
                    //线出现
                    track[i].classList.add('show-track');
                    i++;
                    if (i === 3) {
                        clearInterval(showTip1);
                    }
                }, 200);
                let j = 4;//出现的下标
                let showTip2 = setInterval(() => {
                    inputTip[j].classList.add(`show${j + 1}`);
                    track[j].classList.add('show-track');
                    j--;
                    if (j === 2) {
                        clearInterval(showTip2);
                    }
                }, 400);
            }, 200);
        }
        //消失
        if (indexCont.scrollTop < boxHeight * 4 || indexCont.scrollTop >= boxHeight * 4 + halfH) {
            searchBox.classList.remove('show-input');
            searchBox.classList.remove('show-input1');
            for (let i = 0; i < track.length; i++) {
                inputTip[i].classList.remove(`show${i + 1}`);
                track[i].classList.remove('show-track');
            }
        }


    })
    //回到顶部
    goBack.addEventListener('click', () => {
        indexCont.scrollTop = 0;
        sideNavBgc.style.transform = `translateY(${41 * 0}px)`;
    })


    const tipItem = document.querySelectorAll('.detail-item');//侧边导航栏每个索引
    const tipTag = document.querySelectorAll('.tip-tag');//侧边导航栏提示标签
    for (let i = 0; i < tipItem.length - 1; i++) {

        //鼠标移入出现提示标签
        tipItem[i].addEventListener('mouseover', () => {
            tipTag[i].style.display = 'block';
            setTimeout(() => {
                tipTag[i].classList.add('show-tag');
            }, 100);
        })
        tipItem[i].addEventListener('mouseleave', () => {

            //鼠标移出 出现提示标签
            tipTag[i].classList.remove('show-tag');
            setTimeout(() => {
                tipTag[i].style.display = 'none';
            }, 500);
        })


        //点击 页面到指定板块
        tipItem[i].addEventListener('click', () => {
            indexCont.scrollTop = boxHeight * (i + 1);
        })
    }





    //点击开启成长星球之旅
    const searchBtn = document.querySelector('.search-icon ');//搜索按钮
    const searchInput = document.querySelector('.search-box ');//输入框
    searchBtn.addEventListener('click', () => {
        if (searchInput.value != '') {
            location.href = './route-node.html';
        }
    })


})