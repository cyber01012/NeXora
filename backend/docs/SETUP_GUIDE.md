# 🛠️ NeXora — Complete Setup Guide

This guide covers the **full development setup** for all team members.

---

## 📋 PREREQUISITES

| Software | Version | Download |
|----------|---------|----------|
| **JDK** | 17 | [Oracle JDK 17](https://www.oracle.com/java/technologies/javase/jdk17-archive-downloads.html) or [Eclipse Temurin](https://adoptium.net/download/) |
| **Maven** | 3.9.x | [Apache Maven](https://maven.apache.org/download.cgi) |
| **PostgreSQL** | 15+ | [PostgreSQL Downloads](https://www.postgresql.com/download/windows/) |
| **Git** | Latest | [Git SCM](https://git-scm.com/downloads) |
| **IntelliJ IDEA** | Community/Ultimate | [JetBrains](https://www.jetbrains.com/idea/download/) |

---

## 🗄️ STEP 1: DATABASE SETUP

### 1.1 Install PostgreSQL

1. Download & run the PostgreSQL installer
2. **IMPORTANT:** Remember the `postgres` user password you set
3. Default port: `5432` (keep it)
4. Install pgAdmin 4 (included)

### 1.2 Create Database

**Option A — pgAdmin (GUI):**
Open pgAdmin 4

Servers → PostgreSQL → Databases → Right-click → Create → Database

Database name: nexora_db

Click [Save]

text

**Option B — CMD (CLI):**
```cmd
psql -U postgres
# Enter your postgres password
CREATE DATABASE nexora_db;
\q
📥 STEP 2: CLONE THE PROJECT
cmd
cd C:\Users\YourName\Projects
git clone https://github.com/cyber01012/NeXora.git
cd NeXora/backend
⚙️ STEP 3: CONFIGURE APPLICATION
3.1 Copy Template
cmd
copy application-template.properties application.properties
3.2 Update Database Password
Open application.properties and replace YOUR_PASSWORD_HERE with your PostgreSQL password:

properties
spring.datasource.url=jdbc:postgresql://localhost:5432/nexora_db
spring.datasource.username=postgres
spring.datasource.password=YOUR_ACTUAL_PASSWORD
🔨 STEP 4: BUILD & RUN
4.1 Generate Maven Wrapper (First Time Only)
cmd
mvn wrapper:wrapper -Dmaven=3.9.15
4.2 Build Project
cmd
.\mvnw.cmd clean install -DskipTests
4.3 Run Spring Boot
cmd
.\mvnw.cmd spring-boot:run
4.4 Verify
Open browser:

text
http://localhost:8080/api/health
Expected output:

text
NeXora Backend is running! 🚀
🌿 STEP 5: CREATE YOUR BRANCH
cmd
# Replace YOUR_PORTAL with your module name
git checkout -b YOUR_PORTAL

# Examples:
git checkout -b auth              # Member 1 (Authentication)
git checkout -b citizen-responder # Member 2 (Citizen + Responder)
git checkout -b ngo-volunteer     # Member 3 (NGO + Volunteer)
git checkout -b admin             # Member 4 (Admin)
🔄 STEP 6: DAILY WORKFLOW
Start of Day:
cmd
git checkout main
git pull origin main
git checkout YOUR_BRANCH
git merge main
End of Day:
cmd
git add .
git commit -m "Descriptive message about what you did"
git push origin YOUR_BRANCH
Creating Pull Request:
Go to GitHub repo

Click "Pull Requests" → "New Pull Request"

Base: main ← Compare: YOUR_BRANCH

Create Pull Request

Team reviews & merges

📊 VERIFY TABLES
After running Spring Boot, tables are auto-created.

Check in pgAdmin:

text
Servers → PostgreSQL → Databases → nexora_db → Schemas → public → Tables
You should see:

users table (from shared User.java entity)

Portal-specific tables (as team members add entities)

❗ TROUBLESHOOTING
Error	Solution
mvn not recognized	Install Maven or use .\mvnw.cmd
JAVA_HOME not set	Set JAVA_HOME=C:\Program Files\Java\jdk-17
Connection refused: localhost:5432	Start PostgreSQL service
Access denied for user 'postgres'	Check password in application.properties
Unknown database 'nexora_db'	Create database in pgAdmin
Port 8080 already in use	Kill process: netstat -ano | findstr :8080 then taskkill /PID <PID> /F
📚 ADDITIONAL RESOURCES
Spring Boot Documentation

PostgreSQL Tutorial

Git Cheat Sheet

JPA/Hibernate Guide

