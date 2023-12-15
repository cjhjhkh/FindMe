'use strict';
window.addEventListener('load', () => {
    const spreadText = document.querySelectorAll(' .spread-text');
    let replyWrap = document.querySelectorAll('.chat-area .spread-card .reply-wrap');
    for (let i = 0; i < replyWrap.length; i++) {
        spreadText[i].addEventListener('click', () => {

            replyWrap[i].classList.toggle('spread-text-active');
        })
    }



    // const commentArea = document.querySelector('.chat-area .comment-area');
    // commentArea.addEventListener('click',e => {
    //     if(e.target.classList.contains('spread-text')){
    //         // alert(1);
    //         const replyItem = e.target.closest('spread-card');
    //         replyItem.children[3].classList.toggle('spread-text-active');
    //     // console.log(e.target.parentNode);
    //     }

    // })


    //展开后的评论区
    const spreadBox = document.querySelector('.chat-area .comment-area');


    const spreadBtn = document.querySelector('.chat-area .spread-btn');
    let spread = false;
    spreadBtn.addEventListener('click', () => {
            // alert(1)
            if (!spread) {
            // alert(1)
            spreadBtn.innerHTML = '收起';
            spreadBox.classList.add('spread');
            spread = true;
        }
        else {
            // alert(1)
            spreadBtn.innerHTML = '全部展开';
            spreadBox.classList.remove('spread');
            spread = false;
        }
    })




    //帖子点赞收藏
    const contentLike = document.querySelector(' .cont-container .like');
    const contentStrore = document.querySelector(' .cont-container .store');
    contentLike.addEventListener('click',() => {
        contentLike.classList.toggle('like-active');
    })
    contentStrore.addEventListener('click',() => {
        contentStrore.classList.toggle('store-active');
    })

    //未展开评论点赞
    const commentLike = document.querySelector('.card .like') ;
    commentLike.addEventListener('click',() => {
        commentLike.classList.toggle('active-like');
    })

    //展开后的评论点赞
    // const likeItem = document.querySelectorAll('.like-item');
    // likeItem.addEventListener('click',() => {
    //     likeItem.classList.toggle('active-like');
    // })
    const commentArea = document.querySelector('.comment-area');
    commentArea.addEventListener('click',e => {
        if(e.target.classList.contains('like-item')){
            e.target.classList.toggle('active-like');
        }
    })





    //瓶论区的
    const starBox = document.querySelector('.star-box');//星星瓶子
    const chatCard = document.querySelector('.chat-area .card');//单条评论卡片
    starBox.addEventListener('click',() => {
        chatCard.classList.add('show-card');
    })


    //显示单条评论的卡片关闭
    const closeCard = document.querySelector('.card .close');
    closeCard.addEventListener('click',()=> {
        chatCard.classList.remove('show-card');
    })

    
})