class TrafficLight {
    constructor() {
        this.redLight = document.getElementById('red-light');
        this.yellowLight = document.getElementById('yellow-light');
        this.greenLight = document.getElementById('green-light');
        this.statusText = document.getElementById('status-text');
        this.timestamp = document.getElementById('timestamp');
        this.refreshBtn = document.getElementById('refresh-btn');
        this.repoUrlInput = document.getElementById('repo-url');
        this.setRepoBtn = document.getElementById('set-repo-btn');
        
        // GitHub repository information (defaults)
        this.owner = 'PATTASWAMY-VISHWAK-YASASHREE';
        this.repo = 'PROJECT01';
        
        this.init();
    }
    
    init() {
        this.refreshBtn.addEventListener('click', () => this.checkBuildStatus());
        this.setRepoBtn.addEventListener('click', () => this.setRepository());
        this.repoUrlInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.setRepository();
            }
        });
        
        // Load saved repository from localStorage
        this.loadSavedRepository();
        
        this.checkBuildStatus();
        
        // Auto-refresh every 30 seconds
        setInterval(() => this.checkBuildStatus(), 30000);
    }
    
    parseGitHubUrl(url) {
        // Support various GitHub URL formats
        const patterns = [
            // https://github.com/owner/repo
            /^https?:\/\/github\.com\/([^\/]+)\/([^\/]+?)(\.git)?(\?.*)?$/,
            // git@github.com:owner/repo.git
            /^git@github\.com:([^\/]+)\/([^\/]+?)\.git$/,
            // owner/repo shorthand
            /^([^\/]+)\/([^\/]+)$/
        ];
        
        for (const pattern of patterns) {
            const match = url.trim().match(pattern);
            if (match) {
                return {
                    owner: match[1],
                    repo: match[2]
                };
            }
        }
        
        return null;
    }
    
    setRepository() {
        const url = this.repoUrlInput.value.trim();
        if (!url) {
            this.setStatus('error', 'Please enter a GitHub repository URL');
            return;
        }
        
        const parsed = this.parseGitHubUrl(url);
        if (!parsed) {
            this.setStatus('error', 'Invalid GitHub repository URL format');
            return;
        }
        
        this.owner = parsed.owner;
        this.repo = parsed.repo;
        
        // Save to localStorage
        localStorage.setItem('github-repo-url', url);
        localStorage.setItem('github-owner', this.owner);
        localStorage.setItem('github-repo', this.repo);
        
        this.setStatus('pending', `Switched to ${this.owner}/${this.repo}`);
        this.checkBuildStatus();
    }
    
    loadSavedRepository() {
        const savedUrl = localStorage.getItem('github-repo-url');
        const savedOwner = localStorage.getItem('github-owner');
        const savedRepo = localStorage.getItem('github-repo');
        
        if (savedUrl && savedOwner && savedRepo) {
            this.repoUrlInput.value = savedUrl;
            this.owner = savedOwner;
            this.repo = savedRepo;
        } else {
            // Set default URL in input
            this.repoUrlInput.value = `https://github.com/${this.owner}/${this.repo}`;
        }
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