import React from 'react';
import Card from '../UI/Card';
import CodeBlock from '../UI/CodeBlock';

const Troubleshooting: React.FC = () => {
  const debugCommands = `# Check all running containers
docker ps

# View Kubernetes cluster info
kubectl cluster-info

# Check node status
kubectl get nodes

# View all resources
kubectl get all

# Check AWS CLI configuration
aws configure list

# Test connectivity
curl -v http://service-url/health`;

  return (
    <div>
      <div className="section-header">
        <h1>Troubleshooting Guide</h1>
        <p>Common issues and solutions for microservices implementation</p>
      </div>

      <div className="troubleshooting-grid">
        <Card className="trouble-card">
          <h3>🐳 Docker Issues</h3>
          <div className="trouble-item">
            <h4>Container fails to start</h4>
            <p><strong>Solution:</strong> Check Docker logs and verify port availability</p>
            <CodeBlock 
              code={`docker logs container-name
docker ps -a
netstat -tulpn | grep :3001`}
              small
            />
          </div>
          <div className="trouble-item">
            <h4>Image build fails</h4>
            <p><strong>Solution:</strong> Clear Docker cache and rebuild</p>
            <CodeBlock 
              code={`docker system prune -a
docker build --no-cache -t service-name .`}
              small
            />
          </div>
        </Card>

        <Card className="trouble-card">
          <h3>☸️ Kubernetes Issues</h3>
          <div className="trouble-item">
            <h4>Pod not starting</h4>
            <p><strong>Solution:</strong> Check pod status and events</p>
            <CodeBlock 
              code={`kubectl get pods
kubectl describe pod pod-name
kubectl logs pod-name`}
              small
            />
          </div>
          <div className="trouble-item">
            <h4>Service not accessible</h4>
            <p><strong>Solution:</strong> Verify service and ingress configuration</p>
            <CodeBlock 
              code={`kubectl get svc
kubectl get ingress
kubectl port-forward svc/service-name 8080:80`}
              small
            />
          </div>
        </Card>

        <Card className="trouble-card">
          <h3>☁️ AWS Issues</h3>
          <div className="trouble-item">
            <h4>EKS cluster access denied</h4>
            <p><strong>Solution:</strong> Update kubeconfig and verify IAM permissions</p>
            <CodeBlock 
              code={`aws eks update-kubeconfig --name cluster-name
kubectl auth can-i "*" "*"`}
              small
            />
          </div>
          <div className="trouble-item">
            <h4>Terraform apply fails</h4>
            <p><strong>Solution:</strong> Check AWS credentials and resource limits</p>
            <CodeBlock 
              code={`terraform validate
terraform plan
aws sts get-caller-identity`}
              small
            />
          </div>
        </Card>

        <Card className="trouble-card">
          <h3>🔧 General Debug Commands</h3>
          <div className="debug-commands">
            <CodeBlock 
              code={debugCommands}
              filename="Useful Commands"
            />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Troubleshooting;