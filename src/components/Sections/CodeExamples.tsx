import React from 'react';
import Card from '../UI/Card';
import CodeBlock from '../UI/CodeBlock';

const CodeExamples: React.FC = () => {
  const dockerfileCode = `FROM node:16-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy source code
COPY . .

# Create non-root user
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001
USER nodejs

EXPOSE 3001

CMD ["npm", "start"]`;

  const terraformCode = `resource "aws_eks_cluster" "main" {
  name     = var.cluster_name
  role_arn = aws_iam_role.cluster.arn
  version  = "1.24"

  vpc_config {
    subnet_ids = var.subnet_ids
    endpoint_private_access = true
    endpoint_public_access  = true
  }

  depends_on = [
    aws_iam_role_policy_attachment.cluster-AmazonEKSClusterPolicy,
  ]
}

resource "aws_eks_node_group" "main" {
  cluster_name    = aws_eks_cluster.main.name
  node_group_name = "main-nodes"
  node_role_arn   = aws_iam_role.node.arn
  subnet_ids      = var.private_subnet_ids

  scaling_config {
    desired_size = 3
    max_size     = 5
    min_size     = 1
  }

  instance_types = ["t3.medium"]

  depends_on = [
    aws_iam_role_policy_attachment.node-AmazonEKSWorkerNodePolicy,
    aws_iam_role_policy_attachment.node-AmazonEKS_CNI_Policy,
    aws_iam_role_policy_attachment.node-AmazonEC2ContainerRegistryReadOnly,
  ]
}`;

  const k8sCode = `apiVersion: apps/v1
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
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 3001
          initialDelaySeconds: 5
          periodSeconds: 5`;

  return (
    <div>
      <div className="section-header">
        <h1>Code Examples & Templates</h1>
        <p>Ready-to-use code snippets and configuration templates</p>
      </div>

      <div className="examples-grid">
        <Card className="example-card">
          <h3>Dockerfile Template</h3>
          <p>Optimized Dockerfile for Node.js microservices</p>
          <CodeBlock code={dockerfileCode} filename="Dockerfile" />
        </Card>

        <Card className="example-card">
          <h3>Terraform EKS Cluster</h3>
          <p>EKS cluster configuration with managed node groups</p>
          <CodeBlock code={terraformCode} filename="main.tf" />
        </Card>

        <Card className="example-card">
          <h3>Kubernetes Deployment</h3>
          <p>Deployment manifest for microservices</p>
          <CodeBlock code={k8sCode} filename="deployment.yaml" />
        </Card>
      </div>
    </div>
  );
};

export default CodeExamples;