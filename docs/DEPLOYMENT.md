# ResQChain Deployment Guide

## Prerequisites

Before deploying ResQChain, ensure you have:

- Node.js v18 or higher
- Docker and Docker Compose
- MongoDB (or use Docker)
- Kafka (or use Docker)
- Auth0 account (free tier available)
- Ethereum node or use Ganache

## Local Development Setup

### 1. Clone and Install

```bash
git clone https://github.com/sharma3008/ResQChain.git
cd ResQChain
npm install
```

### 2. Configure Environment

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Auth0 Configuration (Sign up at https://auth0.com)
AUTH0_DOMAIN=your-tenant.auth0.com
AUTH0_CLIENT_ID=your-client-id
AUTH0_CLIENT_SECRET=your-client-secret
AUTH0_AUDIENCE=https://resqchain-api

# MongoDB
MONGODB_URI=mongodb://localhost:27017/resqchain

# Kafka
KAFKA_BROKERS=localhost:9092
KAFKA_CLIENT_ID=resqchain-client
KAFKA_GROUP_ID=resqchain-group

# Blockchain (Ganache)
BLOCKCHAIN_RPC_URL=http://localhost:8545
```

### 3. Start Services with Docker

The easiest way to run all services:

```bash
docker-compose up -d
```

This starts:
- MongoDB on port 27017
- Kafka on port 9092
- Zookeeper on port 2181
- Ganache blockchain on port 8545
- ResQChain API on port 3000

### 4. Start Development Server

If running services manually:

```bash
# Start MongoDB
mongod --dbpath ./data/db

# Start Kafka (requires Zookeeper)
# See Kafka documentation

# Start Ganache
ganache-cli --deterministic

# Start ResQChain
npm run dev
```

### 5. Verify Installation

```bash
# Check health endpoint
curl http://localhost:3000/health

# Expected response:
# {"status":"healthy","service":"ResQChain","timestamp":"..."}
```

## Setting up Auth0

### 1. Create Auth0 Account
- Sign up at https://auth0.com
- Create a new tenant

### 2. Create API
- Go to Applications > APIs
- Click "Create API"
- Name: "ResQChain API"
- Identifier: `https://resqchain-api`
- Signing Algorithm: RS256

### 3. Create Application
- Go to Applications > Applications
- Click "Create Application"
- Name: "ResQChain Web App"
- Type: Single Page Application
- Note the Domain, Client ID, and Client Secret

### 4. Configure Roles
Create roles for different user types:
- `responder` - Emergency responders
- `ambulance` - Ambulance crew
- `hospital` - Hospital staff
- `admin` - Platform administrators

### 5. Update .env
Add your Auth0 credentials to `.env`

## Production Deployment

### Deploy to AWS/Azure/GCP

#### 1. Containerize Application

Build Docker image:
```bash
docker build -t resqchain:latest .
```

#### 2. Set up MongoDB Atlas
- Create cluster at mongodb.com/cloud/atlas
- Get connection string
- Update `MONGODB_URI` in production environment

#### 3. Set up Kafka Cluster
Options:
- Confluent Cloud (managed Kafka)
- AWS MSK
- Azure Event Hubs
- Self-hosted

#### 4. Deploy Blockchain
Options:
- Ethereum Mainnet/Testnet
- Polygon
- Private blockchain network

#### 5. Environment Variables
Set all production environment variables securely

#### 6. Deploy Application
```bash
# Push to container registry
docker push your-registry/resqchain:latest

# Deploy to Kubernetes
kubectl apply -f k8s/deployment.yaml

# Or deploy to cloud platform
# AWS ECS, Azure Container Apps, Google Cloud Run
```

### Deploy to Heroku (Quick Option)

```bash
# Install Heroku CLI
heroku login

# Create app
heroku create resqchain-api

# Add MongoDB addon
heroku addons:create mongolab

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set AUTH0_DOMAIN=your-domain.auth0.com
# ... set all other variables

# Deploy
git push heroku main

# Scale dynos
heroku ps:scale web=1
```

## Monitoring & Maintenance

### Logs

View application logs:
```bash
# Docker
docker-compose logs -f app

# Heroku
heroku logs --tail

# Local files
tail -f logs/combined.log
```

### Health Checks

Set up monitoring for:
- `/health` endpoint
- Database connectivity
- Kafka connection
- Blockchain node status

### Backups

#### MongoDB Backups
```bash
# Create backup
mongodump --uri="mongodb://localhost:27017/resqchain" --out=./backups/$(date +%Y%m%d)

# Restore backup
mongorestore --uri="mongodb://localhost:27017/resqchain" ./backups/20240115
```

#### Configuration Backups
- Back up `.env` files securely
- Version control all configurations
- Document all secrets in password manager

## Scaling

### Horizontal Scaling

1. **API Servers**: Add more instances behind load balancer
2. **MongoDB**: Use replica sets
3. **Kafka**: Add more brokers and partitions
4. **Blockchain**: Use multiple nodes

### Load Balancing

Use Nginx, HAProxy, or cloud load balancers:

```nginx
# Nginx config example
upstream resqchain {
    server 127.0.0.1:3000;
    server 127.0.0.1:3001;
    server 127.0.0.1:3002;
}

server {
    listen 80;
    location / {
        proxy_pass http://resqchain;
    }
}
```

## Security Checklist

- [ ] Use HTTPS in production
- [ ] Enable Auth0 MFA
- [ ] Rotate secrets regularly
- [ ] Use environment variables for secrets
- [ ] Enable database encryption
- [ ] Set up firewall rules
- [ ] Enable rate limiting
- [ ] Regular security audits
- [ ] Keep dependencies updated
- [ ] Monitor for vulnerabilities

## Troubleshooting

### Common Issues

**MongoDB Connection Error**
```bash
# Check MongoDB is running
systemctl status mongod

# Check connection string
mongo "mongodb://localhost:27017/resqchain"
```

**Kafka Connection Error**
```bash
# Check Kafka is running
kafka-topics.sh --list --bootstrap-server localhost:9092

# Check Zookeeper
echo stat | nc localhost 2181
```

**Auth0 Authentication Error**
- Verify Auth0 credentials
- Check JWT token format
- Verify audience matches

**Blockchain Connection Error**
```bash
# Check Ganache is running
curl -X POST http://localhost:8545 \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}'
```

## Performance Tuning

### Database Optimization
- Create proper indexes
- Use connection pooling
- Enable query profiling
- Regular maintenance

### API Optimization
- Enable response compression
- Implement caching
- Use CDN for static assets
- Optimize queries

### Kafka Optimization
- Adjust batch size
- Configure retention
- Partition optimization
- Consumer group tuning

## Updates & Maintenance

### Updating Dependencies
```bash
# Check for updates
npm outdated

# Update packages
npm update

# Audit for vulnerabilities
npm audit
npm audit fix
```

### Database Migrations
- Plan migration strategy
- Test in staging first
- Back up before migrating
- Use migration tools

## Support & Resources

- Documentation: /docs
- API Examples: /docs/API_EXAMPLES.md
- Architecture: /docs/ARCHITECTURE.md
- GitHub Issues: https://github.com/sharma3008/ResQChain/issues

## License

MIT License - See LICENSE file for details
