pipeline {
    agent any
  
      environment {
        AZURE_VM_IP = "52.246.136.157"
        DOCKER_IMAGE = "weather-dev-api"
        DOCKER_CONTAINER = "weather-dev-api-container"
    }
    stages {
        stage("checkout git"){
           
            steps{
                git branch : 'development',
                url: "https://github.com/fantasyinfo/express-js-weather-app-for-ci-cd-multienv-deployment"
                echo "Checked out development branch successfully"
                sh '''
                git branch --show-current
                ls -la
                '''
            }
        
        }
        stage("Login to SSH"){
            steps {
                echo "Login onto the ssh machine of azure"
                sshagent(credentials : ["azurevmsshkey"]){
                    sh '''
                        ssh -o StrictHostKeyChecking=no azureuser@${AZURE_VM_IP} "
                            echo 'SSH Login Successful'
                            echo 'changking directory to weather app dev'
                            cd /home/azureuser/weather-app/dev
                         
                            echo 'builiding docker image'
                            docker build -t ${DOCKER_IMAGE} --env-file .env .
                        
                            echo 'stopping the current docker container'
                            docker stop ${DOCKER_CONTAINER}
                        
                            echo 'removing the stopped container to restart with same name'
                            docker rm ${DOCKER_CONTAINER}
                        
                            echo 'running docker container'
                            docker run  -d --env-file .env  -p 3200:3000  --name ${DOCKER_CONTAINER} --restart unless-stopped ${DOCKER_IMAGE} 
                        
                            echo 'checking running docker container'
                            docker ps
                        
                            echo 'build the frontend now'
                      
                            echo 'npm install'
                            npm install
                        
                            echo 'npm run build'
                            npm run build
                        
                            echo 'build is ready inside /dist folder & copy to var directory'
                        
                            cp -r /home/azureuser/weather-app/dev/dist/* /var/www/dev-weather
                        
                            echo 'build copied to their directory'

                        "
                    '''
                }
                echo "Docker container build and running"
            }
        }
        
        stage("Build created"){
            steps {
                
                echo "Here is the Build ID ${BUILD_ID} & Build Number ${BUILD_NUMBER}"
            }
        }
    }
}