class VideoPlayerBasic {

  constructor(settings) {
    this._settings = Object.assign(VideoPlayerBasic.getDefaultSettings(), settings);
    this._videoContainer = null;
    this._video = null;
    this._toggleBtn = null;
    this._progress = null;
    this._mouseDown = false;
    this._volume = null;
    this._speedValue = null;
  }

  /**
   * @desc method initializes the necessary parts of our module (puts markup, etc.)
   */
  init() {

    if (!this._settings.videoUrl) return console.error("Передайте адрес видео");
    if (!this._settings.videoPlayerContainer) return console.error("Передайте селектор контейнера");

    // Создадим разметку и добавим ее на страницу
    this._addTemplate();
    // Найти все элементы управления
    this._setElements();
    // Установить обработчики событий
    this._setEvents();
  }

  /**
   * @desc  method is responsible for the pause
   */
  toggle() {
    const method = this._video.paused ? 'play' : 'pause';
    this._toggleBtn.textContent = this._video.paused ? '❚ ❚' : '►';
    this._video[method]();
  }

  /**
   * @desc  method is responsible for the time lane
   */
  _handlerProgress() {
    const percent = (this._video.currentTime / this._video.duration) * 100;
    this._progress.style.flexBasis = `${percent}%`;
  }

  /**
   * @desc  method is responsible for the rewind on the click in the right part of video
   */
  _scrub(e) {
    this._video.currentTime = (e.offsetX / this._progressContainer.offsetWidth) * this._video.duration;
  }

  /**
   * @desc  method is responsible for volume
   */
  _setVolume() {
    this._video.volume = this._volume.value;
  }

  /**
   * @desc  method is responsible for the speed of the video
   */
  _speedPlayer() {
    this._video.playbackRate = this._speedValue.value;
  }

  /**
   * @desc  method is responsible for skip after click back(depends on settings)currentTime + setting time(2s)
   * we can also change this time in settings
   */
  _skipPrev() {
    this._video.currentTime += this._settings.skipPrev;
  }

  /**
   * @desc  method is responsible for skip after click next(depends on settings)currentTime + setting time(3s)
   * we can also change this time in settings
   */
  _skipNext() {
    this._video.currentTime += this._settings.skipNext;
  }

  /**
   * @desc  method is responsible for skip back or next(depends on half of the video)
   */
  _dblClickSkip(e) {
    e.offsetX < this._video.offsetWidth / 2 ? this._skipPrev() : this._skipNext();
  }


  /**
   * @desc  method is responsible for set used items
   */
  _setElements() {
    this._videoContainer = document.querySelector(this._settings.videoPlayerContainer);
    this._video = this._videoContainer.querySelector('video');
    this._toggleBtn = this._videoContainer.querySelector('.toggle');
    this._progress = this._videoContainer.querySelector('.progress__filled');
    this._progressContainer = this._videoContainer.querySelector('.progress');
    this._volume = this._videoContainer.querySelector('.player__slider.vol'); //1

    this._speedValue = this._videoContainer.querySelector('.speed'); //2

    this._skipBack = this._videoContainer.querySelector('.back'); //3
    this._skipForward = this._videoContainer.querySelector('.forward'); //3
  }

  /**
   * @desc  method is responsible for set used events on this items(above)
   */
  _setEvents() {
    this._video.addEventListener('click', () => this.toggle());
    this._toggleBtn.addEventListener('click', () => this.toggle());
    this._video.addEventListener('timeupdate', () => this._handlerProgress());
    this._progressContainer.addEventListener('click', (e) => this._scrub(e));
    this._progressContainer.addEventListener('mousemove', (e) => this._mouseDown && this._scrub(e));
    this._progressContainer.addEventListener('mousedown', (e) => this._mouseDown = true);
    this._progressContainer.addEventListener('mouseup', (e) => this._mouseDown = false);
    this._volume.addEventListener('input', () => this._setVolume()); //1

    this._speedValue.addEventListener('input', () => this._speedPlayer()); //2
    this._speedValue.addEventListener('click', () => this._speedPlayer()); //2

    this._skipBack.addEventListener('click', () => this._skipPrev()); //3
    this._skipForward.addEventListener('click', () => this._skipNext()); //3

    this._videoContainer.addEventListener('dblclick', (e) => this._dblClickSkip(e)); //4
  }


  /**
   * @desc  method is responsible for adding template 
   */
  _addTemplate() {
    const template = this._createVideoTemplate();
    const container = document.querySelector(this._settings.videoPlayerContainer);
    container ? container.insertAdjacentHTML("afterbegin", template) : console.error('контейнер не найден');
  }

  /**
   * @desc  method is responsible for creating template 
   */
  _createVideoTemplate() {
    return `
    <div class="player">
      <video class="player__video viewer" src="${this._settings.videoUrl}"> </video> 
      <div class="player__controls">
        <div class="progress">
        <div class="progress__filled"></div>
        </div>
        <button class="player__button toggle" title="Toggle Play">►</button>
        <input type="range" name="volume" class="player__slider vol" min=0 max="1" step="0.05" value="${this._settings.volume}">
        <input type="range" name="playbackRate" class="player__slider speed" min="0.2" max="5" step="0.1" value="1">
        <button data-skip="-1" class="player__button back">«${this._settings.skipPrev}s </button>
        <button data-skip="1" class="player__button forward"> ${this._settings.skipNext}s»</button>
      
      </div>
    </div>
    `;
  }


  static getDefaultSettings() {
    /**
     * Список настроек
     * - адрес видео
     * - тип плеера "basic", "pro"
     * - controls - true, false
     */
    return {
      videoUrl: '',
      videoPlayerContainer: '.myplayer',
      volume: 1,
      skipNext: 1,
      skipPrev: 1,
    }
  }
}

const myPlayer = new VideoPlayerBasic({
  videoUrl: 'video/mov_bbb.mp4',
  videoPlayerContainer: 'body',
  skipNext: 3,
  skipPrev: -2,
});

myPlayer.init();