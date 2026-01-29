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



---- Architecture
--refactor the current backend/Api that handles tokens, users, auth -> backend/Auth.Api -- need verify



---- Roles/Auth
-move roles to Enums.
-add premium user role
-add email verification functionality to registration
--introduce auth context -- need verification of completion
-make sure we have sql injection hygiene in the EF
--move refresh token to DB from Backend memory -- need to verification of completion
-fix bug where once the accesstoken expires, it's not doing the refresh behavior correctly
-add unique_primary identifier for User table



---- Database/Mongo



---- Database/EF
