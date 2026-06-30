---
title: "Bluebeam Revu Studio Sessions: Real-Time PDF Collaboration for Design Review and RFI Management"
excerpt: "A guide to using Bluebeam Studio Sessions for real-time document collaboration covering session creation, permission management, parallel markup workflows, RFI tracking, and activity reporting for construction project teams."
category: "workflow"
softwareSlug: "bluebeam-revu"
keyword: "bluebeam studio sessions collaboration"
slug: "bluebeam-revu-studio-sessions-real-time-collaboration-design-review-rfi"
author: "CADGuide Technical Editorial"
readTime: "11 min read"
date: "2026-06-30"
sources:
  - "https://support.bluebeam.com/articles/category/studio/"
  - "https://www.bluebeam.com/product/studio/"
---

# Bluebeam Revu Studio Sessions: Real-Time PDF Collaboration for Design Review and RFI Management

Studio Sessions are Bluebeam's real-time collaboration feature. Multiple users can mark up the same PDFs simultaneously, with all changes syncing instantly. This eliminates the inefficiency of emailing PDFs back and forth and consolidates all review comments in one place. This guide covers the complete Studio Session workflow.

## Creating a Studio Session

### Session Setup

1. Studio > Studio Sessions > New Session
2. Configure:
   - **Session name**: Descriptive name (e.g., "Project Alpha — Structural Review R3")
   - **Session expiration**: Set end date or leave open
   - **PDF files**: Add drawings to review (drag and drop or browse)
   - **Allow attendees to invite others**: Yes/No
   - **Enable markup alerts**: Yes (notifies when new markups are added)
3. Click "Create"

### Inviting Participants

1. Studio > Sessions > Manage > Invite
2. Enter email addresses (comma-separated)
3. Set permissions per user:
   - **Full Access**: Can mark up, add files, invite others
   - **Markup Only**: Can mark up but not manage files
   - **View Only**: Can view but not mark up
4. Click "Send Invitations"
5. Participants receive an email with a direct link to join

### Joining a Session

1. Click the email link, or
2. Open Revu > Studio > Sessions > Join > enter Session ID
3. The Session opens with all PDFs and existing markups visible
4. New participants see all previous markups immediately

## Real-Time Collaboration

### Parallel Markups

1. All participants can mark up PDFs simultaneously
2. Each markup is color-coded by author (assigned automatically)
3. Markups appear on all participants' screens within seconds
4. No conflicts — each markup is tracked independently

### Seeing Other Participants

1. View > Studio > Active Attendees
2. See who is currently online
3. See which page each person is viewing
4. Optional: enable cursor tracking to see others' cursors

### Chat

1. Studio > Chat
2. Send messages to all participants or specific individuals
3. Chat is saved with the Session for record-keeping
4. Use chat for:
   - Quick questions about a markup
   - Coordinating who reviews which sheets
   - Notifying the team when you've finished your review

### Markup Alerts

1. When someone adds a markup, other participants see:
   - A notification badge on the page tab
   - The markup appear in real-time
2. Configure alerts:
   - Studio > Sessions > Settings > Alerts
   - Choose: All markups, Only @mentions, or None

## RFI Management in Studio Sessions

### Creating an RFI Markup

1. Navigate to the drawing location with the issue
2. Use the Callout tool to describe the question
3. Set markup Subject to "RFI"
4. In the markup comment, include:
   - **RFI number**: e.g., "RFI-047"
   - **Question**: Clear description of the issue
   - **Reference**: Drawing number, detail, or specification
   - **Assigned to**: Who needs to answer
5. Set status to "Open"

### Tracking RFIs

1. Open the Markups List
2. Filter: Subject = "RFI"
3. View all RFIs across all drawings in the Session
4. Columns show:
   - RFI number
   - Question
   - Assigned to
   - Status (Open, Answered, Closed)
   - Date created
   - Date answered

### Answering an RFI

1. The assigned person opens the Session
2. Navigates to the RFI markup (click in the Markups List)
3. Adds a reply comment to the markup
4. Changes status to "Answered"
5. The originator is notified
6. If the answer is satisfactory, change status to "Closed"

### RFI Report Export

1. Markups List > Filter: Subject = "RFI"
2. Export > CSV
3. Import into Excel
4. Generate RFI log with:
   - RFI number, date, question, answer, status
   - Assigned to, answered by
   - Days open (calculate from dates)
5. Distribute RFI log in project meetings

## Design Review Workflow

### Preparing for a Design Review

1. Create a Studio Session with the current drawing set
2. Invite all stakeholders (architect, engineers, owner, contractor)
3. Set permissions: all can mark up
4. Create a checklist of items to review:
   - Code compliance
   - Coordination between disciplines
   - Constructability issues
   - Cost concerns
   - Schedule implications

### Conducting the Review

1. All participants join the Session at the scheduled time
2. The facilitator guides the team through each drawing
3. Participants add markups as issues are identified
4. Use the Callout tool for detailed comments
5. Use the Cloud tool to highlight areas
6. Assign each markup to the responsible party
7. Set status to "Open" for all issues

### Post-Review Actions

1. Export the Markups List to CSV
2. Generate a review minutes document
3. Distribute to all participants
4. Track resolution of each markup:
   - Responsible party addresses the issue
   - Updates status to "Resolved"
   - Facilitator verifies and sets to "Accepted"
5. Schedule follow-up review if needed

## Studio Projects

### What Are Studio Projects?

Studio Projects are cloud-based document repositories:
1. Studio > Studio Projects > New Project
2. Upload a folder structure of PDFs
3. Team members access from anywhere with internet
4. Features:
   - **Check-out/in**: Prevent conflicting edits
   - **Version history**: Every saved version is retained
   - **Activity log**: Who accessed, edited, or downloaded what
   - **Permissions**: Per-folder access control

### Sessions vs. Projects

| Feature | Studio Sessions | Studio Projects |
|---------|----------------|-----------------|
| Purpose | Real-time markup collaboration | Document storage and management |
| Markups | Real-time, multi-user | One user at a time (check-out)
| File management | Add files to Session | Full folder structure |
| Version history | No | Yes |
| Access control | Per-Session | Per-folder |
| Best for | Design reviews, RFI management | Drawing set distribution, archiving |

### Using Sessions and Projects Together

1. Store the master drawing set in a Studio Project
2. Create a Studio Session for each review cycle
3. Pull drawings from the Project into the Session
4. Conduct the review with real-time markups
5. After review, update the Project files with resolved markups
6. The Project maintains the version history

## Session Management and Archiving

### Monitoring Session Activity

1. Studio > Sessions > Manage
2. View:
   - **Active Sessions**: Currently open
   - **Participants**: Who has joined
   - **Markup count**: Total markups per Session
   - **Last activity**: Most recent markup date
3. Use this to track engagement and identify stale Sessions

### Closing a Session

1. When the review is complete:
2. Export all markups to CSV (for records)
3. Save the marked-up PDFs (File > Save As)
4. Studio > Sessions > Close Session
5. The Session is archived but still accessible for reference

### Session Security

- Sessions are hosted on Bluebeam's cloud servers
- Data is encrypted in transit and at rest
- Optional: require authentication (email + password) for participants
- Optional: restrict access to specific email domains
- Activity log tracks all participant actions

## Best Practices

1. **Name Sessions descriptively** — include project, discipline, and revision
2. **Set expiration dates** — prevents stale Sessions from lingering
3. **Use consistent markup subjects** — "RFI", "Comment", "Punch Item", "Approval"
4. **Assign every markup** — accountability drives resolution
5. **Export markup lists after each review** — preserve the record
6. **Use chat for coordination** — don't rely on email alongside Sessions
7. **Train all participants** — 15 minutes of training ensures everyone can participate
8. **Archive completed Sessions** — keep records for project closeout and disputes
9. **Combine with Studio Projects** — Projects for storage, Sessions for review
10. **Schedule review sessions** — set a specific time for all participants to be online simultaneously

## Conclusion

Studio Sessions transform PDF review from a serial, email-based process into a real-time, collaborative workflow. By creating Sessions for design reviews and RFI management, inviting all stakeholders, using parallel markups with consistent subjects, and exporting markup lists for tracking, project teams can complete reviews in hours instead of weeks. Combined with Studio Projects for document storage and version control, the Bluebeam collaboration ecosystem provides a complete document management solution for construction projects of any size.
