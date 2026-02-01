branch protection rules
    "require status chekcs to pass before merging" - add CI/CD checks later
    

Jan 26 checkpoint
🔐 Replace stub auth with real users (DB + hashing) -- currently working on

🎨 Improve UI (Tailwind / MUI)

🧩 Add role-based access (admin vs user)

🚀 Prep for AWS/Kubernetes deployment

🧠 Decode JWT and show user info -- did



---- General
-add graceful error handling



---- Frontend
-redo the colors and stuff
-move the register button to the login page
-move the Login/profile button inside the menu bar if the website is squeezed
-fix logo
-fix logo in footer
-make the FAQs prettier

-(longterm) light/dark theme



---- Architecture
--refactor the current backend/Api that handles tokens, users, auth -> backend/Auth.Api -- need verify
-configure CORS only on Gateway before BFF
-Remove browser facing CORS from auth.api and recipes.api
-Add S3 logging
-Expose some logging to showcase logging and S3 calling



---- Roles/Auth
-move roles to Enums.
-add premium user role
-add email verification functionality to registration
--introduce auth context -- need verification of completion
-make sure we have sql injection hygiene in the EF
--move refresh token to DB from Backend memory -- need to verification of completion
-fix bug where once the accesstoken expires, it's not doing the refresh behavior correctly
-also kick out of username once refresh token is unauthed
-add unique_primary identifier for User table



---- Database/Mongo



---- Database/EF



---- Security
-add cybersec
-DDOS protections?
-if client is hitting the service too often
-api gateway / admin layer
-content monitoring/moderating (use AI)


---- Infrastructure
-AWS account -> IAM
-AWS environment scripts
-CICD
-docker containers
-databases
-GraphQL
-Build out and configure Gateway Api from scaffold
-rewire auth.api and recipes.api to only accept calls from web.bff.api or admin tests



---- Documentation
-environent setup
-architecture review/overview explaning my thoughts in an open portfolio style
-Maintenance plan
  -If endpoint in microservice layer, make sure bff layer also is updated with that endpoint



---- Modules
-using AI
-demo of agentic/cerebral AI companion
-programming assistant
-Big data -> hadoop
-creating my own AI model -> including architecture.
-Merch Store
-Paid Premium account
-Angular 





---- IMMEDIATELY UP NEXT ON THE DOCKET

--Strong DTO types in the BFF (instead of object)
-Actually use these DTOs instead of leaving them hanging and using raw json with the frontend
-In web.bff.api authcontroller.cs, change the return to use the _response.cs DTOs and make sure the frontend can handle them
-switch frontend to hit the gateway instead of auth.api

-Standard error mapping (Auth.Api returns text sometimes; make it consistent JSON)

-Correlation IDs + logging in BFF for request tracing

-Move Auth.Api behind Gateway only (no direct browser access)
