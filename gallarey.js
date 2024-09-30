function setup() {
    const loaderText = document.querySelector(".loader__text");
    
    let progress = 0;
    const interval = setInterval(() => {
        progress += 1;  // 進捗を1%ずつ増加させる
        loaderText.textContent = `${progress}%`;

        if (progress >= 100) {
            clearInterval(interval);
            init();  // 進捗が100%になったらinit関数を呼び出してローダーを非表示にする
        }
    }, 30);  // 30msごとに進捗を更新（適宜調整可能）
}

function init() {
    const loader = document.querySelector(".loader");
    loader.style.opacity = 0;
    loader.style.pointerEvents = "none";
    // 他の初期化処理
}

// ページ読み込み後にセットアップを開始
window.onload = setup;

document.addEventListener('DOMContentLoaded', function () {
    const prevBtn = document.querySelector('.slider--btn__prev');
    const nextBtn = document.querySelector('.slider--btn__next');
    const slides = document.querySelectorAll('.slide');
    let currentIndex = 0;

    function updateSlides() {
        slides.forEach((slide, index) => {
            slide.removeAttribute('data-current');
            slide.removeAttribute('data-next');
            slide.removeAttribute('data-previous');
            if (index === currentIndex) {
                slide.setAttribute('data-current', '');
            } else if (index === (currentIndex + 1) % slides.length) {
                slide.setAttribute('data-next', '');
            } else if (index === (currentIndex - 1 + slides.length) % slides.length) {
                slide.setAttribute('data-previous', '');
            }
        });
    }

    prevBtn.addEventListener('click', function () {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        updateSlides();
    });

    nextBtn.addEventListener('click', function () {
        currentIndex = (currentIndex + 1) % slides.length;
        updateSlides();
    });

    updateSlides();
});
