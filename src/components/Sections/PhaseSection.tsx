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

      <div className="phase-content">
        <TaskList phaseId={phaseId} tasks={content.tasks} />
        <div className="instructions">
          <h3>Step-by-Step Instructions</h3>
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
  );
};

export default PhaseSection;