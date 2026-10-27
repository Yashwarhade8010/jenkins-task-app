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