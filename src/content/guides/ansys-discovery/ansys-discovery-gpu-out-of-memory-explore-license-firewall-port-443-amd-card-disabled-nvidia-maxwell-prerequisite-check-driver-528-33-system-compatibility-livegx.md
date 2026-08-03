---
title: "Ansys Discovery GPU Out of Memory in Explore Stage, License Activation Firewall Block, AMD Card Explore Stage Disabled, Prerequisite Check Failure on Launch, and NVIDIA Driver Version Incompatibility: Fidelity Slider, Port 443 Firewall Rules, NVIDIA Maxwell Minimum, Driver 528.33, and System Compatibility Check"
excerpt: "Ansys Discovery fails for 5 distinct reasons: GPU out of memory in Explore stage from high fidelity settings requiring fidelity slider adjustment, license activation failure from firewall blocking port 443 to ansys-fno.flexnetoperations.com requiring firewall exception rules, AMD and non-compliant NVIDIA cards disabling Explore and Refine LiveGX stages requiring NVIDIA Maxwell or newer, prerequisite check failure on launch from missing or outdated drivers requiring system compatibility check, and NVIDIA driver version below 528.33 causing minor version incompatibility requiring driver update. We cover each with fixes from Ansys Help and Knowledge Base."
category: "gpu-license-and-prerequisite-errors"
softwareSlug: "ansys-discovery"
keyword: "Ansys Discovery GPU out of memory Explore stage fidelity slider license activation firewall port 443 AMD card disabled NVIDIA Maxwell prerequisite check failure driver 528.33 system compatibility LiveGX solver"
slug: "ansys-discovery-gpu-out-of-memory-explore-license-firewall-port-443-amd-card-disabled-nvidia-maxwell-prerequisite-check-driver-528-33-system-compatibility-livegx"
author: "CADGuide Tools Editorial Team"
readTime: "12 min"
date: "2025-08-03"
sources:
  - "https://ansyshelp.ansys.com/public/Views/Secured/corp/v242/en/disco_unified_releasenotes/disco_cav_kils.html"
  - "https://ansyshelp.ansys.com/public/Views/Secured/corp/v261/en/install_discovery/disc_prereq.html"
  - "https://innovationspace.ansys.com/knowledge/forums/topic/discovery-license-activation-troubleshooting/"
---

# Ansys Discovery GPU Out of Memory in Explore Stage, License Activation Firewall Block, AMD Card Explore Stage Disabled, Prerequisite Check Failure on Launch, and NVIDIA Driver Version Incompatibility: Fidelity Slider, Port 443 Firewall Rules, NVIDIA Maxwell Minimum, Driver 528.33, and System Compatibility Check

Ansys Discovery produces errors from GPU memory exhaustion, license activation failures, unsupported graphics cards, prerequisite check failures, and driver version incompatibility. This guide covers the 5 most common Discovery problems with diagnostic steps and community-verified fixes from Ansys Help and Knowledge Base.

## 1. GPU Out of Memory in Explore Stage from High Fidelity Settings

### Symptom

When solving in the Explore stage, the GPU runs out of memory and starts using the CPU, resulting in extremely slow solve times. The simulation may appear to hang or take much longer than expected. The issue occurs with complex models or high fidelity settings. GPU memory usage reaches 100% before falling back to CPU.

### Root Cause

"When solving in Explore, fidelity settings may cause the GPU to run out of memory and start using the CPU resulting in slow solve times." The Explore stage uses GPU-based live simulation (LiveGX solver). Higher fidelity settings require more GPU memory for the simulation mesh and solver data. When the GPU's dedicated video memory is exhausted, the solver falls back to CPU-based shared memory, which is dramatically slower. "Disabling shared memory may also be a workaround."

### Fix

1. **Adjust fidelity slider to a lower position**:
   - "Adjust fidelity slider to a lower position"
   - In the Explore stage
   - Lower the fidelity slider
   - This reduces the simulation mesh density
   - And the GPU memory requirement

2. **Disable shared memory**:
   - "Disabling shared memory may also be a workaround"
   - "See https://nvidia.custhelp.com/app/answers/detail/a_id/5490"
   - Disable GPU shared memory in NVIDIA settings
   - This forces the solver to use only dedicated GPU memory
   - And may improve performance

3. **Use a GPU with more VRAM**:
   - Minimum: 4 GB dedicated video memory
   - Recommended: 8 GB dedicated video memory
   - For complex models, 8 GB or more is essential
   - Consider NVIDIA Quadro or RTX cards with more VRAM

4. **Simplify the model**:
   - Reduce the number of bodies
   - Suppress non-critical features
   - Simplify complex geometry
   - This reduces the simulation mesh size

5. **Reduce the simulation domain**:
   - Use local simulation regions
   - Instead of simulating the entire model
   - Focus on the area of interest
   - This reduces GPU memory requirements

6. **Close other GPU-intensive applications**:
   - Close browsers with hardware acceleration
   - Close other 3D applications
   - Close video players
   - Free up GPU memory for Discovery

7. **Use the Refine stage with Fluent solver instead**:
   - If the Explore stage consistently runs out of GPU memory
   - Use the Refine stage with the Fluent solver
   - Which uses CPU instead of GPU
   - But provides more accurate results

### Community Report

> "When solving in Explore, fidelity settings may cause the GPU to run out of memory and start using the CPU resulting in slow solve times. Workarounds: Adjust fidelity slider to a lower position. Disabling shared memory may also be a workaround."

## 2. License Activation Failure from Firewall Blocking Port 443

### Symptom

Discovery can't activate the subscription license. Error messages include "There are no current ANSYS subscriptions that enable capability ANSYS Discovery SpaceClaim" or "Unable to connect to ANSYS subscription registration service. No connection could be made because the target machine actively refused it." Pinging ansys-fno.flexnetoperations.com results in 100% loss or request timed out.

### Root Cause

"If the output shows 100% loss or request timed out or message like 'Ping request could not find host ansys-fno.flexnetoperations.com. Please check the name and try again,' it indicates that connection requests could be blocked by firewall settings." Discovery's subscription licensing requires communication with the cloud-based ANSYS License Activation Server via port 443 (HTTPS). Firewalls, proxy servers, or antivirus software can block this communication, preventing license activation.

### Fix

1. **Enable outbound communication over port 443**:
   - "If your network is protected by a firewall, the following exception rules need to be implemented"
   - "Enable outbound communication over port 443 (https) to the following:"
   - Add firewall exception for port 443
   - For ansys-fno.flexnetoperations.com

2. **Add ansysls_client.exe to exclusions**:
   - "Add the ansysls_client.exe (subscription handler) executable"
   - "To your endpoint and network security exclusions"
   - "(for example, whitelisting solutions)"
   - Add to antivirus allowed apps list

3. **Configure proxy server settings**:
   - "If your network uses a proxy server, additional configuration is required"
   - "In the Windows Control Panel under Internet Properties"
   - "Click on the Connections tab and then click on LAN settings"
   - "Specify proxy server address and its port"

4. **Set proxy environment variable**:
   - If proxy settings don't work
   - Set the environment variable:
   - `HTTP_PROXY=http://host:port`
   - Where host and port are the proxy host and port

5. **Install ansysls_client patch (pre-2019 R1)**:
   - "Download ansysls_client patch if you are using any version prior to 2019 R1"
   - Go to `Shared Files\Licensing\winx64`
   - Rename `ansysls_client.exe` to `ansysls_client_old.exe`
   - Copy the patched version to this location

6. **Check antivirus and user permissions**:
   - "ANSYS Discovery products licensing requests might also be denied"
   - "By your antivirus software or by missing user permissions in Windows"
   - Add ansysls_client.exe to antivirus exclusions
   - Ensure the user has administrator permissions

7. **Gather diagnostics for Ansys support**:
   - "Open Windows Explorer, browse to %temp%"
   - "Find the directory named .ansys"
   - "Right-click on the directory, select Send To and then Compressed (zipped) folder"
   - Send the diagnostics to ANSYS support

### Community Report

> "Unable to connect to ANSYS subscription registration service. No connection could be made because the target machine actively refused it. If the output shows 100% loss or request timed out, it indicates that connection requests could be blocked by firewall settings. Enable outbound communication over port 443 (https). Add the ansysls_client.exe (subscription handler) executable to your endpoint and network security exclusions."

## 3. AMD Card and Non-Compliant NVIDIA Card Explore Stage Disabled

### Symptom

Discovery launches but the Explore stage is disabled. The Refine stage with LiveGX solver is also disabled. The Model stage works fine. The user has an AMD Radeon card or an older NVIDIA card. The Explore and Refine LiveGX stages are grayed out or show "not available."

### Root Cause

"With AMD cards and non-compliant NVIDIA cards, Discovery still functions but access to the Explore stage, or to the Refine stage using the LiveGX solver, is disabled." The Explore stage and Refine stage with LiveGX solver require NVIDIA GPU compute capability (CUDA). AMD cards don't support CUDA, so these stages are disabled. Non-compliant NVIDIA cards (older than Maxwell series) don't have the required compute capability for the LiveGX solver.

### Fix

1. **Use an NVIDIA GPU, Maxwell series or newer**:
   - "Dedicated NVIDIA GPU, Maxwell series or newer"
   - "4 GB of dedicated video memory"
   - This is the minimum requirement for Explore stage
   - Maxwell = NVIDIA GeForce 900 series or newer

2. **Use NVIDIA Pascal series or newer (recommended)**:
   - "Dedicated NVIDIA GPU, Pascal series or newer"
   - "8 GB dedicated video memory"
   - Pascal = NVIDIA GeForce 1000 series or newer
   - This is the recommended configuration

3. **Use Refine stage with Fluent or MAPDL solver**:
   - "Refine stage with Fluent solver" or "Refine stage with MAPDL solver"
   - These solvers don't require NVIDIA GPU
   - They work with AMD Radeon Pro or NVIDIA Quadro
   - With OpenGL 4.6 support

4. **Use the Model stage only**:
   - The Model stage works with any dedicated graphics card
   - "Dedicated graphics card with the latest vendor drivers"
   - "Supporting OpenGL version 4.6 and a minimum of 2 GB"
   - But without simulation capabilities

5. **Check GPU compatibility**:
   - Verify the GPU is NVIDIA Maxwell or newer
   - Check the NVIDIA GPU compute capability
   - Use the Discovery prerequisite checker
   - To verify GPU compatibility

6. **Update NVIDIA drivers**:
   - "We recommend you update your graphics card to the latest drivers"
   - "From the NVIDIA website prior to installation"
   - "Minimum required driver version being >= 528.33"
   - Update drivers from NVIDIA's website

7. **Use Intel Arc Pro for Model stage**:
   - "Intel Arc Pro graphics cards are also supported"
   - "In the Modeling stage"
   - Intel Arc Pro can be used for the Model stage
   - But not for Explore or Refine LiveGX

### Community Report

> "With AMD cards and non-compliant NVIDIA cards, Discovery still functions but access to the Explore stage, or to the Refine stage using the LiveGX solver, is disabled. Dedicated NVIDIA GPU, Maxwell series or newer, 4 GB of dedicated video memory. We recommend you update your graphics card to the latest drivers from the NVIDIA website prior to installation, with the minimum required driver version for minor version compatibility being >= 528.33."

## 4. Prerequisite Check Failure on Launch

### Symptom

When launching Discovery after installation, a dialog box reports missing or out-of-date prerequisites. The application may not start or may have limited functionality. The prerequisite check results are captured in the Discovery application log. The SID (System Information Diagnostic) reports missing or out-of-date prerequisites.

### Root Cause

"Upon launching Discovery after installation, prerequisite checking occurs automatically to ensure there are no installation issues that may lead to unexpected behaviors or failures." Discovery checks for required prerequisites including graphics card drivers, OpenGL version, CUDA support, and system libraries. If any prerequisite is missing or outdated, the check fails and reports the issue. This can happen after a fresh installation, a driver update, or a system change.

### Fix

1. **Check the prerequisite check dialog**:
   - "The results of these checks are reported in several ways"
   - "A dialog box reports any missing or out-of-date prerequisites"
   - Read the dialog carefully
   - Note which prerequisites are missing or outdated

2. **Check the Discovery application log**:
   - "Results of the prerequisite checks are captured in the Discovery application log"
   - Find the log in the Discovery installation directory
   - Or in `%TEMP%\.ansys`
   - Review the log for detailed prerequisite information

3. **Run system compatibility check**:
   - "Open the Windows command prompt as administrator"
   - Run: `"<install_path>/Framework/bin/Win64/Ans.DriverSetup.exe" --check-system-compatibility`
   - "Capture the output of the command"
   - This provides detailed compatibility information

4. **Update graphics drivers**:
   - If the prerequisite check reports outdated graphics drivers
   - Download the latest drivers from NVIDIA or AMD
   - Minimum NVIDIA driver version: 528.33
   - Install and restart Discovery

5. **Verify OpenGL version**:
   - Discovery requires OpenGL 4.6 or above
   - Check the graphics card's OpenGL support
   - Use GPU Caps Viewer or similar tool
   - To verify OpenGL version

6. **Install missing system libraries**:
   - If the prerequisite check reports missing libraries
   - Install the required Visual C++ redistributables
   - Or other system libraries
   - As specified in the prerequisite check

7. **Contact Ansys customer support**:
   - "Include the command output and the Discovery application log"
   - "When contacting Ansys customer support"
   - If the prerequisite check still fails after updates
   - Contact support with the diagnostic information

### Community Report

> "Upon launching Discovery after installation, prerequisite checking occurs automatically to ensure there are no installation issues that may lead to unexpected behaviors or failures. The results of these checks are reported in several ways: a dialog box reports any missing or out-of-date prerequisites. Open the Windows command prompt as administrator and run Ans.DriverSetup.exe --check-system-compatibility."

## 5. NVIDIA Driver Version Below 528.33 Causing Incompatibility

### Symptom

Discovery launches but experiences graphical glitches, crashes, or performance issues. The NVIDIA driver is older than version 528.33. The issue may occur after a Discovery update or version upgrade. Some features may not work correctly or the application may crash during simulation.

### Root Cause

"The minimum required driver version for minor version compatibility being >= 528.33." Discovery uses NVIDIA CUDA and OpenGL features that require specific driver versions. Drivers older than 528.33 may not support the CUDA or OpenGL features used by the current Discovery version. This is a "minor version incompatibility" — the driver is NVIDIA but too old for the current Discovery version.

### Fix

1. **Update NVIDIA drivers to 528.33 or newer**:
   - "We recommend you update your graphics card to the latest drivers"
   - "From the NVIDIA website prior to installation"
   - "With the minimum required driver version for minor version compatibility being >= 528.33"
   - Download from https://www.nvidia.com/drivers

2. **Use NVIDIA Studio Driver instead of Game Ready**:
   - For professional applications like Discovery
   - Use the NVIDIA Studio Driver
   - Instead of the Game Ready Driver
   - Studio drivers are more stable for CAD/CAE applications

3. **Clean install the driver**:
   - Use NVIDIA's clean install option
   - Or use DDU (Display Driver Uninstaller)
   - To completely remove old drivers
   - Then install the new driver

4. **Check driver version after installation**:
   - Open NVIDIA Control Panel
   - Check the driver version
   - Ensure it's 528.33 or newer
   - Restart Discovery after driver update

5. **Check for unsupported cards**:
   - "The following cards are no longer supported at 2026 R1"
   - Check the Ansys graphics cards tested list
   - If your card is no longer supported
   - You may need to upgrade your GPU

6. **Verify CUDA support**:
   - After updating drivers
   - Verify CUDA is working
   - Use the Discovery prerequisite checker
   - Or GPU Caps Viewer

7. **Check for driver conflicts**:
   - If multiple graphics drivers are installed
   - (e.g., both NVIDIA and Intel)
   - Ensure Discovery uses the NVIDIA GPU
   - Set in NVIDIA Control Panel > Manage 3D Settings

### Community Report

> "We recommend you update your graphics card to the latest drivers from the NVIDIA website prior to installation, with the minimum required driver version for minor version compatibility being >= 528.33. With AMD cards and non-compliant NVIDIA cards, Discovery still functions but access to the Explore stage, or to the Refine stage using the LiveGX solver, is disabled."

## 6. Additional Ansys Discovery Issues

### Discovery GPU HPC Licensing

**Issue**: How many GPU cards can be used with Discovery?
**Fix**: "Discovery offers GPU-based solvers, with 1 GPU card included. You cannot use multiple GPU cards. CPU solves are supported only in the Refine stage and follow standard HPC task consumption rates for cores requested."

### Intel Arc Pro Graphics Support

**Issue**: Can Intel Arc Pro graphics cards be used with Discovery?
**Fix**: "Intel Arc Pro graphics cards are also supported in the Modeling stage." Intel Arc Pro can be used for the Modeling stage with at least 2 GB of dedicated video memory (4+ GB recommended). But not for Explore or Refine LiveGX stages.

### Discovery 2026 R1 Unsupported Cards

**Issue**: "The following cards are no longer supported at 2026 R1."
**Fix**: Check the Ansys 2026 R1 platform support documentation. If your card is no longer supported, upgrade to a supported NVIDIA or AMD card. "Discovery maintains support for as long as NVIDIA drivers and SDKs allow."

### Refine Stage with Fluent Solver GPU Requirements

**Issue**: What GPU is needed for the Refine stage with Fluent solver?
**Fix**: "Dedicated NVIDIA Quadro or AMD Radeon Pro graphics card with the latest vendor drivers supporting OpenGL version 4.6 and a minimum of 4 GB of dedicated video memory." Recommended: 8 GB.

### Refine Stage with MAPDL Solver GPU Requirements

**Issue**: What GPU is needed for the Refine stage with MAPDL solver?
**Fix**: Same as Fluent solver — "Dedicated NVIDIA Quadro or AMD Radeon Pro graphics card with the latest vendor drivers supporting OpenGL version 4.6 and a minimum of 4 GB." These don't require CUDA.

### Model Stage GPU Requirements

**Issue**: What GPU is needed for the Model stage?
**Fix**: "Dedicated graphics card with the latest vendor drivers supporting OpenGL version 4.6 and a minimum of 2 GB of dedicated video memory." Recommended: 4 GB NVIDIA Quadro or AMD Radeon Pro.

### License Server Version Compatibility

**Issue**: What license server version is required?
**Fix**: "When running Ansys Products Release 2025 R1 or newer, your license server must be using a minimum of Ansys License Manager Release 2024 R1.03. Client systems must be pointing to the license server, using an FlexNet Publisher binaries equal to or greater than v11.19.5.0."

## Best Practices

1. **Use NVIDIA Maxwell or newer GPU** — required for Explore and Refine LiveGX stages
2. **Keep NVIDIA drivers updated to 528.33+** — ensures minor version compatibility
3. **Use NVIDIA Studio Driver** — more stable for professional applications
4. **Enable port 443 firewall exceptions** — for license activation communication
5. **Add ansysls_client.exe to antivirus exclusions** — prevents license activation blocking
6. **Lower fidelity slider for GPU memory issues** — prevents CPU fallback
7. **Use 8 GB VRAM GPU for complex models** — recommended for Explore stage
8. **Run system compatibility check** — use Ans.DriverSetup.exe --check-system-compatibility
9. **Check prerequisite dialog on launch** — identifies missing or outdated prerequisites
10. **Use Refine stage with Fluent/MAPDL for non-NVIDIA GPUs** — CPU-based solvers work with AMD
