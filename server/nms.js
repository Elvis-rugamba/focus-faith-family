const NodeMediaServer = require('node-media-server');
const config = require('./config/config').rtmpConfig;
 
nms = new NodeMediaServer(config);
 
nms.on('prePublish', async (id, StreamPath, args) => {
    let streamKey = getStreamKeyFromStreamPath(StreamPath);
    console.log('[NodeEvent on prePublish]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}, stream_key=${streamKey}`);
});
 
const getStreamKeyFromStreamPath = (path) => {
    let parts = path.split('/');
    return parts[parts.length - 1];
};

module.exports = nms;
 