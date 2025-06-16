// Application state
let appState = {
    currentSection: 'dashboard',
    completedTasks: new Set(),
    totalTasks: 42,
    phases: [
        { id: 1, name: 'Project Setup & Planning', tasks: 5 },
        { id: 2, name: 'Infrastructure as Code', tasks: 6 },
        { id: 3, name: 'Microservices Development', tasks: 7 },
        { id: 4, name: 'Containerization', tasks: 6 },
        { id: 5, name: 'Kubernetes Deployment', tasks: 7 },
        { id: 6, name: 'CI/CD Pipeline', tasks: 7 }
    ]
};

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing Microservices Guide App...');
    
    initializeNavigation();
    initializeTaskTracking();
    initializeCopyButtons();
    initializeCostCalculator();
    initializeMobileMenu();
    updateProgress();
    loadSavedState();
    
    console.log('App initialized successfully!');
});

// Navigation functionality
function initializeNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const targetSection = this.getAttribute('data-section');
            if (targetSection) {
                navigateToSection(targetSection);
            }
        });
    });
    
    console.log('Navigation initialized with', navItems.length, 'nav items');
}

function navigateToSection(sectionId) {
    console.log('Navigating to section:', sectionId);
    
    // Update active nav item
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('data-section') === sectionId) {
            item.classList.add('active');
        }
    });

    // Update active content section
    const contentSections = document.querySelectorAll('.content-section');
    contentSections.forEach(section => {
        section.classList.remove('active');
        if (section.id === sectionId) {
            section.classList.add('active');
        }
    });

    appState.currentSection = sectionId;
    
    // Close mobile menu if open
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.sidebar-overlay');
    if (sidebar) {
        sidebar.classList.remove('open');
    }
    if (overlay) {
        overlay.classList.remove('active');
    }
    
    // Scroll to top
    smoothScrollToTop();
    
    saveState();
}

// Task tracking functionality
function initializeTaskTracking() {
    const taskCheckboxes = document.querySelectorAll('.task-checkbox');
    
    taskCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const taskId = this.id;
            const taskItem = this.closest('.task-item');
            
            if (this.checked) {
                appState.completedTasks.add(taskId);
                if (taskItem) {
                    taskItem.classList.add('completed');
                }
            } else {
                appState.completedTasks.delete(taskId);
                if (taskItem) {
                    taskItem.classList.remove('completed');
                }
            }
            
            updateProgress();
            saveState();
        });
    });
    
    console.log('Task tracking initialized with', taskCheckboxes.length, 'checkboxes');
}

function updateProgress() {
    const completedCount = appState.completedTasks.size;
    const totalCount = appState.totalTasks;
    const progressPercentage = (completedCount / totalCount) * 100;

    // Update progress bar
    const overallProgress = document.getElementById('overall-progress');
    if (overallProgress) {
        overallProgress.style.width = progressPercentage + '%';
        overallProgress.style.setProperty('--progress-width', progressPercentage + '%');
        overallProgress.classList.add('animate');
    }

    // Update progress text
    const completedTasksSpan = document.getElementById('completed-tasks');
    const totalTasksSpan = document.getElementById('total-tasks');
    
    if (completedTasksSpan) {
        completedTasksSpan.textContent = completedCount;
    }
    if (totalTasksSpan) {
        totalTasksSpan.textContent = totalCount;
    }

    // Update phase indicators based on completion
    updatePhaseIndicators();
    
    // Check for completion
    if (completedCount === totalCount && completedCount > 0) {
        showCompletionCelebration();
    }
}

function updatePhaseIndicators() {
    appState.phases.forEach(phase => {
        const phaseTasksCompleted = getPhaseCompletionCount(phase.id);
        const phaseIndicator = document.querySelector(`[data-section="phase-${phase.id}"] .phase-indicator`);
        
        if (phaseIndicator) {
            if (phaseTasksCompleted === phase.tasks) {
                phaseIndicator.style.backgroundColor = 'var(--color-success)';
                phaseIndicator.style.color = 'white';
            } else if (phaseTasksCompleted > 0) {
                phaseIndicator.style.backgroundColor = 'var(--color-warning)';
                phaseIndicator.style.color = 'white';
            } else {
                phaseIndicator.style.backgroundColor = 'var(--color-secondary)';
                phaseIndicator.style.color = 'var(--color-text)';
            }
        }
    });
}

function getPhaseCompletionCount(phaseId) {
    let count = 0;
    appState.completedTasks.forEach(taskId => {
        if (taskId.startsWith(`task-${phaseId}-`)) {
            count++;
        }
    });
    return count;
}

// Copy to clipboard functionality
function initializeCopyButtons() {
    const copyButtons = document.querySelectorAll('.copy-btn');
    
    copyButtons.forEach(button => {
        button.addEventListener('click', async function(e) {
            e.preventDefault();
            const codeText = this.getAttribute('data-copy');
            
            if (!codeText) {
                console.error('No data-copy attribute found');
                return;
            }
            
            try {
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    await navigator.clipboard.writeText(codeText);
                } else {
                    fallbackCopyToClipboard(codeText);
                }
                showCopySuccess(this);
            } catch (err) {
                console.error('Copy failed:', err);
                fallbackCopyToClipboard(codeText);
                showCopySuccess(this);
            }
        });
    });
    
    console.log('Copy buttons initialized:', copyButtons.length);
}

function fallbackCopyToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
    } catch (err) {
        console.error('Fallback copy failed:', err);
    }
    
    document.body.removeChild(textArea);
}

function showCopySuccess(button) {
    const originalText = button.textContent;
    button.classList.add('copied');
    button.textContent = 'Copied!';
    
    setTimeout(() => {
        button.classList.remove('copied');
        button.textContent = originalText;
    }, 2000);
}

// Cost calculator functionality
function initializeCostCalculator() {
    // Remove any existing onclick attributes and add event listeners
    const calculateButton = document.querySelector('.calculator-inputs .btn');
    if (calculateButton) {
        calculateButton.removeAttribute('onclick');
        calculateButton.addEventListener('click', function(e) {
            e.preventDefault();
            calculateCosts();
        });
    }
}

function calculateCosts() {
    const envTypeSelect = document.getElementById('env-type');
    const teamSizeSelect = document.getElementById('team-size');
    const trafficLevelSelect = document.getElementById('traffic-level');
    
    if (!envTypeSelect || !teamSizeSelect || !trafficLevelSelect) {
        console.error('Calculator form elements not found');
        return;
    }
    
    const envType = envTypeSelect.value;
    const teamSize = parseInt(teamSizeSelect.value);
    const trafficLevel = trafficLevelSelect.value;
    
    const costs = getCostEstimates(envType, trafficLevel);
    const timeEstimates = getTimeEstimates(teamSize);
    
    updateCostDisplay(costs, timeEstimates);
}

function getCostEstimates(envType, trafficLevel) {
    const baseCosts = {
        development: {
            eks: 72,
            ec2: 65,
            documentdb: 45,
            redis: 25,
            loadbalancer: 18
        },
        staging: {
            eks: 72,
            ec2: 95,
            documentdb: 65,
            redis: 35,
            loadbalancer: 25
        },
        production: {
            eks: 72,
            ec2: 190,
            documentdb: 125,
            redis: 65,
            loadbalancer: 45
        }
    };
    
    let costs = { ...baseCosts[envType] };
    
    // Adjust costs based on traffic level
    const trafficMultipliers = {
        low: 1,
        medium: 1.5,
        high: 2.5
    };
    
    const multiplier = trafficMultipliers[trafficLevel];
    costs.ec2 = Math.round(costs.ec2 * multiplier);
    costs.documentdb = Math.round(costs.documentdb * multiplier);
    costs.redis = Math.round(costs.redis * multiplier);
    
    return costs;
}

function getTimeEstimates(teamSize) {
    const baseTime = 19; // Average days
    const teamEfficiency = {
        3: 1.2,
        4: 1.0,
        5: 0.85
    };
    
    const adjustedTime = Math.round(baseTime * teamEfficiency[teamSize]);
    const minTime = Math.max(15, adjustedTime - 3);
    const maxTime = adjustedTime + 3;
    
    return {
        duration: `${minTime}-${maxTime} days`,
        productivity: teamSize >= 5 ? 'High' : teamSize >= 4 ? 'Medium' : 'Standard'
    };
}

function updateCostDisplay(costs, timeEstimates) {
    const costBreakdown = document.getElementById('cost-breakdown');
    const devTime = document.getElementById('dev-time');
    const productivity = document.getElementById('productivity');
    
    if (!costBreakdown) {
        console.error('Cost breakdown element not found');
        return;
    }
    
    const total = costs.eks + costs.ec2 + costs.documentdb + costs.redis + costs.loadbalancer;
    
    costBreakdown.innerHTML = `
        <div class="cost-row">
            <span>EKS Cluster</span>
            <span class="cost-value">$${costs.eks}/month</span>
        </div>
        <div class="cost-row">
            <span>EC2 Instances</span>
            <span class="cost-value">$${costs.ec2}/month</span>
        </div>
        <div class="cost-row">
            <span>DocumentDB</span>
            <span class="cost-value">$${costs.documentdb}/month</span>
        </div>
        <div class="cost-row">
            <span>ElastiCache Redis</span>
            <span class="cost-value">$${costs.redis}/month</span>
        </div>
        <div class="cost-row">
            <span>Load Balancer</span>
            <span class="cost-value">$${costs.loadbalancer}/month</span>
        </div>
        <div class="cost-row total">
            <span><strong>Total Monthly Cost</strong></span>
            <span class="cost-value"><strong>$${total}/month</strong></span>
        </div>
    `;
    
    if (devTime) {
        devTime.textContent = timeEstimates.duration;
    }
    if (productivity) {
        productivity.textContent = timeEstimates.productivity;
    }
}

// Mobile menu functionality
function initializeMobileMenu() {
    let menuToggle = document.querySelector('.mobile-menu-toggle');
    let overlay = document.querySelector('.sidebar-overlay');
    const sidebar = document.querySelector('.sidebar');
    
    // Create mobile menu toggle if it doesn't exist
    if (!menuToggle) {
        menuToggle = document.createElement('button');
        menuToggle.className = 'mobile-menu-toggle';
        menuToggle.innerHTML = '☰ Menu';
        menuToggle.setAttribute('aria-label', 'Toggle navigation menu');
        document.body.appendChild(menuToggle);
    }
    
    // Create overlay if it doesn't exist
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'sidebar-overlay';
        document.body.appendChild(overlay);
    }
    
    // Toggle menu
    menuToggle.addEventListener('click', function(e) {
        e.preventDefault();
        if (sidebar) {
            sidebar.classList.toggle('open');
            overlay.classList.toggle('active');
        }
    });
    
    // Close menu when clicking overlay
    overlay.addEventListener('click', function() {
        if (sidebar) {
            sidebar.classList.remove('open');
            overlay.classList.remove('active');
        }
    });
    
    // Close menu when clicking nav items (handled in navigateToSection)
}

// Smooth scrolling
function smoothScrollToTop() {
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        mainContent.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
}

// Completion celebration
function showCompletionCelebration() {
    // Prevent multiple celebrations
    if (document.querySelector('.completion-celebration')) {
        return;
    }
    
    const celebration = document.createElement('div');
    celebration.className = 'completion-celebration';
    celebration.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: var(--color-success);
        color: white;
        padding: var(--space-24);
        border-radius: var(--radius-lg);
        text-align: center;
        z-index: 1000;
        box-shadow: var(--shadow-lg);
        max-width: 400px;
    `;
    
    celebration.innerHTML = `
        <h2 style="margin: 0 0 var(--space-16) 0;">🎉 Congratulations!</h2>
        <p style="margin: 0 0 var(--space-16) 0;">You've completed all phases of the microservices implementation!</p>
        <button class="btn btn--outline" onclick="this.parentElement.remove()" 
                style="background: rgba(255,255,255,0.2); border-color: rgba(255,255,255,0.3); color: white;">
            Continue
        </button>
    `;
    
    document.body.appendChild(celebration);
    
    // Auto-remove after 10 seconds
    setTimeout(() => {
        if (celebration.parentElement) {
            celebration.remove();
        }
    }, 10000);
}

// Keyboard navigation
document.addEventListener('keydown', function(e) {
    // Escape key closes mobile menu
    if (e.key === 'Escape') {
        const sidebar = document.querySelector('.sidebar');
        const overlay = document.querySelector('.sidebar-overlay');
        if (sidebar) {
            sidebar.classList.remove('open');
        }
        if (overlay) {
            overlay.classList.remove('active');
        }
    }
    
    // Arrow keys for phase navigation
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        const currentPhase = getCurrentPhaseNumber();
        if (currentPhase) {
            const direction = e.key === 'ArrowLeft' ? -1 : 1;
            const nextPhase = currentPhase + direction;
            
            if (nextPhase >= 1 && nextPhase <= 6) {
                navigateToSection(`phase-${nextPhase}`);
            }
        }
    }
});

function getCurrentPhaseNumber() {
    const match = appState.currentSection.match(/phase-(\d+)/);
    return match ? parseInt(match[1]) : null;
}

// State persistence (simplified since localStorage is not available)
function saveState() {
    const state = {
        currentSection: appState.currentSection,
        completedTasks: Array.from(appState.completedTasks)
    };
    console.log('State saved:', state);
}

function loadSavedState() {
    // Initialize with default state
    updateProgress();
    
    // Calculate initial costs with default values
    setTimeout(() => {
        const defaultCosts = getCostEstimates('development', 'low');
        const defaultTime = getTimeEstimates(4);
        updateCostDisplay(defaultCosts, defaultTime);
    }, 100);
}

// Handle window resize
window.addEventListener('resize', function() {
    // Reinitialize mobile menu on resize
    initializeMobileMenu();
});

// Expose functions to global scope for any remaining onclick handlers
window.navigateToSection = navigateToSection;
window.calculateCosts = calculateCosts;

console.log('Microservices Guide App script loaded successfully!');