### 1. Executive Summary & Objective
This network licensing directive provides the technical instructions for setting up a redundant three-server license pool for FLEXlm concurrent seats. It also details how to configure the vendor options file (`adskflex.opt`) to implement automatic idle license reclamation, protecting licensing budgets from inactive workstation locks.

### 2. FLEXlm Three-Server Redundant Pool Setup
A three-server redundancy system requires all three servers to run on the same network subnet with low latency. Two of the three servers must remain online to establish a quorum.
1. Generate your Autodesk redundant network license file.
2. Verify the header contains three `SERVER` declarations pointing to each server MAC address:
   ```lic
   SERVER server_primary 00155D010A01 27000
   SERVER server_secondary 00155D010A02 27000
   SERVER server_tertiary 00155D010A03 27000
   VENDOR adskflex port=2080
   ```
3. Set up the LMTOOLS utility on all three servers, specifying identical paths to the redundant license file.
4. Launch the services in order: Primary, Secondary, and Tertiary.

### 3. Seat Timeout Reclamation (adskflex.opt)
To prevent users from holding AutoCAD seats while their workstations are inactive:
1. Locate your options file named `adskflex.opt` in your licensing directory.
2. Add the timeout declaration line:
   ```opt
   TIMEOUTALL 900
   ```
   * `900` specifies the time in seconds (15 minutes), which is the minimum value allowed by Autodesk.
3. To target specific suites or extensions, use the timeout parameter:
   ```opt
   TIMEOUT 87815ACD_2026_0F 900
   ```
4. Perform a 'Re-Read License File' command in LMTOOLS to apply these session controls.
