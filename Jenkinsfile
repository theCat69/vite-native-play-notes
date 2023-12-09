pipeline {
  agent any
  stages {
    stage('Build') {
      steps {
        sh "npm install && npm run build"
      }
    }
    stage('Deliver') {
      steps {
        script {
          if('main' == env.BRANCH_NAME) {
            echo 'delivering'
          }
          else {
            echo 'not delivering'
          }
        }
      }
    }
  }
}
