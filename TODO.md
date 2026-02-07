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
-homepage hero scroll stops halfway through on squeezed window

-make the technical me, an expandable section in the About me

-(longterm) light/dark theme

-move the auth.ts file to /src/data



---- Architecture
--refactor the current backend/Api that handles tokens, users, auth -> backend/Auth.Api -- need verify
--configure CORS only on Gateway before BFF
-Remove browser facing CORS from auth.api and recipes.api
-Add S3 logging (long term)
-Expose some logging to showcase logging and S3 calling
-Correlation IDs + logging in BFF for request tracing



---- Roles/Auth
-move roles to Enums.
-add premium user role
-add email verification functionality to registration
--introduce auth context -- need verification of completion
-make sure we have sql injection hygiene in the EF
--move refresh token to DB from Backend memory -- need to verification of completion
-fix bug where once the accesstoken expires, it's not doing the refresh behavior correctly
-also kick out of username once refresh token is unauthed
-add unique primary id for User table
-all roles to recipe-api (spring doesn't have a nice translation for .net issued jwt roles)



---- Database/Mongo



---- Database/EF



---- Security
-add cybersec
-manual DDOS protections?
--if client is hitting the service too often
-api gateway vs admin layer vs bff
-content monitoring/moderating (use AI)


---- Infrastructure
-AWS account -> IAM
-AWS environment scripts
--CICD
-add tests in github CI
-replace restore and build in CI with using the Homesite.sln?
-ensure frontend deploy should be separate between dev and main
-long term set up staging/test environment
--docker containers
-databases
-GraphQL
--Build out and configure Gateway Api from scaffold
--rewire auth.api and recipes.api to only accept calls from web.bff.api or admin tests (security groups)



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


Feb 7, 2026.
-push recipes api prototype
-setup/wire/test mongodb

-migrate ef core from auth.api to auth-db
-test auth-db




