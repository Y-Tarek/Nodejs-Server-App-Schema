# Nodejs-Server-App-Schema
## A Schema to use or follow when starting to build a node/expressjs server with a full authintication and authorization serveices.
## Prerequisite
   >node v10.16.0 or higher
 
   >mongodb
  
   >npm
   
## Packages
  >express
  
  >mongodb
  
  >mongoose
  
  >lodash
  
  >bcryptjs
  
  >express-group-routes
  
  >jsonWebToken
  
  >body-parser
  
  >validator
  
  
  ## Installation
  Cloning to the project: 
  
     git clone https://github.com/Y-Tarek/Nodejs-Server-App-Schema.git
   
   then run: 
      
      npm install.
      
  ## Configuration
   In the server/config/config.json:
   
    - put your desired Port number
    - The Mongodb_url
    - jsonWebToken secrete
    
   
   In server/db/models/user.js
    
    You are open to add or remove any data in the user model.
   
   
   At last in server/server.js
   
   put your ip address in address variable and run node server.js and here you go your database has been created automatically once the project runs successfully
   and the url that you will use to make http requests will be logged.
