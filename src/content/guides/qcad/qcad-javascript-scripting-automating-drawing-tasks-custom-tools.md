---
title: "QCAD JavaScript Scripting: Automating Drawing Tasks and Custom Tools"
excerpt: "A developer guide to QCAD Professional's JavaScript scripting API, covering entity creation, property modification, batch operations, and custom tool development for automated 2D drafting workflows."
category: "workflow"
softwareSlug: "qcad"
keyword: "qcad javascript scripting"
slug: "qcad-javascript-scripting-automating-drawing-tasks-custom-tools"
author: "CADGuide Technical Editorial"
readTime: "12 min read"
date: "2026-06-30"
sources:
  - "https://qcad.org/en/qcad-scripting"
  - "https://qcad.org/en/qcad-documentation/scripting"
---

# QCAD JavaScript Scripting: Automating Drawing Tasks and Custom Tools

QCAD Professional includes a JavaScript scripting engine that provides programmatic access to the drawing database. Unlike LISP-based CAD automation, QCAD uses modern JavaScript (ECMAScript), making it accessible to web developers and anyone familiar with JS syntax. This guide covers the scripting API from basic entity creation to custom automation tools.

## Scripting Environment

### Running Scripts

1. File > Run Script > select a `.js` file
2. Or from command line: `qcad -autostart myscript.js`

### Script File Structure

A QCAD script file is a plain JavaScript file with access to QCAD's API objects:

```javascript
// Simple script: draw a rectangle
var doc = getDocument();
var op = new RAddObjectsOperation();

var x = 0, y = 0, w = 100, h = 50;

// Create four lines
var line1 = new RLineEntity(doc, new RLineData(
    new RVector(x, y),
    new RVector(x + w, y)
));
var line2 = new RLineEntity(doc, new RLineData(
    new RVector(x + w, y),
    new RVector(x + w, y + h)
));
var line3 = new RLineEntity(doc, new RLineData(
    new RVector(x + w, y + h),
    new RVector(x, y + h)
));
var line4 = new RLineEntity(doc, new RLineData(
    new RVector(x, y + h),
    new RVector(x, y)
));

op.addObject(line1);
op.addObject(line2);
op.addObject(line3);
op.addObject(line4);

docInterface.applyOperation(op);
```

## Core API Objects

### getDocument()

Returns the current document object, providing access to the drawing database.

### RVector

Represents a 2D or 3D point:
```javascript
var pt = new RVector(100, 50, 0);
var x = pt.x;  // 100
var y = pt.y;  // 50
```

### RLineEntity

A line entity:
```javascript
var line = new RLineEntity(doc, new RLineData(
    new RVector(0, 0),
    new RVector(100, 0)
));
```

### RCircleEntity

A circle entity:
```javascript
var circle = new RCircleEntity(doc, new RCircleData(
    new RVector(50, 50),  // center
    25                     // radius
));
```

### RArcEntity

An arc entity:
```javascript
var arc = new RArcEntity(doc, new RArcData(
    new RVector(50, 50),  // center
    25,                    // radius
    0,                     // start angle (radians)
    Math.PI                // end angle (180°)
));
```

### RPolylineEntity

A polyline entity:
```javascript
var poly = new RPolylineEntity(doc, new RPolylineData());
poly.appendVertex(new RVector(0, 0));
poly.appendVertex(new RVector(100, 0));
poly.appendVertex(new RVector(100, 50));
poly.appendVertex(new RVector(0, 50));
poly.setClosed(true);
```

## Entity Properties

### Setting Layer

```javascript
var line = new RLineEntity(doc, new RLineData(
    new RVector(0, 0),
    new RVector(100, 0)
));
line.setLayerName("A-WALL");
```

### Setting Color

```javascript
line.setColor(new RColor(255, 0, 0));  // Red
```

### Setting Linetype

```javascript
line.setLinetypeId(doc.getLinetypeId("DASHED"));
```

### Setting Lineweight

```javascript
line.setLineweight(RLineweight.Weight025);  // 0.25mm
```

## Querying Existing Entities

### Getting All Entities

```javascript
var doc = getDocument();
var op = new RAddObjectsOperation();

// Query all entities
var it = doc.queryAllEntities();
var entityIds = [];
while (it.hasNext()) {
    var id = it.next();
    var entity = doc.queryEntity(id);
    if (entity.getType() === RS.EntityLine) {
        entityIds.push(id);
    }
}
```

### Selecting by Layer

```javascript
var it = doc.queryAllEntities();
while (it.hasNext()) {
    var entity = doc.queryEntity(it.next());
    if (entity.getLayerName() === "A-WALL") {
        // Process wall entity
        var data = entity.getData();
        var startPoint = data.getStartPoint();
        var endPoint = data.getEndPoint();
    }
}
```

## Batch Operations

### Batch Purge

```javascript
var doc = getDocument();
var op = new RDeleteObjectsOperation();

// Find and delete all unused blocks
var blockIds = doc.queryAllBlocks();
while (blockIds.hasNext()) {
    var blockId = blockIds.next();
    var block = doc.queryBlock(blockId);
    // Check if block is referenced
    var refIt = doc.queryAllEntities();
    var isUsed = false;
    while (refIt.hasNext()) {
        var entity = doc.queryEntity(refIt.next());
        if (entity.getType() === RS.EntityBlockRef &&
            entity.getReferencedBlockId() === blockId) {
            isUsed = true;
            break;
        }
    }
    if (!isUsed) {
        op.deleteObject(block);
    }
}
docInterface.applyOperation(op);
```

### Batch Layer Color Change

```javascript
var doc = getDocument();
var op = new RModifyObjectsOperation();

var it = doc.queryAllEntities();
while (it.hasNext()) {
    var entity = doc.queryEntity(it.next());
    if (entity.getLayerName() === "A-WALL") {
        entity.setColor(new RColor(255, 0, 0));
        op.addObject(entity);
    }
}
docInterface.applyOperation(op);
```

## Creating Custom Tools

### Grid of Holes

```javascript
function createHoleGrid(originX, originY, rows, cols, spacing, radius) {
    var doc = getDocument();
    var op = new RAddObjectsOperation();
    
    for (var row = 0; row < rows; row++) {
        for (var col = 0; col < cols; col++) {
            var cx = originX + col * spacing;
            var cy = originY + row * spacing;
            var circle = new RCircleEntity(doc, new RCircleData(
                new RVector(cx, cy),
                radius
            ));
            circle.setLayerName("DRILLING");
            op.addObject(circle);
        }
    }
    
    docInterface.applyOperation(op);
    EAction.handleUserMessage("Created " + (rows * cols) + " holes.");
}

// Create a 5x5 grid of 5mm holes at 20mm spacing
createHoleGrid(0, 0, 5, 5, 20, 2.5);
```

### Dimension All Walls

```javascript
function dimensionAllWalls() {
    var doc = getDocument();
    var op = new RAddObjectsOperation();
    
    var it = doc.queryAllEntities();
    while (it.hasNext()) {
        var entity = doc.queryEntity(it.next());
        if (entity.getType() === RS.EntityLine &&
            entity.getLayerName() === "A-WALL") {
            
            var data = entity.getData();
            var p1 = data.getStartPoint();
            var p2 = data.getEndPoint();
            
            // Create aligned dimension
            var dim = new RDimAlignedEntity(doc, new RDimAlignedData(
                p1, p2,
                new RVector((p1.x + p2.x) / 2, (p1.y + p2.y) / 2 + 10)
            ));
            dim.setLayerName("A-ANNO-DIMS");
            op.addObject(dim);
        }
    }
    
    docInterface.applyOperation(op);
    EAction.handleUserMessage("Dimensions created for all walls.");
}

dimensionAllWalls();
```

## File Operations

### Open a File

```javascript
var docInterface = getDocumentInterface();
docInterface.openFile("C:/drawings/floorplan.dxf");
```

### Save As

```javascript
var docInterface = getDocumentInterface();
docInterface.saveFile("C:/drawings/floorplan-modified.dxf");
```

### Export to PDF

```javascript
var docInterface = getDocumentInterface();
var printer = new RPrinter();
printer.setPaperSize("A3");
printer.setOrientation(RS.Landscape);
printer.setScale(1/50);  // 1:50
printer.setOutputFile("C:/output/floorplan.pdf");
printer.setVectorFormat("PDF");
docInterface.exportFile(printer);
```

## Running Scripts from Command Line

For batch processing without the GUI:

```bash
qcad -autostart batch-process.js -no-gui
```

This runs the script headlessly, processes the drawing, and exits — ideal for automated workflows and scheduled tasks.

## Conclusion

QCAD Professional's JavaScript scripting API provides a modern, accessible automation pathway for 2D drafting. Unlike LISP-based CAD automation, JavaScript is familiar to millions of web developers, lowering the barrier to entry. The API covers entity creation, property modification, batch operations, and file I/O — enough to build custom tools for any repetitive 2D drafting workflow. Combined with command-line execution for headless batch processing, QCAD scripting is a powerful feature for teams looking to automate their drafting production.
