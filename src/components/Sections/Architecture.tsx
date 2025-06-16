import React from 'react';
import Card from '../UI/Card';

const Architecture: React.FC = () => {
  return (
    <div>
      <div className="section-header">
        <h1>System Architecture</h1>
        <p>Visual overview of the microservices architecture and data flow</p>
      </div>

      <div className="architecture-grid">
        <Card>
          <h3>Service Architecture</h3>
          <div className="architecture-diagram">
            <div className="service-layer">
              <h4>Client Layer</h4>
              <div className="service-box client">Web App / Mobile App</div>
            </div>
            <div className="service-layer">
              <h4>API Gateway</h4>
              <div className="service-box gateway">API Gateway (Port 3000)</div>
            </div>
            <div className="service-layer">
              <h4>Microservices</h4>
              <div className="services-row">
                <div className="service-box user">User Service<br />Port 3001</div>
                <div className="service-box payment">Payment Service<br />Port 3002</div>
                <div className="service-box inventory">Inventory Service<br />Port 3003</div>
              </div>
            </div>
            <div className="service-layer">
              <h4>Data Layer</h4>
              <div className="services-row">
                <div className="service-box database">MongoDB<br />(DocumentDB)</div>
                <div className="service-box cache">Redis<br />(ElastiCache)</div>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <h3>Technology Stack</h3>
          <div className="tech-stack-diagram">
            <div className="tech-layer">
              <h4>Development</h4>
              <div className="tech-items">
                <span className="tech-item">Node.js</span>
                <span className="tech-item">Express.js</span>
                <span className="tech-item">Mongoose</span>
              </div>
            </div>
            <div className="tech-layer">
              <h4>Containerization</h4>
              <div className="tech-items">
                <span className="tech-item">Docker</span>
                <span className="tech-item">Docker Compose</span>
              </div>
            </div>
            <div className="tech-layer">
              <h4>Orchestration</h4>
              <div className="tech-items">
                <span className="tech-item">Kubernetes</span>
                <span className="tech-item">Amazon EKS</span>
              </div>
            </div>
            <div className="tech-layer">
              <h4>Infrastructure</h4>
              <div className="tech-items">
                <span className="tech-item">Terraform</span>
                <span className="tech-item">AWS VPC</span>
                <span className="tech-item">AWS IAM</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Architecture;