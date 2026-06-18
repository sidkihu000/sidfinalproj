# 📖 User Guide - BotHost Platform

## Table of Contents
1. [Getting Started](#getting-started)
2. [Dashboard](#dashboard)
3. [File Management](#file-management)
4. [Admin Panel](#admin-panel)
5. [Settings](#settings)
6. [FAQs](#faqs)

---

## Getting Started

### Login
1. Open the application in your browser
2. Enter your credentials (Admin ID and password)
3. Click "Login"
4. You'll be redirected to the Dashboard

### User Roles
- **Owner**: Full access to all features
- **Admin**: Can manage files, users, and subscriptions
- **User**: Can upload and manage their own bots

---

## Dashboard

### Overview
The Dashboard provides a real-time overview of your entire hosting infrastructure.

### Statistics Cards
Each card displays key metrics:

**Total Users**
- Total number of registered users on the platform
- Updated in real-time as users join/leave

**Active Files**
- Number of bot scripts currently stored
- Includes Python and JavaScript files

**Running Bots**
- Number of actively executing bot instances
- Shows system load at a glance

**System Uptime**
- Platform availability percentage
- Typically 99.8% or higher

**CPU Usage**
- Current processor utilization
- Animated bar shows real-time changes

**Memory Usage**
- RAM consumption percentage
- Green to red gradient indicates usage level

### System Activity Section
Visual representation of platform usage:
- **Bot Executions** - How many bots ran successfully
- **File Uploads** - New files uploaded in the period
- **Admin Commands** - Administrative actions performed

### Recent Activity Log
Real-time log of important events:
- ✅ Bot startup completed
- ✅ File malware scan passed
- ℹ️ Admin actions
- ℹ️ User subscriptions

**Color Indicators:**
- 🟢 Green (Success) - Positive events
- 🔵 Blue (Info) - General information
- 🟡 Yellow (Warning) - Attention needed
- 🔴 Red (Error) - Issues/problems

---

## File Management

### Uploading Files

**Supported Formats:**
- `.py` - Python scripts
- `.js` - JavaScript/Node.js scripts
- `.zip` - Compressed archives

**Upload Process:**
1. Click "📤 Upload File" button
2. Select file from your computer
3. Watch the progress bar
4. File automatically scans for malware
5. Confirmed when "File uploaded successfully!" appears

**Upload Progress:**
- Real-time progress bar shows upload percentage
- Upload speed displayed during transfer
- Auto-saves to user's dedicated folder

### File List

Each file entry displays:

**File Information:**
- 📄 File name and type emoji (🐍 for Python, 📜 for JavaScript)
- 📦 File size
- 📅 Creation date
- ⚙️ Number of executions

**Status Badge:**
- 🟢 **Running** - Bot is currently executing
- 🔴 **Stopped** - Bot is inactive

### File Controls

**Visible on Hover:**

| Button | Function |
|--------|----------|
| 🟢/⏸️ | Start/Stop bot |
| 🔄 | Restart bot (stops and restarts) |
| 🗑️ | Delete file permanently |

### Searching Files
1. Click search bar at top of file list
2. Type filename, owner, or date
3. Results update in real-time
4. Click 'X' to clear search

### File Execution Limits

| User Type | Limit |
|-----------|-------|
| Free User | 10 files |
| Premium (Subscribed) | 15 files |
| Admin | 999 files |
| Owner | Unlimited |

---

## Admin Panel

### Admin Management

**View Current Admins:**
1. Navigate to Admin Panel
2. See list of all current admins
3. Each entry shows:
   - Username
   - Role (Owner/Admin)
   - User ID
   - Join date

**Add New Admin:**
1. Click "➕ Add New Admin"
2. Enter user ID
3. Click confirm
4. User receives promotion notification

**Remove Admin:**
1. Find admin in list
2. Click red 'X' button
3. Confirm removal
4. User notified of demotion

### Subscription Management

**View Active Subscriptions:**
1. Scroll to Subscription Management section
2. See all active user subscriptions
3. Each entry shows:
   - User ID
   - Plan type (Premium, Standard, etc.)
   - Expiry date
   - Status (Active/Expired)

**Add Subscription:**
1. Click "➕ Add Subscription"
2. Enter user ID
3. Select plan duration (days)
4. Click confirm
5. User instantly gains premium benefits

**Remove Subscription:**
1. Find user subscription
2. Click delete button
3. User loses premium benefits immediately

**Renew Subscription:**
1. Add new subscription for existing user
2. System automatically extends expiry date
3. No duplicate charges

### Broadcasting Messages

**Send to All Users:**
1. Scroll to Broadcast Message section
2. Click text area
3. Type your message
4. Message can include:
   - Plain text announcements
   - Update information
   - Maintenance notices
   - Important links

**Broadcasting Features:**
- ✅ Message goes to all active users
- 📱 Delivered instantly
- 📝 No character limit
- 🔍 Messages logged in activity

**Best Practices:**
- Keep messages concise
- Use clear, professional language
- Avoid excessive broadcasting
- Schedule for off-peak hours

### Bot Control

**Run All Scripts:**
1. Click "🟢 Run All User Scripts"
2. System processes all files for all users
3. Only non-running scripts are started
4. Detailed report shows:
   - Scripts successfully started
   - Users processed
   - Skipped/errored files

**Lock Bot:**
1. Click "🔒 Lock Bot"
2. No users can execute bots
3. Admin actions still work
4. Useful during maintenance

**Unlock Bot:**
1. Click "🔓 Unlock Bot"
2. Normal operations resume
3. Users can execute bots again

---

## Settings

### Bot Control Options

Three main buttons for system-wide control:

**🟢 Run All Scripts**
- Executes all stored bot scripts
- Useful for batch operations
- Each file runs in isolated process

**🔒 Lock Bot**
- Pauses all user bot executions
- Admin operations continue
- Good for system maintenance

**🔓 Unlock Bot**
- Resumes normal operations
- All users regain bot execution ability

### Configuration

**API Token**
- Your secure authentication token
- Never share this publicly
- Click "Copy" to copy to clipboard
- Change regularly for security

**Webhook URL**
- External endpoint receiving bot events
- Format: `https://your-domain.com/webhook`
- Used for integrations and notifications

**Database URL**
- Connection string for data storage
- Format: `postgresql://user:pass@host:port/db`
- Contains sensitive credentials
- Keep secured

### Token Management

**Regenerate Token:**
1. Go to Settings
2. Find API Token section
3. Click "Regenerate"
4. Old token becomes invalid
5. Update integrations with new token

**Security Tips:**
- Regenerate if suspected leak
- Use environment variables (don't hardcode)
- Rotate tokens regularly
- Monitor token usage

---

## Real-time Features

### Live Updates
The dashboard updates automatically:
- **Every 30 seconds** - Stats and file list refresh
- **Instant** - Admin actions apply immediately
- **Real-time** - Status changes show as they occur

### Notifications

**Toast Notifications** (bottom-right corner)

| Type | Message | Duration |
|------|---------|----------|
| ✅ Success | "File uploaded successfully!" | 4 seconds |
| ℹ️ Info | "Bot started" | 4 seconds |
| ⚠️ Warning | "High CPU usage detected" | 6 seconds |
| ❌ Error | "Upload failed" | 6 seconds |

**Notification Bell:**
- Located in top-right corner
- Red dot appears for unread notifications
- Click to view notification history

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+K` | Focus search bar |
| `Escape` | Close modals/dialogs |
| `Ctrl+U` | Upload file |
| `Ctrl+D` | Go to Dashboard |
| `Ctrl+F` | Go to File Manager |
| `Ctrl+A` | Go to Admin Panel |
| `Ctrl+S` | Go to Settings |

---

## FAQs

### General

**Q: What file formats are supported?**
A: Python (.py), JavaScript (.js), and ZIP archives (.zip). ZIP files are auto-extracted.

**Q: How large can uploaded files be?**
A: Up to 50MB per file. Larger files can be split across multiple uploads.

**Q: Can I download my bot logs?**
A: Yes, go to File Manager, click file, then "📜 View Logs" to see or download.

### File Management

**Q: What happens if malware is detected in my file?**
A: The upload is blocked. File must be scanned and approved before upload succeeds.

**Q: Can I edit a file after uploading?**
A: No, but you can delete and re-upload an edited version.

**Q: How many files can I have?**
A: Depends on your account tier. Free: 10, Premium: 15, Admin: 999, Owner: Unlimited.

### Admin Features

**Q: What's the difference between Admin and Owner?**
A: Owner has ultimate control and cannot be demoted. Admins can be removed by Owner.

**Q: Can I give myself a subscription discount?**
A: Subscriptions work the same for everyone. Use the same duration/plan for all users.

**Q: What if I need to undo a broadcast message?**
A: Messages cannot be recalled, but you can send a follow-up correction message.

### Subscriptions

**Q: How does subscription renewal work?**
A: Add a new subscription for the same user. System extends the existing expiry date.

**Q: Can users downgrade their subscription?**
A: Remove their subscription through Admin Panel. They revert to free tier.

**Q: What happens when a subscription expires?**
A: File limit reverts to free tier (10 files). Existing files aren't deleted, just can't add new ones.

### Troubleshooting

**Q: My file won't start. What's wrong?**
A: Check:
1. File is properly formatted (valid Python or JavaScript)
2. No syntax errors in code
3. Required dependencies are installed
4. File has proper permissions

**Q: Upload keeps failing. Why?**
A: Possible causes:
1. File too large (>50MB)
2. File contains malware signatures
3. Network connection unstable
4. File upload limit reached for your tier

**Q: Settings not saving. What do I do?**
A: Try:
1. Clear browser cache (Ctrl+Shift+Delete)
2. Disable browser extensions
3. Try a different browser
4. Contact support

**Q: Dashboard loading slowly?**
A: Optimize by:
1. Reducing number of file cards displayed
2. Clearing old activity logs
3. Checking system CPU/Memory usage
4. Trying in incognito mode

### Getting Help

**Need Support?**
1. Check this guide first
2. Review the README.md for technical details
3. Open an issue on GitHub
4. Contact admin with:
   - Description of problem
   - Screenshots
   - Steps to reproduce
   - Your user ID

---

## Best Practices

### Security
- ✅ Use strong, unique passwords
- ✅ Regenerate API tokens regularly
- ✅ Don't share your user ID publicly
- ✅ Keep your admin account secure
- ❌ Never hardcode tokens in files
- ❌ Don't click suspicious links in broadcasts

### Performance
- ✅ Delete unused files to free space
- ✅ Monitor CPU and memory usage
- ✅ Use efficient code in your bots
- ✅ Schedule heavy operations during off-peak
- ❌ Don't run unnecessary bots simultaneously
- ❌ Avoid uploading duplicate files

### Maintenance
- ✅ Regular backups of important files
- ✅ Monitor activity logs for issues
- ✅ Keep dependencies updated
- ✅ Test bots before production
- ❌ Don't modify running bot files
- ❌ Avoid abrupt bot restarts

---

## Keyboard Navigation

You can navigate the entire interface using only your keyboard:

1. **Tab** - Move between elements
2. **Shift+Tab** - Move backward
3. **Enter** - Activate button/link
4. **Space** - Toggle checkbox
5. **Arrow Keys** - Navigate lists
6. **Escape** - Close modals

---

## Accessibility Features

- 🔊 Screen reader compatible
- 🎨 High contrast mode support
- ⌨️ Full keyboard navigation
- 📱 Mobile responsive design
- ✨ Smooth animations (can be disabled)
- 🎯 Clear focus indicators

---

**Last Updated:** 2024
**Version:** 2.0.0

For the latest updates, visit the [GitHub Repository](https://github.com/youruser/bot-hosting-platform)
