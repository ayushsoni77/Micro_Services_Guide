import React from 'react';
import { useApp } from '../../context/AppContext';
import TaskList from '../Tasks/TaskList';
import InstructionStep from '../Instructions/InstructionStep';

interface PhaseSectionProps {
  phaseId: number;
}

const PhaseSection: React.FC<PhaseSectionProps> = ({ phaseId }) => {
  const { state } = useApp();
  const phase = state.phases.find(p => p.id === phaseId);

  if (!phase) {
    return <div>Phase not found</div>;
  }

  const getPhaseContent = () => {
    switch (phaseId) {
      case 1:
        return {
          title: 'Project Setup & Planning',
          description: 'Initialize project structure and plan service architecture',
          duration: '1 day',
          difficulty: '🟢 Beginner',
          tasks: [
            'Initialize Git repository structure',
            'Set up development environment (Node.js, Docker, kubectl)',
            'Plan microservice boundaries using Domain-Driven Design',
            'Design API contracts and service interfaces',
            'Create project documentation and README'
          ],
          instructions: [
            {
              title: '1. Initialize Git Repository',
              description: 'Create a monorepo structure to organize all microservices:',
              code: `mkdir microservices-project && cd microservices-project
git init
mkdir -p services/{user-service,payment-service,inventory-service,api-gateway}
mkdir -p infrastructure/terraform
mkdir -p k8s/manifests
touch README.md docker-compose.yml`,
              language: 'Terminal'
            },
            {
              title: '2. Development Environment Setup',
              description: 'Install required tools and dependencies:',
              code: `# Install Node.js (v16+)
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Docker
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER

# Install kubectl
curl -LO https://dl.k8s.io/release/v1.24.0/bin/linux/amd64/kubectl
sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl

# Install Terraform
wget https://releases.hashicorp.com/terraform/1.3.0/terraform_1.3.0_linux_amd64.zip
unzip terraform_1.3.0_linux_amd64.zip
sudo mv terraform /usr/local/bin/`,
              language: 'Prerequisites'
            }
          ]
        };
      case 2:
        return {
          title: 'Infrastructure as Code',
          description: 'Provision AWS infrastructure using Terraform',
          duration: '2-3 days',
          difficulty: '🟡 Intermediate',
          tasks: [
            'Configure AWS VPC with public/private subnets',
            'Set up EKS cluster with managed node groups',
            'Create ECR repositories for each microservice',
            'Configure DocumentDB cluster for MongoDB workloads',
            'Set up Redis cluster using ElastiCache',
            'Configure IAM roles and security groups'
          ],
          instructions: [
            {
              title: '1. Initialize Terraform Configuration',
              description: 'Set up a basic Terraform project to manage your infrastructure as code:',
              code: `cd infrastructure/terraform
touch main.tf variables.tf outputs.tf
terraform init`,
              language: 'Terminal'
            },
            {
              title: '2. Sample VPC Setup',
              description: 'Use the official AWS VPC module to create a production-ready VPC:',
              code: `module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "3.19.0"

  name = "my-vpc"
  cidr = "10.0.0.0/16"

  azs             = ["us-east-1a", "us-east-1b"]
  public_subnets  = ["10.0.1.0/24", "10.0.2.0/24"]
  private_subnets = ["10.0.3.0/24", "10.0.4.0/24"]

  enable_nat_gateway = true
  single_nat_gateway = true

  tags = {
    Terraform = "true"
    Environment = "dev"
  }
}`,
              language: 'main.tf'
            },
            {
              title: '3. Apply Infrastructure',
              description: 'After defining resources, run the following commands to deploy:',
              code: `terraform plan
terraform apply`,
              language: 'Terminal'
            }
          ]
        };
      case 3:
        return {
          title: 'Microservices Development',
          description: 'Build individual microservices with proper architecture',
          duration: '5-7 days',
          difficulty: '🟡 Intermediate',
          tasks: [
            'Create User Service with authentication endpoints',
            'Build Payment Service with Stripe integration',
            'Develop Inventory Service with CRUD operations',
            'Implement API Gateway for routing and load balancing',
            'Add service-to-service communication',
            'Implement error handling and logging',
            'Add health check endpoints for all services'
          ],
          instructions: [
            {
              title: '1. User Service Structure',
              description: 'Create the basic structure for the User Service:',
              code: `cd services/user-service
npm init -y
npm install express mongoose bcryptjs jsonwebtoken cors helmet
npm install -D nodemon @types/node

mkdir -p src/{controllers,models,routes,middleware,utils}
touch src/app.js src/server.js`,
              language: 'Terminal'
            },
            {
              title: '2. User Model Example',
              description: 'Define the User model with Mongoose:',
              code: `const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  }
}, {
  timestamps: true
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

module.exports = mongoose.model('User', userSchema);`,
              language: 'models/User.js'
            }
          ]
        };
      case 4:
        return {
          title: 'Containerization',
          description: 'Package services using Docker and Docker Compose',
          duration: '2-3 days',
          difficulty: '🟡 Intermediate',
          tasks: [
            'Create Dockerfiles for each microservice',
            'Set up Docker Compose for local development',
            'Configure environment variables and secrets',
            'Implement multi-stage builds for optimization',
            'Set up Docker networks for service communication',
            'Add health checks and restart policies'
          ],
          instructions: [
            {
              title: '1. Service Dockerfile',
              description: 'Create optimized Dockerfile for Node.js services:',
              code: `FROM node:16-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

FROM node:16-alpine AS runtime

RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001

WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --chown=nodejs:nodejs . .

USER nodejs
EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3001/health || exit 1

CMD ["npm", "start"]`,
              language: 'Dockerfile'
            },
            {
              title: '2. Docker Compose Setup',
              description: 'Configure all services with Docker Compose:',
              code: `version: '3.8'

services:
  user-service:
    build: ./services/user-service
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=development
      - MONGODB_URI=mongodb://mongodb:27017/userdb
    depends_on:
      - mongodb
    networks:
      - microservices

  payment-service:
    build: ./services/payment-service
    ports:
      - "3002:3002"
    environment:
      - NODE_ENV=development
      - MONGODB_URI=mongodb://mongodb:27017/paymentdb
    depends_on:
      - mongodb
    networks:
      - microservices

  mongodb:
    image: mongo:5.0
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db
    networks:
      - microservices

networks:
  microservices:
    driver: bridge

volumes:
  mongodb_data:`,
              language: 'docker-compose.yml'
            }
          ]
        };
      case 5:
        return {
          title: 'Kubernetes Deployment',
          description: 'Deploy services to Kubernetes cluster',
          duration: '3-4 days',
          difficulty: '🔴 Advanced',
          tasks: [
            'Create Kubernetes deployment manifests',
            'Set up ConfigMaps and Secrets',
            'Configure Services and Ingress',
            'Implement horizontal pod autoscaling',
            'Set up persistent volumes for databases',
            'Configure monitoring and logging',
            'Deploy to EKS cluster'
          ],
          instructions: [
            {
              title: '1. Deployment Manifest',
              description: 'Create Kubernetes deployment for User Service:',
              code: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: user-service
  labels:
    app: user-service
spec:
  replicas: 3
  selector:
    matchLabels:
      app: user-service
  template:
    metadata:
      labels:
        app: user-service
    spec:
      containers:
      - name: user-service
        image: your-account.dkr.ecr.region.amazonaws.com/user-service:latest
        ports:
        - containerPort: 3001
        env:
        - name: NODE_ENV
          value: "production"
        - name: MONGODB_URI
          valueFrom:
            secretKeyRef:
              name: db-credentials
              key: mongodb-uri
        resources:
          requests:
            memory: "128Mi"
            cpu: "100m"
          limits:
            memory: "256Mi"
            cpu: "200m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3001
          initialDelaySeconds: 30
          periodSeconds: 10`,
              language: 'k8s/user-service.yaml'
            },
            {
              title: '2. Service Configuration',
              description: 'Expose the deployment with a Kubernetes Service:',
              code: `apiVersion: v1
kind: Service
metadata:
  name: user-service
spec:
  selector:
    app: user-service
  ports:
    - protocol: TCP
      port: 80
      targetPort: 3001
  type: ClusterIP

---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: microservices-ingress
  annotations:
    kubernetes.io/ingress.class: alb
    alb.ingress.kubernetes.io/scheme: internet-facing
spec:
  rules:
  - host: api.yourdomain.com
    http:
      paths:
      - path: /users
        pathType: Prefix
        backend:
          service:
            name: user-service
            port:
              number: 80`,
              language: 'k8s/service.yaml'
            }
          ]
        };
      case 6:
        return {
          title: 'CI/CD Pipeline',
          description: 'Automate deployment with GitHub Actions',
          duration: '2-3 days',
          difficulty: '🟡 Intermediate',
          tasks: [
            'Set up GitHub Actions workflows',
            'Configure automated testing pipeline',
            'Implement Docker image building and pushing',
            'Set up deployment to EKS',
            'Configure environment-specific deployments',
            'Add rollback capabilities',
            'Set up monitoring and alerts'
          ],
          instructions: [
            {
              title: '1. GitHub Actions Workflow',
              description: 'Create CI/CD pipeline for automated deployment:',
              code: `name: Deploy Microservices

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '16'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm test

  build-and-deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Configure AWS credentials
      uses: aws-actions/configure-aws-credentials@v2
      with:
        aws-access-key-id: \${{ secrets.AWS_ACCESS_KEY_ID }}
        aws-secret-access-key: \${{ secrets.AWS_SECRET_ACCESS_KEY }}
        aws-region: us-east-1
    
    - name: Login to Amazon ECR
      uses: aws-actions/amazon-ecr-login@v1
    
    - name: Build and push Docker images
      run: |
        docker build -t user-service ./services/user-service
        docker tag user-service:latest \$ECR_REGISTRY/user-service:latest
        docker push \$ECR_REGISTRY/user-service:latest`,
              language: '.github/workflows/deploy.yml'
            },
            {
              title: '2. Deployment Script',
              description: 'Automate Kubernetes deployment:',
              code: `#!/bin/bash

# Update kubeconfig
aws eks update-kubeconfig --name your-cluster-name --region us-east-1

# Apply Kubernetes manifests
kubectl apply -f k8s/

# Wait for rollout to complete
kubectl rollout status deployment/user-service
kubectl rollout status deployment/payment-service
kubectl rollout status deployment/inventory-service

# Verify deployment
kubectl get pods
kubectl get services

echo "Deployment completed successfully!"`,
              language: 'scripts/deploy.sh'
            }
          ]
        };
      default:
        return {
          title: `Phase ${phaseId}`,
          description: 'Phase description',
          duration: '1-2 days',
          difficulty: '🟢 Beginner',
          tasks: [],
          instructions: []
        };
    }
  };

  const content = getPhaseContent();

  return (
    <div className="phase-section">
      <div className="phase-header">
        <div className="phase-badge">Phase {phaseId}</div>
        <h1>{content.title}</h1>
        <p>{content.description}</p>
        <div className="phase-meta">
          <span className="phase-duration">⏱️ {content.duration}</span>
          <span className="phase-difficulty">{content.difficulty}</span>
        </div>
      </div>

      <div className="phase-content-compact">
        <div className="phase-main">
          <TaskList phaseId={phaseId} tasks={content.tasks} />
          <div className="instructions-compact">
            <h3>Step-by-Step Instructions</h3>
            <div className="instructions-grid">
              {content.instructions.map((instruction, index) => (
                <InstructionStep
                  key={index}
                  title={instruction.title}
                  description={instruction.description}
                  code={instruction.code}
                  language={instruction.language}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhaseSection;