```markdown
# ⚡ NeXora — Quick Setup (5 Minutes)

For team members who just want to **run the backend** and start coding.

---

## 🖥️ ONE-TIME SETUP (First Time Only)

### 1. Install Required Software

- ✅ **JDK 17** ([Download](https://adoptium.net/download/))
- ✅ **PostgreSQL** ([Download](https://www.postgresql.com/download/windows/))
- ✅ **Git** ([Download](https://git-scm.com/downloads))

### 2. Create Database

```cmd
# Open CMD
psql -U postgres
# Enter your postgres password
CREATE DATABASE nexora_db;
\q
3. Clone & Configure
cmd
git clone https://github.com/cyber01012/NeXora.git
cd NeXora/backend

# Copy template
copy application-template.properties application.properties

# Edit application.properties — change YOUR_PASSWORD_HERE to your PostgreSQL password
4. Run
cmd
.\mvnw.cmd spring-boot:run
5. Test
text
http://localhost:8080/api/health
Should show: NeXora Backend is running! 🚀

🔄 DAILY WORKFLOW (Every Day)
cmd
# 1. Get latest code
git pull origin main

# 2. Switch to your branch (first time)
git checkout -b YOUR_BRANCH_NAME

# 3. Code...

# 4. Save your work
git add .
git commit -m "What you did today"
git push origin YOUR_BRANCH_NAME
📊 YOUR FILES (By Module)
If you are...	Work in this folder
Auth Team	backend/src/main/java/nexora_backend/auth/
Citizen + Responder (TUM)	backend/src/main/java/nexora_backend/citizen/ + responder/
NGO + Volunteer	backend/src/main/java/nexora_backend/ngo/ + volunteer/
Admin	backend/src/main/java/nexora_backend/admin/
Frontend	frontend/src/
