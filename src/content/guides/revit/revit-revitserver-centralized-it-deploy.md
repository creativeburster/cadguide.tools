### 1. Executive Summary & Objective
This enterprise IT guide provides deployment procedures and performance optimizations for configuring **Revit Server** in a multi-site WAN infrastructure, detailing the centralized Host and local Accelerator hub-and-spoke setup.

### 2. Hub-and-Spoke Architecture Overview
Revit Server enables model-based worksharing across WAN environments by distributing server roles:
*   **Central Host**: The primary node that stores the master central Revit models and handles model lock states.
*   **Local Accelerator**: Caches model files locally to speed up open, sync, and reload operations for workstations on the same local area network (LAN).
*   **Admin**: Provides Web UI administration tools to manage folder directories and locks.

### 3. Step-by-Step Server and Client Deployment Playbook

#### Step 1: Install and Configure Revit Server Roles
1. Run the Revit Server installer (ensuring the release version matches your Revit client version exactly, e.g., 2026).
2. During installation, select the desired roles for the node (e.g., enable **Host** and **Admin** on the central office server; enable **Accelerator** on remote office servers).
3. Ensure all servers are joined to the same Windows Active Directory domain.

#### Step 2: Configure and Deploy the RSN.ini File
All client machines and Revit Server instances must possess a matching `RSN.ini` file to locate Central Hosts:
1. Create a new text file named **`RSN.ini`**.
2. Input the hostnames or IP addresses of all designated **Revit Server Hosts** (one host per line):
   ```text
   central-host-01.yourdomain.local
   central-host-02.yourdomain.local
   ```
3. Deploy this file to the following paths on all target computers:
   *   **Revit Client Workstations**:
       `C:\ProgramData\Autodesk\Revit <Version>\`
   *   **Revit Server Instances**:
       `C:\ProgramData\Autodesk\Revit Server <Version>\Config\`

#### Step 3: Connect Client Workstations to the Local Accelerator
To route client traffic through the local cache node rather than sending all sync requests directly to the distant central host:
1. Open Revit on the client workstation.
2. Go to the **Collaborate** tab > **Coordinate** panel > **Manage Connection to a Revit Server Accelerator**.
3. Input the IP address or hostname of the **local Accelerator** running on the office LAN, and click **Connect**.

### 4. Performance Optimizations & WAN Constraints
*   **Latency Thresholds**: While the local Accelerator caches geometric assets, operations involving element checkout, workset borrowing, and synchronization handshakes are routed directly to the Central Host. If network latency between the Accelerator and Host exceeds **100 ms**, users will experience noticeable delays during save-to-central routines.
*   **Port and Firewall Configuration**: Open port **`808`** (TCP) for Revit Server communication. Ensure **ICMP (Ping)** is enabled between Host and Accelerator nodes to allow connection health monitoring.

### 5. Official References & Source Links
*   **Autodesk Help**: [Revit Server Installation and Configuration Guide](https://help.autodesk.com/)
*   **Autodesk Support**: [Troubleshooting Revit Server Connection Issues](https://knowledge.autodesk.com/)
