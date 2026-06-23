### 1. Executive Summary & Objective
This developer directive provides debugging workflows for resolving assembly loading conflicts (`System.IO.FileLoadException`) and library generation failures when importing custom C# **Zero Touch** node libraries into Autodesk Dynamo for Revit.

### 2. The Mechanics of Assembly Loading Conflicts
Dynamo running inside the Revit parent process shares the same `.NET AppDomain` (or `AssemblyLoadContext` in modern .NET Core releases).
*   **Single-Version Restriction**: If Dynamo or another active Revit add-in loads a specific version of a shared library (e.g., `Newtonsoft.Json.dll` version 13.0.1) into memory, any attempt by your Zero Touch package to load a different version (e.g., version 12.0.3) will trigger a loader exception.
*   **Host Constraints**: Revit core assemblies (like `RevitAPI.dll` and `RevitServices.dll`) are loaded first, establishing strict API boundaries that custom nodes must conform to.

### 3. Step-by-Step Dependency Resolution Playbook

#### Step 1: Diagnose Mismatches via the Dynamo Console
1. Launch Revit and open Dynamo.
2. Press `Ctrl + Shift + C` to open the **Dynamo Console**.
3. Scroll to find red-flagged loader exceptions. Note the exact DLL and version that failed to bind.
4. For deeper system diagnostics, run the Microsoft **Assembly Binding Log Viewer (`fuslogvw.exe`)** to trace the paths .NET checked during assembly resolution.

#### Step 2: Configure Visual Studio Project Properties
Ensure your Zero Touch C# class library project conforms to target platform specifications:
1. In Visual Studio, open your project properties.
2. Under the **Build** tab, set the **Platform Target** to **`Any CPU`** or **`x64`**.
3. Uncheck **"Prefer 32-bit"**.
4. In your dependencies list, set **Copy Local** to **`False`** for all standard Revit and Dynamo DLLs (e.g., `RevitAPI.dll`, `DynamoCore.dll`) to prevent packaging duplicate references.

#### Step 3: Align Library Dependencies
If your node package depends on third-party libraries (e.g., `Newtonsoft.Json` or `RestSharp`):
*   Identify the exact DLL version currently loaded by your Revit release.
*   Update your NuGet packages in Visual Studio to target the exact same version, ensuring binary compatibility and avoiding loader exceptions.

#### Step 4: Implement Binding Redirects (Advanced)
If you cannot change the dependency version, add redirect rules to the host config file (**`Revit.exe.config`**):
```xml
<dependentAssembly>
  <assemblyIdentity name="Newtonsoft.Json" publicKeyToken="30ad4fe6b2a6aeed" culture="neutral" />
  <bindingRedirect oldVersion="0.0.0.0-13.0.0.0" newVersion="13.0.0.0" />
</dependentAssembly>
```

### 4. Official References & Source Links
*   **Dynamo GitHub Wiki**: [Zero Touch Plugin Development Guide](https://github.com/DynamoDS/Dynamo/wiki)
*   **Microsoft .NET Guide**: [Troubleshooting Assembly Load Exceptions](https://learn.microsoft.com/)
