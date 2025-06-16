import React, { useState, useEffect } from 'react';
import Card from '../UI/Card';
import Button from '../UI/Button';

interface CostEstimate {
  eks: number;
  ec2: number;
  documentdb: number;
  redis: number;
  loadbalancer: number;
}

interface TimeEstimate {
  duration: string;
  productivity: string;
}

const Calculator: React.FC = () => {
  const [envType, setEnvType] = useState('development');
  const [teamSize, setTeamSize] = useState(4);
  const [trafficLevel, setTrafficLevel] = useState('low');
  const [costs, setCosts] = useState<CostEstimate>({
    eks: 72,
    ec2: 65,
    documentdb: 45,
    redis: 25,
    loadbalancer: 18
  });
  const [timeEstimates, setTimeEstimates] = useState<TimeEstimate>({
    duration: '15-22 days',
    productivity: 'Medium'
  });

  const getCostEstimates = (env: string, traffic: string): CostEstimate => {
    const baseCosts = {
      development: { eks: 72, ec2: 65, documentdb: 45, redis: 25, loadbalancer: 18 },
      staging: { eks: 72, ec2: 95, documentdb: 65, redis: 35, loadbalancer: 25 },
      production: { eks: 72, ec2: 190, documentdb: 125, redis: 65, loadbalancer: 45 }
    };

    const costs = { ...baseCosts[env as keyof typeof baseCosts] };
    const trafficMultipliers = { low: 1, medium: 1.5, high: 2.5 };
    const multiplier = trafficMultipliers[traffic as keyof typeof trafficMultipliers];

    costs.ec2 = Math.round(costs.ec2 * multiplier);
    costs.documentdb = Math.round(costs.documentdb * multiplier);
    costs.redis = Math.round(costs.redis * multiplier);

    return costs;
  };

  const getTimeEstimates = (team: number): TimeEstimate => {
    const baseTime = 19;
    const teamEfficiency = { 3: 1.2, 4: 1.0, 5: 0.85 };
    const adjustedTime = Math.round(baseTime * teamEfficiency[team as keyof typeof teamEfficiency]);
    const minTime = Math.max(15, adjustedTime - 3);
    const maxTime = adjustedTime + 3;

    return {
      duration: `${minTime}-${maxTime} days`,
      productivity: team >= 5 ? 'High' : team >= 4 ? 'Medium' : 'Standard'
    };
  };

  const calculateCosts = () => {
    const newCosts = getCostEstimates(envType, trafficLevel);
    const newTimeEstimates = getTimeEstimates(teamSize);
    setCosts(newCosts);
    setTimeEstimates(newTimeEstimates);
  };

  useEffect(() => {
    calculateCosts();
  }, []);

  const totalCost = costs.eks + costs.ec2 + costs.documentdb + costs.redis + costs.loadbalancer;

  return (
    <div>
      <div className="section-header">
        <h1>Resource & Cost Calculator</h1>
        <p>Estimate AWS costs and resource requirements for your implementation</p>
      </div>

      <div className="calculator-grid">
        <Card className="calculator-inputs">
          <h3>Configuration</h3>
          <div className="form-group">
            <label className="form-label">Environment Type</label>
            <select 
              className="form-control" 
              value={envType}
              onChange={(e) => setEnvType(e.target.value)}
            >
              <option value="development">Development</option>
              <option value="staging">Staging</option>
              <option value="production">Production</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Team Size</label>
            <select 
              className="form-control"
              value={teamSize}
              onChange={(e) => setTeamSize(Number(e.target.value))}
            >
              <option value={3}>3 developers</option>
              <option value={4}>4 developers</option>
              <option value={5}>5 developers</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Expected Traffic (req/min)</label>
            <select 
              className="form-control"
              value={trafficLevel}
              onChange={(e) => setTrafficLevel(e.target.value)}
            >
              <option value="low">Low (&lt; 1000)</option>
              <option value="medium">Medium (1000-10000)</option>
              <option value="high">High (&gt; 10000)</option>
            </select>
          </div>
          <Button fullWidth onClick={calculateCosts}>
            Calculate Estimates
          </Button>
        </Card>

        <Card className="calculator-results">
          <h3>Cost Estimates</h3>
          <div className="cost-breakdown">
            <div className="cost-row">
              <span>EKS Cluster</span>
              <span className="cost-value">${costs.eks}/month</span>
            </div>
            <div className="cost-row">
              <span>EC2 Instances</span>
              <span className="cost-value">${costs.ec2}/month</span>
            </div>
            <div className="cost-row">
              <span>DocumentDB</span>
              <span className="cost-value">${costs.documentdb}/month</span>
            </div>
            <div className="cost-row">
              <span>ElastiCache Redis</span>
              <span className="cost-value">${costs.redis}/month</span>
            </div>
            <div className="cost-row">
              <span>Load Balancer</span>
              <span className="cost-value">${costs.loadbalancer}/month</span>
            </div>
            <div className="cost-row total">
              <span><strong>Total Monthly Cost</strong></span>
              <span className="cost-value"><strong>${totalCost}/month</strong></span>
            </div>
          </div>

          <div className="time-estimates">
            <h4>Time Estimates</h4>
            <div className="time-breakdown">
              <div className="time-row">
                <span>Development Time</span>
                <span>{timeEstimates.duration}</span>
              </div>
              <div className="time-row">
                <span>Team Productivity</span>
                <span>{timeEstimates.productivity}</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Calculator;