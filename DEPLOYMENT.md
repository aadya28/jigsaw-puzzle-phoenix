# Phoenix App Deployment Guide

This guide walks through deploying a Phoenix application to Render, including local production testing. It covers both the preparation steps and the actual deployment process.

## Prerequisites

- A Phoenix app that runs successfully in development (`mix phx.server`)
- Basic understanding of Phoenix configuration files
- Git repository (GitHub, GitLab, or Bitbucket)
- Render account

## Understanding Environments

Think of environments as different "modes" your app runs in:

### Development Environment
- Runs on your local machine for building and testing features
- **Characteristics:**
  - Shows detailed error messages for debugging
  - Auto-reloads when you change code
  - Uses local development database
  - Prioritizes helpful debugging over performance

*Refer to README.md for development environment setup.*

### Production Environment
- Runs on the server (like Render) to serve real users
- **Characteristics:**
  - Hides error details for security
  - Optimized for speed and performance
  - Uses production database
  - Serves cached and compressed assets

---

## Part 1: Local Production Testing

Testing your app locally in production mode helps catch issues before deployment.

### Step 1: Configure Runtime Settings

Modify `config/runtime.exs` to handle production deployment:

### 1. Make Database Configuration Optional

This prevents crashes when testing without a database:

**Before (mandatory database):**

```elixir
database_url =
  System.get_env("DATABASE_URL") ||
    raise """
    environment variable DATABASE_URL is missing.
    For example: ecto://USER:PASS@HOST/DATABASE
    """

```

**After (optional database):**

```elixir
# Database config (optional for testing)
if database_url = System.get_env("DATABASE_URL") do
  maybe_ipv6 = if System.get_env("ECTO_IPV6") in ~w(true 1), do: [:inet6], else: []

  config :your_app, YourApp.Repo,
    # ssl: true,
    url: database_url,
    pool_size: String.to_integer(System.get_env("POOL_SIZE") || "10"),
    socket_options: maybe_ipv6
end

```

### 2. Add Multi-Platform Host Configuration

Support different deployment platforms:

```elixir
host = System.get_env("RENDER_EXTERNAL_HOSTNAME") ||
       System.get_env("PHX_HOST") ||
       "example.com"

```

- `RENDER_EXTERNAL_HOSTNAME`: Automatically set by Render
- `PHX_HOST`: For manual configuration
- `"example.com"`: Default fallback

### 3. Complete Production Configuration Block

Your full `runtime.exs` should look like this:

```elixir
import Config

if System.get_env("PHX_SERVER") do
  config :your_app, YourAppWeb.Endpoint, server: true
end

if config_env() == :prod do
  # Database config (optional for testing)
  if database_url = System.get_env("DATABASE_URL") do
    maybe_ipv6 = if System.get_env("ECTO_IPV6") in ~w(true 1), do: [:inet6], else: []

    config :your_app, YourApp.Repo,
      url: database_url,
      pool_size: String.to_integer(System.get_env("POOL_SIZE") || "10"),
      socket_options: maybe_ipv6
  end

  # Required secret key
  secret_key_base =
    System.get_env("SECRET_KEY_BASE") ||
      raise """
      environment variable SECRET_KEY_BASE is missing.
      You can generate one by calling: mix phx.gen.secret
      """

  # Host detection for multiple platforms
  host = System.get_env("RENDER_EXTERNAL_HOSTNAME") ||
         System.get_env("PHX_HOST") ||
         "example.com"

  port = String.to_integer(System.get_env("PORT") || "4000")

  # Complete endpoint configuration
  config :your_app, YourAppWeb.Endpoint,
    url: [host: host, port: 443, scheme: "https"],
    http: [
      ip: {0, 0, 0, 0, 0, 0, 0, 0},
      port: port
    ],
    secret_key_base: secret_key_base,
    cache_static_manifest: "priv/static/cache_manifest.json",
    check_origin: [
      "https://#{host}",
      "//#{host}"
    ]
end

```

This structure ensures all production configuration is properly contained and includes security measures like origin checking.

### Step 2: Fix Hardcoded URLs

Replace hardcoded development URLs in JavaScript files:

**Before:**
```javascript
const targetUrl = `http://127.0.0.1:4000/api/endpoint`;
```

**After:**
```javascript
const targetUrl = `${window.location.origin}/api/endpoint`;
```

This ensures your app works in any environment (local dev, local prod, deployed).

### Step 3: Build and Run Locally in Production Mode

Execute these commands in order:

#### 1. Install Production Dependencies
```bash
mix deps.get --only prod
```
Downloads only production-needed dependencies, excluding development tools.

#### 2. Compile for Production
```bash
MIX_ENV=prod mix compile
```
Compiles Elixir code with production optimizations.

#### 3. Build and Deploy Assets
```bash
MIX_ENV=prod mix assets.deploy
```
- Compiles and minifies JavaScript/CSS
- Creates optimized asset bundles
- Generates `cache_manifest.json` for asset fingerprinting

#### 4. Run Database Migrations (Optional)
```bash
MIX_ENV=prod mix ecto.migrate
```
Only needed if using a database.

#### 5. Start Production Server

**Basic command:**
```bash
SECRET_KEY_BASE=$(mix phx.gen.secret) PORT=4001 MIX_ENV=prod mix phx.server
```

**Full command with all variables:**
```bash
SECRET_KEY_BASE=$(mix phx.gen.secret) PHX_HOST=localhost PHX_SCHEME=http PORT=4001 MIX_ENV=prod mix phx.server
```

- Uses port 4001 (avoiding conflict with dev server on 4000)
- Generates a secure secret key
- Sets production environment variables
- This full command is used in local production environment to give env variables to runtime.ex but it is not necessary since our code has fallbacks

<details> 
<summary><strong>Understanding <code>SECRET_KEY_BASE</code></strong></summary>
&nbsp;

The secret key is critical for security:

**What it does:**
- Signs cookies (prevents tampering)
- Encrypts session data
- Provides CSRF protection
- Handles cryptographic operations

**Security importance:**
- Generate with `mix phx.gen.secret` (creates 64+ character secure key)
- Store as environment variable
- Never commit to version control
- Change it if compromised

**Why not use a simple string?** A weak secret makes your app vulnerable to:
- Cookie forgery
- User impersonation  
- Session hijacking
- CSRF attacks

</details>

### Step 4: Testing Your Local Production Build

1. Visit `http://localhost:4001`
2. Check browser console for JavaScript errors
3. Test all functionality
4. Verify assets load properly (check Network tab in dev tools)

---

## Part 2: Deploying to Render

### Step 1: Create a New Web Service

1. Go to your Render dashboard
2. Click **"New +"** → **"Web Service"**
3. Connect your Git repository
4. Select your Phoenix app repository

### Step 2: Configure Service Settings

**Basic Configuration:**
- **Name**: Choose a descriptive name (e.g., "my-phoenix-app")
- **Environment**: Select "Elixir"
- **Region**: Choose closest to your users
- **Branch**: Usually "main" or "master"

Here’s your snippet cleaned up and formatted properly in Markdown:

### Step 3: Choose Your Deployment Method

<details>
<summary><strong>Deploy Without Releases</strong></summary>

&nbsp;

**Build Command:**
```
mix deps.get --only prod && mix compile && mix assets.deploy
```

**Start Command:**
```
mix phx.server
```

</details>

<details>
<summary><strong>Deploy With Releases</strong></summary>

&nbsp;

Prerequisites: Add release configuration to your `mix.exs`

```
def project do
  [
    # ... other config
    deps: deps(),
    releases: [
      jigsaw: [
        include_executables_for: [:unix],
        steps: [:assemble, :tar]
      ]
    ]
  ]
end
```

**Build Command:**
```
mix deps.get --only prod && mix assets.deploy && mix release
```

**Start Command:**
```
_build/prod/rel/jigsaw/bin/jigsaw start
```
</details>

### Step 4: Configure Environment Variables

Click "Advanced" and add these environment variables:

**Required Variables:**
```bash
SECRET_KEY_BASE=your_generated_secret_here
PHX_HOST=your-app-name.onrender.com
MIX_ENV=prod
PORT=10000
```

**Optional Variables:**
```bash
DATABASE_URL=your_database_url_here  # Only if using a database
POOL_SIZE=10                         # Database connection pool size
```

**To generate SECRET_KEY_BASE:**
```bash
mix phx.gen.secret
```
Copy the output and use it as your SECRET_KEY_BASE value.

### Step 5: Deploy

Click **"Create Web Service"**. Render will:
1. Clone your repository
2. Run the build command
3. Start your application
4. Provide you with a URL

---

## Troubleshooting Common Issues

**"DATABASE_URL is missing" Error**

**Cause:** Database configuration is mandatory but no database is configured  
**Solution:** Make database config optional (see Step 1.1 above)

**"SECRET_KEY_BASE is missing" Error**  
**Cause:** Production requires a secret key for security  
**Solution:** Set SECRET_KEY_BASE environment variable with generated key

**Assets Not Loading (404 errors)**

**Cause:** Assets weren't built or fingerprinted correctly  
**Solutions:**
- Run `MIX_ENV=prod mix assets.deploy` again
- Check that `cache_static_manifest: "priv/static/cache_manifest.json"` is in your endpoint config
- Verify assets directory exists in `priv/static/`

**"Port Already in Use" Error**

**Cause:** Another process is using the specified port  
**Solution:** Use a different port: `PORT=4002 MIX_ENV=prod mix phx.server`

**JavaScript/CSS Not Working**

**Cause:** Hardcoded URLs or missing asset compilation  
**Solutions:**
- Replace hardcoded URLs with `window.location.origin`
- Ensure `mix assets.deploy` ran successfully
- Check browser console for specific errors

---

## Deployment Checklist

**Before deploying:**
- [ ] App runs successfully in development
- [ ] Tested locally in production mode
- [ ] All hardcoded URLs replaced with dynamic ones
- [ ] Database configuration made optional (if applicable)
- [ ] Secret key generated and ready
- [ ] Git repository is up to date

**During deployment:**
- [ ] Correct build and start commands set
- [ ] All environment variables configured
- [ ] Proper host name set in PHX_HOST

**After deployment:**
- [ ] App loads without errors
- [ ] All features work as expected
- [ ] Check Render logs for any warnings
- [ ] Test from different devices/networks

---

## References

- [The 12-Factor App](https://12factor.net/) - This explains the principles behind modern app deployment. It's not Phoenix-specific.
- [Phoenix Deployment Guide](https://hexdocs.pm/phoenix/deployment.html)
- [Render Phoenix Documentation](https://render.com/docs/deploy-phoenix)
- [Phoenix Configuration Guide](https://hexdocs.pm/phoenix/config.html)
