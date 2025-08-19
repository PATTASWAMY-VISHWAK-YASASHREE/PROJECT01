class TrafficLight {
    constructor() {
        this.redLight = document.getElementById('red-light');
        this.yellowLight = document.getElementById('yellow-light');
        this.greenLight = document.getElementById('green-light');
        this.statusText = document.getElementById('status-text');
        this.timestamp = document.getElementById('timestamp');
        this.refreshBtn = document.getElementById('refresh-btn');
        
        // GitHub repository information
        this.owner = 'PATTASWAMY-VISHWAK-YASASHREE';
        this.repo = 'PROJECT01';
        
        this.init();
    }
    
    init() {
        this.refreshBtn.addEventListener('click', () => this.checkBuildStatus());
        this.checkBuildStatus();
        
        // Auto-refresh every 30 seconds
        setInterval(() => this.checkBuildStatus(), 30000);
    }
    
    resetLights() {
        this.redLight.classList.remove('active');
        this.yellowLight.classList.remove('active');
        this.greenLight.classList.remove('active');
    }
    
    setStatus(status, message) {
        this.resetLights();
        
        switch(status) {
            case 'success':
                this.greenLight.classList.add('active');
                this.statusText.textContent = message || 'Build Passed ✅';
                this.statusText.style.color = '#44aa44';
                break;
            case 'failure':
                this.redLight.classList.add('active');
                this.statusText.textContent = message || 'Build Failed ❌';
                this.statusText.style.color = '#aa4444';
                break;
            case 'pending':
            case 'in_progress':
                this.yellowLight.classList.add('active');
                this.statusText.textContent = message || 'Build In Progress ⏳';
                this.statusText.style.color = '#aaaa44';
                break;
            default:
                this.statusText.textContent = message || 'Status Unknown ❓';
                this.statusText.style.color = '#666';
        }
        
        this.timestamp.textContent = new Date().toLocaleString();
    }
    
    async checkBuildStatus() {
        try {
            this.refreshBtn.classList.add('loading');
            this.setStatus('pending', 'Checking build status...');
            
            // First, try to get workflow runs
            const workflowsResponse = await fetch(`https://api.github.com/repos/${this.owner}/${this.repo}/actions/runs?per_page=1`);
            
            if (!workflowsResponse.ok) {
                throw new Error(`GitHub API error: ${workflowsResponse.status}`);
            }
            
            const workflowsData = await workflowsResponse.json();
            
            if (workflowsData.total_count === 0) {
                // No workflows found, check if there are any workflow files
                this.setStatus('warning', 'No CI/CD workflows found. Setting up...');
                return;
            }
            
            const latestRun = workflowsData.workflow_runs[0];
            const status = latestRun.status;
            const conclusion = latestRun.conclusion;
            
            if (status === 'completed') {
                if (conclusion === 'success') {
                    this.setStatus('success', `Build Passed ✅ (${latestRun.name})`);
                } else if (conclusion === 'failure') {
                    this.setStatus('failure', `Build Failed ❌ (${latestRun.name})`);
                } else {
                    this.setStatus('failure', `Build ${conclusion} (${latestRun.name})`);
                }
            } else {
                this.setStatus('pending', `Build ${status} ⏳ (${latestRun.name})`);
            }
            
        } catch (error) {
            console.error('Error checking build status:', error);
            this.setStatus('error', 'Error checking build status');
        } finally {
            this.refreshBtn.classList.remove('loading');
        }
    }
}

// Initialize the traffic light when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new TrafficLight();
});