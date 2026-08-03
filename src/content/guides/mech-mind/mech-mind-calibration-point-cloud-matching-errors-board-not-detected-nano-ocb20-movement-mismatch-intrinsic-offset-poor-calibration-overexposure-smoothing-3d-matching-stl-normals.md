---
title: "Mech-Mind 3D Vision Calibration and Point Cloud Matching Errors: Calibration Board Not Detected from Small Circle Interference on NANO with OCB-20 Requiring Nut Covering or Exposure Reduction, Movement Distance Mismatch Between Robot and Camera from Intrinsic Parameter Error or Camera Offset Requiring Robot Accuracy Check and Recalibration, Poor Calibration Results from Overexposure and Point Cloud Fluctuation Requiring Single Exposure and Strong Smoothing, 3D Matching Failure from Incorrect STL Normals Requiring Normal Correction Tool, and Remove Overlapped Poses Filters Correct Matches from Inconsistent Reference Frame Requiring Camera Frame Alignment"
excerpt: "Mech-Mind fails for 5 distinct reasons: calibration board not detected from small circle interference on NANO with OCB-20 requiring nut covering or exposure reduction, movement distance mismatch between robot and camera from intrinsic parameter error or camera offset requiring robot accuracy check and recalibration, poor calibration results from overexposure and point cloud fluctuation requiring single exposure and strong smoothing, 3D matching failure from incorrect STL normals requiring normal correction tool, and Remove Overlapped Poses filters correct matches from inconsistent reference frame requiring camera frame alignment. We cover each with fixes from Mech-Mind Docs and Community."
category: "calibration-and-point-cloud-matching-errors"
softwareSlug: "mech-mind"
keyword: "Mech-Mind calibration board not detected small circle interference NANO OCB-20 nut covering exposure reduction movement distance mismatch robot camera intrinsic parameter error camera offset robot accuracy recalibration poor calibration overexposure point cloud fluctuation single exposure strong smoothing 3D matching incorrect STL normals normal correction Remove Overlapped Poses inconsistent reference frame camera frame alignment"
slug: "mech-mind-calibration-point-cloud-matching-errors-board-not-detected-nano-ocb20-movement-mismatch-intrinsic-offset-poor-calibration-overexposure-smoothing-3d-matching-stl-normals"
author: "CADGuide Tools Editorial Team"
readTime: "13 min"
date: "2025-07-31"
sources:
  - "https://docs.mech-mind.net/en/suite-software-manual/latest/vision-calibration/calib-troubleshooting.html"
  - "https://community.mech-mind.com/t/topic/2731"
  - "https://docs.mech-mind.net/en/suite-tutorial/2.1.0/topic-3d-matching/3d-matching-common-issues.html"
---

# Mech-Mind 3D Vision Calibration and Point Cloud Matching Errors: Calibration Board Not Detected from Small Circle Interference on NANO with OCB-20 Requiring Nut Covering or Exposure Reduction, Movement Distance Mismatch Between Robot and Camera from Intrinsic Parameter Error or Camera Offset Requiring Robot Accuracy Check and Recalibration, Poor Calibration Results from Overexposure and Point Cloud Fluctuation Requiring Single Exposure and Strong Smoothing, 3D Matching Failure from Incorrect STL Normals Requiring Normal Correction Tool, and Remove Overlapped Poses Filters Correct Matches from Inconsistent Reference Frame Requiring Camera Frame Alignment

Mech-Mind's hand-eye calibration, robot-camera synchronization, point cloud quality, 3D matching, and pose filtering produce errors from calibration board interference, intrinsic parameter drift, overexposure, mesh normal issues, and reference frame mismatches. This guide covers the 5 most common Mech-Mind problems with diagnostic steps and community-verified fixes from Mech-Mind Docs and Community.

## 1. Calibration Board Not Detected from Small Circle Interference on NANO with OCB-20

### Symptom

During hand-eye calibration with a Mech-Mind NANO camera and OCB-20 calibration board, clicking "Capture Live" in the calibration board position check stage produces: "Unable to find the calibration board in the image. Please check the mounting of the calibration board." The intrinsic parameter check in Mech-Eye Viewer passes normally. But proceeding with automated calibration in the pyramid path results in all collected data being incorrect: "Unable to obtain move information from the current calibration board image."

### Root Cause

The small circles on the calibration board (specifically around the mounting nut area) interfere with the automatic detection of the calibration board. The overall reflection from the screws, combined with extended exposure time, causes misidentification when recognizing the white circles on the calibration board. The Mech-Eye Viewer check passes because it uses a different detection algorithm than Mech-Vision's calibration detection. The automated calibration in Mech-Vision is more sensitive to interference from reflective elements on the board.

### Fix

1. **Cover the mounting nut on the calibration board**:
   - "The reason for the inability to recognize is that the small circles on the calibration board interfered with the automatic detection"
   - "You can solve the problem by covering this position or painting the nut black"
   - Cover the nut with black tape or paint it black
   - This eliminates the reflective interference

2. **Reduce exposure time**:
   - "Due to the extended overall exposure time and the overall reflection of the screws, misidentification occurred"
   - "By appropriately reducing the exposure, it's also possible to mitigate this issue"
   - In Mech-Eye Viewer, reduce the exposure time
   - This reduces reflection from the screws

3. **Verify the correct calibration board**:
   - "The calibration board may not have been chosen correctly"
   - "You can find the recommended calibration boards for each camera model from the camera material table"
   - Check the Download Center for the correct board for NANO
   - Ensure OCB-20 is the recommended board for NANO

4. **Check for modified intrinsic parameters**:
   - "The customer had set the offset of the intrinsic parameters"
   - Check the extri_param.json file for modified offsets
   - Reset to factory intrinsic parameters in Mech-Eye Viewer
   - If reset fails ("Please retry or contact Technical Support"), contact support

5. **Use manual calibration as workaround**:
   - If automatic calibration consistently fails
   - Switch to manual calibration mode
   - Manually capture and verify each calibration pose
   - This bypasses the automatic detection issue

### Community Report

> "The reason for the inability to recognize is that the small circles on the calibration board interfered with the automatic detection of the calibration board. You can solve the problem by covering this position or painting the nut black. After covering the black nut on the calibration board, the robot calibration is now working normally. Due to the extended overall exposure time and the overall reflection of the screws, misidentification occurred."

## 2. Movement Distance Mismatch Between Robot and Camera from Intrinsic Parameter Error or Camera Offset

### Symptom

During automatic calibration, a mismatch error appears between the robot's detected movement and the camera's detected movement. Manual calibration shows a discrepancy in rotation angles. The point cloud output in Mech-Vision becomes a planar point cloud or shows significant difference compared to Mech-Eye Viewer.

### Root Cause

Three possible causes: (1) Camera intrinsic parameter error — if the intrinsic error is too large, it leads to movement detection mismatch. If the camera was hit or bumped, the intrinsic parameters are physically altered. (2) Robot accuracy issues — the robot's actual movement doesn't match the displayed values. (3) Camera internal offset — from previous calibration issues where compensation parameters were recalculated incorrectly.

### Fix

1. **Check camera intrinsic parameters**:
   - "First, check if there's an issue with the camera's intrinsic parameters"
   - "If the intrinsic error is too large, it can lead to this type of error"
   - "If the camera hasn't been hit or bumped, the intrinsic parameters can be optimized by rectification"
   - Run intrinsic parameter check in Mech-Eye Viewer

2. **Check for physical camera damage**:
   - "If the camera has been hit by something or fallen to the ground, please contact Mech-Mind's technical support"
   - Physical impact changes the lens position
   - This requires factory recalibration
   - Don't attempt to fix physically damaged cameras

3. **Verify robot accuracy**:
   - "Investigate the accuracy of the robot (compare measured values with the distance displayed on the robot's teach pendant)"
   - Move the robot a known distance
   - Measure the actual distance with a ruler
   - Compare with the teach pendant display

4. **Check robot zero points**:
   - "Check the zero points of each robot axis to troubleshoot robot accuracy issues"
   - Verify each axis zero position
   - Re-master if necessary
   - Incorrect zero points cause cumulative errors

5. **Check for camera internal offset**:
   - "This problem arises when there were issues during previous calibration processes, and compensation parameters had to be recalculated"
   - Check if compensation parameters were previously recalculated
   - Reset compensation parameters
   - Perform a fresh calibration

6. **Fix planar point cloud issue**:
   - "If the point cloud output becomes a planar point cloud, it's also related to the camera offset"
   - This indicates a depth map conversion error
   - Check the camera's depth calculation parameters
   - Reset to factory defaults and recalibrate

### Community Report

> "Automatic calibration indicates a mismatch between the robot's and camera's detected movement. First, check if there's an issue with the camera's intrinsic parameters. If the intrinsic error is too large, it can lead to this type of error. Investigate the accuracy of the robot. If the robot's issues are ruled out, it's likely still a camera offset problem."

## 3. Poor Calibration Results from Overexposure and Point Cloud Fluctuation

### Symptom

After hand-eye calibration, the calibration results are poor. The error of 100% of the data points in the point cloud view is greater than the empirical values. Individual calibration points in the point cloud viewer appear red. Only 15% of data points have errors that meet requirements, and rotation points are red.

### Root Cause

Overexposure leads to point cloud loss and increased point cloud fluctuation, which affects calibration accuracy. The point cloud of the calibration board fluctuates greatly in DEEP-GL or LSR cameras. Using gain instead of single exposure increases noise. The smoothing mode is not set to handle the fluctuation.

### Fix

1. **Disable gain and use single exposure**:
   - "Disable gain, use a single exposure, and set 3D exposure appropriately"
   - "Overexposure and overexposure not only lead to point cloud loss, but also cause point cloud fluctuation to increase"
   - In Mech-Eye Viewer: disable gain
   - Set exposure mode to single exposure
   - Adjust 3D exposure to appropriate level

2. **Set point cloud smoothing to strong**:
   - "If the point cloud of the calibration board fluctuates greatly in the DEEP-GL or LSR camera, the calibration result is poor"
   - "Change the point cloud smoothing mode to 'strong'"
   - In Mech-Eye Viewer: Settings > Point Cloud Smoothing > Strong
   - This reduces fluctuation in the calibration board point cloud

3. **Check individual red calibration points**:
   - "If individual calibration points in the point cloud viewer are red"
   - Red points indicate high error
   - Recapture those specific calibration poses
   - Ensure the calibration board is fully visible and well-lit

4. **Verify calibration board poses**:
   - Ensure the calibration board covers different angles and positions
   - Avoid too-similar poses between captures
   - Follow the pyramid path for pose distribution
   - Use at least 15-20 poses for good calibration

5. **Check for overexposure indicators**:
   - Look for saturated (white) areas in the 2D image
   - Reduce exposure until no saturation appears
   - The calibration board circles should be clearly visible
   - Avoid direct sunlight on the calibration board

6. **Use extrinsic parameter calibration report**:
   - "Mech-MSR's camera calibration tool has provided the 'extrinsic parameter calibration report' function"
   - Generate the report after calibration
   - Check the recommended troubleshooting steps
   - Follow the report's guidance for improving accuracy

### Community Report

> "Poor calibration results indicate that the error of 100% of the data points in the point cloud view is greater than the empirical values. Disable gain, use a single exposure, and set 3D exposure appropriately to address overexposure issues. Overexposure not only leads to point cloud loss, but also causes point cloud fluctuation to increase, which affects the calibration accuracy. Change the point cloud smoothing mode to 'strong'."

## 4. 3D Matching Failure from Incorrect STL Normals

### Symptom

Using 3D Matching in Mech-Vision 2.0+. After importing an STL model into the target object editor, some areas of the model appear black. The matching process fails or produces incorrect results. The STL model's normals are incorrect, causing the matching algorithm to fail.

### Root Cause

"Starting from Mech-Vision 2.0.0, the matching process has strict requirements on the normals of point cloud models. When the normals of a point cloud model are incorrect, it directly leads to matching failure." Black areas in the model display indicate incorrect normals — normally, the model should be rendered evenly. The STL-to-point-cloud conversion preserves the incorrect normals from the original STL file.

### Fix

1. **Use the STL Model Normal Correction Tool**:
   - "If the normals of the STL model are incorrect, you can use the 'STL Model Normal Correction Tool' to repair the STL model"
   - In Mech-Vision: Tools > STL Model Normal Correction Tool
   - Load the STL model
   - Run the normal correction
   - Re-import the corrected STL into the target object editor

2. **Fix STL normals in external software**:
   - Use MeshLab, Magics, or Blender to fix STL normals
   - In MeshLab: Filters > Normals, Curvatures and Orientation > Re-Orient all faces outward
   - Export the corrected STL
   - Import into Mech-Vision

3. **Use point cloud model generated directly by Steps**:
   - "It is recommended to use the point cloud model generated by the Step directly for matching"
   - Instead of importing an STL model
   - Use the point cloud from a Step (e.g., Point Cloud Clustering)
   - This avoids the STL normal issue

4. **Check for abnormal normals after Step processing**:
   - "The edge point cloud model contains abnormal normals or tangents after being processed by Steps such as 'Point Cloud Clustering,' 'Get Highest-Layer Clouds'"
   - Verify normals after each Step
   - Use the point cloud model before Step processing for matching
   - Or fix normals after Step processing

5. **Verify model display**:
   - After normal correction, check the model display
   - All areas should be rendered evenly (no black spots)
   - If black spots remain, repeat the normal correction
   - Don't proceed with matching until the model displays correctly

### Community Report

> "Starting from Mech-Vision 2.0.0, the matching process has strict requirements on the normals of point cloud models. When the normals of a point cloud model are incorrect, it directly leads to matching failure. After the STL model was imported, some areas were displayed in black, which usually indicates incorrect normals. You can use the 'STL Model Normal Correction Tool' to repair the STL model."

## 5. Remove Overlapped Poses Filters Out Correct Matches from Inconsistent Reference Frame

### Symptom

After enabling "Remove Overlapped Poses" in the 3D Matching Step, correct matching results are filtered out. The matching was successful before enabling this feature. Multiple fine matching results exist, but the correct one is removed. The issue occurs when the point cloud model and the point cloud to be matched are in different reference frames.

### Root Cause

"When the point cloud of the target object is in the camera reference frame, and the point cloud to be matched is in the robot reference frame, and there are multiple fine matching results, the correct matching results are filtered out." The "Remove Overlapped Poses" feature compares overlap ratios between point clouds. When the reference frames are inconsistent, the overlap calculation is incorrect, causing valid poses to be filtered out.

### Fix

1. **Ensure consistent reference frames**:
   - "During matching, ensure that the point cloud input to the '3D Matching' Step shares the same reference frame as the point cloud model"
   - Use the camera reference frame for both the model and the point cloud to be matched
   - Don't mix camera frame and robot frame

2. **Use camera reference frame for the model**:
   - "It is recommended to use the point cloud in the camera reference frame as the point cloud model"
   - "Ensure that the point cloud to be matched input to the '3D Matching' Step matches the reference frame of the point cloud model"
   - Capture the model point cloud directly from the camera
   - Don't transform it to the robot frame before matching

3. **Disable Remove Overlapped Poses**:
   - If the reference frames can't be aligned
   - Disable "Remove Overlapped Poses" in the 3D Matching Step
   - This prevents incorrect filtering
   - Manually verify the matching results

4. **Check Angle Threshold after adjustment**:
   - "When Angle Threshold was set to 180 degrees, the matching was successful. After adjusting the Angle Threshold, the matching results differed greatly"
   - "The reference frame of the point cloud model and that of the target object was inconsistent"
   - If adjusting Angle Threshold causes wrong results
   - Check reference frame consistency first

5. **Transform point cloud to correct frame before matching**:
   - If the point cloud to be matched is in the robot frame
   - Transform it to the camera frame using the extrinsic parameters
   - Use the "Transform Point Cloud" Step
   - Then input to the 3D Matching Step

### Community Report

> "Once the 'Remove Overlapped Poses' feature is enabled, when the overlap ratio between the point cloud of the target object in the camera reference frame and other point clouds above it exceeds the threshold, the pose of the overlapped target object will be removed. In some cases, the correct matching result may be filtered out. During matching, ensure that the point cloud input to the '3D Matching' Step shares the same reference frame as the point cloud model."

## 6. Additional Mech-Mind Issues

### Calibration Results Verified as Unqualified

**Issue**: After EIH calibration, verification shows the calibration board's point cloud has a significant offset relative to the fixed point.
**Fix**: "Check whether there is any error between the displayed position of the calibration board's point cloud and the actual position in the Z direction." This indicates a Z-axis offset in the extrinsic parameters. Recalibrate with more poses and better distribution.

### Point Cloud Loss on Inner Wall of Ring-Type STL Model

**Issue**: "Point Cloud Loss on Inner Wall of Ring-Type STL Model" causes matching failure.
**Fix**: The inner wall normals point inward, causing the matching algorithm to ignore them. Use the STL Model Normal Correction Tool. Alternatively, use a point cloud captured from the actual object instead of an STL model.

### Intrinsic Parameter Check Failed

**Issue**: "Intrinsic Parameter Check Failed During Hand-Eye Calibration."
**Fix**: Reset to factory intrinsic parameters. If reset fails, contact Mech-Mind technical support. The camera may have physical damage requiring factory recalibration.

### Reset to Factory Intrinsics Fails

**Issue**: "Tried to reset to factory intrinsics parameters in Mech Eye Viewer 2.3.0. It shows 'Please retry or contact Technical Support'."
**Fix**: This indicates a hardware-level issue. Contact Mech-Mind technical support. The camera may need to be returned for factory recalibration.

## Best Practices

1. **Cover or paint black the calibration board mounting nut** — prevents detection interference
2. **Reduce exposure to minimize reflection from screws** — prevents misidentification
3. **Disable gain and use single exposure for calibration** — reduces point cloud fluctuation
4. **Set point cloud smoothing to strong for DEEP-GL/LSR cameras** — improves calibration accuracy
5. **Check camera intrinsic parameters first for movement mismatch** — most common cause
6. **Verify robot accuracy by measuring actual vs displayed distances** — rules out robot issues
7. **Use STL Model Normal Correction Tool before 3D matching** — prevents matching failure
8. **Keep point cloud model and matched cloud in the same reference frame** — prevents pose filtering
9. **Use camera reference frame for both model and target in 3D Matching** — recommended approach
10. **Generate extrinsic parameter calibration report after calibration** — provides troubleshooting guidance
