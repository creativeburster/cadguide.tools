export const revitWorksharingWizard = {
  "wizardId": "revit-central-model-worksharing",
  "title": "Revit Central Model / Worksharing Diagnostic Wizard",
  "entryQuestion": "What problem are you having with the central model or worksharing?",
  "sourcesPolicy": "All causes and fixes below are taken from Autodesk official Knowledge Base / Revit Help articles. Each cause lists its sourceUrl. Branches with no verified official source are explicitly marked 'not obtained'.",
  "nodes": [
    {
      "id": "central-model-not-accessible",
      "symptom": "Revit reports the central model is not accessible, not found, deleted, or has been copied/moved.",
      "causes": [
        {
          "cause": "The central model's backup folder is corrupt (journal shows 'Accessing file ..._backup\\wperms.dat').",
          "fix": [
            "Find the backup folder next to the central model, named <central model name>_Backup.",
            "Rename the backup folder or move it to another location.",
            "In Revit, create a new local model with the Audit checkbox checked, then synchronize once it opens.",
            "After the model opens and syncs successfully, the renamed/moved backup folder can be safely deleted."
          ],
          "sourceUrl": "https://www.autodesk.com/support/technical/article/caas/sfdcarticles/sfdcarticles/Revit-error-Central-model-is-not-accessible.html",
          "sourceTitle": "Central model is not accessible in Revit"
        },
        {
          "cause": "The central model was copied or moved, or team members access it through different paths (different drive letter, IP address, or UNC path).",
          "fix": [
            "Revit stores the save path inside the central model, so all members must reach it through the identical path. Run 'net use' at the command prompt on two machines to compare the mapped paths.",
            "If you received a copy and are not connecting to the original central model, open it with Detach from Central, then save it as a new central model on your system or network.",
            "Make sure every project member maps to the central file the same way (same drive letter/UNC path)."
          ],
          "sourceUrl": "https://www.autodesk.com/support/technical/article/caas/sfdcarticles/sfdcarticles/the-central-model-has-been-moved-or-modified.html",
          "sourceTitle": "\"This central model has been copied or moved\" when creating a local model in Revit"
        },
        {
          "cause": "'Can't obtain permission to edit the element: The Central Model is inaccessible' when opening a cloud workshared model (often caused by a workshared linked model copied via Desktop Connector).",
          "fix": [
            "Open the linked model in a new Revit session using the Detach from Central option.",
            "Save the model to the same path, replacing the existing model.",
            "Reload the linked model using Reload From in Manage Links."
          ],
          "sourceUrl": "https://www.autodesk.com/support/technical/article/caas/sfdcarticles/sfdcarticles/Can-t-obtain-permission-to-edit-the-element-The-Central-Model-is-inaccessible-when-open-a-workshared-model-in-Revit.html",
          "sourceTitle": "\"Can't obtain permission to edit the element: The Central Model is inaccessible\" when opening a workshared model in Revit"
        },
        {
          "cause": "Generic NTFS/network share permission problem on the central model folder (specific official KB not located).",
          "fix": [],
          "sourceUrl": "not obtained",
          "sourceTitle": "not obtained - no single dedicated Autodesk KB found for generic share-permission grants; the nearest official guidance is the path/backup guidance in the two articles above. Verify read/write/modify permission with your IT/network team."
        }
      ]
    },
    {
      "id": "sync-slow",
      "symptom": "Synchronizing with central is slow, takes longer than expected, or the model feels sluggish during sync.",
      "causes": [
        {
          "cause": "The central model has grown large and needs compacting.",
          "fix": [
            "Compacting consolidates all relevant model data into a single data stream, rewriting the data structure without affecting model elements, to reduce file size and improve synchronization.",
            "In Synchronize and Modify Settings, select Compact Central Model. Note that compacting increases the time needed for that particular save.",
            "See Revit Help 'File Save Options' and 'Best Practices: Working on a Team Project' for the compacting workflow."
          ],
          "sourceUrl": "https://www.autodesk.com/support/technical/article/caas/sfdcarticles/sfdcarticles/What-effect-does-compacting-have-on-the-Revit-model.html",
          "sourceTitle": "What effect does compacting have on the Revit model?"
        },
        {
          "cause": "Multiple users are accessing the central file at the same time, causing access delays.",
          "fix": [
            "Watch for the Worksharing Monitor notification 'Expected delay during your central file accesses'.",
            "Check the Central File Access pane to see who is currently accessing the central file.",
            "Do not restart a slow Synchronize with Central manually; wait for it, or cancel and retry later if needed."
          ],
          "sourceUrl": "https://help.autodesk.com/cloudhelp/2026/ENU/Revit-Collaborate/files/GUID-5196BA79-8632-45EC-BC8A-4971FE362465.htm",
          "sourceTitle": "About Delays When Using Synchronize with Central (Revit Help)"
        },
        {
          "cause": "Local machine/environment factors: missing Revit updates, interfering add-ins, permissions, antivirus, or slow storage.",
          "fix": [
            "Update Revit to the latest build and make sure all users are on the same build.",
            "Disable all add-ins and re-enable them one by one to find any that degrade sync performance.",
            "Confirm correct Windows permissions (or test with a new Windows user account), and temporarily disable antivirus/firewall to rule out traffic blocking.",
            "Check that the storage media is not the bottleneck."
          ],
          "sourceUrl": "https://www.autodesk.com/support/technical/article/caas/sfdcarticles/sfdcarticles/When-opening-and-syncing-models-back-to-central-on-a-network-Revit-performance-is-running-slow.html",
          "sourceTitle": "Opening and syncing models back to central on a network is slow in Revit"
        },
        {
          "cause": "The model is bloated/corrupt and a fresh detached central is needed (also releases all worksets).",
          "fix": [
            "Have all participants synchronize and finish work in the affected model.",
            "Open the central model with Detach from Central, Create a new local, and Audit checked, saving under a new file name.",
            "Save As a new central (check the option in Save Options) and set the desired backup count.",
            "Have all participants open the new model with Create a local copy."
          ],
          "sourceUrl": "https://www.autodesk.com/support/technical/article/caas/sfdcarticles/sfdcarticles/Slow-work-with-model-in-Revit.html",
          "sourceTitle": "Slow work with model in Revit"
        }
      ]
    },
    {
      "id": "workset-cannot-edit",
      "symptom": "You cannot edit elements or a workset; Revit says the element/workset is owned by another user or you need to relinquish.",
      "causes": [
        {
          "cause": "Another user owns the element or workset (ownership is taken automatically when editing).",
          "fix": [
            "Have the user named in the message run Synchronize and Modify Settings, with the Borrowed Elements and User-created Worksets checkboxes checked (if available).",
            "Have other members then run Reload Latest.",
            "Remember that views are also objects that can be claimed; each team member should keep separate work-in-progress views."
          ],
          "sourceUrl": "https://www.autodesk.com/support/technical/article/caas/sfdcarticles/sfdcarticles/Error-Message-to-Relinquish-when-other-users-not-ever-in-file.html",
          "sourceTitle": "\"Can't edit the element until [Username] resaves...\" when working in Revit"
        },
        {
          "cause": "The named user cannot open the model (stale ownership, e.g. after a username change).",
          "fix": [
            "Try opening the model with the worksets closed.",
            "If the user can open the model, have them synchronize and relinquish; if they cannot, worksets may need to be released from another valid session.",
            "Refer to the opening-specific troubleshooting article linked in the KB if the error appears at open time."
          ],
          "sourceUrl": "https://www.autodesk.com/support/technical/article/caas/sfdcarticles/sfdcarticles/Error-Message-to-Relinquish-when-other-users-not-ever-in-file.html",
          "sourceTitle": "\"Can't edit the element until [Username] resaves...\" when working in Revit"
        },
        {
          "cause": "You still hold borrowed elements or checked-out worksets when closing; Revit asks whether to keep or relinquish them.",
          "fix": [
            "When closing with editable items remaining, Revit shows the Editable Elements dialog.",
            "Choose to relinquish the checked-out worksets and borrowed elements to release them, or keep them to continue editing later.",
            "Use Synchronize and Modify Settings to control whether borrowed elements and user-created worksets are released after each sync."
          ],
          "sourceUrl": "https://help.autodesk.com/cloudhelp/2024/ENU/Revit-Collaborate/files/GUID-7AF97381-C703-4ACE-8153-E328605CB018.htm",
          "sourceTitle": "Synchronize with the Central Model (Revit Help)"
        }
      ]
    },
    {
      "id": "central-model-corrupt",
      "symptom": "The central model is corrupt; Revit blocks syncing or you need to restore/rebuild it.",
      "causes": [
        {
          "cause": "Revit detects central model corruption during sync ('You cannot synchronize to central until the model is repaired').",
          "fix": [
            "Instruct users to stop using the corrupt model, and identify a workstation that has a local copy.",
            "Go to Collaborate tab > Manage Models panel > Manage Models drop-down > Repair Central Model. A message appears when the repair completes.",
            "Close the active model, create a new local copy of the repaired central, and have all users create fresh local copies from it.",
            "If repair is not enough, use a previous uncorrupt version of the file."
          ],
          "sourceUrl": "https://help.autodesk.com/cloudhelp/2023/ENU/Revit-Collaborate/files/GUID-2DF59A60-A798-4528-8938-099D4E8E0D2A.htm",
          "sourceTitle": "Repair a Corrupt Central Model (File-Based Worksharing Only) (Revit Help)"
        },
        {
          "cause": "You need to restore from an automatic backup instead.",
          "fix": [
            "Identify the model type (non-workshared, file-based worksharing, Revit Server, or cloud), because recovery options differ.",
            "For file-based worksharing, use 'Repair a Corrupt Central Model'; for Revit Server, restore a previous version of the server-based central model.",
            "For cloud models, access and download a previous copy of the Revit cloud model.",
            "See the KB article's recovery table for the exact path for your model type."
          ],
          "sourceUrl": "https://www.autodesk.com/support/technical/article/caas/sfdcarticles/sfdcarticles/How-to-recover-backup-of-Revit-model.html",
          "sourceTitle": "How to recover Revit model backup"
        },
        {
          "cause": "Rebuild a clean model by detaching and discarding worksets (last resort, ends worksharing history).",
          "fix": [
            "Click File > Open and select the workshared model.",
            "In the Open dialog, select Detach from Central and click Open; the default name gets '_detached' appended.",
            "In the task dialog, choose Discard worksets. This removes worksets and all element assignments/visibility settings and cannot be undone.",
            "Save As to a local drive or as a cloud model to Autodesk Docs. The detached model can no longer sync with the original central."
          ],
          "sourceUrl": "https://www.autodesk.com/support/technical/article/caas/sfdcarticles/sfdcarticles/How-to-stop-worksharing-in-a-central-Revit-model.html",
          "sourceTitle": "How to stop worksharing in a central Revit model"
        }
      ]
    },
    {
      "id": "elements-lost-or-out-of-sync",
      "symptom": "Elements disappear, move unexpectedly, or go out of sync during collaboration.",
      "causes": [
        {
          "cause": "Synchronize with Central fails because of a design conflict, elements owned by another user, or a read-only/missing/corrupt central.",
          "fix": [
            "Open Worksharing Monitor, select the project under Central File Access, open History, and inspect the failed sync entry for details.",
            "If it is a design conflict, create a fresh local file from the central, move the needed edits into it, save those edits to central, then abandon the problematic local file.",
            "If the central is read-only, missing, or corrupt, address the central file (see the corrupt-central branch) and contact Autodesk Support if needed."
          ],
          "sourceUrl": "https://help.autodesk.com/cloudhelp/2024/ENU/Revit-Collaborate/files/GUID-61C5C95C-F91F-4FF4-AD8A-86E4EDC37AAF.htm",
          "sourceTitle": "Synchronize with Central Fails (Revit Help)"
        },
        {
          "cause": "An unstable local environment causes elements to be deleted or relocated during sync/publish.",
          "fix": [
            "Clean temporary files to improve environment stability (see How to delete temporary files in Windows).",
            "Reinstall Revit for a stable configuration (see How to Complete a Clean Uninstall of Revit products)."
          ],
          "sourceUrl": "https://www.autodesk.com/support/technical/article/caas/sfdcarticles/sfdcarticles/Objects-will-move-unexpectedly-when-synchronizing-a-Revit-project.html",
          "sourceTitle": "Unexpected Deletion or Relocation of Elements During Synchronize/Publish Operations in Revit"
        },
        {
          "cause": "Prevention of recurring sync corruption (mixed builds, WAN/VPN, add-ins, corrupt families).",
          "fix": [
            "For file-based worksharing, keep all users on the same network as the file server; avoid working over WAN/VPN.",
            "Ensure all project members run the latest Revit build, and test with all add-ons disabled.",
            "Follow 'Best Practices: Preventing Data Corruption in Revit' and keep file sizes manageable.",
            "Check for corrupt families (see 'Cannot open or save file with audit in Revit')."
          ],
          "sourceUrl": "https://www.autodesk.com/support/technical/article/caas/sfdcarticles/sfdcarticles/Error-You-cannot-synchronize-to-central-until-the-model-is-repaired-message-appears-when-syncing-to-a-local-model-in-Revit.html",
          "sourceTitle": "\"You cannot synchronize to central until the model is repaired...\" when syncing local copy to a central model in Revit"
        }
      ]
    }
  ]
} as const;
