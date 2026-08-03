---
title: "Aspen HYSYS Column Non-Convergence from Over-Specified Specs, Two Liquid Phases Causing Consistency Error, Stages Drying Up from Impossible Specs, Column Won't Converge Even When Spec Errors Within Tolerance, and Feed Pressure Confusion from Gravitational Head: Spec Simplification, Water Removal, Flow Rate Specs, Converged Starting Point, and Feed Pressure Independence"
excerpt: "Aspen HYSYS fails for 5 distinct reasons: column non-convergence from over-specified compositional specs requiring spec simplification, two liquid phases causing consistency error from water or glycol in feed requiring component removal, stages drying up from impossible column specs requiring flow rate and reflux ratio specs, column won't converge even when spec errors within tolerance from finite difference algorithm requiring different starting point, and feed pressure confusion from gravitational head requiring understanding that column pressure is independent of feed pressure. We cover each with fixes from Cheresources community."
category: "column-convergence-and-simulation-errors"
softwareSlug: "aspen-hysys"
keyword: "Aspen HYSYS column non-convergence over-specified specs two liquid phases consistency error stages drying up impossible specs spec errors within tolerance feed pressure gravitational head flow rate reflux ratio water removal"
slug: "aspen-hysys-column-non-convergence-over-specified-specs-two-liquid-phases-consistency-error-stages-drying-up-spec-errors-tolerance-feed-pressure-gravitational-head-flow-rate-reflux-ratio-water-removal"
author: "CADGuide Tools Editorial Team"
readTime: "12 min"
date: "2025-08-03"
sources:
  - "https://www.cheresources.com/invision/topic/22673-lpg-from-natural-gas-hysys-simulation-problem/"
  - "https://www.cheresources.com/invision/topic/31372-absorber-convergence-error-aspen-hysys-v11/"
  - "https://www.cheresources.com/invision/topic/25175-column-does-not-converge-even-when-spec-error-are-within-limits/"
---

# Aspen HYSYS Column Non-Convergence from Over-Specified Specs, Two Liquid Phases Causing Consistency Error, Stages Drying Up from Impossible Specs, Column Won't Converge Even When Spec Errors Within Tolerance, and Feed Pressure Confusion from Gravitational Head: Spec Simplification, Water Removal, Flow Rate Specs, Converged Starting Point, and Feed Pressure Independence

Aspen HYSYS produces errors from column non-convergence, two-phase issues, stage drying, tolerance problems, and feed pressure confusion. This guide covers the 5 most common HYSYS problems with diagnostic steps and community-verified fixes from the Cheresources community.

## 1. Column Non-Convergence from Over-Specified Compositional Specs

### Symptom

A distillation column (e.g., deethanizer) in HYSYS doesn't converge. The column has multiple compositional specifications, such as component recovery propane 0.93 mole% in reboiler and component ratio methane+ethane/propane 1e-5 in reboiler. The column shows yellow (unconverged) even though some streams appear blue (converged). The column solver runs but can't satisfy all specifications simultaneously.

### Root Cause

"Forcing the column to satisfy both compositional specs will result in non-convergence." When multiple compositional specifications are applied to the same product stream, they may be mutually exclusive or create an over-specified system. The column solver can't find a solution that satisfies all specs simultaneously. "In general, this means that the simulation is overspecified." Each additional spec constrains the solution space, and too many specs can make the problem impossible to solve.

### Fix

1. **Remove redundant compositional specs**:
   - "Remove the spec for C1+C2 ratio in the reboiler"
   - "You already have the compositional specification for reboiler (0.93% C3)"
   - "So forcing the column to satisfy both compositional specs will result in non-convergence"
   - Keep only one compositional spec per product stream

2. **Use simpler specifications**:
   - "Try to use another specification, which may be e.g. % C3 in column overheads"
   - Use flow rate or temperature specs instead of compositional specs
   - Flow rate and reflux ratio are the easiest specs for convergence
   - Switch to compositional specs after convergence

3. **Start with reflux ratio and product rate**:
   - "The easiest specifications to ensure column convergence"
   - "Would be to specify reflux ratio and one of the product rate"
   - Get the column converged first
   - Then gradually change to desired specs

4. **Play with specifications after convergence**:
   - "If this does not work, try playing with the % C3 in reboiler"
   - "And tower temperatures in the top section"
   - "Once you get the model converged, it is much easier to play with specifications"
   - Use the converged solution as a starting point

5. **Check for over-specification**:
   - "In general, this means that the simulation is overspecified"
   - Count the number of specs vs degrees of freedom
   - The number of specs should equal the degrees of freedom
   - Remove excess specs

6. **Use different spec types**:
   - Mix different types of specifications
   - Such as temperature, flow rate, and composition
   - Instead of all compositional specs
   - This gives the solver more flexibility

7. **Do a hand material balance**:
   - "Make sure that you do a material balance by hand"
   - "To make sure that your specifications are realistic"
   - If the specs are physically impossible
   - The column will never converge

### Community Report

> "The deethanizer don't want to converge. The specification for the deethanizer are: component recovery propane 0.93 mole% in reboiler, component ratio methane + ethane / propane 1e-5 in reboiler. Remove the spec for C1+C2 ratio in the reboiler. You already have the compositional specification for reboiler (0.93% C3) so forcing the column to satisfy both compositional specs will result in non-convergence. Try to use another specification, which may be e.g. % C3 in column overheads."

## 2. Two Liquid Phases Causing Consistency Error from Water or Glycol in Feed

### Symptom

The column shows "two liquid phases were found in the top stream" and the entire column is yellow (unconverged). A consistency error occurs: "This can arise either when two objects calculate differing values for the same variable or one object's calculations are conflicting with existing specifications. In general, this means that the simulation is overspecified." The feed contains water and/or glycol components.

### Root Cause

"Occurrence of two liquid phases inside the tower is not a showstopper for convergence of the model, but it has made me curious." Water or glycol in the feed can cause a second liquid phase to form inside the column. The column solver may not be configured to handle two liquid phases, leading to consistency errors. "I think Glycol and Water are causing this issue." The two liquid phases create conflicting calculations that the solver can't resolve with the current specifications.

### Fix

1. **Remove water from the feed stream**:
   - "You should completely remove water from the column feed stream"
   - "Even if in reality you have 1ppm water or less"
   - Use a split unit operation to remove water
   - Before the column feed

2. **Remove glycol from the feed stream**:
   - "I think Glycol and Water are causing this issue"
   - "You can remove them from feed by using split unit operation"
   - "The problem should disappear afterwards"
   - Use a separator or splitter before the column

3. **Check liquid composition on each tray**:
   - "You can double-click on the column and check liquid composition on each tray"
   - Identify where the second liquid phase forms
   - And which components cause it
   - This helps diagnose the root cause

4. **Use a decanter**:
   - If two liquid phases are expected
   - Add a decanter before the column
   - To separate the aqueous phase
   - Before feeding to the column

5. **Adjust thermo method for two phases**:
   - "Your error message indicates two liquid phases"
   - "So you have to account for that in your thermo method"
   - Use a property method that handles two liquid phases
   - Such as NRTL or UNIQUAC

6. **Tighten column solver tolerances**:
   - "If the discrepancy is small and one of the values is calculated by a column flowsheet"
   - "Tightening the column solver tolerances may eliminate the inconsistency"
   - Reduce the convergence tolerance
   - In the column parameters

7. **Deactivate pumparound rate spec**:
   - "Heat/Spec is out of tolerance"
   - "Probably pumparound rate spec should be inactive"
   - Deactivate the pumparound rate spec
   - And use a different spec type

### Community Report

> "Hysys indicates that two liquid phases were found in the top stream leaving the deethanizer and which is blue (converged) but the entire column is yellow. A consistency error has occurred. This can arise either when two objects calculate differing values for the same variable or one object's calculations are conflicting with existing specifications. I think Glycol and Water are causing this issue. You can remove them from feed by using split unit operation. The problem should disappear afterwards."

## 3. Stages Drying Up from Impossible Column Specs

### Symptom

HYSYS reports "SEVERE ERROR: MATERIAL AND ENERGY BALANCES FAILED TO CONVERGE: CHECK COL-SPECS OR SUPPLY BETTER TEMPERATURE AND COMPOSITION ESTIMATES" and "SEVERE ERROR: THE FOLLOWING STAGES DRIED UP: 7 10 11 15. A LIMIT OF 0.10000E-04 * SUM OF FEEDS WAS IMPOSED ON THE FLOW RATES." The column has reactive distillation or complex specifications. Column temperatures are much higher than expected (e.g., 200C instead of 75C).

### Root Cause

"There MUST be a vapor and liquid on each stage for the calculations to converge." The column specifications are such that some stages have no liquid (dried up). This can happen when the specs require more vapor than the feed can provide, or when the reaction heat causes excessive vaporization. "Your column specifications are likely such that a mass balance is impossible." The high temperatures indicate excessive vaporization, which dries up the stages.

### Fix

1. **Simplify to a non-reactive column first**:
   - "I ran the simulation without the reaction, just as a methanol/water stripper"
   - "I also ran the reaction on its own in a reactor"
   - "There were no problems and I got expected results"
   - Get the column converged without reaction first

2. **Use simpler specifications**:
   - "If you are over-specified using product purity specs"
   - "Change them to something simpler like a product flow rate and reflux ratio"
   - Flow rate specs are easier to converge
   - Than purity or composition specs

3. **Check mass balance by hand**:
   - "Get out a pencil and paper and make the separation yourself"
   - "To find out what the expected products will be"
   - "If the specs are impossible so check those first"
   - Ensure the specs are physically achievable

4. **Provide better initial estimates**:
   - "SUPPLY BETTER TEMPERATURE AND COMPOSITION ESTIMATES"
   - Provide initial temperature profile
   - And composition estimates
   - Closer to the expected solution

5. **Reduce the number of stages**:
   - "Reduce the number of stages significantly until you get convergence"
   - "You may have to go down to 4 or 5 stages total"
   - "Once you get convergence, then stepwise add features back"
   - Start simple and add complexity

6. **Set all side draws to small rates**:
   - "Set all side draws to 0.1 m3/h rate"
   - "Then try to converge the column with all product to the bottom"
   - "If converged, add in side draws one at a time"
   - "Until column breaks again to better troubleshoot"

7. **Adjust feed temperature**:
   - "Is this reaction exothermic? At what temperature are you feeding?"
   - "Is it possible to lower this temperature and see the effect?"
   - Lower feed temperature may reduce vaporization
   - And prevent stages from drying up

8. **Use Absorber = Yes option**:
   - "Are you using the Absorber = Yes option in Radfrac block?"
   - For reactive absorption columns
   - Enable the absorber option
   - Which handles different calculation methods

### Community Report

> "SEVERE ERROR: MATERIAL AND ENERGY BALANCES FAILED TO CONVERGE: CHECK COL-SPECS OR SUPPLY BETTER TEMPERATURE AND COMPOSITION ESTIMATES. SEVERE ERROR: THE FOLLOWING STAGES DRIED UP: 7 10 11 15. There MUST be a vapor and liquid on each stage for the calculations to converge. Your column specifications are likely such that a mass balance is impossible. Different initial estimates might help, but the column will never converge if the specs are impossible. If you are over-specified using product purity specs, change them to something simpler like a product flow rate and reflux ratio."

## 4. Column Won't Converge Even When Spec Errors Within Tolerance

### Symptom

A column in HYSYS sometimes doesn't converge even when equilibrium and Heat/spec errors are under the specified values. The solver runs with the allowable spec tolerances but doesn't declare convergence. The issue is intermittent — the same column sometimes converges and sometimes doesn't. The user is using different top and bottom stage temperature specifications.

### Root Cause

"Aspen HYSYS is using a finite differences algorithm. Finite difference solutions sometimes have a personality problem in that it will not allow computational conversion because: 1. the step size is too large, 2. the forcing function is too large, 3. the desired computational accuracy is too small, 4. because of limits in the computer computational accuracy." The finite difference solver gets stuck in a state where the errors are within tolerance but the solver doesn't recognize convergence. This can happen due to numerical precision issues, step size problems, or the solver's convergence criteria being too strict.

### Fix

1. **Change specifications slightly**:
   - "First, change the specifications to make the column converge"
   - "I tried that option. The problem is sometime column converges right after I change specifications"
   - "And sometime the solver just run with the said allowable spec tolerances"
   - Change specs slightly and re-solve

2. **Use a converged solution as starting point**:
   - "First you converge the column with different specifications (slightly modified)"
   - "And then try again with your desired specs"
   - "Using the previous converged solution as the starting point"
   - This is the most effective approach

3. **Change the step size**:
   - "The step size is too large"
   - Reduce the solver step size
   - In the column solver parameters
   - Smaller steps may allow convergence

4. **Relax the computational accuracy**:
   - "The desired computational accuracy is too small"
   - Increase the convergence tolerance
   - In the column parameters
   - The solver may recognize convergence with looser tolerance

5. **Try something different**:
   - "If something doesn't work, try something different"
   - "Don't keep beating a dead horse"
   - Change the spec type, solver method, or initial estimates
   - A different approach may break the deadlock

6. **Check input data accuracy**:
   - "Something is grossly in error with the input data"
   - "I have had the dubiously personal distinction of having created my own problems"
   - "One must be particularly mindful that the input is accurate"
   - "And that the units are compatible"
   - Verify all input data and units

7. **Use a different solver method**:
   - HYSYS offers different column solver methods
   - Try switching to a different solver
   - Such as Newton-Raphson or Inside-Out
   - Different solvers may handle the problem differently

### Community Report

> "I am simulating a column using Aspen HYSYS where sometime I do not get convergence of it even when equilibrium and Heat/spec errors are under the specified values. First you converge the column with different specifications (slightly modified) and then try again with your desired specs using the previous converged solution as the starting point. Finite difference solutions sometimes have a personality problem in that it will not allow computational conversion because the step size is too large, the forcing function is too large, or the desired computational accuracy is too small."

## 5. Feed Pressure Confusion from Gravitational Head

### Symptom

A deethanizer tower operates at 32 bar, with feed coming from a pump at 38 bar discharge pressure. The feed tray is at 35 m height. The user is confused about what pressure to set for the feed stream in HYSYS, since the gravitational head will affect the pressure. The user wants to include the feed line dimensions (diameter, height, elbows) without using pipe segment.

### Root Cause

"Column pressure is not controlled by the pressure of the feed. The feed pump discharge pressure does not affect the pressure at the feed tray of the tower even if the pump has 100 bar discharge pressure." The user is confusing the feed line hydraulics with the column pressure. In HYSYS, the column pressure is set independently of the feed pressure. The feed pressure just needs to be higher than the column pressure at the feed tray. The actual feed pressure doesn't affect the column simulation because a feed control valve regulates the flow.

### Fix

1. **Set feed pressure higher than column pressure**:
   - "Set your feed stream pressure higher than the column feed stage pressure"
   - "It just will not matter at all to the column simulation"
   - The exact value doesn't matter
   - As long as it's higher than the column pressure

2. **Don't worry about gravitational head**:
   - "In the real world, the pump discharge pressure will be higher than required"
   - "By gravity and pipe friction"
   - "There will be a feed control valve downstream of the pump to regulate flow"
   - The control valve handles the pressure difference

3. **Use a pump to increase feed pressure**:
   - "After your stream is specified, put it through a pump"
   - "If you need to get the pressure higher to avoid column warnings"
   - "Make the discharge of the pump higher than the column"
   - "And then get your column converged"

4. **Don't include feed line hydraulics in column model**:
   - "There is no good reason to have to do the hydraulic calcs"
   - "In the same model as the distillation column"
   - "It would be easier to use a separate model if you want to calc hydraulics"
   - Keep hydraulics and separation in separate models

5. **Connect pump outlet directly to column**:
   - "Just connect the outlet of the pump to the distillation column"
   - "Without any pressure drop unit operations"
   - Don't add pipe segments between pump and column
   - For the column simulation

6. **Specify feed by two of T, P, vapor fraction**:
   - "For a mixed stream, you can specify only two of"
   - "Temperature, pressure, vapor fraction"
   - "After your stream is specified, put it through a pump"
   - To get the correct feed conditions

7. **Use feed from another column's bottom**:
   - "Does your feed come from the bottom of a demethanizer?"
   - "If so, then set the feed stream conditions"
   - "Using the pressure at the demethanizer sump"
   - "And the bubble point temperature"

### Community Report

> "I am simulating a deethanizer tower with 32 bar operating condition, which is coming from a pump with Discharge pressure of 38 bar. The feed tray is nearly at 35 m height. Column pressure is not controlled by the pressure of the feed. The feed pump discharge pressure does not affect the pressure at the feed tray of the tower even if the pump has 100 bar discharge pressure. Set your feed stream pressure higher than the column feed stage pressure. It just will not matter at all to the column simulation."

## 6. Additional Aspen HYSYS Issues

### HYSYS Crash When Opening XML File

**Issue**: "For some reason my Hysys crashes when I try to open this XML file."
**Fix**: The XML file may be corrupted or created with a different HYSYS version. Try opening in the same version that created it. Or recreate the simulation from scratch.

### Pumparound Spec Causing Convergence Issues

**Issue**: "Heat/Spec is out of tolerance. Probably pumparound rate spec should be inactive."
**Fix**: Deactivate the pumparound rate spec. Use pumparound return temperature instead. Or use a duty spec on the tray instead of pumparound.

### Vapor Temperature Spec Not Matching

**Issue**: "I suspect its struggling to match the temperature set for the vapour, a common problem as there may no composition/bubble combination point that exactly matches that temperature."
**Fix**: "I would try setting flow or pumparound return temperature and let it calculate the vapour temperature." Use a different spec type that the solver can match.

### Complex Column for Beginners

**Issue**: "If you have not gathered much simulation experience yet, this looks like a complex column to start with."
**Fix**: Start with a simple column (top and bottom product only). Get it converged. Then add complexity step by step. Learn column convergence with simple columns first.

### Column Operating Pressure Selection

**Issue**: "The De-C2 tower pressure seems unreasonably low. These systems usually operate at 30-35 barg. What is the reason for choosing 15 barg?"
**Fix**: Check typical operating pressures for the column type. Deethanizers typically operate at 30-35 barg. Low pressure may cause convergence issues and non-physical results.

### Side Draws Causing Convergence Issues

**Issue**: Column with multiple side draws won't converge.
**Fix**: "Set all side draws to 0.1 m3/h rate then try to converge the column with all product to the bottom. If converged, add in side draws one at a time until column breaks again to better troubleshoot."

### Simplify Pumparound as Duty

**Issue**: Complex pumparound configuration causing convergence issues.
**Fix**: "Start simple to get a converged run so you can make sense of the error messages. This may mean cutting down to a top and bottom product and simplifying the pumparound as a duty applied to the tray."

## Best Practices

1. **Start with simple specs (reflux ratio + product rate)** — easiest to converge
2. **Remove water and glycol from column feed** — prevents two-phase issues
3. **Do a hand material balance** — ensure specs are physically possible
4. **Converge with simple specs, then switch to desired specs** — use converged solution as starting point
5. **Reduce stages to 4-5 for initial convergence** — then add stages back
6. **Add side draws one at a time** — identify which side draw breaks convergence
7. **Set feed pressure higher than column pressure** — exact value doesn't matter
8. **Keep hydraulics and separation in separate models** — don't mix pipe sizing with column simulation
9. **Use proper thermo method for two liquid phases** — NRTL or UNIQUAC
10. **Check typical operating pressures** — ensure column pressure is realistic for the application
