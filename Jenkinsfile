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