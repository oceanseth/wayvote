'use strict';

exports.handler = (event, context, callback) => {
    const request = event.Records[0].cf.request;
    const headers = request.headers;
    
    // Get the host header
    const host = headers.host[0].value.toLowerCase();
    
    // Check if the request is for weighvote.org domains
    if (host === 'weighvote.org' || host === 'www.weighvote.org') {
        // Redirect to www.wayvote.org
        const redirectUrl = `https://www.wayvote.org${request.uri}`;
        
        const response = {
            status: '301',
            statusDescription: 'Moved Permanently',
            headers: {
                'location': [{
                    key: 'Location',
                    value: redirectUrl,
                }],
                'cache-control': [{
                    key: 'Cache-Control',
                    value: 'max-age=3600',
                }],
            },
        };
        
        callback(null, response);
        return;
    }
    
    // For all other domains (wayvote.org, www.wayvote.org), continue with normal processing
    callback(null, request);
};
