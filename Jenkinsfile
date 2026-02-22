pipeline {
    agent any

    environment {
        DOCKER_CREDS = credentials('docker-hub')   // Single Docker Hub credential ID
        VITE_BACKEND_URL = credentials('vite-backend-url') // Your backend URL credential ID
    }

    triggers {
        githubPush()
    }

    stages {

        stage('Cleanup Old Directories') {
            steps {
                sh '''
                    echo "Cleaning old directories..."
                    rm -rf ./server ./client ./admin
                '''
            }
        }

        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Images') {
            steps {
                sh '''
                    echo "Building Docker images..."
                    docker compose build server
                    docker compose build client --build-arg VITE_BACKEND_URL=${VITE_BACKEND_URL}
                    docker compose build admin --build-arg VITE_BACKEND_URL=${VITE_BACKEND_URL}
                '''
            }
        }

        stage('Push Docker Images') {
            steps {
                sh '''
                    echo "Logging in to Docker Hub..."
                    echo $DOCKER_CREDS_PSW | docker login -u $DOCKER_CREDS_USR --password-stdin

                    echo "Pushing Docker images..."
                    docker compose push server
                    docker compose push client
                    docker compose push admin
                '''
            }
        }

        stage('Final Cleanup') {
            steps {
                sh '''
                    echo "Cleaning workspace directories..."
                    rm -rf ./server ./client ./admin
                '''
            }
        }
    }

    post {
        success {
            echo '✅ Pipeline completed successfully!'
        }
        failure {
            echo '❌ Pipeline failed!'
        }
    }
}
