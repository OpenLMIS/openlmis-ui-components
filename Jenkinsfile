import hudson.tasks.test.AbstractTestResultAction

pipeline {
    agent any
    options {
        buildDiscarder(logRotator(
            numToKeepStr: env.BRANCH_NAME.equals("master") ? '15' : '3',
            daysToKeepStr: env.BRANCH_NAME.equals("master") || env.BRANCH_NAME.startsWith("rel-") ? '' : '7',
            artifactDaysToKeepStr: env.BRANCH_NAME.equals("master") || env.BRANCH_NAME.startsWith("rel-") ? '' : '3',
            artifactNumToKeepStr: env.BRANCH_NAME.equals("master") || env.BRANCH_NAME.startsWith("rel-") ? '' : '1'
        ))
        disableConcurrentBuilds()
        skipStagesAfterUnstable()
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
                withCredentials([file(credentialsId: '364a77e6-df3b-4012-8fa6-1c79ffe2171b', variable: 'ENV_FILE')]) {
                    script {
                        try {
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
                            currentBuild.result = processTestResults('SUCCESS')
                        }
                        catch (exc) {
                            currentBuild.result = processTestResults('FAILURE')
                            if (currentBuild.result == 'FAILURE') {
                                error(exc.toString())
                            }
                        }
                    }
                }
            }
            post {
                success {
                    archive 'build/styleguide/*, build/styleguide/**/*, build/docs/*, build/docs/**/*, build/messages/*'
                }
                unstable {
                    script {
                        notifyAfterFailure()
                    }
                }
                failure {
                    script {
                        notifyAfterFailure()
                    }
                }
            }
        }
        stage('Build reference-ui') {
            when {
                expression {
                    return "${env.GIT_BRANCH}" == 'master' && VERSION.endsWith("SNAPSHOT")
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
    messageColor = 'danger'
    if (currentBuild.result == 'UNSTABLE') {
        messageColor = 'warning'
    }
    BRANCH = "${env.GIT_BRANCH}".trim()
    if (BRANCH.equals("master") || BRANCH.startsWith("rel-")) {
        slackSend color: "${messageColor}", message: "${env.JOB_NAME} - #${env.BUILD_NUMBER} ${env.STAGE_NAME} ${currentBuild.result} (<${env.BUILD_URL}|Open>)"
    }
    emailext subject: "${env.JOB_NAME} - #${env.BUILD_NUMBER} ${env.STAGE_NAME} ${currentBuild.result}",
        body: """<p>${env.JOB_NAME} - #${env.BUILD_NUMBER} ${env.STAGE_NAME} ${currentBuild.result}</p><p>Check console <a href="${env.BUILD_URL}">output</a> to view the results.</p>""",
        recipientProviders: [[$class: 'CulpritsRecipientProvider'], [$class: 'DevelopersRecipientProvider']]
}

def processTestResults(status) {
    junit '**/build/test/test-results/*.xml'

    AbstractTestResultAction testResultAction = currentBuild.rawBuild.getAction(AbstractTestResultAction.class)
    if (testResultAction != null) {
        failuresCount = testResultAction.failCount
        echo "Failed tests count: ${failuresCount}"
        if (failuresCount > 0) {
            echo "Setting build unstable due to test failures"
            status = 'UNSTABLE'
        }
    }

    return status
}
