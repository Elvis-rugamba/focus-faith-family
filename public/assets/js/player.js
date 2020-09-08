// Cache references to DOM elements.
var elms = [
  "audio",
  "timer",
  "duration",
  "playBtn",
  "pauseBtn",
  "stopBtn",
  "volLowBtn",
  "volHighBtn",
  "progress",
  "spinner",
];
elms.forEach(function (elm) {
  window[elm] = document.getElementById(elm);
});

/**
 * Player class containing the state of our audio and where we are in it.
 * Includes all methods for playing, skipping, updating the display, etc.
 * @param {Array} audio Array of objects with audio song details ({title, file, howl}).
 */
var Player = function (audio) {
  this.audio = audio;
};
Player.prototype = {
  /**
   * Play a song in the audio.
   * @param  {Number} index Index of the song in the audio (leave empty to play the first or current).
   */
  play: function () {
    var self = this;

    var sound = new Howl({
      src: [self.audio],
      html5: true, // Force to HTML5 so that the audio can stream in (best for large files).
      onplay: function () {
        // Display the duration.
        duration.innerHTML = self.formatTime(Math.round(sound.duration()));

        // Start upating the progress of the track.
        requestAnimationFrame(self.step.bind(self));

        pauseBtn.style.display = "block";
      },
      onload: function () {
        spinner.style.display = "none";
      },
      onend: function () {},
      onpause: function () {},
      onstop: function () {},
      onseek: function () {
        // Start upating the progress of the track.
        requestAnimationFrame(self.step.bind(self));
      },
    });

    // Begin playing the sound.
    sound.play();

    // Show the pause button.
    if (sound.state() === "loaded") {
      playBtn.style.display = "none";
      pauseBtn.style.display = "block";
    } else {
      spinner.style.display = "block";
      playBtn.style.display = "none";
      pauseBtn.style.display = "none";
    }

    this.sound = sound;
  },

  /**
   * Pause the currently playing track.
   */
  pause: function () {
    var self = this;

    // Puase the sound.
    self.sound.pause();

    // Show the play button.
    playBtn.style.display = "block";
    pauseBtn.style.display = "none";
  },

  /**
   * Stop the currently playing track.
   */
  stop: function () {
    var self = this;

    // Puase the sound.
    self.sound.stop();

    // Show the play button.
  },

  /**
   * Set the volume and update the volume slider display.
   * @param  {Number} val Volume between 0 and 1.
   */
  volumeUp: function () {
    var self = this;

    var vol = self.sound.volume();
    vol += 0.1;
    if (vol > 1) {
      vol = 1;
    }

    // Update the global volume (affecting all Howls).
    self.sound.volume(vol);

    // Update the display on the slider.
    // var barWidth = (val * 90) / 100;
    // barFull.style.width = (barWidth * 100) + '%';
    // sliderBtn.style.left = (window.innerWidth * barWidth + window.innerWidth * 0.05 - 25) + 'px';
  },

  volumeDown: function () {
    var self = this;

    var vol = self.sound.volume();
    vol -= 0.1;
    if (vol < 0) {
      vol = 0;
    }

    // Update the global volume (affecting all Howls).
    self.sound.volume(vol);

    // Update the display on the slider.
    // var barWidth = (val * 90) / 100;
    // barFull.style.width = (barWidth * 100) + '%';
    // sliderBtn.style.left = (window.innerWidth * barWidth + window.innerWidth * 0.05 - 25) + 'px';
  },

  /**
   * Seek to a new position in the currently playing track.
   * @param  {Number} per Percentage through the song to skip.
   */
  seek: function (per) {
    var self = this;

    // Get the Howl we want to manipulate.
    var sound = self.sound;

    // Convert the percent into a seek position.
    if (sound.playing()) {
      sound.seek(sound.duration() * per);
    }
  },

  /**
   * The step called within requestAnimationFrame to update the playback position.
   */
  step: function () {
    var self = this;

    // Get the Howl we want to manipulate.
    var sound = self.sound;

    // Determine our current seek position.
    var seek = sound.seek() || 0;
    timer.innerHTML = self.formatTime(Math.round(seek));
    progress.style.width = ((seek / sound.duration()) * 100 || 0) + "%";

    // If the sound is still playing, continue stepping.
    if (sound.playing()) {
      requestAnimationFrame(self.step.bind(self));
    }
  },

  /**
   * Format the time from seconds to M:SS.
   * @param  {Number} secs Seconds to format.
   * @return {String}      Formatted time.
   */
  formatTime: function (secs) {
    var minutes = Math.floor(secs / 60) || 0;
    var seconds = secs - minutes * 60 || 0;

    return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
  },
};

// Setup our new audio player class and pass it the audio.
var url = audio.dataset.url;
var player = new Player(url);

// Bind our player controls.
playBtn.addEventListener("click", function () {
  player.play();
});
pauseBtn.addEventListener("click", function () {
  player.pause();
});
stopBtn.addEventListener("click", function () {
  player.stop();
});
volLowBtn.addEventListener("click", function () {
  player.volumeDown();
});
volHighBtn.addEventListener("click", function () {
  player.volumeUp();
});

window.addEventListener("load", function () {
  // player.play()
});
