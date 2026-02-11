pipeline {
    agent any
    
    environment {
        REGISTRY = 'docker.io'
        REGISTRY_CREDENTIALS = 'docker-hub-credentials'
        PROJECT_NAME = 'phoneshop'
        IMAGE_TAG = "${BUILD_NUMBER}"
    }
    
    stages {
        stage('Checkout') {
            steps {
                echo '========== Checking out code =========='
                checkout scm
            }
        }
        
        stage('Build') {
            steps {
                echo '========== Building Docker images =========='
                sh '''
                    docker-compose build
                '''
            }
        }
        
        stage('Test') {
            steps {
                echo '========== Running tests =========='
                sh '''
                    echo "Running client tests..."
                    docker-compose run --rm frontend npm test || true
                    
                    echo "Running server tests..."
                    docker-compose run --rm backend npm test || true
                '''
            }
        }
        
        stage('Start Services') {
            steps {
                echo '========== Starting services =========='
                sh '''
                    docker-compose up -d
                    sleep 10
                    docker-compose ps
                '''
            }
        }
        
        stage('Health Check') {
            steps {
                echo '========== Performing health checks =========='
                sh '''
                    echo "Checking backend health..."
                    curl -f http://localhost:5000/health || true
                    
                    echo "Checking frontend availability..."
                    curl -f http://localhost:3000 > /dev/null || true
                    
                    echo "Checking admin panel..."
                    curl -f http://localhost:5001 > /dev/null || true
                '''
            }
        }
        
        stage('Push to Registry') {
            when {
                branch 'main'
            }
            steps {
                echo '========== Pushing images to registry =========='
                sh '''
                    echo "Pushing server image..."
                    docker tag ${PROJECT_NAME}-backend:latest ${REGISTRY}/${PROJECT_NAME}-backend:${IMAGE_TAG}
                    docker push ${REGISTRY}/${PROJECT_NAME}-backend:${IMAGE_TAG}
                    
                    echo "Pushing client image..."
                    docker tag ${PROJECT_NAME}-frontend:latest ${REGISTRY}/${PROJECT_NAME}-frontend:${IMAGE_TAG}
                    docker push ${REGISTRY}/${PROJECT_NAME}-frontend:${IMAGE_TAG}
                    
                    echo "Pushing admin image..."
                    docker tag ${PROJECT_NAME}-admin:latest ${REGISTRY}/${PROJECT_NAME}-admin:${IMAGE_TAG}
                    docker push ${REGISTRY}/${PROJECT_NAME}-admin:${IMAGE_TAG}
                '''
            }
        }
        
        stage('Cleanup') {
            steps {
                echo '========== Cleaning up =========='
                sh '''
                    docker-compose down
                '''
            }
        }
    }
    
    post {
        always {
            echo '========== Pipeline finished =========='
            cleanWs()
        }
        
        success {
            echo '========== Build Successful =========='
        }
        
        failure {
            echo '========== Build Failed =========='
            sh '''
                docker-compose logs
                docker-compose down || true
            '''
        }
    }
}
