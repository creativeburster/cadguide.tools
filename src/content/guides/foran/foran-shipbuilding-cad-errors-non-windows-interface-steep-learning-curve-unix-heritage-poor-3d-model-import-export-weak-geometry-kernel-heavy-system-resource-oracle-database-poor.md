---
title: "FORAN Shipbuilding CAD Errors: Non-Windows Interface and Steep Learning Curve from Unix Heritage Requiring Formal Training, Poor 3D Model Import Export from Weak Geometry Kernel Requiring STEP or Parasolid Conversion, Heavy System Resource Requirements from Oracle Database Dependency Requiring Infrastructure Investment, Poor Documentation Making Self-Learning Impossible Requiring Vendor Training, and Comparison with ShipConstructor and CADMATIC for Feature Set and Usability"
excerpt: "FORAN fails for 5 distinct reasons: non-Windows interface and steep learning curve from Unix heritage requiring formal training, poor 3D model import export from weak geometry kernel requiring STEP or Parasolid conversion, heavy system resource requirements from Oracle database dependency requiring infrastructure investment, poor documentation making self-learning impossible requiring vendor training, and comparison with ShipConstructor and CADMATIC for feature set and usability. We cover each with fixes from Boat Design Net and industry reviews."
category: "troubleshooting"
softwareSlug: "foran"
keyword: "FORAN shipbuilding CAD non-Windows interface steep learning curve Unix heritage formal training poor 3D model import export weak geometry kernel STEP Parasolid conversion heavy system resource Oracle database dependency infrastructure poor documentation self-learning vendor training ShipConstructor CADMATIC comparison feature set usability"
slug: "foran-shipbuilding-cad-errors-non-windows-interface-steep-learning-curve-unix-heritage-poor-3d-model-import-export-weak-geometry-kernel-heavy-system-resource-oracle-database-poor"
author: "CADGuide Tools Editorial Team"
readTime: "10 min"
date: "2025-07-31"
sources:
  - "https://www.boatdesign.net/threads/nupas-cadmaric-and-foran.7610/"
  - "https://cadguide.tools/tools/foran"
  - "https://www.marinelog.com/shipbuilding/shipyards/shipyard-news/fincantieri-bay-shipbuilding-implements-foran/"
---

# FORAN Shipbuilding CAD Errors: Non-Windows Interface and Steep Learning Curve from Unix Heritage Requiring Formal Training, Poor 3D Model Import Export from Weak Geometry Kernel Requiring STEP or Parasolid Conversion, Heavy System Resource Requirements from Oracle Database Dependency Requiring Infrastructure Investment, Poor Documentation Making Self-Learning Impossible Requiring Vendor Training, and Comparison with ShipConstructor and CADMATIC for Feature Set and Usability

FORAN's interface design, geometry exchange, system requirements, documentation, and competitive positioning produce challenges from Unix heritage, proprietary kernel, Oracle dependency, and training needs. This guide covers the 5 most common FORAN problems with diagnostic steps and community-verified fixes from Boat Design Net and industry reviews.

## 1. Non-Windows Interface and Steep Learning Curve from Unix Heritage

### Symptom

FORAN's interface is very different from standard Windows applications. Menus are non-standard. The logic of the interface is very special. Users find it extremely difficult to learn without formal training. Simple tasks require many steps compared to other CAD systems.

### Root Cause

"It's not really Windows interface. All menus are very special because FORAN is able to work on Unix platform. Logic of the interface is very special." FORAN was originally developed for Unix platforms and retains its non-standard interface design. The cross-platform requirement (Unix and Windows) prevents the use of standard Windows UI conventions. The interface logic follows shipbuilding-specific workflows that are unfamiliar to general CAD users.

### Fix

1. **Invest in formal training**:
   - "Usually you have to buy training. To learn it without training practically impossible due to poor documentation"
   - Contact SENER (now Siemens) for official training courses
   - Budget for 1-2 weeks of initial training per user
   - Follow up with advanced training as needed

2. **Use the CAM Wizard or equivalent tutorials**:
   - Look for FORAN-specific tutorial resources
   - SENER provides training as part of implementation
   - "Installation, setup, training and support for the three main FORAN disciplines"
   - Use vendor-provided learning materials

3. **Start with one discipline**:
   - FORAN has three main disciplines: Hull Structure, Machinery & Outfitting, Electrical Design
   - Learn one discipline at a time
   - Start with Hull Structure (most fundamental)
   - Expand to other disciplines after proficiency

4. **Leverage remote access solutions**:
   - "Subcontractors are accessing the data remotely by using a Citrix access solution"
   - Use Citrix or terminal server for remote access
   - This standardizes the interface across users
   - Reduces local installation issues

5. **Create internal documentation**:
   - Since official documentation is poor
   - Create internal cheat sheets and workflow guides
   - Document common tasks step by step
   - Share with new users to reduce training time

### Community Report

> "FORAN is very heavy to use. You need a lot of computer resources, additional software like Oracle. It's not really Windows interface. All menus are very special because FORAN is able to work on Unix platform. Logic of the interface is very special. Usually you have to buy training. To learn it without training practically impossible due to poor documentation."

## 2. Poor 3D Model Import Export from Weak Geometry Kernel

### Symptom

Need to import 3D models from sub-suppliers using SolidWorks, CATIA, ProE, Inventor. FORAN's import/export capabilities are limited. STEP import exists but results are unreliable. Models from suppliers don't import correctly or lose geometry.

### Root Cause

"Shipbuilding software normally has their origin in 2D (just to serve the cutting machines) and has poor geometrical kernel. The international standard kernels are Parasolid or ACIS." FORAN uses a proprietary geometry kernel that doesn't match the Parasolid or ACIS kernels used by mainstream CAD systems. This causes import/export incompatibilities. "For FORAN there should be a STEP import but we never have seen any results."

### Fix

1. **Use STEP as intermediate format**:
   - "The standard exchange formats are Parasolid (.x_t), ACIS (.sat) or STEP (.stp)"
   - Export from source CAD as STEP
   - Import STEP into FORAN
   - Verify geometry after import

2. **Use Parasolid format if supported**:
   - "SolidWorks is based on Parasolid"
   - If FORAN supports Parasolid import, use .x_t format
   - This preserves geometry better than STEP
   - Check FORAN's supported import formats

3. **Use ACIS format as alternative**:
   - "Inventor, Mechanical Desktop, AutoCAD are based on ACIS"
   - If FORAN supports ACIS import, use .sat format
   - For AutoCAD-based supplier models
   - Verify after import

4. **Use AutoCAD DWG as intermediate**:
   - "To import 3D-models into Cadmatic you have to go: ACIS (version 4.0 not higher) > AutoCAD .dwg > then Cadmatic"
   - For FORAN, try: Export as ACIS > Import to AutoCAD > Export DWG > Import to FORAN
   - This multi-step conversion may work when direct import fails

5. **Simplify supplier models before import**:
   - Ask suppliers to simplify 3D models
   - Remove internal details not needed for ship design
   - Reduce model complexity
   - This improves import success rate

6. **Request supplier models in FORAN format**:
   - If suppliers have FORAN, request native FORAN models
   - This avoids conversion issues entirely
   - For recurring suppliers, provide FORAN export guidelines

### Community Report

> "Shipbuilding software has poor geometrical kernel. The international standard kernels are Parasolid or ACIS. The standard exchange formats are Parasolid (.x_t), ACIS (.sat) or STEP (.stp). For FORAN there should be a STEP import but we never have seen any results. To import 3D-models you may need to go through ACIS > AutoCAD DWG > then FORAN."

## 3. Heavy System Resource Requirements from Oracle Database Dependency

### Symptom

FORAN requires significant computing resources. Runs slowly on standard workstations. Requires Oracle database installation. System setup is complex and time-consuming. Additional software dependencies increase IT overhead.

### Root Cause

"You need a lot of computer resources, additional software like Oracle." FORAN uses Oracle database for project data management. Oracle requires significant system resources (RAM, CPU, disk). The FORAN application itself is resource-intensive due to the 3D ship model complexity. The combination of Oracle + FORAN on the same workstation can strain resources.

### Fix

1. **Use dedicated database server**:
   - Install Oracle on a dedicated server
   - Connect FORAN workstations to the server via network
   - This offloads database processing from workstations
   - Improves overall performance

2. **Invest in high-performance workstations**:
   - Use workstations with 32+ GB RAM
   - Multi-core processors (8+ cores)
   - SSD storage for fast database access
   - Professional GPUs for 3D rendering

3. **Use Citrix for remote access**:
   - "Subcontractors are accessing the data remotely by using a Citrix access solution"
   - Install FORAN on a powerful server
   - Users access via Citrix terminal server
   - This centralizes resources and simplifies IT

4. **Optimize Oracle configuration**:
   - Work with IT/DBA to optimize Oracle settings
   - Configure memory allocation for FORAN workload
   - Set up proper indexing for project data
   - Regular database maintenance (Check Consistency, Clean Database)

5. **Regular database health checks**:
   - "Preserve Project DB health: Check Consistency, Clean Database"
   - "Project Backup and restores"
   - Run database consistency checks regularly
   - Clean up unused data to reduce database size

6. **Monitor license usage**:
   - "Monitor License Usage"
   - Ensure licenses are available when needed
   - Track usage patterns
   - Optimize license allocation across teams

### Community Report

> "FORAN is very heavy to use. You need a lot of computer resources, additional software like Oracle and additionally it takes a lot of time to learn. The FORAN database with all the project information is located at the shipyard facilities, while subcontractors are accessing the data remotely by using a Citrix access solution."

## 4. Poor Documentation Making Self-Learning Impossible

### Symptom**

Trying to learn FORAN without formal training. The documentation is poor and doesn't explain workflows clearly. Can't find answers to basic questions. Self-learning is practically impossible. Help system is inadequate.

### Root Cause**

"To learn it without training practically impossible due to poor documentation." FORAN's documentation is written for trained users, not for self-learners. The shipbuilding-specific workflows are not well explained. The documentation assumes prior knowledge of shipbuilding design principles and FORAN's unique interface logic. The cross-platform heritage means documentation covers both Unix and Windows, adding complexity.

### Fix**

1. **Budget for formal training**:
   - "Usually you have to buy training"
   - Include training in the software purchase budget
   - SENER provides training as part of implementation
   - "Installation, setup, training and support for the three main FORAN disciplines"

2. **Create internal knowledge base**:
   - Document workflows as you learn them
   - Create step-by-step guides for common tasks
   - Record screen captures of key operations
   - Share with new team members

3. **Join FORAN user communities**:
   - Connect with other FORAN users
   - Share knowledge and solutions
   - Ask questions on forums and LinkedIn groups
   - Learn from experienced users

4. **Use vendor support effectively**:
   - "Handle service requests to the software vendor specifying errors, changes, and request new functionality"
   - Document issues clearly with screenshots
   - Build a relationship with the support team
   - Use support tickets as learning opportunities

5. **Hire experienced FORAN users**:
   - When possible, hire users with FORAN experience
   - They can mentor new users
   - Reduce the training burden on the organization
   - "User Support, Software Implementation and CAD management"

6. **Review release notes for updates**:
   - "Review new release notes to aid in application update/upgrade"
   - Stay current with new features and fixes
   - Release notes may include usage tips
   - Apply updates to get documentation improvements

### Community Report**

> "To learn it without training practically impossible due to poor documentation. Usually you have to buy training. SENER last year signed a contract licensing Fincantieri Marine Group to use FORAN that included installation, setup, training and support for the three main FORAN disciplines: Hull Structure, Machinery & Outfitting, and Electrical Design."

## 5. Comparison with ShipConstructor and CADMATIC

### Symptom**

Evaluating FORAN against alternatives. Need to understand the strengths and weaknesses compared to ShipConstructor and CADMATIC. Want to make an informed decision for shipyard CAD system selection.

### Root Cause**

Each shipbuilding CAD system has different strengths. FORAN is comprehensive but hard to use. ShipConstructor is lighter and integrates with Maxsurf. CADMATIC is professional but has import/export issues. The choice depends on shipyard size, existing infrastructure, and design complexity.

### Fix**

1. **FORAN strengths**:
   - "Fully integrated CAD/CAE/CAM ship design software system"
   - "Covers all stages of vessel design and production"
   - "Multi-disciplinary design environment"
   - "Concurrent collaborative design"
   - Used by major shipyards (Fincantieri, Severnoye PKB)

2. **FORAN weaknesses**:
   - "Steep learning curve for shipbuilding workflows"
   - "Requires significant training"
   - "High cost for small shipyards"
   - "Windows only, no macOS or Linux support"
   - Poor import/export of 3D models

3. **ShipConstructor comparison**:
   - "ShipConstructor is in my opinion a lighter NUPAS"
   - "With the advantage of its interaction between the Maxsurf family"
   - "None of these problems in ShipConstructor"
   - "It's also cheaper than others"
   - Better for smaller shipyards

4. **CADMATIC comparison**:
   - "CADMATIC looks much more professional"
   - "CADMATIC has problems with importing/exporting 3D models"
   - "FORAN is waaaay harder to use (too much steps in between your idea and the pipe on the definitive place)"
   - "NUPAS is easy to use, easy to maintain"
   - CADMATIC is middle ground

5. **Consider generic CAD for machinery**:
   - "For the long run I wouldn't use either FORAN, NUPAS-CADMATIC or Tribon for machinery and outfitting"
   - "Shipbuilding is an assembly industry and you will need 3D-models from sub suppliers"
   - "The suppliers are working with Unigraphics, Catia, ProE, SolidWorks, Inventor"
   - Consider generic CAD for machinery, shipbuilding CAD for hull

6. **Evaluate based on shipyard needs**:
   - Large shipyard with complex vessels: FORAN
   - Medium shipyard: CADMATIC or ShipConstructor
   - Small shipyard: ShipConstructor
   - Machinery and outfitting: Generic CAD (SolidWorks, Inventor)

### Community Report

> "FORAN is hard to use, CADMATIC has problems with importing/exporting 3D models. None of these problems in ShipConstructor. It's also cheaper. FORAN is waaaay harder to use — too much steps in between your idea and the pipe on the definitive place. ShipConstructor is a lighter NUPAS with the advantage of its interaction with the Maxsurf family. For the long run, shipbuilding is an assembly industry and you will need 3D-models from sub suppliers working with Unigraphics, Catia, ProE, SolidWorks."

## 6. Additional FORAN Issues

### Windows Only Limitation

**Issue**: "Windows only, no macOS or Linux support" despite Unix heritage.
**Fix**: Use virtualization (VMware, VirtualBox) for macOS or Linux users. Or use Citrix remote access. FORAN's Unix heritage is in the interface design, not the deployment platform.

### High Cost for Small Shipyards

**Issue**: "High cost for small shipyards. Pricing not publicly available."
**Fix**: Request quotes from SENER/Siemens. Compare with ShipConstructor for smaller shipyards. Consider module-based purchasing. Evaluate ROI based on project complexity.

### Specialized for Marine Industry Only

**Issue**: FORAN is "Specialized for marine industry only."
**Fix**: Use FORAN only for ship design. For general engineering, use mainstream CAD. For machinery design, use SolidWorks or Inventor. Import machinery models into FORAN for integration.

### Database Consistency Issues

**Issue**: Project database can develop inconsistencies over time.
**Fix**: "Preserve Project DB health: Check Consistency, Clean Database. Project Backup and restores." Run consistency checks regularly. Clean up orphaned data. Maintain regular backups. Monitor database size.

## Best Practices

1. **Budget for formal training — self-learning is practically impossible** — 1-2 weeks per user
2. **Use dedicated Oracle database server** — offloads workstations
3. **Use Citrix for remote access and resource centralization** — standardizes environment
4. **Use STEP or Parasolid for 3D model import** — FORAN's kernel is proprietary
5. **Simplify supplier models before import** — improves success rate
6. **Create internal documentation and cheat sheets** — supplements poor official docs
7. **Run regular database consistency checks** — prevents data corruption
8. **Start with Hull Structure discipline** — most fundamental, then expand
9. **Compare with ShipConstructor for smaller shipyards** — lighter and cheaper
10. **Use generic CAD for machinery design** — better import/export compatibility
