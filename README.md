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
│   └── serverless.yml         # Serverless configuration
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

1. **Deploy Lambda functions**
   ```bash
   cd lambdas
   npm run deploy:prod
   ```

2. **Build and deploy frontend**
   ```bash
   cd frontend
   npm run build
   cd ../lambdas
   npx serverless s3sync --stage production
   ```

3. **Invalidate CloudFront cache**
   ```bash
   cd lambdas
   npx serverless cloudfrontInvalidate --stage production
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
