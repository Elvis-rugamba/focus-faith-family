const NodeMediaServer = require('node-media-server');
const _ = require('lodash');
const { join } = require('path');
const config = require('./config/config').rtmpConfig;
const fs = require('./utils/fs');
const hls = require('./utils/hls');
const utils = require('./utils/utils');

const init = async () => {
    try {
        nms = new NodeMediaServer(config);

        hls.recordHls(config, this.streams);

        //
        // HLS callbacks
        //
        hls.on('newHlsStream', async (name) => {
            console.log('Hereeeeeeeeeeeeeeeeeeeeeeeeeeeeee')
            // Create the ABR HLS playlist file.
            await abr.createPlaylist(config.http.mediaroot, name);
            // Send the "stream key" <-> "IP:PORT" mapping to Redis
            // This tells the Origin which Server has the HLS files
            // await cache.set(name, SERVER_ADDRESS);
        });

        nms.on('preConnect', (id, args) => {
            console.log('[NodeEvent on preConnect]', `id=${id} args=${JSON.stringify(args)}`);
            // Pre connect authorization
            // let session = nms.getSession(id);
            // session.reject();
          });
      
        nms.on('postConnect', (id, args) => {
            console.log('[NodeEvent on postConnect]', `id=${id} args=${JSON.stringify(args)}`);
        });
      
        nms.on('doneConnect', (id, args) => {
            console.log('[NodeEvent on doneConnect]', `id=${id} args=${JSON.stringify(args)}`);
        });
 
        nms.on('prePublish', async (id, StreamPath, args) => {
            let streamKey = getStreamKeyFromStreamPath(StreamPath);
            console.log('[NodeEvent on prePublish]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}, stream_key=${streamKey}`);
        });

        nms.on('postPublish', async (id, StreamPath, args) => {
            if (StreamPath.indexOf('/live/') != -1) {
                // Set the "stream key" <-> "id" mapping for this RTMP/HLS session
                // We use this when creating the DVR HLS playlist name on S3.
                const name = getStreamKeyFromStreamPath(StreamPath);
                // this.streams.set(name, id);
            }
        });

        nms.on('donePublish', async (id, StreamPath, args) => {
            console.log('[NodeEvent on donePublish]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
            if (StreamPath.indexOf('/live/') != -1) {
                const name = getStreamKeyFromStreamPath(StreamPath);
                // Delete the Redis cache key for this stream
                // await cache.del(name);
                // Wait a few minutes before deleting the HLS files on this Server
                // for this session
                const timeoutMs = _.isEqual(process.env.NODE_ENV, 'development') ?
                  1000 : 
                  2 * 60 * 1000;
                await utils.timeout(timeoutMs);
                // if (!_.isEqual(await cache.get(name), SERVER_ADDRESS)) {
                  // Only clean up if the stream isn't running.  
                  // The user could have terminated then started again.
                  try {
                    // Cleanup directory
                    console.log('[Delete HLS Directory]', `dir=${join(config.http.mediaroot, name)}`);
                    // this.streams.delete(name);
                    fs.rmdirSync(join(config.http.mediaroot, name));
                  } catch (err) {
                    console.error(err);
                  }
                // }
            }
        });

        nms.on('prePlay', (id, StreamPath, args) => {
            console.log('[NodeEvent on prePlay]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
            // Pre play authorization
            // let session = nms.getSession(id);
            // session.reject();
        });
      
        nms.on('postPlay', (id, StreamPath, args) => {
            console.log('[NodeEvent on postPlay]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
        });
      
        nms.on('donePlay', (id, StreamPath, args) => {
            console.log('[NodeEvent on donePlay]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
        });
 
        const getStreamKeyFromStreamPath = (path) => {
            let parts = path.split('/');
            return parts[parts.length - 1];
        };

        nms.run();
    } catch (err) {
        console.log('Can\'t start app', err);
        process.exit();
    }
};
 


module.exports = init;
 