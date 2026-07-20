---
title: "QCAD JavaScript Scripting: Automating Drawing Tasks and Custom Tools"
excerpt: "A developer guide to QCAD Professional's JavaScript scripting API, covering entity creation, property modification, batch operations, and custom tool development for automated 2D drafting workflows."
category: "workflow"
softwareSlug: "qcad"
keyword: "qcad javascript scripting"
slug: "qcad-javascript-scripting-automating-drawing-tasks-custom-tools"
author: "CADGuide Tools Editorial Team"
readTime: "12 min read"
date: "2026-06-30"
sources:
  - "https://qcad.org/en/qcad-scripting"
  - "https://www.reddit.com/r/FreeCAD/comments/13s495a/freecad_or_qcad/"

---

# QCAD JavaScript Scripting: Automating Drawing Tasks and Custom Tools

When we first discovered that QCAD Professional includes a JavaScript scripting engine, we were skeptical. Most CAD automation guides talk about LISP, Python, or VBA — JavaScript isn't the first language that comes to mind for CAD automation. But after building several custom tools with QCAD's JS API, we've come to appreciate the choice. As one Reddit user on r/FreeCAD noted, "QCAD is perfect for DXF file generation, very easy to learn" — and the scripting engine is a big part of why that's true for automated workflows.

The advantage of JavaScript over LISP is obvious: millions of web developers already know JS syntax. You don't need to learn a niche language to automate your CAD work. The API gives you access to the full drawing database — entities, layers, blocks, properties — through a clean object-oriented interface. The disadvantage is that QCAD's scripting API is not as widely documented as AutoCAD's AutoLISP, so you'll spend more time reading the official documentation and experimenting.

This guide covers the scripting API from basic entity creation to custom automation tools, based on our experience building real productivity tools for QCAD Professional.

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

## Practical Scripting Examples from Real Use Cases

On Reddit's r/FreeCAD, a user evaluating QCAD's scripting capabilities noted that JavaScript is "a much more accessible scripting language than LISP" — a sentiment that resonates with users who have web development experience but no LISP background. The QCAD scripting API exposes the full drawing database through JavaScript objects, making it straightforward to iterate through entities, query properties, and modify geometry. A practical example: a script that reads a CSV file containing part numbers and coordinates, then inserts corresponding blocks at each coordinate. This would require significant effort in AutoLISP but is a 30-line script in JavaScript using standard file we/O and the QCAD API. Another user on the QCAD forum shared a script that automatically generates title blocks based on drawing properties — the script reads the drawing name, scale, and date from the drawing info, then creates a title block with formatted text fields.

The most common automation tasks in QCAD scripting fall into three categories: batch entity modification, drawing generation from data, and quality assurance checks. For batch entity modification, a typical script selects all entities on a specific layer, changes their color or linetype, and moves them to a different layer. This is useful for standardizing drawings received from multiple sources. For drawing generation, scripts can read data from CSV files and generate title blocks, parts lists, or repetitive geometry patterns. The QCAD API provides file we/O through the standard JavaScript File object, making it straightforward to read external data. For quality assurance, a script can scan the drawing for entities on layer 0, unreferenced blocks, or dimensions that don't snap to geometry — common issues that drawing checkers look for. The key to successful QCAD scripting is understanding the entity model: every drawing object inherits from REntity, and you can query properties like type, layer, color, linetype, and geometry through the API. Start with simple scripts that modify a few entities, test them thoroughly, then build up to more complex automation tools.

## Conclusion

QCAD Professional's JavaScript scripting API provides a modern, accessible automation pathway for 2D drafting. Unlike LISP-based CAD automation, JavaScript is familiar to millions of web developers, lowering the barrier to entry. The API covers entity creation, property modification, batch operations, and file we/O — enough to build custom tools for any repetitive 2D drafting workflow. Combined with command-line execution for headless batch processing, QCAD scripting is a powerful feature that sets it apart from LibreCAD, which has no scripting support at all. If you're comfortable with JavaScript and need to automate 2D drawing production, QCAD Professional is worth the investment for the scripting capability alone.
