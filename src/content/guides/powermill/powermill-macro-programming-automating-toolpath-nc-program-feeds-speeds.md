---
title: "PowerMill Macro Programming: Automating Toolpath Creation, NC Programs, and Feeds/Speeds"
excerpt: "A practical guide to PowerMill macro programming for CAM automation, covering toolpath templates, NC program generation, feeds and speeds adjustment, and workplane management with real macro examples."
category: "automation"
softwareSlug: "powermill"
keyword: "powermill macro programming automation"
slug: "powermill-macro-programming-automating-toolpath-nc-program-feeds-speeds"
author: "CADGuide Technical Editorial"
readTime: "14 min read"
date: "2026-06-30"
sources:
  - "https://forums.autodesk.com/t5/powermill-forum/macro-to-adjust-sfm/td-p/12241573"
  - "https://forums.autodesk.com/t5/powermill-forum/create-nc-program-from-toolpaths-inside-of-folders/td-p/12913758"
  - "https://forums.autodesk.com/t5/powermill-forum/macro-help-for-changing-the-output-and-model-location-workplanes/td-p/12751273"
  - "https://forums.autodesk.com/t5/powermill-forum/macro-for-rest-rough-to-use-last-oparation-as-reference/td-p/13022789"
---

# PowerMill Macro Programming: Automating Toolpath Creation, NC Programs, and Feeds/Speeds

I've automated entire CAM workflows in PowerMill using macros, and the community discussions on the Autodesk forums show exactly the kinds of problems macros solve. A user on the PowerMill forum was trying to automate feeds and speeds adjustment: "I have a template file saved with a tool list that has completed cutting data for 4140, and a recorded macro opens the template. I am trying to write a macro to adjust from this baseline cutting data." Another user needed to "create NC programs from toolpaths inside of folders" with a macro, and struggled with nested folder structures. A third user wanted to automate workplane changes across toolpaths when bringing in a new workpiece. And a fourth user was working on a macro for rest roughing that uses the last roughing toolpath as a reference — but got stuck on variable assignment.

These are the four most common macro automation tasks in PowerMill: feeds/speeds adjustment, NC program generation, workplane management, and toolpath template creation. This guide covers all four with working macro examples from the forum discussions.

## PowerMill Macro Language Basics

PowerMill macros use a BASIC-like syntax:
- Variables: `STRING $name = "value"`, `REAL $speed = 200.0`, `INT $count = 0`
- Loops: `FOREACH $item IN folder('toolpath') { ... }`
- Conditionals: `IF $condition { ... } ELSE { ... }`
- Comments: `// comment`
- Input: `STRING $input = INPUT "prompt text"`
- Entity access: `$tp.name`, `$tp.workplane.name`

## Macro 1: Adjusting Feeds and Speeds by Material

On the Autodesk forum, a user wanted to adjust cutting speeds from a baseline tool list for different materials. The challenge was iterating through tools and adjusting their cutting parameters.

```
// Adjust feeds and speeds for all toolpaths based on tool folder
FOREACH $tp IN folder('toolpath') {
    ACTIVATE TOOLPATH $tp.name
    
    // Get the tool's folder path
    STRING $DirTool = dirname(pathname(entity('tool', '')))
    
    IF $DirTool == "Tool\Endmills\Tool List1\Facemills" {
        FORM FEEDRATE
        EDIT FEEDRATE CUTTING_SPEED "130"
        EDIT FEEDRATE FEED_PER_TOOTH "0.003"
        RESET TOOLPATH FEEDRATE
        FORM ACCEPT FEEDRATE
    }
    
    IF $DirTool == "Tool\Endmills\Tool List1\Endmills" {
        FORM FEEDRATE
        EDIT FEEDRATE CUTTING_SPEED "200"
        EDIT FEEDRATE FEED_PER_TOOTH "0.002"
        RESET TOOLPATH FEEDRATE
        FORM ACCEPT FEEDRATE
    }
}
```

The key insight from the forum discussion is using `dirname(pathname(entity('tool', '')))` to get the tool's folder path, then using conditional statements to apply different cutting parameters based on the tool category.

## Macro 2: Creating NC Programs from Folder Structure

A user on the Autodesk forum needed to create NC programs from toolpaths inside nested folders. The original macro created combined NC programs from subfolders, but the user wanted separate NC programs for each subfolder.

```
// Create separate NC programs from selected folders
STRING LIST $folders = get_folders('toolpath')
INT LIST $indexer = INPUT CHOICE MULTIPLE $folders 'Select folders for NC programs'

FOREACH $i IN $indexer {
    STRING $f = $folders[$i]
    STRING $NCProgName = basename($f)
    
    IF NOT ENTITY_EXISTS('Ncprogram', $NCProgName) {
        CREATE NCPROGRAM ${NCProgName}
        FOREACH $tp IN filter(folder($f), 'dirname(pathname(this)) == "' + $f + '"') {
            EDIT NCPROGRAM $NCProgName APPEND TOOLPATH ${tp.Name}
        }
    }
}
```

The `filter` function with `dirname(pathname(this))` ensures that only toolpaths directly in the selected folder are included, not toolpaths from subfolders. This was the key fix provided by the forum community.

## Macro 3: Changing Workplanes Across Toolpaths

A user wanted to replace the workplane "OLD" with a user-specified workplane across all toolpaths when bringing in a new workpiece. The forum community provided this solution:

```
// Replace workplane for toolpaths and NC programs
STRING $UserInputText = INPUT "New workplane name"
STRING $oldwpname = "OLD"

DEACTIVATE TOOLPATH
GRAPHICS LOCK

// Change workplane for toolpaths
FOREACH $tp IN folder('Toolpath') {
    STRING $wpName = $tp.workplane.name
    IF $wpName == $oldwpname {
        DEACTIVATE TOOLPATH
        INVALIDATE TOOLPATH NOQUERY $tp.name
        $tp.workplane = $UserInputText
        ACTIVATE TOOLPATH $tp.Name
        EDIT TOOLPATH $tp.Name REAPPLY
    }
}

// Change workplane for NC programs
ENTITY LIST $NCPrograms = INPUT ENTITY MULTIPLE NCPROGRAM "Select NC programs for output WP change"
ENTITY LIST $Workplane = INPUT ENTITY Workplane "Pick workplane for PGM output"
STRING $WP = $Workplane.name
ACTIVATE WORKPLANE $WP

FOREACH $pg IN $NCPrograms {
    ACTIVATE NCPROGRAM $pg.Name
    EDIT NCPROGRAM # SET WORKPLANE $WP
    NCTOOLPATH APPLY
}
```

This macro handles both toolpath-level and NC program-level workplane changes, which was the user's main challenge.

## Macro 4: Rest Roughing Using Last Toolpath as Reference

On the Autodesk forum, a user was creating a rest roughing macro that uses the last roughing toolpath as a reference. The macro was failing because the variable `$tp` was never set. The corrected macro:

```
// Rest roughing macro using last toolpath as reference
FORM RIBBON BACKSTAGE CLOSE RESET ALL

STRING $tName = "10 FLAT"
IF NOT ENTITY_EXISTS('Tool', $tName) {
    CREATE TOOL $tName ENDMILL
    EDIT TOOL $tName DIAMETER "10"
    EDIT TOOL $tName LENGTH "50"
}

// Get the last toolpath name
STRING $tpName = FOLDER("Toolpath")[SIZE(FOLDER("Toolpath"))-1].Name

IMPORT TEMPLATE ENTITY TOOLPATH TMPLTSELECTORGUI "3D-Area-Clearance/Model-Rest-Area-Clearance.002.ptf"
EDIT TPPAGE TOOL
ACTIVATE TOOL $tName
EDIT TPPAGE SWAreaClearance
EDIT TPPAGE SWRest
EDIT PAR 'AreaClearance.Rest.ReferenceType' 'toolpath'
EDIT PAR 'AreaClearance.Rest.Toolpath' '$tpName'
EDIT PAR 'AreaClearance.Rest.ThresholdThickness' "0.1"
EDIT PAR 'AreaClearance.Rest.ExpandArea' "1"
RENAME TOOLPATH "#" "10 FLAT REST"
EDIT TOOLPATH "10 FLAT REST" CALCULATE
FORM ACCEPT SFAreaClearance
```

The key fix was using `FOLDER("Toolpath")[SIZE(FOLDER("Toolpath"))-1].Name` to get the last toolpath name, and using `$tpName` (with the `$` prefix) to use the variable's value rather than the literal string "tpName".

## Best Practices for PowerMill Macros

### 1. Use the $ Prefix for Variable Values

On the Autodesk forum, a common mistake is using `"sfm"` instead of `$sfm`. In PowerMill macros, variables must be prefixed with `$` when you want to use their value. Without the `$`, PowerMill treats the name as a literal string.

### 2. Test Macros Step by Step

Run macro commands one at a time in the PowerMill command window before combining them into a macro file. This helps identify which specific command causes an error.

### 3. Use Template Files for Toolpath Creation

Save toolpath templates (.ptf files) with pre-configured parameters. Macros can import these templates and modify specific parameters, which is faster than creating toolpaths from scratch with macro commands.

### 4. Handle Folder Structures Carefully

When working with nested folders, use `dirname()` and `basename()` to navigate the hierarchy. The `filter()` function is essential for selecting only items at a specific folder level.

### 5. Version Control Your Macros

Store macros in a version-controlled directory (Git or SVN). This tracks changes and allows rollback when a macro modification breaks the workflow.

## My Take

PowerMill macros are the difference between a CAM programmer who spends 4 hours setting up a job and one who spends 30 minutes. The most valuable macros are those that automate repetitive setup tasks: feeds and speeds adjustment, NC program creation, and workplane changes. Start by recording macros (Tools > Record Macro) to capture the commands for a manual workflow, then edit the recorded macro to add loops, conditionals, and user input. The forum community is an excellent resource — the macro examples in this guide all came from real forum discussions where users shared working solutions to specific problems. On the Autodesk PowerMill forum, I've found that the community is particularly generous with macro code — users regularly post complete working macros that can be adapted with minimal modification. The key is understanding the macro language fundamentals (variable syntax with $ prefix, FOREACH loops, IF conditionals, and entity access methods) so you can adapt shared macros to your specific workflow. Once you build a library of 10-20 core macros covering your most common operations, the time savings compound across every job.
