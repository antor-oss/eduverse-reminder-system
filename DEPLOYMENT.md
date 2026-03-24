# 🚀 EduVerse Deployment Guide

## Quick Start (Vercel)

### Step 1: Connect Vercel to GitHub
1. Go to [vercel.com](https://vercel.com)
2. Click **"New Project"**
3. Select your GitHub repository: **eduverse-reminder-system**
4. Vercel will automatically detect it's a Next.js project

### Step 2: Add Environment Variables
In Vercel Dashboard:
1. Go to **Settings** → **Environment Variables**
2. Add Firebase configuration:

```
NEXT_PUBLIC_FIREBASE_API_KEY = AIzaSyDTgA19sz07lb2vfpgQ_1wwgecNc67xKq4
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN = eduverse-reminder-system.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID = eduverse-reminder-system
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET = eduverse-reminder-system.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = 290203926388
NEXT_PUBLIC_FIREBASE_APP_ID = 1:290203926388:web:13dc0576ce3af3bb857621
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID = G-SSC2QVZE8D
```

### Step 3: Deploy
- Click **Deploy**
- Vercel will automatically build and deploy

### Step 4: Custom Domain (Optional)
In Vercel Dashboard:
1. Go to **Settings** → **Domains**
2. Add your custom domain
3. Follow DNS setup instructions

---

## Local Deployment

### Development
```bash
npm install
npm run dev
# Open http://localhost:3000
```

### Production Build
```bash
npm install
npm run build
npm run start
```

---

## Firestore Rules (Security)

Set up these rules in Firestore console for security:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own profile
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
    
    // Homework rules
    match /homework/{homeworkId} {
      // Students can read homework for their department/semester
      allow read: if request.auth != null;
      // Only teachers can create/update homework
      allow create, update, delete: if request.auth.token.teacher == true;
    }
    
    // Notifications
    match /notifications/{notifId} {
      // Users can only read their own notifications
      allow read: if request.auth.uid == resource.data.userId;
      allow write: if request.auth != null;
    }
  }
}
```

---

## Troubleshooting

### Port Already in Use
```bash
# Kill node process
taskkill /PID <PID> /F
# Or
Get-Process node | Stop-Process -Force
```

### Clear Build Cache
```bash
rm -rf .next
npm run build
```

### Firebase Connection Issues
- Check `.env.local` has correct Firebase keys
- Verify Firebase project is active
- Check Firestore database exists

---

## System Features

✅ **Student Features:**
- Register with Department & Semester
- View all assignments for their class
- See upcoming exams (CT)
- Receive notifications

✅ **Teacher Features:**
- Register and create assignments
- Set deadlines for specific classes
- Create Class Tests (CT)
- Auto-notify students

✅ **Notification System:**
- In-app notifications
- Email notifications (when implemented)
- CT reminders (5 days before)
- Assignment notifications

---

## Next Steps

1. **Email Setup** - Connect SendGrid/Gmail for email notifications
2. **Student Submissions** - Add assignment submission feature
3. **Grading System** - Teachers can grade submissions
4. **Analytics** - Track attendance, grades, performance
5. **Mobile App** - React Native version

---

## Support

For issues or questions:
- Check GitHub: https://github.com/antor-oss/eduverse-reminder-system
- Review logs: `npm run build` for build errors
- Check Firebase console for data issues
