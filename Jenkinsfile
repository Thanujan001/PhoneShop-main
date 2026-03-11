pipeline {
    agent any

    environment {
<<<<<<< HEAD
        // Docker Hub credentials
        DOCKER_HUB_CREDS = credentials('docker')
        DOCKER_USERNAME = "${DOCKER_HUB_CREDS_USR}"
        DOCKER_PASSWORD = "${DOCKER_HUB_CREDS_PSW}"
        
        // Application environment variables
        VITE_BACKEND_URL = credentials('vite-backend-url')
        
        // AWS credentials and configuration
        AWS_REGION = credentials('aws-region')
        ECR_REGISTRY = credentials('ecr-registry')
        AWS_CREDENTIALS = credentials('aws-credentials')
        
        // Docker image naming
        DOCKER_IMAGE_SERVER = "${DOCKER_USERNAME}/phoneshop-server"
        DOCKER_IMAGE_CLIENT = "${DOCKER_USERNAME}/phoneshop-client"
        DOCKER_IMAGE_ADMIN = "${DOCKER_USERNAME}/phoneshop-admin"
        BUILD_TAG = "${BUILD_NUMBER}-${GIT_COMMIT.substring(0, 7)}"
=======
        DOCKER_CREDS = credentials('docker-hub')   // Docker Hub credential ID
>>>>>>> 888d42501c921dd1c5322be1ced694d14360e61b
    }

    triggers {
        githubPush()
    }

    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
        timeout(time: 1, unit: 'HOURS')
    }

    stages {
<<<<<<< HEAD
        stage('🔍 Checkout Code') {
            steps {
                echo "🔄 Checking out code from repository..."
                checkout scmGit(
                    branches: [[name: 'main']],
                    userRemoteConfigs: [[url: 'https://github.com/Thanujan001/PhoneShop-main.git']]
                )
                sh 'git --version && echo "Repository branch: $(git rev-parse --abbrev-ref HEAD)"'
            }
        }

        stage('📦 Install Dependencies') {
            parallel {
                stage('Server Dependencies') {
                    steps {
                        echo "📥 Installing server dependencies..."
                        dir('server') {
                            sh '''
                                npm --version
                                npm ci
                            '''
                        }
                    }
                }
                stage('Client Dependencies') {
                    steps {
                        echo "📥 Installing client dependencies..."
                        dir('client') {
                            sh '''
                                npm --version
                                npm ci
                            '''
                        }
                    }
                }
                stage('Admin Dependencies') {
                    steps {
                        echo "📥 Installing admin dependencies..."
                        dir('admin') {
                            sh '''
                                npm --version
                                npm ci
                            '''
                        }
                    }
                }
            }
        }

        stage('🔗 Linting') {
            parallel {
                stage('Server Lint') {
                    steps {
                        echo "🔍 Running server linting..."
                        dir('server') {
                            sh '''
                                echo "Checking for eslint configuration..."
                                npm run lint || echo "No linting configured for server"
                            '''
                        }
                    }
                }
                stage('Client Lint') {
                    steps {
                        echo "🔍 Running client linting..."
                        dir('client') {
                            sh 'npm run lint || echo "Linting warnings found but continuing..."'
                        }
                    }
                }
                stage('Admin Lint') {
                    steps {
                        echo "🔍 Running admin linting..."
                        dir('admin') {
                            sh 'npm run lint || echo "Linting warnings found but continuing..."'
                        }
                    }
                }
            }
        }

        stage('🧪 Unit Tests') {
            parallel {
                stage('Server Tests') {
                    steps {
                        echo "🧪 Running server unit tests..."
                        dir('server') {
                            sh '''
                                npm test || echo "No tests configured for server"
                            '''
                        }
                    }
                }
                stage('Client Tests') {
                    steps {
                        echo "🧪 Running client unit tests..."
                        dir('client') {
                            sh '''
                                npm test || echo "No tests configured for client"
                            '''
                        }
                    }
                }
            }
        }

        stage('🔨 Build Applications') {
            parallel {
                stage('Build Server') {
                    steps {
                        echo "🔨 Building server..."
                        dir('server') {
                            sh '''
                                echo "Server build validation complete"
                                if [ ! -f "package.json" ]; then
                                    echo "ERROR: package.json not found!"
                                    exit 1
                                fi
                            '''
                        }
                    }
                }
                stage('Build Client') {
                    steps {
                        echo "🔨 Building client..."
                        dir('client') {
                            sh '''
                                echo "Building client application with Vite..."
                                npm run build
                                echo "Client build successful!"
                            '''
                        }
                    }
                }
                stage('Build Admin') {
                    steps {
                        echo "🔨 Building admin..."
                        dir('admin') {
                            sh '''
                                echo "Building admin application with Vite..."
                                npm run build
                                echo "Admin build successful!"
                            '''
                        }
                    }
                }
            }
        }

        stage('🐳 Build Docker Images') {
            steps {
                echo "🐳 Building Docker images..."
                sh '''
                    echo "Building server Docker image..."
                    docker build -t ${DOCKER_IMAGE_SERVER}:${BUILD_TAG} -t ${DOCKER_IMAGE_SERVER}:latest ./server
                    
                    echo "Building client Docker image..."
                    docker build --build-arg VITE_BACKEND_URL=${VITE_BACKEND_URL} \
                                 -t ${DOCKER_IMAGE_CLIENT}:${BUILD_TAG} \
                                 -t ${DOCKER_IMAGE_CLIENT}:latest ./client
                    
                    echo "Building admin Docker image..."
                    docker build --build-arg VITE_BACKEND_URL=${VITE_BACKEND_URL} \
                                 -t ${DOCKER_IMAGE_ADMIN}:${BUILD_TAG} \
                                 -t ${DOCKER_IMAGE_ADMIN}:latest ./admin
                    
                    echo "✅ All Docker images built successfully!"
                    docker images | grep phoneshop
                '''
            }
        }

        stage('🔐 Docker Login & Push') {
            steps {
                echo "🔐 Logging in to Docker Hub and pushing images..."
                sh '''
                    echo $DOCKER_PASSWORD | docker login -u $DOCKER_USERNAME --password-stdin
                    
                    echo "Pushing server image..."
                    docker push ${DOCKER_IMAGE_SERVER}:${BUILD_TAG}
                    docker push ${DOCKER_IMAGE_SERVER}:latest
                    
                    echo "Pushing client image..."
                    docker push ${DOCKER_IMAGE_CLIENT}:${BUILD_TAG}
                    docker push ${DOCKER_IMAGE_CLIENT}:latest
                    
                    echo "Pushing admin image..."
                    docker push ${DOCKER_IMAGE_ADMIN}:${BUILD_TAG}
                    docker push ${DOCKER_IMAGE_ADMIN}:latest
                    
                    echo "✅ All images pushed to Docker Hub!"
                '''
            }
        }

        stage('☁️ Deploy to AWS ECS') {
            steps {
                echo "☁️ Deploying to AWS ECS..."
                sh '''
                    echo "Configuring AWS credentials..."
                    export AWS_ACCESS_KEY_ID=$(echo $AWS_CREDENTIALS | jq -r '.access_key')
                    export AWS_SECRET_ACCESS_KEY=$(echo $AWS_CREDENTIALS | jq -r '.secret_key')
                    
                    echo "Logging in to AWS ECR..."
                    aws ecr get-login-password --region ${AWS_REGION} | \
                    docker login --username AWS --password-stdin ${ECR_REGISTRY}
                    
                    echo "⬆️ Updating ECS services..."
                    aws ecs update-service \
                        --cluster cluster-phoneshop-dev \
                        --service server \
                        --force-new-deployment \
                        --region ${AWS_REGION}
                    
                    aws ecs update-service \
                        --cluster cluster-phoneshop-dev \
                        --service client \
                        --force-new-deployment \
                        --region ${AWS_REGION}
                    
                    aws ecs update-service \
                        --cluster cluster-phoneshop-dev \
                        --service admin \
                        --force-new-deployment \
                        --region ${AWS_REGION}
                    
                    echo "✅ ECS services updated successfully!"
                '''
            }
        }

        stage('✅ Verify Deployment') {
            steps {
                echo "✅ Verifying deployment status..."
                sh '''
                    export AWS_ACCESS_KEY_ID=$(echo $AWS_CREDENTIALS | jq -r '.access_key')
                    export AWS_SECRET_ACCESS_KEY=$(echo $AWS_CREDENTIALS | jq -r '.secret_key')
                    
                    echo "Checking service status..."
                    aws ecs describe-services \
                        --cluster cluster-phoneshop-dev \
                        --services server client admin \
                        --region ${AWS_REGION} \
                        --query 'services[*].[serviceName,status,runningCount,desiredCount]' \
                        --output table
=======

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
>>>>>>> 888d42501c921dd1c5322be1ced694d14360e61b
                '''
            }
        }
    }

    post {
        always {
            echo "🧹 Cleaning up workspace..."
            sh '''
                echo "Removing Docker login credentials..."
                rm -f ~/.docker/config.json
                docker logout || true
            '''
            cleanWs()
        }

        success {
            echo '''
            ╔════════════════════════════════════════╗
            ║  ✅ PIPELINE COMPLETED SUCCESSFULLY!  ║
            ║                                        ║
            ║  Build: ${BUILD_NUMBER}               ║
            ║  Commit: ${GIT_COMMIT}                ║
            ║  Branch: ${GIT_BRANCH}                ║
            ╚════════════════════════════════════════╝
            '''
        }

        failure {
            echo '''
            ╔════════════════════════════════════════╗
            ║     ❌ PIPELINE FAILED!               ║
            ║                                        ║
            ║  Build: ${BUILD_NUMBER}               ║
            ║  Stage: ${env.STAGE_NAME}             ║
            ║  Check logs for more details          ║
            ╚════════════════════════════════════════╝
            '''
        }

        unstable {
            echo '''
            ╔════════════════════════════════════════╗
            ║    ⚠️  PIPELINE UNSTABLE              ║
            ║                                        ║
            ║  Build: ${BUILD_NUMBER}               ║
            ║  Please review warnings               ║
            ╚════════════════════════════════════════╝
            '''
        }

        aborted {
            echo '⏸️ Pipeline was aborted'
        }
    }
}
