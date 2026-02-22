pipeline {
    agent any

    environment {
        DOCKER_HUB_CREDS = credentials('docker')
        DOCKER_USERNAME = "${DOCKER_HUB_CREDS_USR}"
        DOCKER_PASSWORD = "${DOCKER_HUB_CREDS_PSW}"
        VITE_BACKEND_URL = credentials('vite-backend-url')
        AWS_REGION = credentials('aws-region')   // make sure you have this credential
        ECR_REGISTRY = credentials('ecr-registry') // make sure you have this too
    }

    triggers {
        githubPush()
    }

    stages {

        stage('Cleanup Old Directories') {
            steps {
                script {
                    sh '''
                        echo "Cleaning old directories..."
                        rm -rf ./server ./client ./admin
                    '''
                }
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

        stage('Deploy to AWS ECS') {
            steps {
                script {
                    sh '''
                        echo "Logging in to AWS ECR..."
                        aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${ECR_REGISTRY}

                        echo "Updating ECS services..."
                        aws ecs update-service --cluster cluster-phoneshop-dev --service server --force-new-deployment
                        aws ecs update-service --cluster cluster-phoneshop-dev --service client --force-new-deployment
                        aws ecs update-service --cluster cluster-phoneshop-dev --service admin --force-new-deployment
                    '''
                }
            }
        }

        stage('Final Cleanup') {
            steps {
                script {
                    sh '''
                        echo "Cleaning workspace directories..."
                        rm -rf ./server ./client ./admin
                    '''
                }
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