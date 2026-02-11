Required Jenkins credentials for this repository

Overview
- Place credentials in Jenkins (Manage Jenkins → Credentials → System → Global credentials) so the `Jenkinsfile` can access them via the `credentials` binding or environment variable names.

Credentials to add
1. Docker registry (Docker Hub) — credentials type: **Username with password**
   - ID: `docker-hub-credentials`
   - Purpose: used by the pipeline when tagging/pushing images to `docker.io`.

2. Git/GitHub credentials — choose one of:
   - SSH Key (preferred) — type: **SSH Username with private key**
     - ID: `git-ssh-key`
   - Personal Access Token — type: **Username with password** (username=`<your-user>`, password=`<token>`)
     - ID: `github-token`
   - Purpose: allow Jenkins to checkout private repositories and access the Git API if needed.

3. (Optional) DockerHub access token — if you prefer tokens over username/password, use **Username with password** where username is your Docker ID and password is the token. Use the same ID `docker-hub-credentials`.

Agent setup notes
- The Jenkins agent that runs this pipeline must have Docker and Docker Compose installed and available in PATH.
- If using Docker-in-Docker (DinD) or a containerized agent, ensure the agent has privileges to run Docker (or use an agent with the Docker socket mounted).
- For Windows agents: ensure `docker` and `docker-compose` are installed for Windows and adjust any shell steps to use PowerShell if necessary.

How to reference credentials in the `Jenkinsfile`
- The example `Jenkinsfile` uses `REGISTRY_CREDENTIALS = 'docker-hub-credentials'` — create a credential with that ID in Jenkins.
- To bind credentials in declarative pipeline, use the `credentials` step or `withCredentials`:

```groovy
withCredentials([usernamePassword(credentialsId: 'docker-hub-credentials', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
  sh 'echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin'
}
```

Security recommendations
- Use scoped tokens where possible (Docker Hub or GitHub personal access tokens limited to required scopes).
- Store credentials in Jenkins' credentials store, not in repository files or environment variables in plaintext.
- Limit the list of agents that can read these credentials by using folder-level or folder-restricted credentials if needed.

Next steps
- Create the credentials in Jenkins using the IDs listed above.
- If you want, I can adapt the `Jenkinsfile` to use `withCredentials` blocks and to support multibranch pipelines or Windows agents; tell me which one you prefer and I'll update the pipeline accordingly.
