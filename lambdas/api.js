const AWS = require('aws-sdk');

// Initialize AWS services
const s3 = new AWS.S3();
const cloudfront = new AWS.CloudFront();

// CORS headers for all responses
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
  'Content-Type': 'application/json'
};

// Helper function to create response
const createResponse = (statusCode, body, additionalHeaders = {}) => {
  return {
    statusCode,
    headers: { ...corsHeaders, ...additionalHeaders },
    body: JSON.stringify(body)
  };
};

// Helper function to parse JSON body
const parseBody = (body) => {
  try {
    return body ? JSON.parse(body) : null;
  } catch (error) {
    return null;
  }
};

// Main handler function
exports.handler = async (event, context) => {
  console.log('Event:', JSON.stringify(event, null, 2));
  
  const { httpMethod, path, pathParameters, queryStringParameters, body, headers } = event;
  
  // Handle preflight OPTIONS requests
  if (httpMethod === 'OPTIONS') {
    return createResponse(200, { message: 'CORS preflight successful' });
  }
  
  try {
    // Route handling
    const pathSegments = path.split('/').filter(segment => segment);
    
    // Handle /getRankings endpoint
    if (pathSegments.includes('getRankings')) {
      return handleGetRankings(httpMethod, body);
    }
    
    // Handle /upVote endpoint
    if (pathSegments.includes('upVote')) {
      return handleUpVote(httpMethod, body);
    }
    
    // Handle /downVote endpoint
    if (pathSegments.includes('downVote')) {
      return handleDownVote(httpMethod, body);
    }
    
    // Handle /helloworld endpoint
    if (pathSegments.includes('helloworld')) {
      return handleHelloWorld(httpMethod, body);
    }
    
    // Handle root path
    if (path === '/' || path === '') {
      return createResponse(200, {
        message: 'WayVote API is running',
        version: '1.0.0',
        endpoints: {
          'POST /getRankings': 'Get rankings for content IDs',
          'POST /upVote': 'Upvote content',
          'POST /downVote': 'Downvote content',
          'POST /helloworld': 'Test endpoint that returns posted content'
        }
      });
    }
    
    // Handle unknown routes
    return createResponse(404, {
      error: 'Not Found',
      message: `Route ${path} not found`,
      availableRoutes: ['/getRankings', '/upVote', '/downVote', '/helloworld']
    });
    
  } catch (error) {
    console.error('Error in handler:', error);
    return createResponse(500, {
      error: 'Internal Server Error',
      message: 'An unexpected error occurred'
    });
  }
};

// Handle /getRankings endpoint
const handleGetRankings = (httpMethod, body) => {
  if (httpMethod !== 'POST') {
    return createResponse(405, { error: 'Method not allowed' });
  }
  
  const requestData = parseBody(body);
  if (!requestData || !requestData.ids || !Array.isArray(requestData.ids)) {
    return createResponse(400, { error: 'Invalid request data. Expected { ids: string[] }' });
  }
  
  // Generate random rankings for each ID
  const rankings = requestData.ids.map(id => ({
    contentId: id,
    rank: Math.floor(Math.random() * 1000) + 1 // Random rank between 1-1000
  }));
  
  return createResponse(200, rankings);
};

// Handle /upVote endpoint
const handleUpVote = (httpMethod, body) => {
  if (httpMethod !== 'POST') {
    return createResponse(405, { error: 'Method not allowed' });
  }
  
  const requestData = parseBody(body);
  if (!requestData || !requestData.contentId) {
    return createResponse(400, { error: 'Invalid request data. Expected { contentId: string }' });
  }
  
  // For now, just return success
  return createResponse(200, { 
    success: true, 
    message: 'Upvote recorded',
    contentId: requestData.contentId,
    timestamp: new Date().toISOString()
  });
};

// Handle /downVote endpoint
const handleDownVote = (httpMethod, body) => {
  if (httpMethod !== 'POST') {
    return createResponse(405, { error: 'Method not allowed' });
  }
  
  const requestData = parseBody(body);
  if (!requestData || !requestData.contentId) {
    return createResponse(400, { error: 'Invalid request data. Expected { contentId: string }' });
  }
  
  // For now, just return success
  return createResponse(200, { 
    success: true, 
    message: 'Downvote recorded',
    contentId: requestData.contentId,
    timestamp: new Date().toISOString()
  });
};

// Handle /helloworld endpoint
const handleHelloWorld = (httpMethod, body) => {
  const postedContent = parseBody(body);
  
  const response = {
    test: "hello world",
    postedcontent: postedContent || null,
    method: httpMethod,
    timestamp: new Date().toISOString()
  };
  
  return createResponse(200, response);
};

// Helper function to invalidate CloudFront cache (for future use)
const invalidateCloudFront = async (distributionId, paths = ['/*']) => {
  try {
    const params = {
      DistributionId: distributionId,
      InvalidationBatch: {
        CallerReference: Date.now().toString(),
        Paths: {
          Quantity: paths.length,
          Items: paths
        }
      }
    };
    
    const result = await cloudfront.createInvalidation(params).promise();
    console.log('CloudFront invalidation created:', result.Invalidation.Id);
    return result;
  } catch (error) {
    console.error('Error creating CloudFront invalidation:', error);
    throw error;
  }
};

// Helper function to upload to S3 (for future use)
const uploadToS3 = async (bucket, key, body, contentType = 'text/html') => {
  try {
    const params = {
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: contentType,
      CacheControl: key === 'index.html' ? 'no-cache, no-store, must-revalidate' : 'public, max-age=31536000'
    };
    
    const result = await s3.upload(params).promise();
    console.log('File uploaded to S3:', result.Location);
    return result;
  } catch (error) {
    console.error('Error uploading to S3:', error);
    throw error;
  }
};
