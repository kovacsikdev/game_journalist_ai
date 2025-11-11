# Deployment Guide - Heroku with GitHub Actions

This guide explains how to deploy your Next.js Video Game Journalist AI app to Heroku using GitHub Actions for automatic deployments.

## Prerequisites

1. A [Heroku account](https://signup.heroku.com/)
2. A GitHub repository for this project
3. Your Gemini API key

## Setup Instructions

### 1. Create a Heroku App

```bash
# Install Heroku CLI if you haven't already
# Visit: https://devcenter.heroku.com/articles/heroku-cli

# Login to Heroku
heroku login

# Create a new Heroku app
heroku create your-app-name

# Note: Replace 'your-app-name' with your desired app name
# If you don't specify a name, Heroku will generate one for you
```

### 2. Set Environment Variables on Heroku

Your app needs the Gemini API key to function. Set it on Heroku:

```bash
# Set your Gemini API key
heroku config:set GEMINI_API_KEY=your-gemini-api-key-here --app your-app-name

# Verify it was set
heroku config --app your-app-name
```

### 3. Configure GitHub Secrets

You need to add three secrets to your GitHub repository:

1. Go to your GitHub repository
2. Click on **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret** and add the following:

#### Required Secrets:

- **HEROKU_API_KEY**
  - Get this from: `heroku auth:token` in your terminal
  - Or from your [Heroku Account Settings](https://dashboard.heroku.com/account)

- **HEROKU_APP_NAME**
  - The name of your Heroku app (e.g., `your-app-name`)

- **HEROKU_EMAIL**
  - The email address associated with your Heroku account

### 4. Deploy

Once you've set up the secrets, deployment is automatic:

1. Push your code to the `main` branch:
   ```bash
   git add .
   git commit -m "Setup Heroku deployment"
   git push origin main
   ```

2. GitHub Actions will automatically:
   - Build your Next.js app
   - Deploy it to Heroku
   - Set environment variables

3. Monitor the deployment in the **Actions** tab of your GitHub repository

### 5. Access Your App

Once deployed, your app will be available at:
```
https://your-app-name.herokuapp.com
```

## Manual Deployment (Alternative)

If you prefer to deploy manually without GitHub Actions:

```bash
# Add Heroku remote
heroku git:remote -a your-app-name

# Deploy
git push heroku main
```

## Troubleshooting

### Check Heroku Logs

```bash
heroku logs --tail --app your-app-name
```

### Verify Environment Variables

```bash
heroku config --app your-app-name
```

### Restart the App

```bash
heroku restart --app your-app-name
```

### Check Build Status

Visit the **Activity** tab in your Heroku dashboard to see build logs.

## Important Notes

- The app uses Next.js production mode on Heroku
- Make sure your `Procfile` contains: `web: npm start`
- The `heroku-postbuild` script in `package.json` automatically builds the app
- Environment variables must be set on Heroku for the app to work
- Free Heroku dynos sleep after 30 minutes of inactivity

## Files Added for Deployment

1. **Procfile** - Tells Heroku how to run your app
2. **.github/workflows/deploy.yml** - GitHub Actions workflow for automatic deployment
3. **DEPLOYMENT.md** - This documentation file

## Updating the App

To update your deployed app:

1. Make your changes locally
2. Commit and push to the `main` branch
3. GitHub Actions will automatically deploy the updates

```bash
git add .
git commit -m "Your update message"
git push origin main
```

## Cost

- Heroku offers a free tier (Eco dynos)
- For production apps, consider upgrading to paid dynos for better performance
- Check [Heroku pricing](https://www.heroku.com/pricing) for details
