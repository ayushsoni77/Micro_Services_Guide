import React from 'react';
import { useApp } from '../../context/AppContext';
import Card from '../UI/Card';
import ProgressBar from '../UI/ProgressBar';

const Dashboard: React.FC = () => {
  const { state, getProgressPercentage } = useApp();
  const progressPercentage = getProgressPercentage();

  return (
    <div className="dashboard">
      <div className="dashboard__header">
        <h1>Microservices Architecture Implementation</h1>
        <p>A comprehensive guide to building scalable microservices with Docker, Kubernetes, and AWS</p>
      </div>

      <div className="dashboard__grid">
        {/* Project Overview */}
        <Card className="dashboard__overview">
          <h3>Project Overview</h3>
          <p>Build a complete microservices architecture including User Service, Payment Service, and Inventory Service using modern DevOps practices.</p>
          <div className="tech-stack">
            <div className="tech-category">
              <h4>Backend</h4>
              <div className="tech-tags">
                <span className="tech-tag">Node.js</span>
                <span className="tech-tag">Express.js</span>
                <span className="tech-tag">MongoDB</span>
                <span className="tech-tag">Redis</span>
              </div>
            </div>
            <div className="tech-category">
              <h4>Infrastructure</h4>
              <div className="tech-tags">
                <span className="tech-tag">Docker</span>
                <span className="tech-tag">Kubernetes</span>
                <span className="tech-tag">AWS</span>
                <span className="tech-tag">Terraform</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Quick Stats */}
        <Card className="dashboard__stats">
          <h3>Quick Stats</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">15-22</div>
              <div className="stat-label">Days</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">3-5</div>
              <div className="stat-label">Team Size</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">6</div>
              <div className="stat-label">Phases</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">4</div>
              <div className="stat-label">Services</div>
            </div>
          </div>
        </Card>

        {/* Timeline */}
        <Card className="dashboard__timeline">
          <h3>Implementation Timeline</h3>
          <div className="timeline">
            <div className="timeline-item">
              <div className="timeline-marker"></div>
              <div className="timeline-content">
                <h4>Setup & Planning</h4>
                <span className="timeline-duration">1-2 days</span>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-marker"></div>
              <div className="timeline-content">
                <h4>Infrastructure</h4>
                <span className="timeline-duration">2-3 days</span>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-marker"></div>
              <div className="timeline-content">
                <h4>Development</h4>
                <span className="timeline-duration">5-7 days</span>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-marker"></div>
              <div className="timeline-content">
                <h4>Deployment</h4>
                <span className="timeline-duration">7-10 days</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Progress Overview */}
        <Card className="dashboard__progress">
          <h3>Overall Progress</h3>
          <ProgressBar percentage={progressPercentage} animated />
          <div className="progress-text">
            <span>{state.completedTasks.size}</span> of <span>{state.totalTasks}</span> tasks completed
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;