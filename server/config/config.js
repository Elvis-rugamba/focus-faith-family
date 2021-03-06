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
            mediaroot: './server/media',
            allow_origin: '*',
            api: true
        },
        trans: {
            ffmpeg: process.env.FFMPEG_PATH,
            tasks: [
                {
                    app: 'abbagospel',
                    hls: true,
                    hlsFlags: '[hls_time=2:hls_list_size=3:hls_flags=delete_segments]',
                    raw: [
                        '-vf',
                        'scale=w=640:h=360:force_original_aspect_ratio=decrease',
                        '-c:a',
                        'aac',
                        '-ar',
                        '48000',
                        '-c:v',
                        'libx264',
                        '-preset',
                        'veryfast',
                        '-profile:v',
                        'main',
                        '-crf',
                        '20',
                        '-sc_threshold',
                        '0',
                        '-g',
                        '48',
                        '-keyint_min',
                        '48',
                        '-hls_time',
                        '6',
                        '-hls_list_size',
                        '10',
                        '-hls_flags',
                        'delete_segments',
                        '-max_muxing_queue_size',
                        '1024',
                        '-start_number',
                        '${timeInMilliseconds}',
                        '-b:v',
                        '800k',
                        '-maxrate',
                        '856k',
                        '-bufsize',
                        '1200k',
                        '-b:a',
                        '96k',
                        '-hls_segment_filename',
                        '${mediaroot}/${streamName}/360p/%03d.ts',
                        '${mediaroot}/${streamName}/360p/index.m3u8',
                        '-vf',
                        'scale=w=842:h=480:force_original_aspect_ratio=decrease',
                        '-c:a',
                        'aac',
                        '-ar',
                        '48000',
                        '-c:v',
                        'libx264',
                        '-preset',
                        'veryfast',
                        '-profile:v',
                        'main',
                        '-crf',
                        '20',
                        '-sc_threshold',
                        '0',
                        '-g',
                        '48',
                        '-keyint_min',
                        '48',
                        '-hls_time',
                        '6',
                        '-hls_list_size',
                        '10',
                        '-hls_flags',
                        'delete_segments',
                        '-max_muxing_queue_size',
                        '1024',
                        '-start_number',
                        '${timeInMilliseconds}',
                        '-b:v',
                        '1400k',
                        '-maxrate',
                        '1498k',
                        '-bufsize',
                        '2100k',
                        '-b:a',
                        '128k',
                        '-hls_segment_filename',
                        '${mediaroot}/${streamName}/480p/%03d.ts',
                        '${mediaroot}/${streamName}/480p/index.m3u8',
                        '-vf',
                        'scale=w=1280:h=720:force_original_aspect_ratio=decrease',
                        '-c:a',
                        'aac',
                        '-ar',
                        '48000',
                        '-c:v',
                        'libx264',
                        '-preset',
                        'veryfast',
                        '-profile:v',
                        'main',
                        '-crf',
                        '20',
                        '-sc_threshold',
                        '0',
                        '-g',
                        '48',
                        '-keyint_min',
                        '48',
                        '-hls_time',
                        '6',
                        '-hls_list_size',
                        '10',
                        '-hls_flags',
                        'delete_segments',
                        '-max_muxing_queue_size',
                        '1024',
                        '-start_number',
                        '${timeInMilliseconds}',
                        '-b:v',
                        '2800k',
                        '-maxrate',
                        '2996k',
                        '-bufsize',
                        '4200k',
                        '-b:a',
                        '128k',
                        '-hls_segment_filename',
                        '${mediaroot}/${streamName}/720p/%03d.ts',
                        '${mediaroot}/${streamName}/720p/index.m3u8'
                      ],
                      ouPaths: [
                        '${mediaroot}/${streamName}/360p',
                        '${mediaroot}/${streamName}/480p',
                        '${mediaroot}/${streamName}/720p'
                      ],
                    // dash: true,
                    // dashFlags: '[f=dash:window_size=3:extra_window_size=5]',
                    // mp4: true,
                    // mp4Flags: '[movflags=frag_keyframe+empty_moov]',
                }
            ]
        }
    }
};