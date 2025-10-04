# WayVote

A browser plugin that gives users control over ranking algorithms on the sites they visit, starting with Reddit. When you upvote content, your self-reported and measured metrics allow others to weigh your votes according to their preferences.

## Overview

WayVote addresses a critical problem with today's internet: **lack of control over content curation**. Social media platforms like Reddit, Facebook, and Twitter use opaque algorithms to control what content you see, often prioritizing engagement over your mental wellness and authentic preferences.

### The Problem

Current social media algorithms:
- Show content that makes you angry or depressed to maximize engagement
- Use hidden ranking systems you can't understand or control
- Allow bots and bad actors to game the system
- Create echo chambers without your knowledge or consent
- Prioritize advertiser interests over user wellbeing

### The Solution

WayVote gives you the power to:
- **Control ranking algorithms** on sites you visit through a browser plugin
- **Weight votes** based on user metrics (intelligence, expertise, authenticity)
- **See transparent rankings** instead of hidden algorithmic decisions
- **Create custom echo chambers** you can enter and exit at will
- **Filter out bot votes** and low-quality content

### Inspiration

This project was inspired by [Seth Caldwell's vision](https://www.youtube.com/watch?v=T-tzHdSY3n0) for giving users control over content cultivation rather than being subject to corporate-controlled curation algorithms.

> "There's a difference between curation and cultivation. Cultivation means you're combining two things together to create something new... If users were given power to cultivate and curate their feeds themselves, they would be much happier users." - Seth Caldwell

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
The baseurl of the api is api.wayvote.org

- `GET /` - API information and available endpoints
- `POST /helloworld` - Test endpoint that returns posted content
- `POST /getRankings` - Get rankings for a set of content Ids

#### Voting System Endpoints

**Get Rankings**
```http
POST /api/getRankings
Content-Type: application/json

{
  "ids": ["content1", "content2", "content3"],
  "customRanking": [
    {  "IQ": 10 },
    {  "Critial_Thinking": 5 }
  ]
}
```


**Response:**
```json
[
  {
    "contentId": "content1",
    "rank": 1
  },
  {
    "contentId": "content2", 
    "rank": 2
  },
  {
    "contentId": "content3",
    "rank": 3
  }
]
```

**Upvote Content**
```http
POST /api/upVote
Content-Type: application/json

{
  "contentId": "content1"
}
```

**Response:**
```json
{
  "status": "ok"
}
```

**Downvote Content**
```http
POST /api/downVote
Content-Type: application/json

{
  "contentId": "content1"
}
```

**Response:**
```json
{
  "status": "ok"
}
```

#### Custom Ranking Type

The `customRanking` parameter is an array of objects with the following structure:

```typescript
interface CustomRanking {
  weighName: string;    // Name of the ranking criteria (e.g., "IQ", "Experience", "Popularity")
  weighValue: number;   // Weight value for this criteria (higher = more important)
}
```

**Example:**
```json
[
  {
    "weighName": "IQ",
    "weighValue": 10
  },
  {
    "weighName": "Experience", 
    "weighValue": 5
  },
  {
    "weighName": "Popularity",
    "weighValue": 3
  }
]
```


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
├── chrome_extension/           # Chrome browser extension
│   ├── manifest.json          # Extension configuration
│   ├── content.js             # Reddit integration script
│   ├── content.css            # Extension styles
│   ├── popup.html             # Settings popup interface
│   ├── popup.css              # Popup styles
│   ├── popup.js               # Popup functionality
│   ├── background.js          # Background service worker
│   ├── icons/                 # Extension icons
│   ├── README.md              # Extension documentation
│   └── INSTALL.md             # Installation guide
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

### Chrome Extension Testing
1. **Install the extension** (see `chrome_extension/INSTALL.md`)
2. **Navigate to Reddit** and open the extension popup
3. **Configure metrics** and test post reordering
4. **Test custom voting** by clicking the new vote buttons

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

### Chrome Extension
- ✅ Reddit post detection and ID extraction
- ✅ Custom metric configuration with sliders
- ✅ Real-time post reordering based on rankings
- ✅ Custom voting system integration
- ✅ API integration with WayVote backend
- ✅ Settings persistence and sync

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
