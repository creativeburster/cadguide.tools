export const autocadFatalErrorWizard = {
  "wizardId": "autocad-fatal-error-unhandled-access-violation",
  "title": "AutoCAD \"Fatal Error: Unhandled Access Violation\" Diagnostic Wizard",
  "entryQuestion": "When does the FATAL ERROR: Unhandled Access Violation occur?",
  "sourcesPolicy": "All causes and fixes below are taken from Autodesk official Knowledge Base / Help articles. Each cause lists its sourceUrl.",
  "nodes": [
    {
      "id": "crash-opening-specific-drawing",
      "symptom": "AutoCAD crashes with 'FATAL ERROR: Unhandled Access Violation' only when opening one specific drawing. Other drawings open normally.",
      "causes": [
        {
          "cause": "The drawing file or one of its referenced drawings (XREFs) is corrupt.",
          "fix": [
            "Copy the drawing and all of its XREFs into a local folder, then open each XREF separately to identify which file crashes AutoCAD.",
            "Run RECOVER on the problem files, or RECOVERALL to also recover nested XREFs.",
            "Replace the broken files with the recovered copies in the original folders.",
            "If the file will not open in desktop AutoCAD, try the AutoCAD web app. If it opens there, run PURGE All and -PURGE R, save, then download and reopen it on the desktop."
          ],
          "sourceUrl": "https://www.autodesk.com/support/technical/article/caas/sfdcarticles/sfdcarticles/FATAL-ERROR-Unhandled-Access-Violation-when-opening-a-drawing-in-AutoCAD.html",
          "sourceTitle": "\"FATAL ERROR: Unhandled Access Violation...\" when opening a drawing in AutoCAD Products"
        },
        {
          "cause": "The drawing is damaged but can still be opened (errors, hangs, missing or incorrect elements).",
          "fix": [
            "Run AUDIT and answer Yes to fix detected errors, then run PURGE to remove unused items.",
            "If problems persist, use WBLOCK to export the drawing contents into a new file.",
            "As an alternative, use SAVEAS to convert the drawing to DXF, reopen the DXF, then save it back to DWG."
          ],
          "sourceUrl": "https://www.autodesk.com/support/technical/article/caas/sfdcarticles/sfdcarticles/AutoCAD-File-Corruption.html",
          "sourceTitle": "How to repair damaged or corrupt drawing files in AutoCAD products"
        },
        {
          "cause": "The drawing sits on a corrupt or unstable network drive.",
          "fix": [
            "Copy the drawing to a local drive and open it from there.",
            "If it opens without crashing locally, troubleshoot the network drive or path before moving the file back."
          ],
          "sourceUrl": "https://www.autodesk.com/support/technical/article/caas/sfdcarticles/sfdcarticles/FATAL-ERROR-Unhandled-Access-Violation-when-opening-a-drawing-in-AutoCAD.html",
          "sourceTitle": "\"FATAL ERROR: Unhandled Access Violation...\" when opening a drawing in AutoCAD Products"
        }
      ]
    },
    {
      "id": "crash-at-startup",
      "symptom": "AutoCAD crashes with an access violation at launch, before any drawing is opened.",
      "causes": [
        {
          "cause": "A corrupt AutoCAD profile or user settings.",
          "fix": [
            "Run the app named Reset Settings to Default (Start > All Apps > AutoCAD 20xx > Reset Settings To Default).",
            "Choose 'Back up and Reset Settings' so your current settings are kept as a ZIP backup.",
            "If the crash stops, rebuild your customizations on the fresh profile instead of restoring the old one wholesale."
          ],
          "sourceUrl": "https://www.autodesk.com/support/technical/article/caas/sfdcarticles/sfdcarticles/How-to-reset-AutoCAD-to-defaults.html",
          "sourceTitle": "How to reset AutoCAD to defaults"
        },
        {
          "cause": "Outdated graphics driver, dual-GPU conflict, or unsupported video card.",
          "fix": [
            "Update the graphics driver. If the card is on the Autodesk Certified Graphics Hardware list, install the driver version listed there; otherwise install the latest driver from the card manufacturer.",
            "On computers with two graphics cards, configure AutoCAD to use the high-performance adapter.",
            "If multiple monitors are in use, test with a single monitor."
          ],
          "sourceUrl": "https://www.autodesk.com/support/technical/article/caas/sfdcarticles/sfdcarticles/FATAL-ERROR-Unhandled-Access-Violation-Writing-Exception-at-when-opening-AutoCAD.html",
          "sourceTitle": "\"FATAL ERROR: Unhandled Access Violation Writing ... Exception at ...\" when opening AutoCAD products"
        },
        {
          "cause": "Pending AutoCAD/Windows updates or a corrupted installation.",
          "fix": [
            "Install the latest updates for AutoCAD from Autodesk Account or Autodesk Access.",
            "Install pending Windows updates, and check Windows Event Viewer for DLL errors.",
            "If the crash continues, repair the installation or perform a clean uninstall and reinstall."
          ],
          "sourceUrl": "https://www.autodesk.com/support/technical/article/caas/sfdcarticles/sfdcarticles/Fatal-Error-Unhandled-Access-Violation-Reading-0x0000-Exception-at-bcbdad73h.html",
          "sourceTitle": "\"FATAL ERROR: Unhandled Access Violation Reading ... Exception at...\" when launching AutoCAD products"
        }
      ]
    },
    {
      "id": "crash-when-plotting",
      "symptom": "AutoCAD crashes or freezes only when plotting or publishing.",
      "causes": [
        {
          "cause": "A specific printer driver crashes AutoCAD (the same drawing plots fine to other printers and to the AutoCAD PDF driver).",
          "fix": [
            "Uninstall and reinstall the problematic printer driver, then install the latest version from the printer manufacturer.",
            "Delete and recreate the PC3 file assigned in Page Setup.",
            "Install the latest updates for AutoCAD."
          ],
          "sourceUrl": "https://www.autodesk.com/support/technical/article/caas/sfdcarticles/sfdcarticles/plotting-to-a-specific-printer-crashes-autocad.html",
          "sourceTitle": "Plotting to a specific printer crashes AutoCAD"
        },
        {
          "cause": "The DWG To PDF.pc3 or AutoCAD PDF plotter configuration is damaged.",
          "fix": [
            "Run PLOTTERMANAGER, then paste a fresh DWG To PDF.pc3 from C:\\Program Files\\Autodesk\\AutoCAD <version>\\UserDataCache\\Plotters (a hidden folder), overwriting the existing file.",
            "If the product has no Plotters folder in UserDataCache, copy a working DWG To PDF.pc3 from another workstation.",
            "If that fails, delete the PC3 and repair the AutoCAD installation, or reset AutoCAD to defaults."
          ],
          "sourceUrl": "https://www.autodesk.com/support/technical/article/caas/sfdcarticles/sfdcarticles/Crash-or-hang-when-plotting-to-DWG-To-PDF-pc3-in-AutoCAD.html",
          "sourceTitle": "Plotting/publishing with the 'AutoCAD PDF' or 'DWG to PDF.pc3' printer crashes or freezes AutoCAD products"
        }
      ]
    },
    {
      "id": "third-party-plugin-conflict",
      "symptom": "Crashes began after installing or updating a plug-in, or AutoCAD crashes randomly with no clear trigger.",
      "causes": [
        {
          "cause": "An incompatible, unsupported, or malfunctioning third-party plug-in.",
          "fix": [
            "Start AutoCAD with a minimum of plug-ins to confirm the diagnosis (see next step). If it is stable, move the plug-in folders out of C:\\ProgramData\\Autodesk\\ApplicationPlugins and %appdata%\\Autodesk\\ApplicationPlugins to a backup location.",
            "Restart AutoCAD and test, then reintroduce plug-ins one by one to identify the culprit.",
            "Update the identified plug-in or contact its provider for a fix."
          ],
          "sourceUrl": "https://www.autodesk.com/support/technical/article/caas/sfdcarticles/sfdcarticles/Third-party-plugins-causing-crashes-instability-or-errors-in-AutoCAD-Plant-3D.html",
          "sourceTitle": "Third-party plug-ins causing crashes, instability, or errors in AutoCAD Products"
        },
        {
          "cause": "Need a clean diagnostic startup to isolate plug-ins and add-ons.",
          "fix": [
            "Set the APPAUTOLOAD system variable to 0 or 1, then restart the AutoCAD product.",
            "If that does not help, copy the AutoCAD shortcut, open its Properties, and append /safemode to the end of the Target line.",
            "Launch AutoCAD from that shortcut; if it runs cleanly, a plug-in or add-on is the cause."
          ],
          "sourceUrl": "https://www.autodesk.com/support/technical/article/caas/sfdcarticles/sfdcarticles/How-to-launch-an-AutoCAD-Product-without-any-plug-ins-or-add-ons.html",
          "sourceTitle": "How to start an AutoCAD Product with a minimum of plug-ins or add-ons"
        }
      ]
    },
    {
      "id": "graphics-hardware-acceleration",
      "symptom": "Crashes during display/navigation work, or you suspect the graphics card or hardware acceleration.",
      "causes": [
        {
          "cause": "Hardware acceleration misbehaving with a specific video card or driver.",
          "fix": [
            "Enter GRAPHICSCONFIG (or 3DCONFIG) and click Hardware Configuration to toggle hardware acceleration.",
            "Alternatively, run OPTIONS, open the System tab, click Graphics Performance, and switch Hardware Acceleration on or off.",
            "You can also click the performance indicator in the lower-right corner of the application window."
          ],
          "sourceUrl": "https://www.autodesk.com/support/technical/article/caas/sfdcarticles/sfdcarticles/How-to-enable-or-disable-hardware-acceleration-in-AutoCAD.html",
          "sourceTitle": "How to enable or disable hardware acceleration in AutoCAD"
        },
        {
          "cause": "Graphics card missing driver updates, or an unsupported/untested card.",
          "fix": [
            "Check Autodesk Certified Graphics Hardware to see whether your video card is listed.",
            "If it is listed, install the driver version named in the list; otherwise install the latest driver from the card manufacturer's website.",
            "As a workaround, add the /nohardware switch to the end of the program target in the shortcut Properties."
          ],
          "sourceUrl": "https://www.autodesk.com/support/technical/article/caas/sfdcarticles/sfdcarticles/FATAL-ERROR-Unhandled-Access-Violation-Writing-Exception-at-when-opening-AutoCAD.html",
          "sourceTitle": "\"FATAL ERROR: Unhandled Access Violation Writing ... Exception at ...\" when opening AutoCAD products"
        },
        {
          "cause": "Video card is not on Autodesk's tested/certified list.",
          "fix": [
            "Look up your card and driver on the Autodesk Certified Graphics Hardware page for your AutoCAD version.",
            "If the card is absent, treat it as untested and prefer a certified card/driver combination for stability-critical work."
          ],
          "sourceUrl": "https://www.autodesk.com/support/system-requirements/certified-graphics-hardware/autocad",
          "sourceTitle": "AutoCAD | Certified Graphics Hardware | Autodesk Support"
        }
      ]
    }
  ]
} as const;
