pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                echo 'Fetching application source code from GitHub'
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                echo 'Installing Node.js dependencies'
                sh 'npm ci'
            }
        }

        stage('Run Tests') {
            steps {
                echo 'Running automated tests'
                sh 'npm test'
            }
        }

        stage('Build Docker Image') {
            steps {
                echo 'Building Docker image'
                sh 'docker build -t jenkins-task-app:${BUILD_NUMBER} .'
            }
        }
        stage('Push Docker Image') {
             steps {
                 withCredentials([
                     usernamePassword(
                          credentialsId: 'dockerhub-credentials',
                          usernameVariable: 'DOCKERHUB_USERNAME',
                          passwordVariable: 'DOCKERHUB_TOKEN'
                    )
               ]) {
                   sh '''
                       set +x
                       printf '%s' "$DOCKERHUB_TOKEN" | docker login \
                           --username "$DOCKERHUB_USERNAME" \
                           --password-stdin
                       docker tag jenkins-task-app:${BUILD_NUMBER} \
                          "$DOCKERHUB_USERNAME/jenkins-task-app:${BUILD_NUMBER}"
                       docker push "$DOCKERHUB_USERNAME/jenkins-task-app:${BUILD_NUMBER}"
                       docker logout
                    '''
                }
            }
        }
        stage('Deploy to EC2'){
            steps {
                withCredentials([
                    sshUserPrivateKey(
                        credentialsId: 'deploy-server-ssh',
                        keyFileVariable: 'SSH_KEY',
                        usernameVariable: 'SSH_USER'
                    )
                ]) {
                    sh '''
                        set -eu
                        echo "Deploying build ${BUILD_NUMBER} to EC2..."
                        
                        ssh -i "$SSH_KEY" \
                            -o StrictHostKeyChecking=accept-new \
                            "$SSH_USER@172.31.3.52" "
                                set -e
                                docker pull yashwarhadee/jenkins-task-app:${BUILD_NUMBER}
                                docker rm -f jenkins-task-app 2>/dev/null || true
                                docker run -d \
                                    --name jenkins-task-app \
                                    -p 3000:3000 \
                                    --restart unless-stopped \
                                    yashwarhadee/jenkins-task-app:${BUILD_NUMBER}
                            "
                        echo "Deployment completed!"
                    '''
                }
            }
        }

    }

    post {
        success {
            echo 'Pipeline completed successfully!'
        }

        failure {
            echo 'Pipeline failed. Check the console output.'
        }
    }
}