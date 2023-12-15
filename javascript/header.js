window.addEventListener('load', () => {
    contain = document.querySelector('.contain');
    const header = document.createElement('nav');

    //导航栏
    header.innerHTML = `
    
    <div class="nav-wrap">
    <div class="logo">FIND ME</div>
    <div class="selections">
        <ul class="tools">
            <li class="bridge">
                <a href="./mbti-bridge.html">MBTI桥梁</a>
            </li>
            <li class="spaShip">
                <a href="#">
                    情绪追踪器
                </a>
            </li>
            <li class="spaStation">
                <a href="#">
                    计划空间站
                </a>
            </li>
            <li class="market">
                <a href="#">星空集市</a>
            </li>
        </ul>
    </div>                
</div>
    `;
    contain.insertBefore(header, contain.children[0]);

})