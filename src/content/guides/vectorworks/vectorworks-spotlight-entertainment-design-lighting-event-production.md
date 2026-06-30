---
title: "Vectorworks Spotlight: Entertainment Design, Lighting, and Event Production Workflow"
excerpt: "A guide to Vectorworks Spotlight for entertainment and event design covering stage layout, lighting plot creation, truss and rigging design, rendering with Vision, and paperwork generation for live events."
category: "workflow"
softwareSlug: "vectorworks"
keyword: "vectorworks spotlight entertainment"
slug: "vectorworks-spotlight-entertainment-design-lighting-event-production"
author: "CADGuide Technical Editorial"
readTime: "12 min read"
date: "2026-06-30"
sources:
  - "https://app-help.vectorworks.net/spotlight/"
  - "https://www.vectorworks.net/en-US/products/spotlight"
---

# Vectorworks Spotlight: Entertainment Design, Lighting, and Event Production Workflow

Vectorworks Spotlight is the entertainment and event design module, widely used by lighting designers, set designers, and event producers for theatre, concerts, corporate events, and exhibitions. It provides specialized tools for stage layout, lighting plots, truss and rigging, and paperwork generation. This guide covers the complete entertainment design workflow.

## Project Setup

### Template Selection

1. File > New > select "Spotlight" template
2. The template includes:
   - Standard layer structure (Stage, Lighting, Rigging, Audio, Video, Set)
   - Pre-configured classes for lighting instruments, trusses, and set pieces
   - Standard title blocks for lighting plots and stage plans

### Layer and Class Setup

| Layer | Z-Elevation | Purpose |
|-------|------------|---------|
| Stage | 0 | Stage geometry and set pieces |
| Lighting | +6000 | Lighting positions and instruments |
| Rigging | +6000 | Trusses, motors, and rigging hardware |
| Audio | +3000 | Speaker positions |
| Video | +4000 | LED screens and projectors |
| Ground | 0 | Floor patterns, audience areas |

## Stage and Set Design

### Stage Creation

1. Spotlight > Stage Tool
2. Draw the stage outline
3. Set:
   - **Deck height**: e.g., 1500mm
   - **Stage type**: Modular (4×8ft decks) or custom
   - **Leg height**: Calculated from deck height
4. Add stage risers and stairs as needed

### Set Pieces

1. Spotlight > 3D Modeling tools
2. Create set walls, platforms, and props
3. Use the Symbol Library for standard set pieces:
   - Flats (theater walls)
   - Platforms and stairs
   - Curtain tracks and legs
   - Furniture and props

### Audience Layout

1. Spotlight > Seating Tool
2. Draw audience area
3. Set:
   - **Seating type**: Theater, banquet, standing
   - **Row spacing**: e.g., 900mm for theater
   - **Seat width**: e.g., 500mm
4. Vectorworks calculates capacity

## Lighting Design

### Lighting Positions

1. Spotlight > Lighting Position Tool
2. Draw the lighting position (pipe, truss, or boom)
3. Set:
   - **Position type**: Front-of-house, stage left, stage right, overhead
   - **Height**: e.g., 6000mm
   - **Length**: e.g., 6000mm
4. Name each position (e.g., "FOH 1", "DS Truss", "US Boom")

### Inserting Lighting Instruments

1. Spotlight > Lighting Instrument Tool
2. Select instrument type from the Symbol Library:
   - **Ellipsoidal (LEKO)**: ETC Source Four, Vari-Lite
   - **Wash**: ETC Color Force, ROBE Wash
   - **Moving Light**: ROBE Pointe, Martin MAC, Clay Paky
   - **LED Fixture**: ETC ColorSource, Chauvet
   - **Follow Spot**: Lycian, Strong
3. Click on a lighting position to insert
4. Set parameters in Object Info palette:
   - **Channel**: DMX channel number
   - **Address**: DMX address (e.g., 1/001)
   - **Universe**: DMX universe number
   - **Gel color**: Standard gel number (e.g., R26, R02)
   - **Gobo**: Pattern for ellipsoidals
   - **Focus point**: Where the light is aimed
   - **Position**: Which lighting position it's on
   - **Purpose**: What it lights (e.g., "Wash DS", "Special on vocal")

### Focus Points

1. Spotlight > Focus Point Tool
2. Click on the stage where lights should aim
3. Assign focus points to instruments in the Object Info palette
4. In 3D view, light beams point toward their focus points

### Lighting Beam Visualization

1. View > Lighting > Beam Visualization
2. Vectorworks draws light beams in 3D:
   - **Beam shape**: Cone for ellipsoidals, fan for wash lights
   - **Beam color**: Based on assigned gel color
   - **Field angle**: Based on lens (19°, 26°, 36°, 50°)
3. Check for beam coverage and overlap

## Truss and Rigging

### Truss Creation

1. Spotlight > Truss Tool
2. Select truss type from library:
   - **Tomcat**: 12×12, 20×20, 24×24
   - **Tyler**: 12×12, 20×20
   - **Prolyte**: H30V, H40V, X30V
   - **Global**: 12×12, 20×20
3. Draw the truss run
4. Set height and support points

### Motor Placement

1. Spotlight > Motor Tool
2. Select motor type (1-ton, 0.5-ton, 0.25-ton)
3. Click on the truss to place
4. Set:
   - **Pick point**: Where the motor attaches to the structure
   - **Load**: Weight of truss + fixtures
5. Vectorworks calculates total load per motor

### Rigging Points

1. Spotlight > Rigging Point Tool
2. Click on the ceiling/structure where the motor hangs
3. Set:
   - **Point type**: Dead hang, hoist, or manual
   - **Working Load Limit (WLL)**: Maximum safe load
   - **Safety factor**: Typically 7:1 or 10:1 for overhead rigging
4. Generate a rigging point plot showing all points with loads

## Paperwork Generation

### Lightwright Integration

1. Tools > Reports > Export to Lightwright
2. Vectorworks exports:
   - Channel, Address, Universe, Instrument type, Position, Purpose, Gel, Gobo, Focus
3. Open in Lightwright for complete paperwork management
4. Lightwright generates:
   - Channel hookup
   - DMX address chart
   - Magic sheets
   - Shop orders

### Channel Hookup

1. Tools > Reports > Create Report
2. Select object type: Lighting Instruments
3. Sort by: Channel number
4. Fields: Channel, Position, Instrument, Gel, Purpose, Address
5. Generate the channel hookup worksheet

### Instrument Schedule

1. Tools > Reports > Create Report
2. Select object type: Lighting Instruments
3. Sort by: Position
4. Fields: Position, Instrument, Channel, Gel, Gobo, Focus, Weight
5. Generate the instrument schedule

### Weight Load Calculation

1. Tools > Reports > Rigging Report
2. Vectorworks calculates:
   - Total weight per truss
   - Weight per motor
   - Weight per rigging point
   - Safety factor per point
3. Verify all points are within WLL
4. Generate a rigging load report for the structural engineer

## Rendering and Visualization

### Renderworks Rendering

1. View > Rendering > Custom Renderworks
2. Set:
   - **Lighting**: Include lighting instrument beams
   - **Shadows**: On
   - **Quality**: High for presentation
3. Render the 3D view to show:
   - Stage and set in 3D
   - Lighting beams with color
   - Shadows from set pieces
   - Audience perspective views

### Vision Integration

1. File > Export > Vision
2. Vectorworks exports the 3D model and lighting data to Vision (previsualization software)
3. In Vision:
   - Connect to a lighting console (via Art-Net or sACN)
   - See lighting cues in real-time on the 3D model
   - Program and test cues before arriving at the venue

### Camera Views

1. View > Create Camera
2. Position the camera at audience viewing angles
3. Create multiple camera views:
   - FOH (front of house)
   - Stage left wing
   - Stage right wing
   - Overhead
4. Use these for client presentations and design reviews

## Drawing Production

### Light Plot

1. Create a viewport at 1:50 or 1:100
2. Show: Stage, set pieces, lighting positions, instruments, focus points
3. Add:
   - Instrument labels (channel, type, gel)
   - Position labels
   - Scale bar and north arrow
   - Title block with show name, venue, designer

### Section Views

1. View > Create Viewport > Section
2. Cut through the stage at key positions
3. Show: Stage height, truss height, lighting angles, sightlines
4. Verify audience sightlines to stage

### Rigging Plot

1. Create a viewport showing rigging points
2. Show: Rigging point locations, motor types, loads
3. Add a load table
4. This plot goes to the structural engineer for approval

## Conclusion

Vectorworks Spotlight provides a complete entertainment design workflow: stage and set modeling, lighting plot creation with instrument libraries, truss and rigging design with load calculations, paperwork generation (channel hookup, instrument schedule, rigging report), rendering with light beams, and previsualization through Vision integration. For lighting designers, set designers, and event producers, Spotlight is the industry-standard tool that covers the entire production from concept to paperwork. The Lightwright integration and Vision previsualization make it particularly powerful for large-scale productions where accuracy and safety are critical.
