// https://www.w3schools.com/tags/ref_av_dom.asp

const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const PLAYER_STORAGE_KEY = 'F8_PLAYER'

const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const cd = $('.cd')
const playBtn = $('.btn-toggle-play')
const player = $('.player')
const progress  = $('#progress')
const prevBtn = $('.btn-prev')
const nextBtn = $('.btn-next')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playlist = $('.playlist')

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs: [
        {
            name: '3107-2',
            singer: 'Duong',
            path: './assets/music/3-1-0-7-2-Duongg-W-N-Nau.mp3',
            image: './assets/img/3107-2.jpg'
        }, 
        {
            name: 'Bao một mớ bình yên',
            singer: 'Casper-Bon',
            path: './assets/music/Bao-Tien-Mot-Mo-Binh-Yen-14-Casper-Bon.mp3',
            image: './assets/img/baotien.jpg'
        },
        {
            name: 'Bầu trời năm ấy',
            singer: 'Sean',
            path: './assets/music/Bau-Troi-Nam-Ay-Sean-Ed-Hast-Anfang.mp3',
            image: './assets/img/bautroinamay.jpg'
        },
        {
            name: 'Chang the tim duoc em',
            singer: 'PhucXP',
            path: './assets/music/Chang-The-Tim-Duoc-Em-Lofi-Version-Reddy-Freak-D.mp3',
            image: './assets/img/changthetimduocem.jpg'
        },
        {
            name: 'Để tôi ôm em bằng giai điệu này',
            singer: 'Min',
            path: './assets/music/de-toi-om-em-bang-giai-dieu-nay-Kai-Dinh-MIN-GREY-D.mp3',
            image: './assets/img/detoiomem.jpg'
        },
        {
            name: 'Như anh đã thấy em',
            singer: 'PhucXP',
            path: './assets/music/Nhu-Anh-Da-Thay-Em-PhucXP-Freak-D.mp3',
            image: './assets/img/nhuanhdathayem.jpg'
        },
        {
            name: 'Rồi ta sẽ ngắm pháo hoa cùng nhau',
            singer: 'O.LEW',
            path: './assets/music/Roi-Ta-Se-Ngam-Phao-Hoa-Cung-Nhau-O-lew.mp3',
            image: './assets/img/roitasengamphaohoa.jpg'
        },
        {
            name: 'Hoa Cỏ Lau',
            singer: 'Phong Max',
            path: './assets/music/Hoa-Co-Lau-Phong-Max.mp3',
            image: './assets/img/hoacolau.jpg'
        },
        {
            name: 'Thuyền Quyên',
            singer: 'Dieu Kien',
            path: './assets/music/Thuyen-Quyen-Dieu-Kien.mp3',
            image: './assets/img/thuyenquyen.jpg'
        },
        {
            name: 'Thế Hệ Tan Vở',
            singer: 'Kai Dinh',
            path: './assets/music/The-He-Tan-Vo-Kai-Dinh-SIVAN.mp3',
            image: './assets/img/thehetanvo.jpg'
        }

    ],
    setConfig: function(key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
    },
    render: function(){
        const htmls = this.songs.map((song, index) => {
            return `
            <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                <div class="thumb" style=" background-image:  url('${song.image}')"></div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
            `
        })
        playlist.innerHTML = htmls.join('')
    },  
    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex];
            }
        })
    },
    handleEvents: function() {
        const _this = this;
        const cdWidth = cd.offsetWidth // kích thước chiều rộng

        // Xử lý CD quay và dừng
        // https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API

        const cdThumbAnimate = cdThumb.animate([
            { transform: 'rotate(360deg)'}
        ], {
            duration: 10000, // 10 seconds
            iterations: Infinity
        })

        cdThumbAnimate.pause()

        // Xử lý phóng to / thu nhỏ CD
        document.onscroll = function() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newCdWidth = cdWidth - scrollTop;

            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
            cd.style.opacity = newCdWidth / cdWidth;
        }

        // Xử lý khi click play
        playBtn.onclick = function() {
            if (_this.isPlaying) {
                audio.pause()
            } else {
                audio.play();
            }
        }

        // Khi song được play
        audio.onplay = function() {
            _this.isPlaying = true
            player.classList.add('playing')   
            cdThumbAnimate.play()
        }

        // Khi song bị pause
        audio.onpause = function() {
            _this.isPlaying = false
            player.classList.remove('playing')
            cdThumbAnimate.pause()
        }

        // Khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function() {
            if (audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPercent
            }
        }

        // Xử lý khi tua song
        progress.oninput = function(e) {
            const seekTime = audio.duration / 100 * e.target.value
            audio.currentTime = seekTime
        }

        // Khi next song
        nextBtn.onclick = function() {
            if (_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.nextSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }

        // Khi prev song
        prevBtn.onclick = function() {
            if (_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.prevSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }

        // Khi bật / tắt random song
        randomBtn.onclick = function(e) {
            _this.isRandom = !_this.isRandom
            _this.setConfig('isRandom', _this.isRandom)
            randomBtn.classList.toggle('active', _this.isRandom)
        }

        // Xử lý phát lại 1 song
        repeatBtn.onclick = function() {
            _this.isRepeat = !_this.isRepeat
            _this.setConfig('isRepeat', _this.isRepeat)
            repeatBtn.classList.toggle('active', _this.isRepeat)
        }

        // Xử lý next song khi audio ended
        audio.onended = function() {
            if (_this.isRepeat) {
                audio.play()
            } else {
                nextBtn.click()          
            }
        }

        // Lắng nghe hành vi click vào playlist
        playlist.onclick = function(e) {
            const songNode = e.target.closest('.song:not(.active)')

            // Xử lý khi click vào playlist
            if (songNode || e.target.closest('.option')) {
                // Xử lý khi click vào song
                if (songNode) {
                    // console.log(songNode.getAttribute('data-index'))
                    _this.currentIndex = Number(songNode.dataset.index) 
                    _this.loadCurrentSong()
                    _this.render()
                    audio.play()
                }

                // Xử lý khi click vào song option
                if (e.target.closest('.option')) {

                }
                
            }
        }
    },
    scrollToActiveSong: function() {
        setTimeout(() => {
          $('.song.active').scrollIntoView({
            behavior: 'smooth',
            block: "end",
            inline: "nearest"
          })
        }, 300);
      },
    loadCurrentSong: function() {
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
    },
    loadConfig: function() {
        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat
    },
    nextSong: function() {
        this.currentIndex++
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },
    prevSong: function() {
        this.currentIndex--
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
    },
    playRandomSong: function() {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (newIndex === this.currentIndex)

        this.currentIndex = newIndex
        this.loadCurrentSong()
    },
    start: function(){
        // Gán cấu hình từ config vào ứng dụng
        this.loadConfig();

        // Định nghĩa các thuộc tính cho object
        this.defineProperties();

        // Lắng nghe xử lý sự kiện (DOM events)
        this.handleEvents();

        // Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
        this.loadCurrentSong();

        // Render playlist
        this.render();

        // Hiện thì trạng thái ban đầu của button repeat & random
        repeatBtn.classList.toggle('active', this.isRepeat)
        randomBtn.classList.toggle('active', this.isRandom)
    }
}

app.start();
