'use strict';
window.addEventListener('load', () => {
    const loginSel = document.querySelector('.login-sel');//切换为登录按钮
    const registerSel = document.querySelector('.register-sel');//切换为注册按钮
    const slideBox = document.querySelector('.slide-box');//上方滑动盒子
    const inputBox = document.querySelector('.input-box');//包含输入框的区域
    const loginBtn = document.querySelector('.login-btn');//登录注册按钮
    let phone1 = document.querySelector('.phone');//邮箱输入框
    let password1 = document.querySelector('.password');//密码输入框
    const codeInput1 = document.querySelector('.login-cont .check-area input');//图片验证码输入框

    //placeholder
    let placeholder = () => {
        phone1.addEventListener('focus', () => {
            phone1.placeholder = '';
        })
        phone1.addEventListener('blur', () => {
            phone1.placeholder = '请输入邮箱';
        })
        password1.addEventListener('focus', () => {
            password1.placeholder = '';
        })
        password1.addEventListener('blur', () => {
            password1.placeholder = '请输入密码';
        })
    }
    placeholder();













    //获取图片验证码
    const getCodeBtn = document.querySelector('.getCode');//验证码图片
    //获取验证码 函数
    const getCode = () => {
        axios({
            method: 'GET',
            url: 'http://8.134.176.185:8866/api/identifyImage',
        }).then(result => {
            console.log(result);
            getCodeBtn.src = result.data.data.img;
            uuid = result.data.data.uuid;
        }).catch(error => {
            console.log(error);
        })
    }

    //点击获取验证码
    getCodeBtn.addEventListener('click', () => {
        getCode();
    })

    //未点击时调用一次
    getCode();



    const checkCode = document.querySelector('.check');
    checkCode.addEventListener('focus', () => {
        checkCode.placeholder = '';
    })
    checkCode.addEventListener('blur', () => {
        checkCode.placeholder = '请输入验证码';
    })




    //获取邮箱验证码函数
    let getMvCode = (getCodeBtn, emailValue) => {
        if (emailValue.value != '') {
            let email = emailValue.value;
            axios({
                method: 'POST',
                url: 'http://8.134.176.185:8866/user/email',
                data: {
                    "email": `${email}`
                }
            }).then(result => {
                console.log(result.data.data);
                return result.data.data;
            })
        }
        else {
            //tip
        }
    }



    //登录注册切换操作

    //清空输入框(文字、placeholder颜色)
    const clearCont = () => {
        phone1.value = '';
        password1.value = '';
        codeInput1.value = '';
        phone1.classList.remove('red-placeholder');
        password1.classList.remove('red-placeholder');
        codeInput1.classList.remove('red-placeholder');
    }

    //点击选择登录切换按钮
    loginSel.addEventListener('click', () => {
        //滑块移动
        slideBox.classList.remove('active');
        //删除邮箱验证码盒子
        if (document.querySelector('.check-area2')) {//判断是否存在
            //删除验证码盒子
            inputBox.removeChild(inputBox.children[2]);
        }
        //"忘记密码"盒子
        document.querySelector('.other').style.display = 'flex';

        //图片验证码
        document.querySelector('.check-area').style.display = 'flex';

        //内容切换为"登录"
        loginBtn.innerHTML = '登录';

        //切换后清空输入框
        clearCont();
    })

    //点击选择注册按钮
    let uuid = "";
    registerSel.addEventListener('click', () => {
        //滑块移动
        slideBox.classList.add('active');
        //创建验证码盒子
        if (!document.querySelector('.check-area2')) {//判断是否存在
            let checkBox = document.createElement('check-area');
            checkBox.innerHTML = `                            
            <div class="check-area2" style="display: flex; justify-content: space-between;">
                <input class="check" type="text" placeholder="请输入验证码">
                <div class="getCode">获取邮箱验证码</div>
            </div>`
            inputBox.insertBefore(checkBox, inputBox.children[2]);
        }
        //隐藏"忘记密码"盒子
        document.querySelector('.other').style.display = 'none';
        loginBtn.innerHTML = '注册';

        //隐藏图片验证码盒子
        document.querySelector('.check-area').style.display = 'none';


        //切换后清空输入框
        clearCont();
        


        // //获取验证码
        const getCodeBtn2 = document.querySelector('.getCode');//获取邮箱验证码按钮


        //点击获取验证码
        getCodeBtn2.addEventListener('click', () => {

            getMvCode(getCodeBtn2, phone1);
        }
        )

        //获得焦点失去焦点
        const checkCode = document.querySelector('.check');
        checkCode.addEventListener('focus', () => {
            checkCode.placeholder = '';
        })
        checkCode.addEventListener('blur', () => {
            checkCode.placeholder = '请输入验证码';
        })

    })






    //登录操作

    //判断输入是否为空 (邮箱、密码
    const loginCondict = (phone1, password1, codeInput) => {
        if (phone1.value.trim() === '') {
            phone1.classList.add('red-placeholder');
        }
        if (password1.value.trim() === '') {
            password1.classList.add('red-placeholder');
        }
        if (codeInput.value.trim() === '') {
            codeInput.classList.add('red-placeholder');
            return false;
        }


        //判断密码是否大于8位
        if (password1.value.length <= 8) {
            return false;
        }
        return true;
    }

    //点击登录按钮
    loginBtn.addEventListener('click', () => {

        //判断为登录
        if (loginBtn.innerHTML == '登录') {
            let codeInput = () => {
                if (codeInput1.value != '') {
                    return true;
                } else {
                    return false;
                }
            }
            //判断是否符合条件
            if (loginCondict(phone1, password1, codeInput1) && codeInput) {
                //判断通过后 提交数据
                const account = phone1.value;
                const password = password1.value;
                const code = document.querySelector('.login-cont .check-area .check').value;

                const user = {
                    account,
                    password
                }
                axios({
                    method: 'POST',
                    url: 'http://8.134.176.185:8866/user/login',
                    data: {
                        user,
                        code,
                        uuid
                    },
                    Headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(result => {
                    console.log(result);
                    if (result.data.msg === 'success') {
                        // 存token
                        let token = result.data.data;

                        //登录成功提示出现
                        const loginTip = document.querySelector('.login-tip');
                        loginTip.style.display = 'block';

                        loginTip.classList.add('show-tip');

                        localStorage.setItem('token', token);
                        setTimeout(() => {
                            // 登录成功，跳转主页
                            location.href = './index.html'
                        }, 800)


                    }
                    else {
                        //登录失败提示
                        const failReg = document.querySelector('.fail-login');
                        failReg.style.display = 'block';
                        failReg.classList.add('show-tip');
                    }

                })

            }
        }

        //判断为注册
        else {
            const code = document.querySelector('.check-area .check').value;

            const codeInput2 = document.querySelector('.check-area2 .check');//邮箱验证码输入框

            //判断邮箱密码是否为空
            if (loginCondict(phone1, password1, codeInput2)) {
                //判断通过后 提交数据
                const account = phone1.value;
                const password = password1.value;
                const user = {
                    account,
                    password
                }
                axios({
                    method: 'POST',
                    url: 'http://8.134.176.185:8866/user/register',
                    data: {
                        user,
                        code
                    }
                }).then(result => {

                    if (result.data.code != 10011) {
                        //注册成功提示出现
                        const regTip = document.querySelector('.reg-tip');
                        regTip.style.display = 'block';
                        regTip.classList.add('show-tip');
                        setTimeout(() => {
                            loginSel.click();//注册成功之后转登录按钮
                        }, 300)
                    }
                    else {
                        //注册失败提示
                        const failReg = document.querySelector('.fail-reg');
                        failReg.style.display = 'block';
                        failReg.classList.add('show-tip');
                    }
                })
            }
        }
    })








    //忘记密码-->重置密码

    const forgetBtn = document.querySelector('.forget');//忘记密码按钮
    const resetBox = document.querySelector('.reset-box');
    forgetBtn.addEventListener('click', () => {
        document.querySelector('.login-container .main-box .login-cont').style.display = 'none';//登录盒子隐藏
        resetBox.style.display = 'block';//重置密码盒子出现
        clearCont();
    })

    //重新设置密码
    const resetCode = document.querySelector('.reset-code');//重置密码 按钮
    const resetPhone = document.querySelector('.phone-reset');//邮箱输入框
    const resetPassword = document.querySelector('.password-reset');//密码输入框
    const resetGetCode = document.querySelector(' .check-area-reset .check');//邮箱验证码输入框
    const getCode3 = document.querySelector('.check-area-reset .getCode');//获取邮箱验证码按钮

    let code = '';
    //点击获取邮箱验证码
    getCode3.addEventListener('click', () => {
        code = getMvCode(getCode3, resetPhone);
    })



    //重置密码完成
    let finish = () => {
        //判断邮箱密码是否为空
        //判断验证是否成功
        if (loginCondict(resetPhone, resetPassword, resetGetCode) && flag) {
            //发送数据
            const account = resetPhone.value;
            const password = resetPassword.value;
            axios({
                method: 'POST',
                url: 'http://8.134.176.185:8866/user/resetPassword',
                data: {
                    // account,
                    // // password
                    "user": {
                        "account": `${account}`,
                        "password": `${password}`
                    },
                    "code": `${code}`
                }


            }).then(result => {
                console.log(result);

                //重置密码成功提示出现
                const resetTip = document.querySelector('.reset-tip');
                resetTip.style.display = 'block';
                resetTip.classList.add('show-tip');
                setTimeout(() => {
                    //重置密码成功，回到登录
                    resetBox.style.display = 'none';
                    document.querySelector('.login-container .main-box .login-cont').style.display = 'block';//登录盒子隐藏

                    //清空（可能重置后又进行一次
                    resetPhone.value = '';
                    resetPassword.value = '';
                    //去掉提示
                    resetTip.style.display = 'none';
                    resetTip.classList.remove('show-tip');
                    //滑块回到起点
                    bgBox.style.width = `0px`;
                    slideBlock.style.left = 3 + 'px';

                    document.querySelector('.pass-tip').classList.remove('show-pass');
                }, 1500)
            })
        }
        else {
            return;
        }
    }

    //判断验证是否成功
    let flag = false;

    //拖动滑块验证
    const slideCheck = document.querySelector('.slide-check');
    const slideBlock = document.querySelector('.slide-block');
    const bgBox = document.querySelector('.bg');//背景颜色盒子

    let disX = null;

    //鼠标按下
    const mousedown = (e) => {
        e.preventDefault();
        disX = e.clientX - slideBlock.offsetLeft;
        slideCheck.addEventListener("mousemove", mousemove);//移动 调用移动函数
        slideCheck.addEventListener("mouseup", mouseup);//抬起 调用抬起函数
    };

    //鼠标移动
    const mousemove = (e) => {
        slideBlock.style.left = `${e.clientX - disX}px`;
        //改变背景颜色区域
        bgBox.style.width = `${e.clientX - disX + 10}px`;
        //限制移动位置
        if (e.clientX - disX <= 3) {
            slideBlock.style.left = 3 + 'px';
            bgBox.style.width = `0px`;

        }
        if (e.clientX - disX >= slideCheck.clientWidth - slideBlock.clientWidth - 3) {
            slideBlock.style.left = slideCheck.clientWidth - slideBlock.clientWidth - 3 + 'px';
            //判断验证成功
            flag = true;

            //验证成功提示出现
            document.querySelector('.pass-tip').classList.add('show-pass');

            //滑块不移动
            slideCheck.removeEventListener("mousedown", mousedown);
            slideCheck.removeEventListener("mousemove", mousemove);
            slideCheck.removeEventListener("mouseup", mouseup);


            //背景条长度充满
            bgBox.style.width = `${e.clientX - disX + 10}px`;

            finish();
        }
        else {
            flag = false;//重置
        }
    };

    // 鼠标抬起
    const mouseup = () => {
        //滑动不在最右边
        if (slideBlock.style.left != slideCheck.clientWidth - slideBlock.clientWidth - 3 + 'px') {
            //验证失败提示
            document.querySelector('.fail-tip').classList.add('show-pass');

            //滑块加过渡
            slideBlock.classList.add('block-return');

            //滑块回原位
            setTimeout(() => {
                document.querySelector('.fail-tip').classList.remove('show-pass');
                slideBlock.style.left = 3 + 'px';
                bgBox.style.width = `0px`;

                //回原位后移除过渡
                setTimeout(() => {
                    slideBlock.classList.remove('block-return');
                }, 1000);

            }, 1000);
        }
        slideCheck.removeEventListener("mousemove", mousemove);
        slideCheck.removeEventListener("mouseup", mouseup);
    };

    //点击滑块，调用 按下函数
    slideBlock.addEventListener("mousedown", mousedown);



    //placeholder
    resetPhone.addEventListener('focus', () => {
        resetPhone.placeholder = '';
    })
    resetPhone.addEventListener('blur', () => {
        resetPhone.placeholder = '请输入邮箱';
    })
    resetPassword.addEventListener('focus', () => {
        resetPassword.placeholder = '';
    })
    resetPassword.addEventListener('blur', () => {
        resetPassword.placeholder = '请输入密码';
    })
    resetGetCode.addEventListener('focus', () => {
        resetGetCode.placeholder = '';
    })
    resetGetCode.addEventListener('blur', () => {
        resetGetCode.placeholder = '请输入验证码';
    })
    //点击重置密码
    resetCode.addEventListener('click', () => {
        resetPassword.value = '';
    })
   
})

