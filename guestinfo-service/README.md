# guestinfo-service
Guest user management function for the playground.  
This code build out API-Gateway, Lambda functions and DynamoDB table by using CloudFormation.  
All user information are stored in the DynamoDB table.
## guestSubmission
Submit guest information.  
Method: `POST`  
`curl -H "Content-Type: application/json" -X POST -d '{"fullname":"<username>","email":"<email-address>", "companyname":"<companyname>"}' https://<URL>/dev/guests`
## listGuests
List all guests.  
Method: `GET`  
`curl -X GET https://<URL>/dev/guests`
## guestDetails
Display a detailed specific guest information.   
List all guests.  
Method: `GET`  
`curl -X GET https://<URL>/dev/guests/<id>`