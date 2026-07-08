---
title: "BIMcollab Approval Workflow: Formal Issue Resolution and Verification for BIM Quality"
excerpt: "How to set up and use BIMcollab's approval workflow for formal BIM issue resolution — covering approval configuration, approver assignment, status lifecycle, rejection handling, and limiting issue closure to authorized team members."
category: "workflow"
softwareSlug: "bimcollab"
keyword: "bimcollab approval workflow issue resolution verification formal"
slug: "bimcollab-approval-workflow-issue-resolution-verification-formal"
author: "CADGuide Technical Editorial"
readTime: "10 min read"
date: "2026-07-08"
sources:
  - "https://helpcenter.bimcollab.com/en/articles/359075-the-approval-workflow"
  - "https://helpcenter.bimcollab.com/en/articles/356171-good-issue-management"
---

# BIMcollab Approval Workflow: Formal Issue Resolution and Verification for BIM Quality

On small projects, anyone can close issues — the coordinator trusts that when a designer marks something as resolved, it's actually fixed. On large, formal projects, that trust doesn't work. I've seen designers mark issues as "Resolved" when the fix was incomplete, or close issues without the coordinator's verification. The approval workflow in BIMcollab prevents this by adding a formal verification step. Here's how to set it up.

## Why the Approval Workflow Matters

Without the approval workflow:

1. Designer marks issue as **Resolved**
2. Anyone can mark it as **Closed**
3. No one verifies the fix
4. The issue shows as closed, but the clash still exists

With the approval workflow:

1. Designer marks issue as **Resolved**
2. Issue automatically changes to **To Approve**
3. The assigned approver reviews the fix
4. Approver approves → issue becomes **Resolved, Approved**
5. Only then can the coordinator **Close** the issue

This adds accountability and prevents unverified closures.

## Step 1: Enable the Approval Workflow

1. Log in to BIMcollab Web as a **Project Leader**.
2. Go to **Project Settings** → **Settings**.
3. Find the **Approval Workflow** toggle.
4. Switch it **On**.
5. The **Approval** field now appears in the issue settings.

### Tier Limitations

The approval workflow is not available on all BIMcollab subscription tiers. Check the feature comparison on the pricing page. If it's not available, you may need to upgrade your tier.

## Step 2: Configure Approver Roles

Any user with the role of **Project Leader**, **Editor**, or **Reviewer** can be selected as an approver. You don't need to configure approver roles separately — just ensure the right people have the right roles in the project.

### Recommended Approver Setup

- **BIM Coordinator**: Project Leader role, primary approver for all issues
- **Discipline Leads**: Editor role, can approve issues within their discipline
- **Designers**: Editor role, resolve issues but don't approve
- **Client Representatives**: Reviewer role, can approve issues that affect the owner

## Step 3: Assign Approvers to Issues

### When Creating a New Issue

1. In the issue creation form, fill in:
   - **Title**: Clear description
   - **Assigned To**: The person who will resolve the issue
   - **Approval**: Select one or more approvers
2. When the resolver marks the issue as **Resolved**, the approvers receive a notification.
3. The issue status changes to **To Approve** (shown in purple).

### When Editing an Existing Issue

1. Select the issue in BIMcollab.
2. Click **Edit**.
3. Add or remove approvers in the **Approval** field.
4. Save.

### Batch-Editing Approvers

For efficiency, you can assign the same approver to multiple issues:

1. Select multiple issues (Ctrl+click or Shift+click).
2. Right-click → **Batch Edit**.
3. Set the **Approval** field to the common approver.
4. Save — all selected issues are updated.

## Step 4: Understand the Status Lifecycle

With the approval workflow enabled, the status lifecycle changes:

### Standard Workflow (Without Approval)

```
Active → Resolved → Closed
```

### Approval Workflow

```
Active → Resolved → To Approve → Resolved, Approved → Closed
                         ↓
                    Rejected → Active (back to start)
```

### Status Colors

BIMcollab uses colors to visualize status:

- **Active**: Standard color (typically white/gray)
- **To Approve**: Purple — signals that approval is pending
- **Resolved, Approved**: Blue — signals that the fix is verified
- **Closed**: Green (or gray, depending on theme)

### Status Descriptions

- **Active**: The issue is open and needs resolution. The assigned person is working on it.
- **Resolved**: The resolver has implemented a fix. The issue is waiting for approval.
- **To Approve**: The issue is automatically set to this status when marked as Resolved. Approvers are notified.
- **Resolved, Approved**: The approver has verified the fix. The issue can now be closed.
- **Rejected**: The approver has rejected the fix. The issue goes back to Active for rework.
- **Closed**: The coordinator has closed the issue. Resolution is confirmed.

## Step 5: Handle Approvals

### As an Approver

1. You receive an email notification when an issue is assigned to you for approval.
2. Log in to BIMcollab (or use the BCF Manager in your BIM tool).
3. Filter issues by **Status: To Approve** and **Approval: Me**.
4. For each issue:
   - Open the issue viewpoint
   - Review the fix in the model (if you have a BIM tool with BCF Manager)
   - Or review the issue comments and viewpoint in BIMcollab Web
5. Decide:
   - **Approve**: The fix is correct and complete
   - **Reject**: The fix is incomplete or incorrect

### Approving an Issue

1. Select the issue.
2. Change status to **Resolved, Approved**.
3. Add a comment: "Verified — duct has been moved to clear the beam."
4. Save. The issue turns blue and is ready for closure.

### Rejecting an Issue

1. Select the issue.
2. Change status back to **Active**.
3. Add a comment explaining why: "The duct was moved but now clashes with the cable tray C-15. Please adjust."
4. Save. The issue goes back to the resolver for rework.

## Step 6: Limit Who Can Close Issues

By default, anyone can close issues — even with the approval workflow enabled. To enforce formal closure:

1. Go to **Project Settings** → **Issue Management**.
2. Enable **Limit Team Members from Closing Issues**.
3. Only **Project Leaders** can close issues.
4. This ensures the coordinator verifies every closure.

### Why This Matters

Without this limit, a designer could:
1. Mark an issue as Resolved
2. Approve their own resolution (if they're also an approver)
3. Close the issue

With the limit, only the coordinator can close — ensuring independent verification.

## Step 7: Handle Edge Cases

### Approver is Unavailable

If the assigned approver is on vacation or unavailable:

1. A Project Leader can edit the issue and change the approver.
2. Or a Project Leader can approve on behalf of the unavailable approver.
3. Document the change in a comment: "Approver changed from John to Sarah due to John's absence."

### Approver and Resolver are the Same Person

This should be avoided — self-approval defeats the purpose. But if it happens:

1. The system allows it (no built-in prevention).
2. Enforce through process: the BIM Coordinator should review self-approved issues.
3. Use the "Limit Team Members from Closing Issues" setting so the coordinator still verifies.

### No Approver Assigned

If an issue has no approver assigned:

1. The issue can still be marked as Resolved.
2. It changes to **To Approve** but no one is notified.
3. A Project Leader can assign an approver retroactively.
4. Or a Project Leader can approve directly.

### Multiple Approvers

If multiple approvers are assigned:

1. All approvers receive notifications.
2. Any approver can approve or reject.
3. One approval is sufficient — all approvers don't need to approve.
4. If one approver rejects, the issue goes back to Active.

For stricter control, establish a process where all approvers must agree. This isn't enforced by the system but can be managed through communication.

## Step 8: Monitor Approval Metrics

Track approval workflow health:

1. Go to the BIMcollab dashboard.
2. Monitor:
   - **Issues in To Approve status**: How many are waiting for approval?
   - **Time in To Approve**: How long does approval take?
   - **Rejection rate**: What percentage of resolutions are rejected?
   - **Self-approvals**: Are resolvers approving their own fixes?

### Red Flags

- **High rejection rate**: The design team isn't fixing issues properly. Investigate root causes.
- **Long approval times**: Approvers are bottlenecking the process. Add more approvers.
- **Issues stuck in To Approve**: No one is checking. Remind approvers or reassign.
- **Zero rejections**: Approvers may be rubber-stamping. Audit a sample of approved issues.

## Best Practices

- **Assign approvers when creating issues** — don't wait until resolution to assign
- **Use discipline leads as approvers** — they understand the technical details
- **Don't let resolvers approve their own fixes** — enforce through process
- **Limit closure to Project Leaders** — ensures coordinator verification
- **Monitor rejection rates** — high rates indicate quality issues in the design team
- **Add comments to every approval and rejection** — create an audit trail
- **Review approval metrics monthly** — identify bottlenecks and improve the process
- **Train approvers** — ensure they know how to review viewpoints and verify fixes
- **Use batch-edit for approver assignment** — efficient for assigning the same approver to many issues
- **Document the approval process in the BIM Execution Plan** — make it contractual
