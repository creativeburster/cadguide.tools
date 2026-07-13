---
title: "Planbar TIM Integration: Production Data Management and Factory Automation"
excerpt: "Configure Planbar TIM (Technical Information Manager) for precast production data exchange: manage element data, reinforcement details, and production schedules between design office and precast factory."
category: "deployment"
softwareSlug: "planbar"
keyword: "planbar TIM technical information manager production data factory"
slug: "planbar-tim-integration-production-data-management-factory"
author: "CADGuide Technical Editorial"
readTime: "10 min read"
date: "2026-07-13"
sources:
  - "https://help.allplan.com/Allplan/2025-0/1034/Allplan/352053.htm"
  - "https://www.allplan.com/products/allplan-precast/"
---

# Planbar TIM Integration: Production Data Management and Factory Automation

TIM (Technical Information Manager) is the bridge between Planbar's design environment and the precast factory's production systems. It manages the flow of production data — element geometry, reinforcement, production parameters — from the engineering office to the factory floor. Understanding TIM is essential for any precast operation using Planbar.

## What TIM Does

TIM serves as a central data hub:

1. **Receives data from Planbar** — element models, reinforcement, production parameters
2. **Stores and organizes data** — searchable database of all precast elements
3. **Distributes data to factory systems** — production control, batching, CNC machines
4. **Tracks production status** — which elements are designed, approved, in production, completed
5. **Provides web access** — factory staff can view element data through a web browser

## TIM Architecture

### Components

- **TIM Server** — central database server that stores all production data
- **TIM Client** — desktop application for managing data in Planbar
- **TIM Web** — web interface for factory staff to view and track elements
- **TIM Connect** — API for connecting to third-party factory systems

### Data Flow

```
Planbar (Design) → TIM Server (Storage) → Factory Systems (Production)
                     ↓
                 TIM Web (Status Tracking)
```

## Setting Up TIM

### Server Installation

1. Install TIM Server on a dedicated server or workstation
2. Configure the database (SQL Server or PostgreSQL)
3. Set up user accounts and permissions:
   - **Designers** — can upload and modify element data
   - **Production managers** — can view and track production status
   - **Factory operators** — can view element details and production instructions
4. Configure network access for TIM Web

### Planbar Integration

1. In Planbar, go to **File > Project Settings > TIM**
2. Enter the TIM Server address
3. Enter user credentials
4. Test the connection
5. Planbar is now linked to the TIM database

## Exporting Data to TIM

### Element Export

1. In Planbar, select the elements to export
2. Go to **Export > TIM > Export Elements**
3. Configure the export:
   - **Project** — select the TIM project
   - **Production day** — when the elements should be produced
   - **Delivery date** — when elements should be delivered to site
   - **Status** — Draft, Ready for Approval, Approved, or Released for Production
4. Click **Export**
5. TIM receives the element data including:
   - **3D geometry** — complete element model
   - **Reinforcement** — all bars, meshes, and anchors with positions
   - **Concrete data** — concrete type, volume, strength
   - **Production parameters** — curing time, stacking requirements
   - **Lifting data** — anchor positions, weight, crane requirements

### Reinforcement Data

TIM receives detailed reinforcement data:
- **Bar list** — every bar with diameter, length, shape, and position
- **Mesh data** — mesh type, dimensions, and position
- **Bending schedules** — bar bending instructions for CNC bending machines
- **Lifting anchors** — anchor type, position, and load capacity

### Production Data

Each element includes production-specific data:
- **Element ID** — unique identifier for tracking
- **Production order** — sequence in the production schedule
- **Mold requirements** — mold type and dimensions
- **Concrete volume** — for batching
- **Curing time** — minimum time before demolding
- **Stacking data** — how elements should be stacked for transport

## TIM Web Interface

### Accessing TIM Web

1. Open a web browser
2. Navigate to the TIM Web URL (e.g., http://tim-server:8080)
3. Log in with user credentials
4. The dashboard shows:
   - **Project list** — all current projects
   - **Production status** — elements by status (designed, approved, in production, completed)
   - **Daily production plan** — elements scheduled for today

### Viewing Element Details

1. Click an element in the list
2. View:
   - **3D model** — interactive 3D view of the element
   - **Shop drawing** — 2D drawing with dimensions and reinforcement
   - **Bar list** — all reinforcement bars with quantities
   - **Production instructions** — step-by-step production guide
   - **Quality control data** — inspection requirements

### Production Tracking

Factory staff update element status through TIM Web:
1. **Designed** — element is in Planbar, not yet approved
2. **Approved** — engineering review complete
3. **Released** — approved for production
4. **In production** — currently being cast
5. **Cured** — concrete has cured, ready for demolding
6. **Demolded** — removed from mold
7. **In storage** — in the storage yard
8. **Loaded** — loaded on truck for delivery
9. **Delivered** — delivered to site

This real-time tracking gives the engineering office visibility into production progress.

## Connecting to Factory Systems

### Production Control Systems

TIM connects to factory production control systems through TIM Connect API:

1. **Weckenmann** — circulatory pallet system
2. **Vollert** — pallet circulation systems
3. **EBAWE** — palletizer systems
4. **Preba** — production control software
5. **Custom systems** — via the TIM Connect API

The connection enables:
- **Automatic data transfer** — element data flows to the production system
- **Status feedback** — production status flows back to TIM
- **Scheduling** — production schedules are synchronized

### CNC Machine Connection

TIM sends reinforcement data to CNC machines:
- **Bar bending machines** — bar cutting and bending instructions
- **Mesh welding machines** — mesh welding patterns
- **CNC routers** — mold cutting paths

### Batching Plant Connection

TIM sends concrete volume and mix design to the batching plant:
- **Concrete type** — mix design specification
- **Volume** — exact volume for each element
- **Admixtures** — specific admixture requirements

## Common TIM Issues

### Elements Not Appearing in TIM

- Check the TIM server connection in Planbar settings
- Verify the export project matches a TIM project
- Check user permissions — the user may not have upload rights
- Review the export log for error messages

### Production Status Not Updating

- Factory staff may not be updating status in TIM Web
- Check the TIM Web user permissions
- Verify the production control system is connected via TIM Connect

### Reinforcement Data Incomplete

- Some reinforcement may not be recognized by TIM
- Check that all reinforcement uses Planbar's standard reinforcement tools
- Verify the reinforcement catalog is up to date
- Custom reinforcement shapes may need TIM mapping

### TIM Server Performance

- Large projects with thousands of elements can slow TIM
- Archive completed projects to reduce database size
- Ensure the server meets hardware requirements
- Schedule regular database maintenance

## Best Practices

- **Set up TIM before starting production design** — don't wait until elements are ready
- **Train factory staff on TIM Web** — they need to update production status
- **Use consistent element naming** — ensures elements are trackable
- **Export elements with correct production dates** — enables accurate scheduling
- **Review element data in TIM Web before releasing** — catch errors before production
- **Connect TIM to factory systems early** — test the data flow before full production
- **Archive completed projects** — keep the database performant
- **Use TIM Connect for automated data exchange** — manual export/import is error-prone
