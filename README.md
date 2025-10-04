# WayVote

A modern, secure, and transparent democratic voting platform built with React, AWS Lambda, and serverless architecture.

## 🌐 Live Sites

- **Main Site**: [wayvote.org](https://wayvote.org)
- **Redirect Site**: [weighvote.org](https://weighvote.org) → redirects to wayvote.org
- **API**: [api.wayvote.org](https://api.wayvote.org)

## 🏗️ Architecture

### Frontend
- **Framework**: React 18 with Vite
- **Styling**: Custom CSS with modern design
- **Routing**: React Router DOM
- **Hosting**: AWS S3 + CloudFront
- **Domain**: wayvote.org, www.wayvote.org

### Backend
- **Runtime**: Node.js 18.x
- **Framework**: AWS Lambda + API Gateway
- **Domain**: api.wayvote.org
- **SSL**: Custom certificate (85043eab-f82f-484d-88cc-6d352db8123c)

### Infrastructure
- **CDN**: CloudFront distribution
- **DNS**: Route53 hosted zones
- **Storage**: S3 bucket (www.wayvote.org)
- **Deployment**: GitHub Actions + Serverless Framework

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- AWS CLI configured
- Serverless Framework
- Git

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd wayvote
   ```

2. **Install dependencies**
   ```bash
   # Install Lambda dependencies
   cd lambdas
   npm install
   
   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Start frontend development server**
   ```bash
   cd frontend
   npm run dev
   ```

4. **Deploy Lambda functions (optional for local testing)**
   ```bash
   cd lambdas
   npm run deploy
   ```

### API Endpoints

- `GET /api/` - API information and available endpoints
- `POST /api/helloworld` - Test endpoint that returns posted content

Example API call:
```bash
curl -X POST https://api.wayvote.org/helloworld \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello from API!"}'
```

Response:
```json
{
  "test": "hello world",
  "postedcontent": {"message": "Hello from API!"},
  "method": "POST",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## 📁 Project Structure

```
wayvote/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions deployment
├── frontend/                   # React frontend
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/         # React components
│   │   ├── pages/             # Page components
│   │   ├── App.jsx            # Main app component
│   │   └── main.jsx           # Entry point
│   ├── package.json
│   └── vite.config.js
├── lambdas/                   # Lambda functions
│   ├── api.js                 # Main Lambda handler
│   ├── package.json
│   ├── serverless-basic.yml   # Basic serverless config (Lambda + S3)
│   ├── cloudfront-template.yml # CloudFront + Route53 template
│   └── serverless.yml         # Original full config (deprecated)
├── deploy-step1.sh/.ps1       # Deploy basic infrastructure
├── deploy-step2.sh/.ps1       # Deploy CloudFront + Route53
├── deploy-step3.sh/.ps1       # Deploy frontend
└── README.md
```

## 🚀 Deployment

### Automatic Deployment
The project uses GitHub Actions for automatic deployment to production:

1. Push to `production` branch
2. GitHub Actions automatically:
   - Deploys Lambda functions
   - Builds and deploys frontend to S3
   - Invalidates CloudFront cache
   - Tests API endpoints

### Manual Deployment

The deployment is now split into 3 steps to avoid circular dependencies:

1. **Deploy basic infrastructure (Lambda + S3 + API Gateway)**
   ```bash
   ./deploy-step1.sh  # or .\deploy-step1.ps1 on Windows
   ```

2. **Deploy CloudFront and Route53**
   ```bash
   ./deploy-step2.sh  # or .\deploy-step2.ps1 on Windows
   ```

3. **Build and deploy frontend**
   ```bash
   ./deploy-step3.sh  # or .\deploy-step3.ps1 on Windows
   ```

**Alternative: Manual step-by-step**
   ```bash
   # Step 1: Deploy Lambda and basic infrastructure
   cd lambdas
   npx serverless deploy --config serverless-basic.yml --stage production
   
   # Step 2: Deploy CloudFront (get API Gateway Rest API ID from step 1 output)
   aws cloudformation deploy \
     --template-file cloudfront-template.yml \
     --stack-name wayvote-cloudfront-production \
     --parameter-overrides ApiGatewayRestApiId="YOUR_API_ID" Stage="production" \
     --capabilities CAPABILITY_IAM
   
   # Step 3: Build and deploy frontend
   cd ../frontend
   npm run build
   cd ../lambdas
   npx serverless s3sync --config serverless-basic.yml --stage production
   
   # Step 4: Invalidate CloudFront cache
   aws cloudfront create-invalidation \
     --distribution-id "YOUR_DISTRIBUTION_ID" \
     --paths "/*"
   ```

## 🔧 Configuration

### Environment Variables
Set these in your GitHub repository secrets:

- `AWS_ACCESS_KEY_ID` - AWS access key
- `AWS_SECRET_ACCESS_KEY` - AWS secret key

### AWS Resources Created
- S3 bucket: `www.wayvote.org`
- CloudFront distribution with custom domain
- Route53 hosted zones for both domains
- Lambda function with API Gateway
- SSL certificate integration

## 🧪 Testing

### Frontend Testing
```bash
cd frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

### API Testing
Visit [wayvote.org/api-test](https://wayvote.org/api-test) to test API endpoints interactively.

### Manual API Testing
```bash
# Test API root
curl https://api.wayvote.org/

# Test hello world endpoint
curl -X POST https://api.wayvote.org/helloworld \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}'
```

## 🛠️ Development

### Adding New API Endpoints
1. Edit `lambdas/api.js`
2. Add new route handling in the main handler
3. Deploy with `npm run deploy:prod`

### Adding New Frontend Pages
1. Create new component in `frontend/src/pages/`
2. Add route in `frontend/src/App.jsx`
3. Add navigation link in `frontend/src/components/Header.jsx`

### Styling
- Global styles: `frontend/src/index.css`
- Component styles: Individual `.css` files
- Responsive design with CSS Grid and Flexbox

## 📋 Features

### Frontend
- ✅ Responsive design
- ✅ Modern React with hooks
- ✅ Client-side routing
- ✅ API integration
- ✅ Interactive API testing page
- ✅ Professional UI/UX

### Backend
- ✅ Serverless Lambda functions
- ✅ CORS enabled
- ✅ JSON request/response handling
- ✅ Error handling
- ✅ Logging

### Infrastructure
- ✅ CloudFront CDN
- ✅ S3 static hosting
- ✅ Route53 DNS management
- ✅ SSL/TLS encryption
- ✅ Automatic deployments
- ✅ Domain redirects

## 🔒 Security

- SSL/TLS encryption for all domains
- CORS properly configured
- Input validation and sanitization
- Secure AWS IAM roles
- Environment variable protection

## 📞 Support

For questions or support:
- Email: contact@wayvote.org
- Website: [wayvote.org](https://wayvote.org)

## 📄 License

MIT License - see LICENSE file for details.

---

Built with ❤️ for democratic participation
