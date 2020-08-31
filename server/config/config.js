const { config } = require('dotenv');
config()

module.exports = {
    rtmpConfig: {
        rtmp: {
            port: 1935,
            chunk_size: 60000,
            gop_cache: true,
            ping: 60,
            ping_timeout: 30
        },
        http: {
            port: 8888,
            mediaroot: './media',
            allow_origin: '*'
        },
        trans: {
            ffmpeg: process.env.FFMPEG_PATH,
            tasks: [
                {
                    app: 'abbagospel',
                    hls: true,
                    hlsFlags: '[hls_time=2:hls_list_size=3:hls_flags=delete_segments]',
                    dash: true,
                    dashFlags: '[f=dash:window_size=3:extra_window_size=5]'
                }
            ]
        }
    }
};