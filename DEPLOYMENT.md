# Deploying AmazonReplica (frontend + backend)

This project has two parts:

- **Frontend:** Vite + React in `frontend/` → deploy to **Azure Static Web Apps** (or any static host).
- **Backend:** ASP.NET Core API in `backend/AmazonReplica.API/` → deploy to **Azure App Service** (Web App for .NET).

Deploy the **backend first**, note its public URL, then configure and deploy the **frontend** so it calls that URL.

---

## Prerequisites

- [Azure account](https://azure.microsoft.com/free/) with permission to create resources.
- **Node.js** (LTS) and npm — for local builds and Static Web Apps.
- **.NET SDK** matching the project (see `backend/AmazonReplica.API/AmazonReplica.API.csproj` — e.g. .NET 10).
- Optional: **Visual Studio** or **VS Code** with Azure extensions for guided publish.

---

## Part 1: Deploy the backend (API)

### 1. Create the Azure Web App

1. In [Azure Portal](https://portal.azure.com), create a resource → **Web App**.
2. Choose:
   - **Runtime stack:** .NET (match your project’s target framework).
   - **Operating system:** Windows or Linux (either works; ensure stack matches).
3. Create the app and wait until it finishes provisioning.

### 2. Publish the API project

**Option A — Visual Studio**

1. Open `backend/AmazonReplica.API/AmazonReplica.API.csproj`.
2. Right-click the project → **Publish** → target **Azure** → select your Web App → publish.

**Option B — CLI (overview)**

1. From `backend/AmazonReplica.API` folder:

   ```bash
   dotnet publish -c Release -o ./publish
   ```

2. Zip the contents of `publish/` and deploy via Azure Portal (**Deployment Center** → ZIP deploy) or use [`az webapp deployment`](https://learn.microsoft.com/azure/app-service/deploy-zip) — use the method you prefer.

### 3. Database (SQLite)

The API uses SQLite (`Bookstore.sqlite` in the project). For App Service:

- Ensure `Bookstore.sqlite` is **deployed with the app** (the `.csproj` already copies it to output when configured).
- **Note:** On a default App Service plan, the local filesystem can be **reset** on certain operations. For production durability, consider mounting **Azure Files** or moving to **Azure SQL** later. For class/demo deployments, publishing the `.sqlite` file is often enough.

### 4. HTTPS URL for the API

After deployment, your API base will look like:

`https://<your-webapp-name>.azurewebsites.net`

Book endpoints are under the **`Books`** controller, so the base used by the frontend is:

`https://<your-webapp-name>.azurewebsites.net/Books`

(no trailing slash)

### 5. CORS

The API in `Program.cs` allows:

- Local Vite dev (`http://localhost:3000`, etc.).
- Origins whose host ends with **`.azurestaticapps.net`** (typical Static Web Apps URLs).

If you add a **custom domain** to the static site, you must **update CORS** in the API to allow that origin, then **redeploy the backend**.

---

## Part 2: Deploy the frontend (Static Web Apps)

### 1. Point the build at your API

The frontend reads the API base from **`VITE_API_URL`** at **build time** (see `frontend/src/config/api.ts`).

Set it to your deployed Books base URL, for example:

```text
VITE_API_URL=https://<your-webapp-name>.azurewebsites.net/Books
```

If you skip this, the app falls back to the default URL hard-coded in `api.ts` — change that fallback or always set `VITE_API_URL` for your environment.

### 2. Build locally (sanity check)

```bash
cd frontend
npm ci
set VITE_API_URL=https://<your-webapp-name>.azurewebsites.net/Books
npm run build
```

On **PowerShell**, use `$env:VITE_API_URL="..."` instead of `set`.

Output is in `frontend/dist/`.

### 3. Deploy via Azure Static Web Apps

**Option A — GitHub (recommended if you use the repo workflow)**

1. In Azure Portal, create **Static Web App** and connect your GitHub repo/branch.
2. Configure build settings to match this repo:
   - **App location:** `frontend`
   - **Output location:** `dist`
   - **API location:** leave empty unless you use Azure Functions in this repo (the .NET API is separate).
3. In the Static Web App → **Configuration** → **Application settings**, add:
   - Name: `VITE_API_URL`
   - Value: `https://<your-webapp-name>.azurewebsites.net/Books`
4. Save and trigger a new build (push a commit or **Run workflow** in GitHub).

**Option B — VS Code “Azure Static Web Apps” extension**

1. Install the **Azure Static Web Apps** extension.
2. Sign in to Azure, create or select a Static Web App.
3. When prompted for build details, use **app location** `frontend`, **output** `dist`.
4. Add **`VITE_API_URL`** in the Static Web App’s **Application settings** in Azure Portal so CI/build picks it up, then redeploy.

### 4. Client-side routing

`frontend/public/routes.json` sends all routes to `index.html`, which supports React Router on refresh/deep links.

### 5. Workflow note (this repository)

The file `.github/workflows/azure-static-web-apps-ashy-dune-0a93c6d0f.yml` sets `api_location: "api"`. This repo does **not** have a root `api` folder for Azure Functions. If GitHub Actions fails or warns about the API step, set **`api_location`** to **`""`** (empty) in that workflow for a frontend-only build.

---

## Verification checklist

1. Open `https://<your-webapp-name>.azurewebsites.net/Books/AllBooks?pageSize=5&pageNum=1` in a browser — you should get JSON.
2. Open your Static Web App URL → books list should load (no CORS errors in F12 → Console).
3. If books fail: check **Console** for CORS errors, confirm **`VITE_API_URL`** was set **before** the last frontend build, and confirm the **backend** deployment includes the latest CORS code.

---

## Order of operations (short)

1. Deploy **backend** → copy **`https://...azurewebsites.net/Books`**.
2. Set **`VITE_API_URL`** for the Static Web App build → deploy **frontend**.
3. If anything still breaks, redeploy **backend** after CORS changes and **rebuild frontend** after URL changes.
