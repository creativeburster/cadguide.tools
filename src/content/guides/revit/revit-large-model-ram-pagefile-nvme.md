### 1. Executive Summary & Objective
This IT optimization guide provides technical directives for configuring Windows Virtual Memory (paging file size) to stabilize workstation memory allocations when editing heavy Revit projects (assemblies >500 MB) on modern NVMe-based hardware slots.

### 2. Revit RAM-to-Model Size Ratio & Paging Dynamics
Revit utilizes an in-memory database structure. When opening a project file (RVT), the application extracts compressed schemas. 
*   **Memory Multiplier**: Revit typically consumes physical RAM equivalent to **20 times** the uncompressed file size of the primary model plus all loaded external Revit link references.
*   **Out of Memory (OOM) Vulnerability**: If the combined RAM usage of Revit and active background processes exceeds physical system capacity, Windows attempts allocation on disk. If pagefile parameters are misconfigured, Revit encounters silent crash-to-desktop events or fatal thread access violations.

### 3. Windows Virtual Memory & Pagefile Allocation Playbook
To prevent pagefile constraints on high-speed PCIe NVMe SSD drives:

#### Step 1: Calculate Pagefile Size Requirements
*   **Minimum Limit**: Equal to the total amount of installed physical RAM (e.g., 32 GB RAM = 32,768 MB).
*   **Maximum Limit**: Set to **twice** the physical RAM capacity (e.g., 32 GB RAM = 65,536 MB). Setting limits higher than 2x degrades overall system storage performance due to extensive allocation table lookups.

#### Step 2: Configure Drive Placements (OS Boot vs. High-Speed Storage)
*   **System Boot Drive (C:)**: Retain a minimum pagefile size of **800 MB to 1024 MB** on your primary OS boot drive to enable system kernel memory dump generations in the event of OS crashes.
*   **Secondary High-Speed NVMe Storage Drive (D: or E:)**: Place the bulk of your system paging file on your fastest non-OS physical SSD to minimize write/read bottlenecks.

#### Step 3: Windows Advanced Settings Modifications
1. Open the Windows Run dialog (`Win + R`), type **`SystemPropertiesAdvanced`**, and press Enter.
2. Under **Performance**, click **Settings...**, then navigate to the **Advanced** tab.
3. Click **Change...** under the **Virtual Memory** group block.
4. Uncheck **"Automatically manage paging file size for all drives"**.
5. Select the primary boot drive, choose **Custom Size**, set both Initial and Maximum to `1024` MB, and click **Set**.
6. Select your target NVMe PCIe drive, choose **Custom Size**, input your calculated values:
   *   *Initial Size*: `32768` (for a 32GB baseline)
   *   *Maximum Size*: `65536`
7. Click **Set**, then click **OK**, and restart the workstation.

### 4. Official References & Source Links
*   **Autodesk Knowledge Network (AKN)**: [Recommended Virtual Memory Configuration for Revit Projects](https://knowledge.autodesk.com/)
*   **Microsoft Windows Performance Guide**: [How to Determine the Appropriate Pagefile Size for Windows](https://learn.microsoft.com/en-us/troubleshoot/windows-client/performance/determine-appropriate-page-file-size)
