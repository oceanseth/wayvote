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
          'POST /helloworld': 'Test endpoint that returns posted content'
        }
      });
    }
    
    // Handle unknown routes
    return createResponse(404, {
      error: 'Not Found',
      message: `Route ${path} not found`,
      availableRoutes: ['/helloworld']
    });
    
  } catch (error) {
    console.error('Error in handler:', error);
    return createResponse(500, {
      error: 'Internal Server Error',
      message: 'An unexpected error occurred'
    });
  }
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
