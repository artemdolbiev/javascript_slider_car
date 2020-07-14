function Carousel() {

    this.container = document.querySelector('#carousel');
    this.controlsContainer = document.querySelector('.controls');
    this.indicatorsContainer = document.querySelector('.indicators');
    this.indicators = document.querySelectorAll('.indicator');
    this.slides = document.querySelectorAll('.slide');
    this.pausePlayBtn = document.querySelector('#pause');
    this.nextBtn = document.querySelector('#next');
    this.prevBtn = document.querySelector('#prev');

    this.interval = 5000;
    this._initProps();
    this._initControls();

};

Carousel.prototype = {
    _initProps(){
        this.currentSlide = 0;
        this.slideLength = this.slides.length;
        this.timerId = null;
        this.isPlaying = true;
        this.swipeStartX = null;
        this.swipeEndX = null;

        this.LEFT_ARROW = 'ArrowLeft';
        this.RIGHT_ARROW = 'ArrowRight';
        this.SPACE = ' ';
        this.FA_PAUSE = '<i class="far fa-pause-circle"></i>';
        this.FA_PLAY = '<i class="far fa-play-circle"></i>';
    },

    _initControls() {
        let controls = document.createElement('div');
    },

    _gotoNth(n) {
        this.slides[this.currentSlide].classList.toggle('active');
        this.indicators[this.currentSlide].classList.toggle('active');
        this. currentSlide = (n + this.slideLength) % this.slideLength;
        this.slides[this.currentSlide].classList.toggle('active');
        this.indicators[this.currentSlide].classList.toggle('active');
    },

    _gotoNext() {
        this._gotoNth(this.currentSlide + 1);
    },

    _gotoPrev() {
        this._gotoNth(this.currentSlide - 1);
    },

    _play() {
        this.timerId = setInterval(this._gotoNext, this.interval);
        this.pausePlayBtn.innerHTML = this.FA_PAUSE;
        this.isPlaying = !this.isPlaying;
    },

    _pause() {
        if (this.isPlaying) {
            clearInterval(this.timerId);
            this.pausePlayBtn.innerHTML = this.FA_PLAY;
            this.isPlaying = !this.isPlaying;
        }
    },

    _indicator (e) {
        let target = e.target;
        if (target.classList.contains('indicator')){
            this._pause();
            this._gotoNth(+target.getAttribute(('data-slider-to')));
        }
    },

    _pressKey (e) {
        if (e.key === this.LEFT_ARROW) this.prev();
        if (e.key === this.RIGHT_ARROW) this.next();
        if (e.key === this.SPACE) this.pausePlay();
    },

    _swipeStart (e) {
        this.swipeStartX = e.changedTouches[0].pageX;
    },

    _swipeEnd (e) {
        this.swipeEndX = e.changedTouches[0].pageX;
        this.swipeStartX - this.swipeEndX < -100 && this.prev();
        this.swipeStartX - this.swipeEndX > 100 && this.next();
    },

    _setListeners() {
        this.pausePlayBtn.addEventListener('click', this.pausePlay.bind(this));
        this.nextBtn.addEventListener('click', this.next.bind(this));
        this.prevBtn.addEventListener('click', this.prev.bind(this));
        this.indicatorsContainer.addEventListener('click', this._indicator.bind(this));
        document.addEventListener('keydown', this._pressKey.bind(this));
        this.container.addEventListener('touchstart', this._swipeStart.bind(this));
        this.container.addEventListener('touchend', this._swipeEnd.bind(this));
    },

    pausePlay() {
        if (this.isPlaying) this._pause();
        else this._play();
    },

    next() {
        this._pause();
        this._gotoNext();
    },

    prev() {
        this._pause();
        this._gotoPrev();
    },

    init() {
        this._setListeners();
        this.timerId = setInterval(() => {
            this._gotoNext();
        },  this.interval);
    }
};

let carousel = new Carousel();

carousel.init();