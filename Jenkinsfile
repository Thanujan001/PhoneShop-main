// pipeline {
//     agent any

//     environment {
//         DOCKER_HUB_CREDS = credentials('docker')
//         DOCKER_USERNAME = "${DOCKER_HUB_CREDS_USR}"
//         DOCKER_PASSWORD = "${DOCKER_HUB_CREDS_PSW}"
//         VITE_BACKEND_URL = credentials('vite-backend-url')
//     }

//     triggers {
//         githubPush()
//     }

//     stages {
//         stage('Checkout Code') {
//             steps {
//                 checkout scmGit(
//                     branches: [[name: 'main']],
//                     userRemoteConfigs: [[url: 'https://github.com/Thanujan001/PhoneShop-main.git']]
//                 )
//             }
//         }

//         stage('Build Docker Images') {
//             steps {
//                 script {
//                     docker.build("$DOCKER_USERNAME/phoneshop-server:latest", "./server")
//                     docker.build("$DOCKER_USERNAME/phoneshop-client:latest", "--build-arg VITE_BACKEND_URL=${VITE_BACKEND_URL} ./client")
//                     docker.build("$DOCKER_USERNAME/phoneshop-admin:latest", "--build-arg VITE_BACKEND_URL=${VITE_BACKEND_URL} ./admin")
//                 }
//             }
//         }

//         stage('Push Docker Images') {
//             steps {
//                 script {
//                     docker.withRegistry('', 'docker') {
//                         docker.image("$DOCKER_USERNAME/phoneshop-server:latest").push()
//                         docker.image("$DOCKER_USERNAME/phoneshop-client:latest").push()
//                         docker.image("$DOCKER_USERNAME/phoneshop-admin:latest").push()
//                     }
//                 }
//             }
//         }

//         stage('Deploy to AWS') {
//             steps {
//                 script {
//                     sh '''
//                         # Login to ECR
//                         aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${ECR_REGISTRY}

//                         # Update ECS Services
//                         aws ecs update-service --cluster cluster-phoneshop-dev --service server --force-new-deployment
//                         aws ecs update-service --cluster cluster-phoneshop-dev --service client --force-new-deployment
//                         aws ecs update-service --cluster cluster-phoneshop-dev --service admin --force-new-deployment
//                     '''
//                 }
//             }
//         }
//     }

//     post {
//         success {
//             echo '✅ Pipeline completed successfully!'
//         }
//         failure {
//             echo '❌ Pipeline failed!'
//         }
//     }
// }


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
                script {
                    // Delete old directories if they exist
                    sh '''
                        rm -rf ./server
                        rm -rf ./client
                        rm -rf ./admin
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
                    docker.build("$DOCKER_USERNAME/phoneshop-server:latest", "./server")
                    docker.build("$DOCKER_USERNAME/phoneshop-client:latest", "--build-arg VITE_BACKEND_URL=${VITE_BACKEND_URL} ./client")
                    docker.build("$DOCKER_USERNAME/phoneshop-admin:latest", "--build-arg VITE_BACKEND_URL=${VITE_BACKEND_URL} ./admin")
                }
            }
        }

        stage('Push Docker Images') {
            steps {
                script {
                    docker.withRegistry('', 'docker') {
                        docker.image("$DOCKER_USERNAME/phoneshop-server:latest").push()
                        docker.image("$DOCKER_USERNAME/phoneshop-client:latest").push()
                        docker.image("$DOCKER_USERNAME/phoneshop-admin:latest").push()
                    }
                }
            }
        }

        stage('Deploy to AWS') {
            steps {
                script {
                    sh '''
                        # Login to ECR
                        aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${ECR_REGISTRY}

                        # Update ECS Services
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
                    // Delete directories after pipeline finishes
                    sh '''
                        rm -rf ./server
                        rm -rf ./client
                        rm -rf ./admin
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