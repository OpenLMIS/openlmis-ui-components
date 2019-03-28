pipeline {
    agent any
    options {
        buildDiscarder(logRotator(numToKeepStr: '15'))
        disableConcurrentBuilds()
    }
    environment {
      PATH = "/usr/local/bin/:$PATH"
      COMPOSE_PROJECT_NAME = "${env.JOB_NAME}-${BRANCH_NAME}"
    }
    stages {
        stage('Preparation') {
            steps {
                checkout scm

                withCredentials([usernamePassword(
                  credentialsId: "cad2f741-7b1e-4ddd-b5ca-2959d40f62c2",
                  usernameVariable: "USER",
                  passwordVariable: "PASS"
                )]) {
                    sh 'set +x'
                    sh 'docker login -u $USER -p $PASS'
                }
                script {
                    def properties = readProperties file: 'project.properties'
                    if (!properties.version) {
                        error("version property not found")
                    }
                    VERSION = properties.version
                    currentBuild.displayName += " - " + VERSION
                }
            }
            post {
                failure {
                    script {
                        notifyAfterFailure()
                    }
                }
            }
        }
        stage('Build') {
            steps {
                withCredentials([file(credentialsId: '8da5ba56-8ebb-4a6a-bdb5-43c9d0efb120', variable: 'ENV_FILE')]) {
                    sh '''
                        sudo rm -f .env
                        cp $ENV_FILE .env
                        if [ "$GIT_BRANCH" != "master" ]; then
                            sed -i '' -e "s#^TRANSIFEX_PUSH=.*#TRANSIFEX_PUSH=false#" .env  2>/dev/null || true
                        fi
                        docker-compose pull
                        docker-compose down --volumes
                        docker-compose run --entrypoint /dev-ui/build.sh ui-components
                        docker-compose build image
                        docker-compose down --volumes
                    '''
                }
            }
            post {
                success {
                    archive 'build/styleguide/*, build/styleguide/**/*, build/docs/*, build/docs/**/*, build/messages/*'
                }
                failure {
                    script {
                        notifyAfterFailure()
                    }
                }
                always {
                    junit '**/build/test/test-results/*.xml'
                }
            }
        }
        stage('Build reference-ui') {
            when {
                expression {
                    return env.GIT_BRANCH == 'master'
                }
            }
            steps {
                sh "docker tag openlmis/ui-components:latest openlmis/ui-components:${VERSION}"
                sh "docker push openlmis/ui-components:${VERSION}"
                build job: 'OpenLMIS-reference-ui-pipeline/master', wait: false
            }
            post {
                failure {
                    script {
                        notifyAfterFailure()
                    }
                }
            }
        }
        stage('Sonar analysis') {
            steps {
                withSonarQubeEnv('Sonar OpenLMIS') {
                    withCredentials([string(credentialsId: 'SONAR_LOGIN', variable: 'SONAR_LOGIN'), string(credentialsId: 'SONAR_PASSWORD', variable: 'SONAR_PASSWORD')]) {
                        sh '''
                            set +x

                            sudo rm -f .env
                            touch .env

                            SONAR_LOGIN_TEMP=$(echo $SONAR_LOGIN | cut -f2 -d=)
                            SONAR_PASSWORD_TEMP=$(echo $SONAR_PASSWORD | cut -f2 -d=)
                            echo "SONAR_LOGIN=$SONAR_LOGIN_TEMP" >> .env
                            echo "SONAR_PASSWORD=$SONAR_PASSWORD_TEMP" >> .env
                            echo "SONAR_BRANCH=$GIT_BRANCH" >> .env

                            docker-compose run --entrypoint ./sonar.sh ui-components
                            docker-compose down --volumes
                            sudo rm -rf node_modules/
                        '''
                        // workaround because sonar plugin retrieve the path directly from the output
                        sh 'echo "Working dir: ${WORKSPACE}/.sonar"'
                    }
                }
                timeout(time: 1, unit: 'HOURS') {
                    script {
                        def gate = waitForQualityGate()
                        if (gate.status != 'OK') {
                            error 'Quality Gate FAILED'
                        }
                    }
                }
            }
            post {
                failure {
                    script {
                        notifyAfterFailure()
                    }
                }
            }
        }
        stage('Push image') {
            when {
                expression {
                    return env.GIT_BRANCH == 'master' || env.GIT_BRANCH =~ /rel-.+/
                }
            }
            steps {
                sh "docker tag openlmis/ui-components:latest openlmis/ui-components:${VERSION}"
                sh "docker push openlmis/ui-components:${VERSION}"
            }
            post {
                success {
                    script {
                        if (!VERSION.endsWith("SNAPSHOT")) {
                            currentBuild.setKeepLog(true)
                        }
                    }
                }
                failure {
                    script {
                        notifyAfterFailure()
                    }
                }
            }
        }
    }
    post {
        fixed {
            script {
                BRANCH = "${env.GIT_BRANCH}".trim()
                if (BRANCH.equals("master") || BRANCH.startsWith("rel-")) {
                    slackSend color: 'good', message: "${env.JOB_NAME} - #${env.BUILD_NUMBER} Back to normal"
                }
            }
        }
    }
}

def notifyAfterFailure() {
    BRANCH = "${env.GIT_BRANCH}".trim()
    if (BRANCH.equals("master") || BRANCH.startsWith("rel-")) {
        slackSend color: 'danger', message: "${env.JOB_NAME} - #${env.BUILD_NUMBER} ${env.STAGE_NAME} FAILED (<${env.BUILD_URL}|Open>)"
    }
    emailext subject: "${env.JOB_NAME} - #${env.BUILD_NUMBER} ${env.STAGE_NAME} FAILED",
        body: """<p>${env.JOB_NAME} - #${env.BUILD_NUMBER} ${env.STAGE_NAME} FAILED</p><p>Check console <a href="${env.BUILD_URL}">output</a> to view the results.</p>""",
        recipientProviders: [[$class: 'CulpritsRecipientProvider'], [$class: 'DevelopersRecipientProvider']]
}