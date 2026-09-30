#!/usr/bin/env python3
"""
CADGuide CLI - Command Line Tool
https://cadguide.tools
"""

import sys
import os
import math
import argparse

DWG_HEADER_MAP = {
    "AC1032": ("AutoCAD 2018 - 2026", "2018+", True),
    "AC1027": ("AutoCAD 2013 - 2017", "2013", True),
    "AC1024": ("AutoCAD 2010 - 2012", "2010", False),
    "AC1021": ("AutoCAD 2007 - 2009", "2007", False),
    "AC1018": ("AutoCAD 2004 - 2006", "2004", False),
    "AC1015": ("AutoCAD 2000 - 2002", "2000", False),
    "AC1014": ("AutoCAD Release 14", "R14", False),
    "AC1012": ("AutoCAD Release 13", "R13", False),
    "AC1009": ("AutoCAD Release 11 / 12", "R11/R12", False),
}

def inspect_dwg(filepath: str):
    if not os.path.exists(filepath):
        print(f"❌ Error: File not found: {filepath}", file=sys.stderr)
        sys.exit(1)
        
    try:
        with open(filepath, "rb") as f:
            header_bytes = f.read(6)
            
        header_str = header_bytes.decode("ascii", errors="ignore")
        
        print("=" * 60)
        print("  🔍 CADGuide DWG Binary Header Inspector")
        print("  🌐 https://cadguide.tools/toolbox/dwg-version-checker")
        print("=" * 60)
        print(f"File: {filepath}")
        print(f"Magic Code: {header_str}")
        
        if header_str in DWG_HEADER_MAP:
            releases, year, is_modern = DWG_HEADER_MAP[header_str]
            print(f"Compatible CAD Releases: {releases}")
            print(f"Internal Format Era: {year}")
            print(f"Modern 64-bit Object Stream: {'Yes (Supported)' if is_modern else 'Legacy Format'}")
            print("=" * 60)
            print("✅ Verified locally with 0 cloud uploads. 100% private.")
        else:
            print("⚠️ Unknown or non-standard DWG header magic bytes.")
            print("Note: Valid AutoCAD drawing files must start with AC10xx.")
            print("=" * 60)
    except Exception as e:
        print(f"❌ Error reading file: {e}", file=sys.stderr)
        sys.exit(1)

def calculate_kfactor(thickness: float, radius: float, angle: float, k: float):
    # BA = (pi / 180) * angle * (radius + k * thickness)
    rad = math.radians(angle)
    ba = rad * (radius + (k * thickness))
    # Setback = tan(angle/2) * (thickness + radius)
    setback = math.tan(math.radians(angle / 2)) * (thickness + radius)
    # Bend Deduction = 2 * Setback - BA
    bd = (2 * setback) - ba
    
    print("=" * 60)
    print("  📐 CADGuide Sheet Metal K-Factor Calculator")
    print("  🌐 https://cadguide.tools/toolbox/k-factor-calculator")
    print("=" * 60)
    print(f"Inputs: Thickness={thickness}mm, Inside Radius={radius}mm, Angle={angle}°, K-Factor={k}")
    print("-" * 60)
    print(f"Bend Allowance (BA)  : {ba:.4f} mm")
    print(f"Outside Setback (OSB): {setback:.4f} mm")
    print(f"Bend Deduction (BD)  : {bd:.4f} mm")
    print("=" * 60)

def dwg_check_entry():
    if len(sys.argv) < 2:
        print("Usage: dwg-check <path_to_dwg_file>")
        sys.exit(1)
    inspect_dwg(sys.argv[1])

def cli_entry():
    parser = argparse.ArgumentParser(
        description="CADGuide CLI - Offline CAD tools and calculators (https://cadguide.tools)"
    )
    subparsers = parser.add_subparsers(dest="command", help="Available subcommands")
    
    # Subcommand: dwg
    dwg_parser = subparsers.add_parser("dwg", help="Inspect binary header of AutoCAD DWG file")
    dwg_parser.add_argument("file", help="Path to .dwg drawing file")
    
    # Subcommand: kfactor
    k_parser = subparsers.add_parser("kfactor", help="Calculate sheet metal K-Factor and Bend Allowance")
    k_parser.add_argument("--thickness", "-t", type=float, required=True, help="Material thickness (mm)")
    k_parser.add_argument("--radius", "-r", type=float, required=True, help="Inside bend radius (mm)")
    k_parser.add_argument("--angle", "-a", type=float, default=90.0, help="Bend angle in degrees (default: 90)")
    k_parser.add_argument("--k", "-k", type=float, default=0.44, help="K-Factor value (default: 0.44 for mild steel)")
    
    # Subcommand: compare
    compare_parser = subparsers.add_parser("compare", help="Compare CAD software alternatives")
    compare_parser.add_argument("software_a", help="First software name (e.g., autocad)")
    compare_parser.add_argument("software_b", help="Second software name (e.g., gstarcad)")
    
    args = parser.parse_args()
    
    if args.command == "dwg":
        inspect_dwg(args.file)
    elif args.command == "kfactor":
        calculate_kfactor(args.thickness, args.radius, args.angle, args.k)
    elif args.command == "compare":
        print(f"🔗 Compare {args.software_a} vs {args.software_b} at https://cadguide.tools/compare/{args.software_a}-vs-{args.software_b}")
    else:
        parser.print_help()

if __name__ == "__main__":
    cli_entry()
