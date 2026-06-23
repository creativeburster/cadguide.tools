### 1. Executive Summary & Objective
This technical blueprint outlines the official migration path for upgrading AutoCAD .NET and ObjectARX custom plugins from legacy **.NET Framework 4.8** to modern **.NET 8.0 (NET Core)**. Starting with AutoCAD 2025 and continuing into AutoCAD 2026, the underlying execution environment has transitioned entirely to .NET 8, requiring developers to re-compile and re-target assemblies to ensure system stability.

### 2. Project File (.csproj) Target Framework Restructuring
To initiate the migration, you must manually edit your project file to retarget the new framework execution context.
1. Open your `.csproj` file in a text editor.
2. Locate the `<TargetFramework>` tag and replace it:
   ```xml
   <!-- Old Configuration -->
   <!-- <TargetFrameworkVersion>v4.8</TargetFrameworkVersion> -->
   
   <!-- New Configuration -->
   <TargetFramework>net8.0-windows</TargetFramework>
   <UseWindowsForms>true</UseWindowsForms>
   <UseWPF>true</UseWPF>
   ```
3. Ensure platform targeting is explicitly set to `x64` since AutoCAD runs exclusively in 64-bit address spaces.

### 3. API Assembly Reference Adjustments
In .NET 8, assembly binding and runtime loading differ from the legacy .NET Framework.
- **AutoCAD Core References**: Retain references to `accoremgd.dll`, `acdbmgd.dll`, and `acmgd.dll`. Ensure their properties are configured as `Copy Local = False` to prevent assembly loading conflicts.
- **Dependency Changes**: Replace references to the legacy Windows compatibility packages with native .NET 8 equivalents via Nuget, especially for database connectivity and XML schema parsing.
- **Command Registration**: Update your initialization class implementing `IExtensionApplication` to ensure command namespaces map cleanly to the new assembly host layout.
