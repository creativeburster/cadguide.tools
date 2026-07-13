---
title: "Dynamo Python Scripting: Extending Visual Programming with Custom Logic"
excerpt: "Embed Python scripts in Dynamo to handle complex logic, Revit API access, loops, and conditional processing that visual nodes can't achieve, with practical examples and best practices."
category: "workflow"
softwareSlug: "autodesk-dynamo"
keyword: "dynamo python scripting revit api custom logic"
slug: "dynamo-python-scripting-extending-visual-programming-custom-logic"
author: "CADGuide Technical Editorial"
readTime: "10 min read"
date: "2026-07-13"
sources:
  - "https://dynamobim.org/"
  - "https://dynatools.github.io/dynaguide/category/bim-tools/dynamo/"
---

# Dynamo Python Scripting: Extending Visual Programming with Custom Logic

Visual scripting in Dynamo is powerful, but some tasks are easier in code. Loops, conditional logic, error handling, and Revit API access are often cleaner in Python. Dynamo's Python node lets you embed Python scripts directly in your visual graph, combining the best of both approaches.

## When to Use Python in Dynamo

Use Python when:

- **Complex loops** — nested loops or conditional loops are hard to build with nodes
- **Revit API access** — need to call Revit API methods not exposed by Dynamo nodes
- **Error handling** — need try/except blocks for robust scripts
- **Custom data structures** — dictionaries, nested lists, or custom objects
- **Performance** — Python can be faster than many connected nodes for large datasets
- **Reusable logic** — encapsulate complex logic in a single node

## Adding a Python Node

1. In the Library, go to **Core > Scripting > Python Script**
2. Drag the node onto the canvas
3. Click the **"+"** button on the node to add input ports
4. Click the **"..."** button to open the Python editor

## Python Editor

The editor opens with a template:

```python
import clr

# Import Revit API
clr.AddReference('RevitAPI')
import Autodesk
from Autodesk.Revit.DB import *

# Import Revit Services
clr.AddReference('RevitServices')
import RevitServices
from RevitServices.Persistence import DocumentManager
from RevitServices.Transactions import TransactionManager

# Get the current Revit document
doc = DocumentManager.Instance.CurrentDBDocument

# Unwrap input elements
elements = UnwrapElement(IN[0])

# Transaction
TransactionManager.Instance.EnsureInTransaction(doc)

# Your code here

# End transaction
TransactionManager.Instance.TransactionTaskDone()

# Output
OUT = elements
```

### Key Imports

- **RevitAPI** — access to the Revit API classes
- **RevitServices** — document and transaction management
- **clr** — .NET Common Language Runtime bridge (allows Python to use .NET libraries)

### Input and Output

- **IN[0], IN[1], ...** — inputs from Dynamo nodes
- **OUT** — output back to Dynamo
- **UnwrapElement** — converts Dynamo elements to Revit API elements

## Example 1: Rename All Walls by Level

```python
import clr
clr.AddReference('RevitAPI')
from Autodesk.Revit.DB import *

clr.AddReference('RevitServices')
import RevitServices
from RevitServices.Persistence import DocumentManager
from RevitServices.Transactions import TransactionManager

doc = DocumentManager.Instance.CurrentDBDocument

# Get all walls
walls = FilteredElementCollector(doc) \
    .OfCategory(BuiltInCategory.OST_Walls) \
    .WhereElementIsNotElementType() \
    .ToElements()

TransactionManager.Instance.EnsureInTransaction(doc)

count = 0
for wall in walls:
    level_id = wall.LevelId
    level = doc.GetElement(level_id)
    level_name = level.Name if level else "Unknown"
    
    new_name = f"Wall_{level_name}_{count:03d}"
    param = wall.get_Parameter(BuiltInParameter.ALL_MODEL_INSTANCE_MARK)
    if param:
        param.Set(new_name)
    count += 1

TransactionManager.Instance.TransactionTaskDone()

OUT = f"Renamed {count} walls"
```

## Example 2: Filter Elements by Multiple Criteria

```python
import clr
clr.AddReference('RevitAPI')
from Autodesk.Revit.DB import *

doc = DocumentManager.Instance.CurrentDBDocument

# Input: category name, min width, level name
category_name = IN[0]
min_width = IN[1]  # in mm
level_name = IN[2]

# Get all doors
doors = FilteredElementCollector(doc) \
    .OfCategory(BuiltInCategory.OST_Doors) \
    .WhereElementIsNotElementType() \
    .ToElements()

result = []
for door in doors:
    # Check level
    level = doc.GetElement(door.LevelId)
    if level and level.Name != level_name:
        continue
    
    # Check width
    width_param = door.get_Parameter(BuiltInParameter.DOOR_WIDTH)
    if width_param:
        width_mm = width_param.AsDouble() * 304.8  # Convert feet to mm
        if width_mm >= min_width:
            result.append(door)

OUT = result
```

## Example 3: Create Elements from Data

```python
import clr
clr.AddReference('RevitAPI')
from Autodesk.Revit.DB import *

clr.AddReference('RevitServices')
import RevitServices
from RevitServices.Persistence import DocumentManager
from RevitServices.Transactions import TransactionManager

doc = DocumentManager.Instance.CurrentDBDocument

# Input: list of points (X, Y, Z), family name, type name
points = IN[0]
family_name = IN[1]
type_name = IN[2]

# Find family symbol
family = FilteredElementCollector(doc) \
    .OfClass(FamilySymbol) \
    .Where(lambda x: x.Family.Name == family_name and x.Name == type_name) \
    .FirstElement()

if not family:
    OUT = "Family not found"
else:
    TransactionManager.Instance.EnsureInTransaction(doc)
    
    if not family.IsActive:
        family.Activate()
        doc.Regenerate()
    
    created = []
    for pt in points:
        xyz = XYZ(pt[0], pt[1], pt[2])
        instance = doc.Create.NewFamilyInstance(xyz, family, Structure.StructuralType.NonStructural)
        created.append(instance)
    
    TransactionManager.Instance.TransactionTaskDone()
    OUT = f"Created {len(created)} instances"
```

## Working with Transactions

Any Revit API call that modifies the model must be inside a transaction:

```python
TransactionManager.Instance.EnsureInTransaction(doc)

# Model modifications here
wall.WallType = new_type

TransactionManager.Instance.TransactionTaskDone()
```

For read-only operations (collecting elements, reading parameters), no transaction is needed.

## Error Handling

```python
try:
    TransactionManager.Instance.EnsureInTransaction(doc)
    
    for element in elements:
        param = element.get_Parameter(BuiltInParameter.ALL_MODEL_INSTANCE_MARK)
        if param and not param.IsReadOnly:
            param.Set(new_value)
        else:
            pass  # Skip elements without the parameter
    
    TransactionManager.Instance.TransactionTaskDone()
    OUT = "Success"

except Exception as e:
    TransactionManager.Instance.TransactionTaskDone()
    OUT = f"Error: {str(e)}"
```

## Common Issues

### "AttributeError" on Revit Elements

Dynamo wraps Revit elements. Use `UnwrapElement()` to access the full Revit API:

```python
# Wrong — Dynamo wrapper doesn't have all methods
element.WallType

# Right — unwrapped Revit element
wall = UnwrapElement(IN[0])
wall.WallType
```

### Transaction Errors

"Starting a transaction from an external application" or similar errors mean you're not using the TransactionManager correctly. Always use:

```python
TransactionManager.Instance.EnsureInTransaction(doc)
# modifications
TransactionManager.Instance.TransactionTaskDone()
```

### Performance with Large Loops

Python loops over thousands of elements can be slow. Optimize by:
- Using LINQ queries instead of Python loops where possible
- Filtering elements with ElementFilter before iterating
- Batching operations

## Best Practices

- **Use Python for complex logic** — don't force everything into visual nodes
- **Keep scripts modular** — one Python node per logical operation
- **Add comments** — explain what the script does and why
- **Handle errors gracefully** — use try/except and return meaningful messages
- **Test with small datasets first** — verify before running on the full model
- **Use UnwrapElement** — always unwrap Dynamo elements before Revit API calls
- **Close transactions** — always pair EnsureInTransaction with TransactionTaskDone
- **Learn the Revit API** — the Revit API documentation is essential for Python scripting
