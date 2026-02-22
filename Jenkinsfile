pipeline {
    agent any

    environment {
        DOCKER_HUB_CREDS = credentials('docker')
        DOCKER_USERNAME = "${DOCKER_HUB_CREDS_USR}"
        DOCKER_PASSWORD = "${DOCKER_HUB_CREDS_PSW}"
        VITE_BACKEND_URL = credentials('vite-backend-url')
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
                checkout scmGit(
                    branches: [[name: 'main']],
                    userRemoteConfigs: [[url: 'https://github.com/Thanujan001/PhoneShop-main.git']]
                )
            }
        }

        stage('Build Docker Images') {
            steps {
                script {
                    sh '''
                        echo "Building Docker images..."
                        docker compose build server
                        docker compose build client --build-arg VITE_BACKEND_URL=${VITE_BACKEND_URL}
                        docker compose build admin --build-arg VITE_BACKEND_URL=${VITE_BACKEND_URL}
                    '''
                }
            }
        }

        stage('Push Docker Images') {
            steps {
                script {
                    sh '''
                        echo "Logging in to Docker Hub..."
                        echo $DOCKER_PASSWORD | docker login -u $DOCKER_USERNAME --password-stdin

                        echo "Pushing Docker images..."
                        docker compose push server
                        docker compose push client
                        docker compose push admin
                    '''
                }
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
