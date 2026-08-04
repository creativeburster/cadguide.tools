---
title: "TARGET 3001 PCB Design Signal Island Short Circuit, Ground Plane Island Orphan, Autorouter Suboptimal Routing, Star Ground Short Circuit Alert, and Schematic Signal Island Without REF Pin: DRC Check Procedures, Island Deletion, Router Strategy Configuration, and Signal Name Verification"
excerpt: "TARGET 3001 fails for 5 distinct reasons: signal island short circuit from both resistor pins on same signal requiring signal highlighting and orphan track deletion, ground plane island orphan fragments from isolated copper requiring Delete islands option, autorouter suboptimal routing from poor strategy settings requiring Hybrid and Contour router comparison, star ground short circuit alert from united GND potentials requiring Generate Star Ground option, and schematic signal island without REF pin from missing reference symbols requiring signal name correction. We cover each with fixes from TARGET 3001 wiki documentation."
category: "troubleshooting"
softwareSlug: "target-3001"
keyword: "TARGET 3001 PCB design signal island short circuit resistor pins same signal ground plane island orphan fragments Delete islands autorouter suboptimal routing Hybrid Contour router star ground short circuit alert Generate Star Ground schematic signal island without REF pin missing reference symbols signal name correction DRC check"
slug: "target-3001-pcb-design-signal-island-short-circuit-ground-plane-island-orphan-autorouter-suboptimal-routing-star-ground-short-circuit-alert-schematic-signal-island-without-ref-pin"
author: "CADGuide Tools Editorial Team"
readTime: "12 min"
date: "2025-08-03"
sources:
  - "https://server.ibfriedrich.com/wiki/ibfwikien/index.php?title=Check_project"
  - "https://server.ibfriedrich.com/wiki/ibfwikien/index.php?title=Remove_groundplane_islands"
  - "https://server.ibfriedrich.com/wiki/ibfwikien/index.php?title=Autorouter"
---

# TARGET 3001 PCB Design Signal Island Short Circuit, Ground Plane Island Orphan, Autorouter Suboptimal Routing, Star Ground Short Circuit Alert, and Schematic Signal Island Without REF Pin: DRC Check Procedures, Island Deletion, Router Strategy Configuration, and Signal Name Verification

TARGET 3001's signal island detection, ground plane handling, autorouting, star ground configuration, and schematic signal verification produce errors from short circuits, orphaned copper fragments, suboptimal routing strategies, united ground potentials, and missing reference symbols. This guide covers the 5 most common TARGET 3001 problems with diagnostic steps and community-verified fixes from TARGET 3001 wiki documentation.

## 1. Signal Island Short Circuit from Both Resistor Pins on Same Signal

### Symptom

After running "Check project" in TARGET 3001, the error "Island without Ref Pin" appears. The signal in the schematic consists of several signal islands which optically seem to be connected. The autorouter would short-circuit the resistor with other signal tracks. The error message may point at a short circuit in the schematic — for example, at a resistor both pins are connected to the same signal.

### Root Cause

"TARGET 3001! recognizes two islands of the same signal and the autorouter would short circuit the resistor with other signal tracks." When both pins of a component (e.g., a resistor) are connected to the same signal, TARGET 3001 detects two signal islands of the same signal name. The autorouter, seeing two pads of the same signal, would connect them with a copper track, effectively short-circuiting the resistor. This is a schematic error — both pins should be on different signals. The error may also be caused by "orphan signal track pieces, which might lay under an already existing signal track" — hidden track segments that create unintended signal islands.

### Fix

1. **Highlight the signal to find the error**:
   - "Set the highlighting mode to 'mark the signal island hit'"
   - "Highlight by M1 all islands of a signal after each other"
   - Click on each signal island
   - Identify which islands are incorrectly connected

2. **Use the binoculars to find the complete signal**:
   - "Highlight the complete signal by the use of the binoculars"
   - "Find and select a Component or Signal"
   - This shows all tracks and pads of the signal
   - Look for unintended connections

3. **Search for orphan signal track pieces**:
   - "Search for 'orphan' signal track pieces, which might lay under an already existing signal track"
   - "Use keyboard key [s] (for select) several times when the cursor is close to a suspicious spot"
   - "Different elements being close to the cursor will flash though eventually invisible"
   - "If it flashes, press Enter and then delete it"

4. **Fix the resistor pin connections**:
   - If both pins of a resistor are on the same signal
   - Move one pin to the correct signal
   - Check the schematic for the error
   - Re-run Check project

5. **Delete the signal segment and reconnect**:
   - "Delete the signal segment, double click REF symbol (GND), change signal name to GND, connect new"
   - "Do a project reorganization (menu Actions)"
   - "In order to make the error marker vanish"
   - "Do a project test again (menu Actions)"

6. **Check for hidden tracks under other tracks**:
   - Use the select key [s] repeatedly
   - Look for flashing elements under visible tracks
   - Delete orphan tracks
   - Re-run Check project

7. **Verify with signal name display**:
   - "In menu Settings/Options you can make TARGET 3001! display the signal name to every signal segment"
   - Enable signal name display
   - Check all segments have the correct signal name
   - Fix any mismatches

### Community Report

> "The signal in the schematic consists of several signal islands which optically seem to be connected. Danger: this error message might point at a short circuit in the schematic. Example: at a resistor both pins are connected to the same signal. TARGET 3001! recognizes two islands of the same signal and the autorouter would short circuit the resistor with other signal tracks. If you really don't find a different signal island, then please search for 'orphan' signal track pieces, which might lay under an already existing signal track."

## 2. Ground Plane Island Orphan Fragments from Isolated Copper

### Symptom

After creating a ground plane in TARGET 3001, isolated copper fragments (islands) appear within the ground plane. These islands are not connected to the main ground plane. Elements connected to these islands appear to be connected to ground but electrically aren't. The ground plane may not convert to lines properly.

### Root Cause

"Islands in ground planes, orphan ground fragments occur, when parts of a ground plane get isolated from the main ground plane by its surrounding signal tracks." Signal tracks crossing through the ground plane can isolate portions of the copper, creating islands. "Those ground plane islands can have the electrical effect of a capacitor and might cause unwanted effects in respect to electromagnetic compatibility." The islands serve no purpose and can cause EMC issues. Additionally, "by incident you create areas within a groundplane which are isolated from the ground signal like an island. Elements connected here give the impression of being connected to ground but in fact electrically they aren't."

### Fix

1. **Enable Delete islands option**:
   - "Start the 'Create signal polygon' dialog (Menu Actions/Ground planes/Entire PCB area...)"
   - "Within this dialog tick the box: 'Delete islands'"
   - "If you don't want to have a gridded ground plane but a solid one, set the 'Grid spacing' zero"
   - "Press the OK button"
   - Islands are automatically removed

2. **Convert ground plane to lines**:
   - "A conversion of the ground plane to lines helps because it needs a definition of a line width"
   - "Which cares for the existence of copper 'corridors', ligaments, at least having the strength of the line width"
   - This ensures all copper is connected
   - No isolated islands

3. **Run Check project before manufacturing**:
   - "When outputting data for manufacturing, the correct recalculation of all surfaces is then carried out"
   - "Which can lead to differences"
   - "To make sure that the PCB looks on the screen as it will be produced"
   - "Always run 'Check Project' as the last step before ordering"

4. **Check for isolated elements**:
   - After deleting islands
   - Check if any elements were connected to the deleted islands
   - Reconnect them to the main ground plane
   - Add a track or via to bridge the gap

5. **Avoid creating islands in the first place**:
   - Route signal tracks to minimize ground plane fragmentation
   - Use wider clearances for signal tracks in ground plane areas
   - Group signal tracks together to reduce isolation
   - Use ground vias to connect fragmented ground areas

6. **Use signal polygons instead of ground planes**:
   - "From TARGET V18 onwards, a ground plane is treated as a signal polygon"
   - "Can be equipped with individual attributes"
   - "Any number of signal polygons can be created on one copper side"
   - More control over copper filling

7. **Recalculate after changes**:
   - "When you render the filling of a ground plane, this is done exactly representing the conditions at the time of rendering"
   - "If you make changes to elements having an aura afterwards, the area will have the wrong shape"
   - "The area always will be recalculated" during Check project
   - Always run Check project after changes

### Community Report

> "Islands in ground planes, orphan ground fragments occur, when parts of a ground plane get isolated from the main ground plane by its surrounding signal tracks. Those ground plane islands can have the electrical effect of a capacitor and might cause unwanted effects in respect to electromagnetic compatibility. So they should be removed from the layout (rub out). In TARGET 3001! start the 'Create signal polygon' dialog and tick the box: 'Delete islands'."

## 3. Autorouter Suboptimal Routing from Poor Strategy Settings

### Symptom

The TARGET 3001 autorouter produces unsatisfying routing results. Routes are not optimal, with excessive vias, unnecessary detours, or unrouted connections. The routing doesn't meet design constraints. Manual post-processing is required to fix the autorouter's output.

### Root Cause

"TARGET 3001! offers two internal autorouters, the Hybrid and the Contour router using different routing algorithms." Each router has different strategies and settings. Using the wrong router or suboptimal settings produces poor results. The Hybrid router uses a grid-based approach with preferred directions, while the Contour router is gridless and shape-based. "The definition of the order has influence on the computing-heuristic. It is difficult to say which setting is best. It depends on the complexity of the layout." Poor preferred direction settings, via usage settings, or layer configuration all contribute to suboptimal results.

### Fix

1. **Try both internal routers**:
   - "Use the two routers with different routing strategies (Settings)"
   - Run the Hybrid autorouter first
   - Then try the Contour autorouter
   - Compare results and choose the better one

2. **Configure preferred directions**:
   - "The predefinition of a 'preferable direction' makes sense only if you are moving upon two or more signal layers"
   - Set horizontal preferred direction on one layer
   - Set vertical preferred direction on the other
   - "Both sliding buttons should not be set to 'forbidden' neither to 'all the same'"

3. **Configure via usage**:
   - "The use of vias we leave on 'doesn't matter'"
   - "So we don't wish them but we accept them"
   - Set via usage to minimize vias
   - But allow them when necessary

4. **Reserve layers for specific signals**:
   - "You can reserve a layer especially for one single signal (e.g. GND or VCC)"
   - "Or close a layer for all signals"
   - Use inner layers for power/ground
   - Route signals on outer layers

5. **Use the Pilot Router for manual assistance**:
   - "Also a very useful feature is the Pilot Router, assisting you when manually routing"
   - "You are the pilot and set the route with the mouse pointer without clicking"
   - "When you arrive at the destination, the track is routed accordingly with just one click"
   - Use for critical or complex routes

6. **Try external autorouters**:
   - "If the internal routers do not help, try the 14-day trial version of the Autorouter ELECTRA"
   - "Which is embedded as an external Autorouter in the TARGET 3001! environment"
   - Also try FreeRouting — "a very useful free external router is supported"
   - External routers may produce better results

7. **Optimize manually after autorouting**:
   - "Check your project optically after autorouting"
   - "Often the paths have to be optimized manually"
   - "Use the function 'Check project' to exclude errors"
   - Clean up suboptimal routes

8. **Define routing prohibition areas**:
   - "If there are areas in your layout where no tracks are wanted you might define a routing-prohibition area"
   - "Assign a layer function 'Route prohibition' to a certain layer"
   - "Draw your routing prohibition area upon this layer"
   - This guides the autorouter around critical areas

9. **Don't give up on the first attempt**:
   - "Do not give up on the attempt if you are not satisfied with the result"
   - Try different settings
   - Try different routers
   - Iterate until satisfactory

### Community Report

> "TARGET 3001! offers two internal autorouters, the Hybrid and the Contour router using different routing algorithms. Do not give up on the attempt if you are not satisfied with the result. Use the two routers with different routing strategies. If the internal routers do not help, try the 14-day trial version of the Autorouter ELECTRA. Also a very useful free external router is supported: FreeRouting. Check your project optically after autorouting. Often the paths have to be optimized manually."

## 4. Star Ground Short Circuit Alert from United GND Potentials

### Symptom

When using a star-shaped ground in TARGET 3001 where different ground potentials (e.g., AGND and DGND) are linked at a certain junction, the "Check project" function reports a short circuit. The alert appears even though the connection is intentional. The spacing violation alert prevents the design from passing the DRC check.

### Root Cause

"In audio and analog circuits different ground potentials often are linked at a certain junction. A 'star shaped ground' emerges." TARGET 3001 treats different signal names (AGND, DGND, GND) as separate signals. When they're physically connected at a star ground junction, the DRC check detects a short circuit between different signals. The check is correct — it's detecting a connection between different signal names. But in star ground topology, this connection is intentional and should be tolerated.

### Fix

1. **Use Generate Star Ground option**:
   - "Use option 'Actions/Ground planes/Generate Star Ground'"
   - "To designate those signals whose linkage shall be tolerated by TARGET 3001!"
   - Select the signals to unite (e.g., AGND and DGND)
   - The DRC check will tolerate the connection

2. **Manually place the junction point**:
   - "You may manually place such a green junction point with key [.] (= period)"
   - Place the star ground junction at the desired location
   - This marks the intentional connection
   - The DRC check tolerates it

3. **Add a ground symbol for clarification**:
   - "You can place such a ground symbol for clarification"
   - Add a GND reference symbol at the junction
   - This documents the star ground connection
   - Makes the schematic clearer

4. **Create the connection in PCB manually**:
   - "The autorouters ignore this all"
   - "You have to make the junction in PCB manually"
   - The autorouter won't create the star ground connection
   - Route the connection by hand

5. **Verify the connection exists**:
   - "Whether a connection e.g. between AGND and DGND really is created somewhere at all"
   - "Currently can not be checked automatically by TARGET 3001!"
   - "This will stay your work"
   - Manually verify the star ground is properly connected

6. **Use a solder jumper as alternative**:
   - "You can also use this function for a closed solder jumper"
   - "To avoid a short-circuit message when testing"
   - Create a solder jumper between the ground potentials
   - Close it with solder when needed

7. **Check signal names carefully**:
   - "Only the genuine ground symbol does not need a text"
   - "Just the signal name exactly needs to be GND"
   - "All other signals need the display of their name in the REF"
   - Ensure signal names are correct

### Community Report

> "In audio and analog circuits different ground potentials often are linked at a certain junction. A star shaped ground emerges. In TARGET 3001! a star shaped ground is created by simple connection of two or more signal tracks having different GND potentials/signals. To avoid a 'spacing violation' alert (short circuit) when using the Check project function, you need to define the signals which shall be united prior to the check. Use option 'Actions/Ground planes/Generate Star Ground' to designate those signals whose linkage shall be tolerated by TARGET 3001!"

## 5. Schematic Signal Island Without REF Pin from Missing Reference Symbols

### Symptom

The "Check project" function reports "Island without Ref Pin" in the schematic. A signal in the schematic consists of several signal islands which optically seem to be connected. The connection must be effected by reference symbols or by buses, but at least one signal island is not connected to a reference symbol.

### Root Cause

"Every signal island must show its ownership visually to a signal through reference symbols or through a connection to a bus." In schematics, signals are connected using reference symbols (REF) or buses. If a signal island (a group of connected pins/tracks) doesn't have a reference symbol, TARGET 3001 can't determine which signal it belongs to. "In this case, at least one signal island is not connected to a reference symbol. This error could also be named as double signal name! Also it might represent an unwanted short circuit." The missing REF symbol means the signal island is floating — it appears connected visually but isn't electrically connected to the named signal.

### Fix

1. **Add reference symbols to all signal islands**:
   - "Every signal island must show its ownership visually to a signal through reference symbols"
   - Add a REF symbol to each signal island
   - Set the signal name on the REF symbol
   - This connects the island to the named signal

2. **Check the signal name on REF symbols**:
   - "Double click REF symbol (GND), change signal name to GND, connect new"
   - Double-click each REF symbol
   - Verify the signal name is correct
   - Fix any mismatches

3. **Use the correct GND symbol**:
   - "Only the genuine ground symbol does not need a text"
   - "Just the signal name exactly needs to be GND"
   - "All other signals need the display of their name in the REF"
   - Use the correct symbol type for each signal

4. **Highlight signal islands to find the missing REF**:
   - "Set the highlighting mode to 'mark the signal island hit'"
   - "Highlight by M1 all islands of a signal after each other"
   - Click on each island
   - Find the one without a REF symbol

5. **Check for short circuits**:
   - "This error message might point at a short circuit in the schematic"
   - "Example: at a resistor both pins are connected to the same signal"
   - Check for components with both pins on the same signal
   - Fix the schematic error

6. **Do a project reorganization**:
   - "Do a project reorganization (menu Actions)"
   - "In order to make the error marker vanish"
   - "Do a project test again (menu Actions)"
   - This clears old error markers

7. **Use buses for multi-signal connections**:
   - "The connection in fact must be effected by reference symbols or by buses"
   - Use bus connections for multi-bit signals
   - Ensure each signal on the bus has a REF symbol
   - Check bus entries are correct

8. **Display signal names on all segments**:
   - "In menu Settings/Options you can make TARGET 3001! display the signal name to every signal segment"
   - Enable signal name display
   - Visually verify all segments have the correct name
   - Fix any mismatches

### Community Report

> "The signal in the schematic consists of several signal islands which optically seem to be connected. The connection in fact must be effected by reference symbols or by buses. If the error message appears nevertheless, please set the highlighting mode to 'mark the signal island hit' and highlight by M1 all islands of a signal after each other. In this case, at least one signal island is not connected to a reference symbol. This error could also be named as double signal name! Also it might represent an unwanted short circuit."

## 6. Additional TARGET 3001 Issues

### Wrong REF Signal Name

**Issue**: "A reference symbol (REF) representing a certain signal name had been connected to a symbol representing a different name."
**Fix**: "Delete the signal segment, double click REF symbol (GND), change signal name to GND, connect new. Do a project reorganization."

### Unfinished Signal

**Issue**: "The schematic requires connections which are incomplete on the PCB. Individual solder pads of the signal are not connected or the signal is made of two or more signal islands."
**Fix**: "Activate the pointer-option 'Mark signal islands'. Click M1 on a track to see where the signal flow stops."

### Short Circuit in Layout

**Issue**: "A soldering pad in the layout is connected to a different signal than required from the schematic."
**Fix**: "Double click each segment and look out for its name and eventually change it. In Settings/Options you can display all signal names to the track segments."

### Spacing Violation

**Issue**: "If spacing d between the elements is smaller than the parameter in the 'Check project' dialog, TARGET 3001! alerts a spacing violation."
**Fix**: Check the pad aura vs. track distance. Increase spacing or adjust the DRC parameters. Check for tangency that could cause short circuits.

### Ground Plane Not Converted to Lines

**Issue**: "Sometimes it may happen that by incident you create areas within a groundplane which are isolated from the ground signal like an island."
**Fix**: "A conversion of the ground plane to lines helps because it needs a definition of a line width which cares for the existence of copper 'corridors'."

### Grid Size Affecting Short Circuit Check

**Issue**: "The grid size value is regarded for this check! Two tracks with their ends nearer than a grid can be seen as connected."
**Fix**: Set the appropriate grid size. Check tracks that are closer than the grid. Adjust grid or track positions.

### Push and Shove Routing

**Issue**: "When manually routing, your current track will push away existing traces as far as needed (spacing rules are considered)."
**Fix**: Use push and shove for efficient manual routing. Check that spacing rules are maintained. Verify with Check project after routing.

## Best Practices

1. **Run Check project before manufacturing** — catches all DRC and ERC errors
2. **Enable Delete islands for ground planes** — removes orphaned copper fragments
3. **Use signal highlighting to find short circuits** — mark signal islands individually
4. **Search for orphan tracks with [s] key** — find hidden tracks under other elements
5. **Try both Hybrid and Contour autorouters** — compare results
6. **Configure preferred directions for multi-layer routing** — horizontal on one layer, vertical on other
7. **Use Generate Star Ground for multi-GND designs** — prevents false short circuit alerts
8. **Add REF symbols to all signal islands** — prevents "Island without Ref Pin" error
9. **Display signal names on all segments** — verify signal name consistency
10. **Do project reorganization after fixes** — clears old error markers before re-checking
