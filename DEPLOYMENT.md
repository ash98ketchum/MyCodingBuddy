# 🚀 Quick Deployment Guide for Render

## Option 1: Automatic Deployment (Recommended)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/your-username/codingbuddy-platform.git
   git push -u origin main
   ```

2. **Connect to Render**
   - Go to [render.com](https://render.com)
   - Click "New" → "Blueprint"
   - Connect your GitHub repository
   - Select `codingbuddy-platform`
   - Render will automatically read `render.yaml` and create all services

3. **Set Admin Password**
   - Go to Backend Service → Environment
   - Add `ADMIN_PASSWORD` with a strong password
   - Click "Save Changes"

4. **Initialize Database**
   - Go to Backend Service → Shell
   - Run: `npm run prisma:push`

5. **Access Your App**
   - Frontend: `https://codingbuddy-frontend.onrender.com`
   - Backend: `https://codingbuddy-backend.onrender.com`
   - Login with admin credentials

## Option 2: Manual Deployment

Follow the detailed steps in the main [README.md](README.md) under "Render Deployment" section.

## Important Notes

### Free Tier Limitations
- Services spin down after inactivity
- First request may take 30-60 seconds
- Limited to 750 hours/month per service

### Upgrading to Paid Plans
For production use, upgrade to:
- **Starter Plan** ($7/month per service)
- **Standard Plan** ($25/month per service)
- Better performance, no spin down, more resources

### Environment Variables Required

**Backend:**
- `DATABASE_URL` - Auto-set by Render
- `REDIS_URL` - Auto-set by Render
- `JWT_SECRET` - Auto-generated or set manually
- `ADMIN_PASSWORD` - **YOU MUST SET THIS**
- `FRONTEND_URL` - Your frontend URL

**Frontend:**
- `VITE_API_URL` - Your backend API URL

## Post-Deployment Checklist

- [ ] All services show "Live" status
- [ ] Database connection successful
- [ ] Redis connection successful
- [ ] Can access frontend URL
- [ ] Can register new user
- [ ] Can login as admin
- [ ] Can create problem (admin)
- [ ] Can submit code (user)
- [ ] Judge worker processing submissions

## Troubleshooting

### Service Failed to Start
- Check logs in Render dashboard
- Verify environment variables
- Check build command completed successfully

### Database Connection Error
- Verify DATABASE_URL is set correctly
- Check database service is running
- Run `npm run prisma:push` in backend shell

### Frontend Can't Reach Backend
- Verify VITE_API_URL is correct
- Check CORS settings in backend
- Ensure backend service is "Live"

### Code Execution Not Working
- Check worker service is running
- Verify REDIS_URL is set in worker
- Check worker logs for errors

## Support

If you encounter issues:
1. Check service logs in Render dashboard
2. Verify all environment variables
3. Check health endpoint: `https://your-backend.onrender.com/health`
4. Review [README.md](README.md) troubleshooting section

---

**Deployment Time:** ~10 minutes with automatic blueprint
**Cost:** Free tier available, $21+/month for production-ready setup
