'use strict';


window.addEventListener('load', () => {
    let token = localStorage.getItem('token');

    const close1 = document.querySelector('.join-box .close');//关闭按钮
    const joinBtn = document.querySelector('.join');//加入按钮
    const createBtn = document.querySelector('.create');//创建按钮
    const joinBox = document.querySelector('.join-box');//加入、创建 的盒子
    const mainBox = document.querySelector('.drawing-plate .draw-plate-contain .main-box');
    const inputInviteCode = document.querySelector('.invite-code');//邀请码输入框
    //点击  加入按钮
    //出现输入邀请码的盒子
    joinBtn.addEventListener('click', () => {
        joinBox.classList.add('show1');
        mainBox.classList.remove('show1');
    })
    //点击关闭按钮，关闭输入邀请码
    joinBox.addEventListener('click', e => {
        if (e.target === close1) {
            joinBox.classList.remove('show1');
            mainBox.classList.add('show1');
        }
    })

    //点击创建按钮，用户视角界面出现
    createBtn.addEventListener('click', () => {
        location.href = './create-share.html';
    })






    //点击加入房间按钮，跳转绘画界面
    const joinRoom = document.querySelector('.join-box .enter-room');
    joinRoom.addEventListener('click', () => {
        //输入邀请码
        if (inputInviteCode.value != '') {
            let InvitationCode = inputInviteCode.value;
            axios({
                method: 'PUT',
                url: 'http://8.134.176.185:8866/room/in-room',
                headers: {
                    'Content-Type': 'application/json',
                    'token': `${token}`
                },
                data: {
                    "InvitationCode": `${InvitationCode}`
                    }
                
            }).then(result => {
                console.log(result);
                // alert(111);

                if(result != null){
                    //存房间id
                    localStorage.setItem('invitationCode',result.data.data.invitationCode);

                    
                    localStorage.setItem('receiverId',result.data.data.receiverId);
                    localStorage.setItem('senderId',result.data.data.senderId);
                    
                    //存邀请码
                    localStorage.setItem('roomCode',inputInviteCode.value);

                    //跳转绘画界面
                    location.href = './join-share.html';
                }



            })
        }
        else{
            // alert('不能为空');
        }




    })


})