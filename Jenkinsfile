pipeline {
    agent any

    environment {
        DOCKER_CREDS = credentials('docker-hub')   // Docker Hub credential ID
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
                    echo "Building backend..."
                    docker compose build server

                    echo "Building frontend with backend container URL..."
                    docker compose build client --build-arg VITE_BACKEND_URL=http://server:3000
                    docker compose build admin --build-arg VITE_BACKEND_URL=http://server:3000
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
