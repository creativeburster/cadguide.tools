### 1. Executive Summary & Objective
This developer-focused directive provides the technical specifications and build configurations required to retarget Revit custom C# add-ins and API plug-ins from legacy **.NET Framework 4.8** to the modern **.NET 8.0 (Core)** runtime, aligning with Revit 2025 and 2026 platform architecture requirements.

### 2. Core API Migration & SDK-Style Project Conversion
Revit 2025 has transitioned fully to the .NET 8.0 execution engine. Plugins compiled under .NET Framework 4.8 will fail to load or invoke. Follow this migration path to update your codebase:

#### Step 1: Convert Project to SDK-Style Format
Convert your traditional XML-bloated `.csproj` file to the modern Microsoft SDK-style format. Replace the root project definition:

```xml
<!-- Before: Legacy Framework .csproj -->
<Project ToolsVersion="15.0" DefaultTargets="Build" xmlns="http://schemas.microsoft.com/developer/msbuild/2003">

<!-- After: SDK-style Target -->
<Project Sdk="Microsoft.NET.Sdk">
```

#### Step 2: Target Framework & Windows Desktop App Support
Update your compilation targets. Since Revit runs as a Windows desktop process using WPF and WinForms, configure your target framework as follows:

```xml
<PropertyGroup>
  <TargetFramework>net8.0-windows</TargetFramework>
  <UseWPF>true</UseWPF>
  <UseWindowsForms>true</UseWindowsForms>
  <ImportWindowsDesktopTargets>true</ImportWindowsDesktopTargets>
</PropertyGroup>
```

#### Step 3: Resolve MSB3277 Library Mismatches
When compilation fails with warning **MSB3277** due to conflicted assembly references, add the unified Windows Desktop shared framework reference:

```xml
<ItemGroup>
  <FrameworkReference Include="Microsoft.WindowsDesktop.App" />
</ItemGroup>
```

### 3. Conditional Compilation for Multi-Release Add-ins
To support older Revit editions (e.g., Revit 2024 on .NET Framework 4.8) alongside newer releases within a single solution codebase, use preprocessor directives:

```csharp
#if NET8_0_OR_GREATER
    using Autodesk.Revit.DB;
    // .NET 8.0 Specific API Calls
#else
    using Autodesk.Revit.DB;
    // .NET Framework 4.8 Fallback Logic
#endif
```

### 4. Official References & Source Links
*   **Autodesk Developer Network (ADN) Blog**: [Revit 2025 and .NET 8.0 Transition Guide](https://forums.autodesk.com/t5/revit-api-forum/bd-p/160)
*   **Microsoft Porting Assistant Docs**: [Porting C# Projects from .NET Framework to .NET 8](https://learn.microsoft.com/en-us/dotnet/core/porting/)
