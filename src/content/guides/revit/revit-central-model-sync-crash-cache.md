### 1. Executive Summary & Objective
This operations guide provides the standard IT workflow to resolve Revit synchronization freezes, network timeout crashes, and local data lockups when performing a **Sync to Central (STC)**. It details the step-by-step methods to safely purge corrupted local worksharing caches and isolate conflicting add-ins.

### 2. Purging Corrupted Local Worksharing Caches
Corrupted local model caches or outdated PAC files frequently block the synchronization pipeline. You must manually clear these directories:
1. Close all active Revit sessions.
2. Open Windows File Explorer and navigate to the Collaboration Cache directory:
   ```cmd
   %LOCALAPPDATA%\Autodesk\Revit\Autodesk Revit <Version>\CollaborationCache
   ```
   *(e.g., `%LOCALAPPDATA%\Autodesk\Revit\Autodesk Revit 2026\CollaborationCache`)*
3. Locate the folder matching your Autodesk Account ID, then identify the project and model GUID folders. Move or delete these local cache files.
4. Navigate to the PAC Cache directory:
   ```cmd
   %LOCALAPPDATA%\Autodesk\Revit\PacCache
   ```
5. Delete all files and folders inside the PacCache directory.
6. Empty the Windows Temp directory: Go to `%TEMP%` and delete all temporary files to free up disk buffer handles.

### 3. Add-in Isolation and Journal Analysis
If the sync crash continues:
1. Navigate to `C:\ProgramData\Autodesk\Revit\Addins\<Version>\` and temporarily move all `.addin` files to a backup folder on your Desktop.
2. Restart Revit and attempt the Sync to Central. If it succeeds, one of the third-party plugins is causing thread lockups.
3. Open your Revit Journal logs in `%LOCALAPPDATA%\Autodesk\Revit\Autodesk Revit <Version>\Journals` and search for entries containing `HttpRequestFailedException` or `SSL_ERROR` to identify local network inspection packet locks blocking Autodesk Cloud servers.
