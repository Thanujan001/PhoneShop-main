pipeline {
    agent any

    environment {
        // Docker Hub credentials (set this in Jenkins)
        DOCKER_CREDS = credentials('docker-hub')

        // Image names
        SERVER_IMAGE = "${DOCKER_CREDS_USR}/phoneshop-server"
        CLIENT_IMAGE = "${DOCKER_CREDS_USR}/phoneshop-client"
        ADMIN_IMAGE  = "${DOCKER_CREDS_USR}/phoneshop-admin"

        // Tag
        TAG = "${BUILD_NUMBER}"
    }

    triggers {
        pollSCM('H/5 * * * *')
    }

    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
        timeout(time: 30, unit: 'MINUTES')
    }

    stages {

        stage('🔄 Checkout Code') {
            steps {
                echo "Cloning repository..."
                checkout scm
            }
        }

        stage('📦 Install Dependencies') {
            parallel {
                stage('Server') {
                    steps {
                        dir('server') {
                            bat 'npm install'
                        }
                    }
                }
                stage('Client') {
                    steps {
                        dir('client') {
                            bat 'npm install'
                        }
                    }
                }
                stage('Admin') {
                    steps {
                        dir('admin') {
                            bat 'npm install'
                        }
                    }
                }
            }
        }

        stage('🧪 Run Tests') {
            steps {
                dir('client') {
                    bat 'npm test -- --run'
                }
            }
        }

        stage('🧪 Build Frontend') {
            parallel {
                stage('Client Build') {
                    steps {
                        dir('client') {
                            bat 'npm run build'
                        }
                    }
                }
                stage('Admin Build') {
                    steps {
                        dir('admin') {
                            bat 'npm run build'
                        }
                    }
                }
            }
        }

        stage('🐳 Build Docker Images') {
            steps {
                bat '''
                    echo "Building server image..."
                    docker build -t %SERVER_IMAGE%:%TAG% ./server

                    echo "Building client image..."
                    docker build -t %CLIENT_IMAGE%:%TAG% ./client

                    echo "Building admin image..."
                    docker build -t %ADMIN_IMAGE%:%TAG% ./admin
                '''
            }
        }

        stage('🔐 Login to Docker Hub') {
            steps {
                bat '''
                    echo %DOCKER_CREDS_PSW% | docker login -u %DOCKER_CREDS_USR% --password-stdin
                '''
            }
        }

        stage('📤 Push Docker Images') {
            steps {
                bat '''
                    echo "Pushing server..."
                    docker push %SERVER_IMAGE%:%TAG%

                    echo "Pushing client..."
                    docker push %CLIENT_IMAGE%:%TAG%

                    echo "Pushing admin..."
                    docker push %ADMIN_IMAGE%:%TAG%
                '''
            }
        }

        stage('🧹 Cleanup') {
            steps {
                bat '''
                    docker logout
                    docker system prune -f
                '''
            }
        }
    }

    post {
        success {
            echo '''
            ✅ SUCCESS!
            Your PhoneShop app is built and pushed to Docker Hub.
            '''
        }

        failure {
            echo '''
            ❌ FAILED!
            Check logs in Jenkins.
            '''
        }

        always {
            cleanWs()
        }
    }
}
