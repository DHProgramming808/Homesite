branch protection rules
    "require status chekcs to pass before merging" - add CI/CD checks later
    

Jan 26 checkpoint
🔐 Replace stub auth with real users (DB + hashing) -- currently working on

🎨 Improve UI (Tailwind / MUI)

🧩 Add role-based access (admin vs user)

🚀 Prep for AWS/Kubernetes deployment

🧠 Decode JWT and show user info -- did



---
move refresh token to DB from Backend memory -- need verification of completion


---


--introduce auth context -- need verification of completion
--make sure we have sql injection hygiene in the EF

fix bug where once the accesstoken expires, it's not doing the refresh behavior correctly


--
add email verification functionality to registration


--
add graceful error handling


--
refactor the current backend/Api that handles tokens, users, auth -> backend/Auth.Api

--add a solution file for the backend

--move roles to Enums.
--add premium user role
