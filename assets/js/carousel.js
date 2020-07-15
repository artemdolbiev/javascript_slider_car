function Carousel(containerID = '#carousel', slideID = '.slide') {

    this.container = document.querySelector(containerID);
    this.controlsContainer = document.querySelector('.controls');
    this.slides = document.querySelectorAll(slideID);


    this.interval = 5000;

};

Carousel.prototype = {
    _initProps(){
        this.currentSlide = 0;
        this.slidesCount = this.slides.length;
        this.timerId = null;
        this.isPlaying = true;
        // this.swipeStartX = null;
        // this.swipeEndX = null;

        this.LEFT_ARROW = 'ArrowLeft';
        this.RIGHT_ARROW = 'ArrowRight';
        this.SPACE = ' ';
        this.FA_PAUSE = '<i class="far fa-pause-circle"></i>';
        this.FA_PLAY = '<i class="far fa-play-circle"></i>';
        this.FA_PREV = '<i class="fas fa-angle-left"></i>';
        this.FA_NEXT = '<i class="fas fa-angle-right"></i>';
    },

    _initControls() {
        let controls = document.createElement('div');
        const PAUSE = `<span id="pause" class="control-pause control--pause">${this.FA_PAUSE}</span>`;
        const PREV = `<span id="prev" class="control-prev control--prev">${this.FA_PREV}</span>`;
        const NEXT = `<span id="next" class="control-next control--next">${this.FA_NEXT}</span>`;

        controls.innerHTML = PAUSE + PREV + NEXT;

        controls.setAttribute('class', 'controls');
        this.container.append(controls);

        this.pausePlayBtn = document.querySelector('#pause');
        this.nextBtn = document.querySelector('#next');
        this.prevBtn = document.querySelector('#prev');
    },

    _initIndicators() {
        let indicators = document.createElement('ol');

        indicators.setAttribute('class', 'indicators');

        for (let i = 0, n = this.slidesCount; i < n; i++) {
            let indicator = document.createElement('li');
            indicator.setAttribute('class', 'indicator');
            indicator.setAttribute('data-slider-to', `${i}`);
            i === 0 && indicator.classList.add('active');

            indicators.appendChild(indicator);
        }


        this.container.append(indicators);

        this.indicatorsContainer = document.querySelector('.indicators');
        this.indicators = document.querySelectorAll('.indicator');
    },

    _initListeners() {
        this.pausePlayBtn.addEventListener('click', this.pausePlay.bind(this));
        this.nextBtn.addEventListener('click', this.next.bind(this));
        this.prevBtn.addEventListener('click', this.prev.bind(this));
        this.indicatorsContainer.addEventListener('click', this._indicator.bind(this));
        document.addEventListener('keydown', this._pressKey.bind(this));
    },

    _gotoNth(n) {
        this.slides[this.currentSlide].classList.toggle('active');
        this.indicators[this.currentSlide].classList.toggle('active');
        this.currentSlide = (n + this.slidesCount) % this.slidesCount;
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
        this.timerID = setInterval(() => this._gotoNext(), this.interval);
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
            this._gotoNth(+target.getAttribute('data-slider-to'));
        }
    },

    _pressKey (e) {
        if (e.key === this.LEFT_ARROW) this.prev();
        if (e.key === this.RIGHT_ARROW) this.next();
        if (e.key === this.SPACE) this.pausePlay();
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
        this._initProps();
        this._initControls();
        this._initIndicators();
        this._initListeners();
        this.timerId = setInterval(() => {
            this._gotoNext();
        },  this.interval);
    }
};

function SwipeCarousel (containerID = '#carousel', slideID = '.slide') {
    Carousel.apply(this, arguments);
};

SwipeCarousel.prototype = Object.create(Carousel.prototype);
SwipeCarousel.prototype.constructor = SwipeCarousel;

SwipeCarousel.prototype._initListeners = function () {
    Carousel.prototype._initListeners.apply(this);
    this.container.addEventListener('touchstart', this._swipeStart.bind(this));
    this.container.addEventListener('touchend', this._swipeEnd.bind(this));
};

SwipeCarousel.prototype._swipeStart = function(e) {
    this.swipeStartX = e.changedTouches[0].pageX;
};

SwipeCarousel.prototype._swipeEnd=  function(e) {
    this.swipeEndX = e.changedTouches[0].pageX;
    this.swipeStartX - this.swipeEndX < -100 && this.prev();
    this.swipeStartX - this.swipeEndX > 100 && this.next();
};