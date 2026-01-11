# NextGen - Youth Civic Engagement Platform 🇳🇬

> A simple, modern website for managing conferences and empowering young Nigerians through civic participation.

![NextGen Logo](public/nextgen-logo.png)

---

## What is NextGen?

NextGen is a website that helps organizations:
- **Create and manage conferences** with online registration
- **Track attendance** using QR codes
- **Manage referral codes** to track who brings attendees
- **Export data** for reports and analysis

Perfect for civic organizations, youth groups, and community leaders!

---

## 🚀 Quick Start (For Beginners)

### Step 1: Install Node.js

First, you need Node.js installed on your computer.

1. Go to [nodejs.org](https://nodejs.org)
2. Download the **LTS version** (recommended for most users)
3. Run the installer and follow the prompts
4. To verify installation, open Command Prompt (Windows) or Terminal (Mac/Linux) and type:
   ```bash
   node --version
   ```
   You should see a version number like `v18.0.0` or higher

### Step 2: Download the Project

**Option A: Using Git (Recommended)**
```bash
git clone https://github.com/ejoeltech/nxtg.git
cd nxtg
```

**Option B: Download ZIP**
1. Go to https://github.com/ejoeltech/nxtg
2. Click the green "Code" button
3. Click "Download ZIP"
4. Extract the ZIP file
5. Open Command Prompt/Terminal in the extracted folder

### Step 3: Install Dependencies

In your Command Prompt/Terminal, type:
```bash
npm install
```

This will download all the required packages. It may take a few minutes.

### Step 4: Set Up Admin Password

Before you can use the admin panel, you need to create a password:

1. **Generate password hash:**
   ```bash
   node scripts/hash-password.js
   ```

2. **Enter your desired password** when prompted (minimum 8 characters)

3. **Copy the output** - you'll see something like:
   ```
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD_HASH=<long string of characters>
   JWT_SECRET=<another long string>
   ```

4. **Create a file named `.env.local`** in the project folder

5. **Paste the copied text** into `.env.local` and save

### Step 5: Start the Website

```bash
npm run dev
```

You should see:
```
✓ Ready in 2.5s
○ Local: http://localhost:3000
```

### Step 6: Open in Browser

Open your web browser and go to:
```
http://localhost:3000
```

🎉 **You're done!** The website is now running on your computer.

---

## 📖 How to Use

### For Visitors (Public Pages)

- **Homepage**: `http://localhost:3000`
- **View Conferences**: `http://localhost:3000/conferences`
- **Register for Conference**: Click "View Details" on any conference

### For Administrators

1. **Login**: Go to `http://localhost:3000/admin`
2. **Username**: `admin`
3. **Password**: The password you created in Step 4

**Admin Features:**
- 📊 **Dashboard**: Overview of your system
- 🎤 **Conferences**: Create and manage conferences
- 📋 **Registrations**: View who registered and mark attendance
- 🎫 **Referral Codes**: Manage referral codes
- 👥 **Users**: Create additional admin users (different permission levels)
- ⚙️ **Settings**: Change your password

---

## 🎯 Common Tasks

### Creating Your First Conference

1. Login to admin panel
2. Click "Conferences" in sidebar
3. Click "+ Create New Conference"
4. Fill in the form:
   - **Conference ID**: Short name (e.g., "lagos-summit")
   - **Title**: Full name (e.g., "Lagos Youth Summit 2026")
   - **Date**: When it happens
   - **Venue**: Where it happens
   - **Description**: What it's about
   - **Flier**: Upload a poster image
   - **Advertise on Homepage**: Check this to show on homepage
5. Click "Create Conference"

### Viewing Registrations

1. Login to admin panel
2. Click "Registrations" in sidebar
3. Use the dropdown to filter by conference
4. Click "Export to CSV" to download data

### Creating Referral Codes

1. Login to admin panel
2. Click "Referral Codes" in sidebar
3. Click "+ Create New Code"
4. Enter:
   - **Code**: 5 characters (e.g., "ABC12")
   - **Owner Name**: Who will use this code
   - **Owner Phone**: Contact number
5. Click "Create Code"
6. Share the code with the owner

### Adding More Admins

1. Login to admin panel
2. Click "Users" in sidebar
3. Click "+ Create New User"
4. Choose a role:
   - **Super Admin**: Full access (can create users)
   - **Admin**: Manage conferences and registrations
   - **Moderator**: Only manage registrations
   - **Viewer**: Read-only access
5. Click "Create User"

---

## 🛠️ Troubleshooting

### "Command not found: npm"
- Node.js is not installed. Go back to Step 1.

### "Port 3000 is already in use"
- Another program is using port 3000
- Close other programs or use a different port:
  ```bash
  npm run dev -- -p 3001
  ```
- Then open `http://localhost:3001`

### "Cannot find module"
- Run `npm install` again

### "Invalid username or password"
- Make sure `.env.local` file exists
- Check that you copied the hash correctly
- Restart the server after creating `.env.local`

### Website looks broken
- Clear your browser cache (Ctrl+Shift+Delete)
- Try a different browser
- Make sure `npm run dev` is running

---

## 📁 Project Structure (For Developers)

```
nextgen/
├── app/                    # Website pages
│   ├── admin/             # Admin panel pages
│   ├── api/               # Backend APIs
│   └── page.tsx           # Homepage
├── components/            # Reusable UI components
├── data/                  # Data storage (JSON files)
│   ├── conferences.json   # Conference data
│   ├── attendance.json    # Registration data
│   ├── referral-codes.json # Referral codes
│   └── users.json         # Admin users
├── public/                # Images and static files
├── scripts/               # Utility scripts
│   ├── hash-password.js   # Generate password hash
│   └── reset-data.js      # Clear all data
└── .env.local            # Your passwords (DO NOT SHARE!)
```

---

## 🔒 Security Notes

⚠️ **IMPORTANT:**
- Never share your `.env.local` file
- Never commit `.env.local` to Git
- Use strong passwords (at least 12 characters)
- Change default passwords in production
- Backup your `data/` folder regularly

---

## 🆘 Getting Help

**Need help?**
- 📧 Email: support@nextgen.ng
- 🐛 Report bugs: https://github.com/ejoeltech/nxtg/issues
- 📖 Full documentation: [MANUAL.md](./MANUAL.md)
- 🔐 Authentication guide: [AUTHENTICATION_SETUP.md](./AUTHENTICATION_SETUP.md)

---

## 🚀 Deploying to Production

Ready to put your website online? See our deployment guides:

- **Vercel** (Recommended): [Deploy to Vercel](https://vercel.com/new)
- **Netlify**: [Deploy to Netlify](https://app.netlify.com/start)

Remember to:
1. Set environment variables in your hosting platform
2. Use a strong password for production
3. Set up a custom domain
4. Enable HTTPS (usually automatic)

---

## 📝 License

MIT License - Feel free to use this for your organization!

---

## 🙏 Credits

Built with:
- [Next.js](https://nextjs.org) - React framework
- [TypeScript](https://www.typescriptlang.org) - Type safety
- [QRCode](https://www.npmjs.com/package/qrcode) - QR code generation

---

**NextGen** - Empowering the Next Generation of Nigerian Leaders 🇳🇬
