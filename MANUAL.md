# NextGen Platform - User Manual

## Table of Contents
1. [Introduction](#introduction)
2. [Public Features](#public-features)
3. [Admin Features](#admin-features)
4. [Troubleshooting](#troubleshooting)

---

## Introduction

NextGen is a civic engagement platform designed to empower young Nigerians through conference management, registration, and community participation.

### Key Capabilities
- Browse and register for conferences
- Track attendance with QR codes
- Manage referral codes
- Export registration data
- Feature conferences on homepage

---

## Public Features

### 1. Browsing Conferences

**Access**: Navigate to `/conferences`

View all conferences categorized as:
- **Current**: Happening today
- **Upcoming**: Future conferences
- **Past**: Completed conferences

Each conference card shows:
- Conference title
- Date and venue
- Description
- Flier thumbnail (if available)
- "View Details" button

### 2. Conference Registration

**Access**: Click "View Details" on any conference or navigate to `/conference/[id]`

**Registration Form Fields:**
- Full Name (required)
- Email Address (required)
- Phone Number (required)
- Voter Registration Status (required)
- Referral Code (optional)

**Steps:**
1. Fill in all required fields
2. Optionally enter a referral code if you have one
3. Click "Register Now"
4. Receive confirmation message

**Note**: Referral codes are 5-character codes (e.g., NGN01) provided by NextGen representatives.

---

## Admin Features

### Accessing Admin Panel

**URL**: `/admin`

**Navigation Menu:**
- Dashboard
- Pages
- Conferences
- Registrations
- Referral Codes (new)

---

### 1. Conference Management

**Access**: `/admin/conferences`

#### Viewing Conferences
- See all conferences in a grid layout
- Each card shows title, date, venue, and QR code thumbnail
- Filter and search capabilities

#### Creating a Conference

**Steps:**
1. Click "+ Create New Conference"
2. Fill in the form:
   - **Conference ID**: Unique identifier (lowercase, no spaces)
   - **Title**: Full conference name
   - **Date**: Conference date (e.g., "January 22, 2026")
   - **Venue**: Location
   - **Description**: Detailed information
   - **Flier**: Upload conference poster/flier image
   - **Advertise on Homepage**: Check to feature on homepage
3. Click "Create Conference"

**Result**: 
- Conference is created
- QR code is automatically generated
- Flier is uploaded to `/public/conference-fliers/`

#### Editing a Conference

**Steps:**
1. Click "Edit" on any conference card
2. Modify fields as needed
3. Upload new flier (optional)
4. Toggle "Advertise on Homepage" checkbox
5. Click "Update Conference"

#### Deleting a Conference

**Steps:**
1. Click "Delete" on conference card
2. Confirm deletion
3. Conference and associated data are removed

#### Homepage Advertising

When "Advertise on Homepage" is checked:
- Conference appears in homepage hero section
- Shows flier, title, date, venue, description
- Includes "Register Now" button
- Replaces default hero content

---

### 2. Registration Management

**Access**: `/admin/registrations`

#### Viewing Registrations

**Filter Options:**
- All Conferences
- Specific conference (dropdown)

**Table Columns:**
- Name
- Email
- Phone
- Conference
- Registered (timestamp)
- Attended (status)
- Actions

#### Managing Attendance

**Mark Present:**
1. Click "Mark Present" button
2. Attendance timestamp is recorded
3. Status changes to "Attended"

**Mark Absent:**
1. Click "Mark Absent" on attended registration
2. Attendance is cleared
3. Status changes to "Not attended"

#### Deleting Registrations

**Steps:**
1. Click "Delete" button next to registration
2. Confirm deletion in dialog
3. Registration is permanently removed

**Use Cases:**
- Remove duplicate registrations
- Delete test entries
- Clean up invalid data

#### Exporting Data

**Steps:**
1. Optionally filter by conference
2. Click "📥 Export to CSV"
3. CSV file downloads with all visible registrations

**CSV Includes:**
- Name, Email, Phone
- Conference ID
- Registration timestamp
- Attendance status
- Referral code (if provided)
- Voter registration status

---

### 3. Referral Code Management

**Access**: `/admin/referral-codes`

#### Viewing Referral Codes

**Features:**
- Table view of all codes
- Search by code, name, or phone
- 50 pre-populated codes (NGN01-NGN50)

**Table Columns:**
- Code (5 characters)
- Owner Name
- Owner Phone
- Created Date
- Actions

#### Creating a Referral Code

**Steps:**
1. Click "+ Create New Code"
2. Fill in the form:
   - **Code**: 5 uppercase alphanumeric characters (e.g., NGN99)
   - **Owner Name**: Person responsible for the code
   - **Owner Phone**: Contact number
3. Click "Create Code"

**Validation:**
- Code must be exactly 5 characters
- Code must be unique
- All fields are required

#### Editing a Referral Code

**Steps:**
1. Click "Edit" on any code
2. Update owner name or phone
3. Click "Update Code"

**Note**: The code itself cannot be changed after creation.

#### Deleting a Referral Code

**Steps:**
1. Click "Delete" on any code
2. Confirm deletion
3. Code is removed from system

**Important**: Deleting a code doesn't affect existing registrations that used it.

#### Using Referral Codes

**Purpose:**
- Track registration sources
- Measure outreach effectiveness
- Incentivize community organizers

**How It Works:**
1. Admin creates code and assigns to organizer
2. Organizer shares code with community
3. Attendees enter code during registration
4. System validates code exists
5. Code is stored with registration record

---

## Troubleshooting

### Common Issues

#### Registration Not Submitting
- **Check**: All required fields are filled
- **Check**: Email format is valid
- **Check**: Referral code is valid (if provided)
- **Solution**: Clear form and try again

#### Flier Not Uploading
- **Check**: File is an image (JPG, PNG)
- **Check**: File size is reasonable (<5MB recommended)
- **Solution**: Resize image and try again

#### QR Code Not Generating
- **Check**: Conference ID is unique
- **Check**: All required fields are filled
- **Solution**: Try creating with different ID

#### Homepage Not Showing Conference
- **Check**: "Advertise on Homepage" is checked
- **Check**: Conference has a flier uploaded
- **Solution**: Edit conference and verify settings

#### Referral Code Invalid
- **Check**: Code is exactly 5 characters
- **Check**: Code exists in referral codes list
- **Check**: Code is uppercase
- **Solution**: Verify code with admin

### Data Backup

**Important Files:**
- `/data/attendance.json` - All registrations
- `/data/conferences.json` - Conference data
- `/data/referral-codes.json` - Referral codes
- `/public/conference-fliers/` - Uploaded images

**Recommendation**: Backup these files regularly, especially before major updates.

---

## Best Practices

### For Administrators

1. **Conference Creation**
   - Use descriptive, unique IDs
   - Upload high-quality fliers
   - Write clear, engaging descriptions
   - Test registration before promoting

2. **Referral Code Management**
   - Assign codes to specific organizers
   - Track which codes are most effective
   - Create new codes as needed
   - Keep owner information updated

3. **Registration Management**
   - Review registrations regularly
   - Export data for backup
   - Mark attendance promptly
   - Remove duplicates/test entries

4. **Data Management**
   - Export CSV files regularly
   - Backup JSON data files
   - Monitor storage space for fliers
   - Clean up old conference data

### For Conference Organizers

1. **Promoting Conferences**
   - Share direct conference links
   - Display QR codes at venues
   - Promote referral codes
   - Encourage early registration

2. **Using Referral Codes**
   - Share your code with community
   - Explain benefits of registration
   - Track your referrals
   - Report issues to admin

---

## Support

For technical support or questions:
- **Email**: support@nextgen.ng
- **GitHub Issues**: https://github.com/ejoeltech/nxtg/issues

---

**Version**: 1.0  
**Last Updated**: January 2026
