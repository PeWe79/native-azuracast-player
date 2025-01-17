(function () {
  "use strict";

  // Delete the class 'preload' from the body when the page is loaded
  window.addEventListener("DOMContentLoaded", () => {
    document.body.classList.remove("preload");
  });
  const buttons = document.querySelectorAll("[data-outside]");
  const ACTIVE_CLASS = "is-active";
  function outsideClick(button) {
    if (!button) return;
    const target = document.getElementById(button.dataset.outside);
    if (!target) return;
    function toggleClasses() {
      button.classList.toggle(ACTIVE_CLASS);
      target.classList.toggle(ACTIVE_CLASS);
      if (button.classList.contains(ACTIVE_CLASS)) {
        document.addEventListener("click", clickOutside);
        return;
      }
      document.removeEventListener("click", clickOutside);
    }
    button.addEventListener("click", toggleClasses);
    function clickOutside(event) {
      if (!target.contains(event.target) && !button.contains(event.target)) {
        toggleClasses();
        document.removeEventListener("click", clickOutside);
      }
    }
    const closeButton = target.querySelector("[data-close]");
    if (closeButton) {
      closeButton.addEventListener("click", () => {
        button.classList.remove(ACTIVE_CLASS);
        target.classList.remove(ACTIVE_CLASS);
        document.removeEventListener("click", clickOutside);
      });
    }
  }
  buttons.forEach((button) => {
    outsideClick(button);
  });

  // Function to initialize the canvas (canvas)
  function initCanvas(container) {
    const canvas = document.createElement("canvas");
    canvas.setAttribute("id", "visualizerCanvas");
    canvas.setAttribute("class", "visualizer-item");
    container.appendChild(canvas);
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    return canvas;
  }

  // Feature to change canvas based on container size
  function resizeCanvas(canvas, container) {
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
  }

  // Visualizer
  const visualizer = (audio, container) => {
    if (!audio || !container) {
      return;
    }
    const options = {
      fftSize: container.dataset.fftSize || 2048,
      numBars: container.dataset.bars || 40,
      maxHeight: container.dataset.maxHeight || 255,
    };
    const ctx = new AudioContext();
    const audioSource = ctx.createMediaElementSource(audio);
    const analyzer = ctx.createAnalyser();
    audioSource.connect(analyzer);
    audioSource.connect(ctx.destination);
    const frequencyData = new Uint8Array(analyzer.frequencyBinCount);
    const canvas = initCanvas(container);
    const canvasCtx = canvas.getContext("2d");

    // Create bars
    const renderBars = () => {
      resizeCanvas(canvas, container);
      analyzer.getByteFrequencyData(frequencyData);
      if (options.fftSize) {
        analyzer.fftSize = options.fftSize;
      }
      canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < options.numBars; i++) {
        const index = Math.floor((i + 10) * (i < options.numBars / 2 ? 2 : 1));
        const fd = frequencyData[index];
        const barHeight = Math.max(4, fd || 0) + options.maxHeight / 255;
        const barWidth = canvas.width / options.numBars;
        const x = i * barWidth;
        const y = canvas.height - barHeight;
        canvasCtx.fillStyle = "white";
        canvasCtx.fillRect(x, y, barWidth - 2, barHeight);
      }
      requestAnimationFrame(renderBars);
    };
    renderBars();

    // Window space change listener
    window.addEventListener("resize", () => {
      resizeCanvas(canvas, container);
    });
  };

  const cache = {};

  // Meteor Icons: https://meteoricons.com/
  const icons = {
    play: '<svg class="i i-play" viewBox="0 0 24 24"><path d="m7 3 14 9-14 9z"></path></svg>',
    pause:
      '<svg class="i i-pause" viewBox="0 0 24 24"><path d="M5 4h4v16H5Zm10 0h4v16h-4Z"></path></svg>',
    facebook:
      '<svg class="i i-facebook" viewBox="0 0 24 24"><path d="M17 14h-3v8h-4v-8H7v-4h3V7a5 5 0 0 1 5-5h3v4h-3q-1 0-1 1v3h4Z"></path></svg>',
    twitter:
      '<svg class="i i-x" viewBox="0 0 24 24"><path d="m3 21 7.5-7.5m3-3L21 3M8 3H3l13 18h5Z"></path></svg>',
    instagram:
      '<svg class="i i-instagram" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"></circle><rect width="20" height="20" x="2" y="2" rx="5"></rect><path d="M17.5 6.5h0"></path></svg>',
    youtube:
      '<svg class="i i-youtube" viewBox="0 0 24 24"><path d="M1.5 17q-1-5.5 0-10Q1.9 4.8 4 4.5q8-1 16 0 2.1.3 2.5 2.5 1 4.5 0 10-.4 2.2-2.5 2.5-8 1-16 0-2.1-.3-2.5-2.5Zm8-8.5v7l6-3.5Z"></path></svg>',
    tiktok:
      '<svg class="i i-tiktok" viewBox="0 0 24 24"><path d="M22 6v5q-4 0-6-2v7a7 7 0 1 1-5-6.7m0 6.7a2 2 0 1 0-2 2 2 2 0 0 0 2-2V1h5q2 5 6 5"></path></svg>',
    whatsapp:
      '<svg class="i i-whatsapp" viewBox="0 0 24 24"><circle cx="9" cy="9" r="1"></circle><circle cx="15" cy="15" r="1"></circle><path d="M8 9a7 7 0 0 0 7 7m-9 5.2A11 11 0 1 0 2.8 18L2 22Z"></path></svg>',
    telegram:
      '<svg class="i i-telegram" viewBox="0 0 24 24"><path d="M12.5 16 9 19.5 7 13l-5.5-2 21-8-4 18-7.5-7 4-3"></path></svg>',
    tv: '<svg class="i i-tv" viewBox="0 0 24 24"><rect width="22" height="15" x="1" y="3" rx="3"></rect><path d="M7 21h10"></path></svg>',
    ios: '<svg class="i i-apple" viewBox="0 0 24 24"><path d="M12 3q2 0 2-2-2 0-2 2M8 6C0 6 3 22 8 22q2 0 3-.5t2 0q1 .5 3 .5 3 0 4.5-6a1 1 0 0 1-.5-7.5Q19 6 16 6q-1 0-2.5.5t-3 0Q9 6 8 6"></path></svg>',
    android:
      '<svg class="i i-google-play" viewBox="0 0 24 24"><path d="M6.8 2.2a2.5 2.5 0 0 0-3.8 2v15.6a2.5 2.5 0 0 0 3.8 2L21 13.7a2 2 0 0 0 0-3.4ZM3.2 3.5l12.8 13m-12.8 4L16 7.5"></path></svg>',
  };
  const pixel = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAA1JREFUGFdj+P//PxcACQYDCF0ysWYAAAAASUVORK5CYII=";
  const changeImageSize = (url, size) => url.replace(/100x100/, size);

  // Get Data from Stream Africa
  const getDataFromStreamAfrica = async (
    artist,
    title,
    defaultArt,
    defaultCover
  ) => {
    let text;
    if (artist === null || artist === title) {
      text = `${title} - ${title}`;
    } else {
      text = `${artist} - ${title}`;
    }
    const cacheKey = text.toLowerCase();
    if (cache[cacheKey]) {
      return cache[cacheKey];
    }
    const API_URL = `https://api.streamafrica.net/new.search.php?query=${encodeURIComponent(
      text
    )}&service=itunes`;
    const response = await fetch(API_URL);
    if (title === "MIXX SHOW RADIO" || response.status === 403) {
      const results = {
        title,
        artist,
        thumbnail: defaultArt,
        art: defaultArt,
        cover: defaultCover,
        stream_url: "#not-found",
      };
      cache[cacheKey] = results;
      return results;
    }
    const data = response.ok ? await response.json() : {};
    if (!data.results || data.results.length === 0) {
      const results = {
        title,
        artist,
        thumbnail: defaultArt,
        art: defaultArt,
        cover: defaultCover,
        stream_url: "#not-found",
      };
      cache[cacheKey] = results;
      return results;
    }
    const stream = data.results;
    const results = {
      title: stream.title || title,
      artist: stream.artist || artist,
      thumbnail: stream.artwork || defaultArt,
      art: stream.artwork || defaultArt,
      cover: stream.artwork || defaultCover,
      stream_url: stream.stream_url || "#not-found",
    };
    cache[cacheKey] = results;
    return results;
  };

  // Get data from iTunes
  const getDataFromiTunes = async (artist, title, defaultArt, defaultCover) => {
    let text;
    if (artist === title) {
      text = `${title}`;
    } else {
      text = `${artist} - ${title}`;
    }
    const cacheKey = text.toLowerCase();
    if (cache[cacheKey]) {
      return cache[cacheKey];
    }

    // SyntaxError: Unexpected end of JSON input
    const response = await fetch(
      `https://itunes.apple.com/search?limit=1&term=${encodeURIComponent(text)}`
    );

    if (response.status === 403) {
      const results = {
        title,
        artist,
        thumbnail: defaultArt,
        art: defaultArt,
        cover: defaultCover,
        stream_url: "#not-found",
      };
      return results;
    }

    const data = response.ok ? await response.json() : {};
    if (!data.results || data.results.length === 0) {
      const results = {
        title,
        artist,
        thumbnail: defaultArt,
        art: defaultArt,
        cover: defaultCover,
        stream_url: "#not-found",
      };
      return results;
    }

    const itunes = data.results[0];
    const results = {
      title: itunes.trackName || title,
      artist: itunes.artistName || artist,
      thumbnail: itunes.artworkUrl100 || defaultArt,
      art: itunes.artworkUrl100
        ? changeImageSize(itunes.artworkUrl100, "512x512")
        : defaultArt,
      cover: itunes.artworkUrl100
        ? changeImageSize(itunes.artworkUrl100, "512x512")
        : defaultCover,
      stream_url: "#not-found",
    };
    cache[cacheKey] = results;
    return results;
  };

  // Determine where to get the data from
  async function getDataFrom({ artist, title, art, cover, server }) {
    let dataFrom = {};
    if (server.toLowerCase() === "africa") {
      dataFrom = await getDataFromStreamAfrica(artist, title, art, cover);
    } else {
      dataFrom = await getDataFromiTunes(artist, title, art, cover);
    }
    return dataFrom;
  }

  // Create an HTML element from a text string
  function createElementFromHTML(htmlString) {
    const div = document.createElement("div");
    div.innerHTML = htmlString.trim();
    return div.firstChild;
  }

  // Remove unnecessary elements from text
  function sanitizeText(text) {
    return text.replace(/^\d+\.\)\s/, "").replace(/<br>$/, "");
  }

  // Normalize history
  function normalizeHistory(api) {
    let artist;
    let song;
    let history = api.song_history || api.history || api.songHistory || [];
    history = history.slice(0, 4);
    const historyNormalized = history.map((item) => {
      if (api.song_history) {
        artist = item.song.artist;
        song = item.song.title;
      } else if (api.history) {
        artist = sanitizeText(item.split(" - ")[0] || item);
        song = sanitizeText(item.split(" - ")[1] || item);
      } else if (api.songHistory) {
        artist = item.artist;
        song = item.title;
      }
      return {
        artist,
        song,
      };
    });

    // limit to 4 elements
    return historyNormalized;
  }
  function createTempImage(src) {
    return new Promise((resolve, reject) => {
      const img = document.createElement("img");
      img.crossOrigin = "Anonymous";
      // img.src = `https://images.weserv.nl/?url=${src}`;
      img.src = `${src}`;
      img.onload = () => resolve(img);
      img.onerror = reject;
    });
  }

  function normalizeTitle(api) {
    let title;
    let artist;
    if (api.songtitle && api.songtitle.includes(" - ")) {
      title = api.songtitle.split(" - ")[0];
      artist = api.songtitle.split(" - ")[1];
    } else if (api.now_playing) {
      title = api.now_playing.song.title;
      artist = api.now_playing.song.artist;
    } else if (api.artist && api.title) {
      title = api.title;
      artist = api.artist;
    } else if (api.currenttrack_title) {
      title = api.currenttrack_title;
      artist = api.currenttrack_artist;
    } else if (api.title && api.djprofile && api.djusername) {
      title = api.title.split(" - ")[1];
      artist = api.title.split(" - ")[0];
    } else {
      title = api.currentSong;
      artist = api.currentArtist;
    }
    return {
      title,
      artist,
    };
  }

  const playButton = document.querySelector(".player-button-play");
  const visualizerContainer = document.querySelector(".visualizer");
  const audio = new Audio();
  audio.crossOrigin = "anonymous";
  let hasVisualizer = false;
  function play(audio, newSource = null) {
    if (newSource) {
      audio.src = newSource;
    }

    // Visualizer
    if (!hasVisualizer) {
      visualizer(audio, visualizerContainer);
      hasVisualizer = true;
    }
    audio.load();
    audio.play();
    playButton.innerHTML = icons.pause;
    playButton.classList.add("is-active");
    document.body.classList.add("is-playing");
  }
  function pause(audio) {
    audio.pause();
    playButton.innerHTML = icons.play;
    playButton.classList.remove("is-active");
    document.body.classList.remove("is-playing");
  }

  // Play/pause button, when pausing stop the stream, when playing start the stream again
  // playButton, play, pause are exported functions that will be used in other files

  if (playButton !== null) {
    playButton.addEventListener("click", async () => {
      if (audio.paused) {
        play(audio);
      } else {
        pause(audio);
      }
    });
  }
  const range = document.querySelector(".player-volume");
  const rangeFill = document.querySelector(".player-range-fill");
  const rangeWrapper = document.querySelector(".player-range-wrapper");
  const rangeThumb = document.querySelector(".player-range-thumb");
  const currentVolume = localStorage.getItem("volume") || 100;

  // Range
  function setRangeWidth(percent) {
    {
      rangeFill.style.height = `${percent}%`;
    }
  }

  // Thumb position
  function setThumbPosition(percent) {
    const compensatedWidth =
      rangeWrapper.offsetHeight - rangeThumb.offsetHeight;
    const thumbPosition = (percent / 100) * compensatedWidth;
    {
      rangeThumb.style.bottom = `${thumbPosition}px`;
    }
  }

  // Update volume when changing range
  function updateVolume(value) {
    range.value = value;
    setRangeWidth(value);
    setThumbPosition(value);
    localStorage.setItem("volume", value);
    audio.volume = value / 100;
  }

  // Initial value
  if (range !== null) {
    updateVolume(currentVolume);

    // Listen to the range change
    range.addEventListener("input", (event) => {
      updateVolume(event.target.value);
    });

    // Listen to mouse movement
    rangeThumb.addEventListener("mousedown", () => {
      document.addEventListener("mousemove", handleThumbDrag);
    });
  }

  // Move the thumb and update the volume
  function handleThumbDrag(event) {
    const rangeRect = range.getBoundingClientRect();
    const click = event.clientY - rangeRect.top;
    let percent = (click / range.offsetWidth) * 100;
    percent = 100 - percent;
    percent = Math.max(0, Math.min(100, percent));
    const value =
      Math.round((range.max - range.min) * (percent / 100)) +
      parseInt(range.min);
    updateVolume(value);
  }

  // Stop listening to mouse movement
  document.addEventListener("mouseup", () => {
    document.removeEventListener("mousemove", handleThumbDrag);
  });
  window.addEventListener("resize", () => {
    const currentPercent = range.value;
    setRangeWidth(currentPercent);
    setThumbPosition(currentPercent);
  });

  const songNow = document.querySelector(".song-now");
  const stationsList = document.getElementById("stations");
  const stationName = document.querySelector(".station-name");
  const stationDescription = document.querySelector(".station-description");
  const headerLogoImg = document.querySelector(".header-logo-img");
  const playerArtwork = document.querySelector(
    ".player-artwork img:first-child"
  );
  const playerCoverImg = document.querySelector(".player-cover-image");
  const playerSocial = document.querySelectorAll(".player-social");
  const playerApps = document.querySelector(".footer-app");
  const playerTv = document.querySelector(".online-tv");
  const playerTvHeader = document.querySelector(".online-tv-header");
  const playerTvModal = document.getElementById("modal-tv");
  const playerProgram = document.querySelector(".player-program");
  const history = document.getElementById("history");

  const historyTemplate = `<div class="history-item flex items-center g-0.75">
      <div class="history-image flex-none">
        <img src="{{art}}" width="80" height="80">
      </div>
      <div class="history-meta flex column">
        <span class="color-title fw-500 truncate-line">{{title}}</span>
        <span class="color-text truncate-line">{{artist}}</span>
      </div>
      <a href="{{stream_url}}" class="history-spotify" target="_blank" rel="noopener">
      </a>
      </div>`;

  const TIME_TO_REFRESH = window?.streams?.timeRefresh || 10000;
  let currentStation;
  let activeButton;
  function setAssetsInPage(station) {
    if (playerSocial) {
      playerSocial.forEach((item) => {
        item.innerHTML = "";
      });
    }
    playerApps && (playerApps.innerHTML = "");
    playerProgram && (playerProgram.innerHTML = "");
    playerTv && (playerTv.innerHTML = "");
    playerTvHeader && (playerTvHeader.innerHTML = "");
    headerLogoImg.src = station.logo;
    playerArtwork.src = station.albumArt;
    playerCoverImg.src = station.cover || station.albumArt;
    stationName.textContent = station.name;
    stationDescription.textContent = station.description;
    if (station.social && playerSocial.length) {
      playerSocial.forEach((item) => {
        Object.keys(station.social).forEach((key) => {
          item.appendChild(createSocialItem(station.social[key], key));
        });
      });
    }
    if (station.apps && playerApps) {
      Object.keys(station.apps).forEach((key) => {
        playerApps.appendChild(createAppsItem(station.apps[key], key));
      });
    }
    if (station.program && playerProgram) {
      createProgram(station.program);
    }
    if (station.tv_url && playerTv) {
      createOpenTvButton(station.tv_url);
    }
  }

  function setAccentColor(image, colorThief) {
    const dom = document.documentElement;
    const metaThemeColor = document.querySelector("meta[name=theme-color]");
    if (image.complete) {
      dom.setAttribute("style", `--accent: rgb(${colorThief.getColor(image)})`);
      metaThemeColor.setAttribute(
        "content",
        `rgb(${colorThief.getColor(image)})`
      );
    } else {
      image.addEventListener("load", function () {
        dom.setAttribute(
          "style",
          `--accent: rgb(${colorThief.getColor(image)})`
        );
        metaThemeColor.setAttribute(
          "content",
          `rgb(${colorThief.getColor(image)})`
        );
      });
    }
  }

  function createOpenTvButton(url) {
    const $button = document.createElement("button");
    $button.classList.add("player-button-tv", "player-button");
    $button.innerHTML = icons.tv + "Tv en vivo";
    function openTv() {
      playerTvModal.classList.add("is-active");
      pause(audio);
      const modalBody = playerTvModal.querySelector(".modal-body-video");
      const closeButton = playerTvModal.querySelector("[data-close]");
      const $iframe = document.createElement("iframe");
      $iframe.src = url;
      $iframe.allowFullscreen = true;
      modalBody.appendChild($iframe);
      closeButton.addEventListener("click", () => {
        playerTvModal.classList.remove("is-active");

        // When you finish closing the modal, delete the iframe
        $iframe.remove();
      });
    }
    $button.addEventListener("click", openTv);
    playerTv.appendChild($button);
    const cloneButton = $button.cloneNode(true);
    cloneButton.classList.add("btn");
    cloneButton.classList.remove("player-button");
    cloneButton.addEventListener("click", openTv);
    playerTvHeader.appendChild(cloneButton);
  }

  function createProgram(program) {
    if (!program) return;
    if (program.time) {
      const $div = document.createElement("div");
      const $span = document.createElement("span");
      $div.classList.add("player-program-time-container");
      $span.classList.add("player-program-badge");
      $span.innerHTML = "<i></i> On Air";
      $div.appendChild($span);
      const $time = document.createElement("span");
      $time.classList.add("player-program-time");
      $time.textContent = program.time;
      $div.appendChild($time);
      playerProgram.appendChild($div);
    }
    if (program.name) {
      const $name = document.createElement("span");
      $name.classList.add("player-program-name");
      $name.textContent = program.name;
      playerProgram.appendChild($name);
    }
    if (program.description) {
      const $description = document.createElement("span");
      $description.classList.add("player-program-description");
      $description.textContent = program.description;
      playerProgram.appendChild($description);
    }
  }

  function createSocialItem(url, icon) {
    const $a = document.createElement("a");
    $a.classList.add("player-social-item");
    $a.href = url;
    $a.target = "_blank";
    $a.innerHTML = icons[icon];
    return $a;
  }

  function createAppsItem(url, name) {
    const $a = document.createElement("a");
    $a.classList.add("player-apps-item");
    $a.href = url;
    $a.target = "_blank";
    $a.innerHTML = `<img src="assets/app/${name}.svg" alt="${name}" height="48" width="${name === "ios" ? "143" : "163"
      }">`;
    return $a;
  }

  function createStations(stations, currentStation, callback) {
    if (!stationsList) return;
    stationsList.innerHTML = "";
    stations.forEach(async (station, index) => {
      const $fragment = document.createDocumentFragment();
      const $button = createStreamItem(
        station,
        index,
        currentStation,
        callback
      );
      $fragment.appendChild($button);
      stationsList.appendChild($fragment);
    });
  }

  function createStreamItem(station, index, currentStation, callback) {
    const $button = document.createElement("button");
    $button.classList.add("station");
    $button.innerHTML = `<img class="station-img" src="${station.albumArt}" alt="station" height="160" width="160">`;
    $button.dataset.index = index;
    $button.dataset.hash = station.hash;
    if (currentStation.stream_url === station.stream_url) {
      $button.classList.add("is-active");
      activeButton = $button;
    }
    $button.addEventListener("click", () => {
      if ($button.classList.contains("is-active")) return;

      // Remove the "active" class from the previous active button, if it exists
      if (activeButton) {
        activeButton.classList.remove("is-active");
      }
      const playerStation = document.querySelector(
        ".player-station img:first-child"
      );
      if (playerStation) {
        playerStation.src = station.albumArt;
      }

      // Add "active" class to currently pressed button
      $button.classList.add("is-active");
      activeButton = $button; // Update active button

      setAssetsInPage(station);
      play(audio, station.stream_url);
      if (history) {
        history.innerHTML = "";
      }

      // Call the callback function if provided
      if (typeof callback === "function") {
        callback(station);
      }
    });
    return $button;
  }

  // Load current song data to browser
  function mediaSession(data) {
    const { title, artist, albumArt, art } = data;
    if ("mediaSession" in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title,
        artist,
        albumArt,
        artwork: [
          {
            src: art,
            sizes: "512x512",
            type: "image/png",
          },
        ],
      });
      navigator.mediaSession.setActionHandler("play", () => {
        play();
      });
      navigator.mediaSession.setActionHandler("pause", () => {
        pause();
      });
    }
  }

  // Set current song data
  function npData(data) {
    const content = songNow;
    const songTitle = content.querySelector(".song-title");
    const songName = document.querySelectorAll(".song-name");
    const songArtist = document.querySelectorAll(".song-artist");
    document.title = data.artist + " - " + data.title;
    // const playerModalImage = document.querySelector('.player-modal-image')

    songName.forEach((item) => {
      item.textContent = data.title;
    });
    songArtist.forEach((item) => {
      item.textContent = data.artist;
    });
    songTitle.classList.remove("is-scrolling");
    songTitle.removeAttribute("style");
    if (songTitle.scrollWidth > songTitle.offsetWidth) {
      songTitle.classList.add("is-scrolling");
      const scroll = songTitle.scrollWidth - songTitle.offsetWidth;
      const speed = scroll / 10;
      songTitle.setAttribute(
        "style",
        `--text-scroll: -${scroll}px; --text-scroll-duration: ${speed}s`
      );
    } else {
      songTitle.classList.remove("is-scrolling");
      songTitle.removeAttribute("style");
    }
    const artwork = document.querySelector(".player-artwork");
    const miniArtwork = document.querySelector(".player-artwork-mini");
    if (artwork) {
      const $img = document.createElement("img");
      $img.src = data.art;
      $img.width = 600;
      $img.height = 600;

      // playerModalImage.src = data.art

      // When the image has uploaded, insert it into artwork
      $img.addEventListener("load", () => {
        artwork.appendChild($img);

        // eslint-disable-next-line no-undef
        const colorThief = new ColorThief();

        // Run every time the image changes
        // Create a temporary image to avoid CORS errors
        createTempImage($img.src).then((img) => {
          setAccentColor(img, colorThief);
        });

        // Animate image to shift left with transform
        setTimeout(() => {
          artwork.querySelectorAll("img").forEach((img) => {
            // Set the transition
            img.style.transform = `translateX(${-img.width}px)`;

            // Wait for the animation to finish
            img.addEventListener("transitionend", () => {
              // Delete all images except the last one
              artwork
                .querySelectorAll("img:not(:last-child)")
                .forEach((img) => {
                  img.remove();
                });
              img.style.transition = "none";
              img.style.transform = "none";
              setTimeout(() => {
                img.removeAttribute("style");
              }, 1000);
            });
          });
        }, 100);
      });
    }
    if (miniArtwork) {
      miniArtwork.src = data.art;
    }
    if (playerCoverImg) {
      const tempImg = new Image();
      tempImg.src = data.cover || data.art;
      tempImg.addEventListener("load", () => {
        playerCoverImg.style.opacity = 0;

        // Wait for the animation to finish
        playerCoverImg.addEventListener("transitionend", () => {
          playerCoverImg.src = data.cover || data.art;
          playerCoverImg.style.opacity = 1;
        });
      });
    }
  }

  // Set the songs that have been played
  function setHistory(data, current, server) {
    if (!history) return;
    history.innerHTML = historyTemplate
      .replace("{{art}}", pixel)
      .replace("{{title}}", "Loading history...")
      .replace("{{artist}}", "Artist")
      .replace("{{stream_url}}", "#not-found");
    if (!data) return;

    // max 10 items
    data = data.slice(0, 4);
    const promises = data.map(async (item) => {
      const { artist, title } = item;
      const { albumArt, cover } = current;
      const dataFrom = await getDataFrom({
        artist,
        title: title,
        art: albumArt,
        cover,
        server,
      });
      return historyTemplate
        .replace("{{art}}", dataFrom.thumbnail || dataFrom.art)
        .replace("{{title}}", dataFrom.title)
        .replace("{{artist}}", dataFrom.artist)
        .replace("{{stream_url}}", dataFrom.stream_url);
    });

    Promise.all(promises)
      .then((itemsHTML) => {
        const $fragment = document.createDocumentFragment();
        itemsHTML.forEach((itemHTML) => {
          $fragment.appendChild(createElementFromHTML(itemHTML));
        });
        history.innerHTML = "";
        history.appendChild($fragment);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  // Start the application
  function initApp() {
    // Variables to store information to be updated
    let currentSongPlaying;
    let timeoutId;
    const json = window.streams || {};
    const stations = json.stations;
    currentStation = stations[0];

    // Set page assets
    setAssetsInPage(currentStation);

    // Set the audio source
    audio.src = currentStation.stream_url;

    // Start the stream
    function init(current) {
      // Cancelar el timeout anterior
      if (timeoutId) clearTimeout(timeoutId);

      // If the url of the current station is different from the current station, the information is updated
      if (currentStation.stream_url !== current.stream_url) {
        currentStation = current;
      }
      const server = currentStation.server || "itunes";
      const jsonUri = currentStation.api;
      fetch(jsonUri)
        .then((response) => response.json())
        .then(async (res) => {
          const current = normalizeTitle(res);

          // If currentSong is different from the current song, the information is updated
          const title = current.title;
          if (currentSongPlaying !== title) {
            // Update current song
            currentSongPlaying = title;
            let artist = current.artist;
            const art = currentStation.albumArt;
            const cover = currentStation.cover;
            const history = normalizeHistory(res);
            artist = title === artist ? null : artist;
            const dataFrom = await getDataFrom({
              artist,
              title,
              art,
              cover,
              server,
              // server: 'itunes'
            });

            // Set current song data
            npData(dataFrom);
            mediaSession(dataFrom);
            setHistory(history, currentStation, server);
          }
        })
        .catch((error) => console.log(error));
      timeoutId = setTimeout(() => {
        init(current);
      }, TIME_TO_REFRESH);
    }
    init(currentStation);
    createStations(stations, currentStation, (station) => {
      init(station);
    });
    const nextStation = document.querySelector(".player-button-forward-step");
    const prevStation = document.querySelector(".player-button-backward-step");
    if (nextStation) {
      nextStation.addEventListener("click", () => {
        const next =
          stationsList.querySelector(".is-active").nextElementSibling;
        if (next) {
          next.click();
        }
      });
    }
    if (prevStation) {
      prevStation.addEventListener("click", () => {
        const prev = stationsList.querySelector(".is-active").previousElementSibling;
        if (prev) {
          prev.click();
        }
      });
    }
  }
  initApp();
})();
