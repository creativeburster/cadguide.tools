### 1. Executive Summary & Objective
This technical blueprint details the workflow to resolve missing shared parameters, type parameters, and class mapping anomalies when exporting Revit BIM models to the **IFC4 (Industry Foundation Classes)** schema. It defines the exact syntax for custom property set mapping files to ensure complete data transfer.

### 2. Custom Property Set Mapping Configuration
Standard Revit IFC export setups bypass non-standard shared parameters unless they are declared in a user-defined mapping file.
1. Create a plain text mapping file named `CustomIFCParameterMap.txt`.
2. Define property sets and map parameters using the following rigid syntax:
   ```txt
   # Syntax: PropertySet: <PsetName> [I/T] <IFC_Element_Class>
   #         <Pset_Property_Name> <Revit_Parameter_Name> <Data_Type>
   
   PropertySet: EnterpriseAECParams T IfcWall
       AEC_AssetCode Asset_Code Identifier
       AEC_Manufacturer Manufacturer_Name Text
       AEC_AcousticRating Acoustic_Rating Text
   ```
   * Use `I` for Instance parameters and `T` for Type parameters.
   * Ensure `Data_Type` matches IFC definitions (e.g., `Text`, `Identifier`, `Integer`, `Real`, `Boolean`).
3. In Revit, go to **File > Export > IFC > Modify Setup**.
4. In the **Property Sets** tab, check **Export user-defined property sets** and link your text file.

### 3. Class Mapping Verification
Ensure categories map correctly to prevent elements exporting as generic building proxies:
1. Go to **File > Export > Options > IFC Options**.
2. Locate the Revit Categories (e.g., Columns, Structural Columns, Walls).
3. Verify that Columns map to `IfcColumn` (rather than `IfcBuildingElementProxy`) and Walls map to `IfcWall`.
4. Open the exported IFC in Solibri or Navisworks to verify that all custom property tabs appear under the designated categories.
