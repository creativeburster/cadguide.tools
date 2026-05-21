#!/usr/bin/env python3
"""
Content Completeness Audit Script
Scans c1.ts through c7.ts for missing/incomplete fields per tool.
"""
import re
import json
from pathlib import Path

DATA_DIR = Path("f:/cad tools io/cadtools-cc/src/lib/data")
OUTPUT_FILE = Path("f:/cad tools io/cadtools-cc/audit_report.txt")

# Fields to check for completeness
REQUIRED_FIELDS = [
    "logo_url",
    "industries",
    "core_features",
    "user_scales",
    "score",
    "pros",
    "cons",
    "expert_verdict",
]

OPTIONAL_BUT_IMPORTANT = [
    "detailed_features",
    "pricing_tiers",
    "faqs",
    "tech_specs",
    "external_ratings",
    "description",
    "short_desc",
    "country",
    "version",
    "last_updated",
    "free_trial_days",
    "languages",
    "file_formats_in",
    "file_formats_out",
    "integrations",
    "deployment_options",
    "license_types",
    "support_channels",
    "security_compliance",
    "api_sdk",
    "alternatives",
    "pricing_breakdown",
    "key_capabilities",
]

PLACEHOLDER_PATTERNS = [
    "待补充",
    "placeholder",
    "tbd",
    "todo",
    "待完善",
    "待填写",
]

def find_tool_blocks(text):
    """Find top-level tool objects in the export const cXTools array."""
    tools = []
    # Match objects starting with { id: "..." , name: "..." ... }
    # Use brace counting for robust extraction
    i = 0
    while i < len(text):
        m = re.search(r'\{\s*id\s*:', text[i:])
        if not m:
            break
        start = i + m.start()
        brace_count = 0
        in_string = False
        string_char = None
        escape = False
        j = start
        while j < len(text):
            ch = text[j]
            if escape:
                escape = False
                j += 1
                continue
            if ch == '\\':
                escape = True
                j += 1
                continue
            if not in_string and ch in ('"', "'"):
                in_string = True
                string_char = ch
                j += 1
                continue
            if in_string and ch == string_char:
                in_string = False
                string_char = None
                j += 1
                continue
            if not in_string:
                if ch == '{':
                    brace_count += 1
                elif ch == '}':
                    brace_count -= 1
                    if brace_count == 0:
                        j += 1
                        break
            j += 1
        block = text[start:j]
        tools.append(block)
        i = j
    return tools

def extract_field(block, field_name):
    """Extract a field value from a tool object block as raw text."""
    # Match field_name: <value> or field_name?: <value>
    pattern = rf'{re.escape(field_name)}\??\s*:\s*'
    m = re.search(pattern, block)
    if not m:
        return None
    start = m.end()
    # Determine the value type
    s = block[start:].lstrip()
    if s.startswith('"'):
        # String value
        i = 1
        escape = False
        while i < len(s):
            if escape:
                escape = False
                i += 1
                continue
            if s[i] == '\\':
                escape = True
                i += 1
                continue
            if s[i] == '"':
                break
            i += 1
        return s[:i+1]
    elif s.startswith('['):
        # Array value
        brace_count = 0
        in_string = False
        string_char = None
        escape = False
        i = 0
        while i < len(s):
            ch = s[i]
            if escape:
                escape = False
                i += 1
                continue
            if ch == '\\':
                escape = True
                i += 1
                continue
            if not in_string and ch in ('"', "'"):
                in_string = True
                string_char = ch
                i += 1
                continue
            if in_string and ch == string_char:
                in_string = False
                string_char = None
                i += 1
                continue
            if not in_string:
                if ch == '[':
                    brace_count += 1
                elif ch == ']':
                    brace_count -= 1
                    if brace_count == 0:
                        i += 1
                        break
            i += 1
        return s[:i]
    elif s.startswith('{'):
        # Object value
        brace_count = 0
        in_string = False
        string_char = None
        escape = False
        i = 0
        while i < len(s):
            ch = s[i]
            if escape:
                escape = False
                i += 1
                continue
            if ch == '\\':
                escape = True
                i += 1
                continue
            if not in_string and ch in ('"', "'"):
                in_string = True
                string_char = ch
                i += 1
                continue
            if in_string and ch == string_char:
                in_string = False
                string_char = None
                i += 1
                continue
            if not in_string:
                if ch == '{':
                    brace_count += 1
                elif ch == '}':
                    brace_count -= 1
                    if brace_count == 0:
                        i += 1
                        break
            i += 1
        return s[:i]
    else:
        # Primitive (number, boolean, null)
        m2 = re.match(r'[^,\s}]+', s)
        if m2:
            return m2.group(0)
        return None

def check_completeness(block, tool_name):
    """Check a single tool block for missing/incomplete fields."""
    issues = []

    # Extract basic info
    id_match = re.search(r'id\s*:\s*"([^"]+)"', block)
    slug_match = re.search(r'slug\s*:\s*"([^"]+)"', block)
    name_match = re.search(r'name\s*:\s*"([^"]+)"', block)
    tool_id = id_match.group(1) if id_match else "unknown"
    slug = slug_match.group(1) if slug_match else "unknown"
    name = name_match.group(1) if name_match else tool_name

    # Check required fields
    for field in REQUIRED_FIELDS:
        val = extract_field(block, field)
        if val is None:
            issues.append(f"  MISSING: {field}")
        else:
            # Check for empty values
            stripped = val.strip()
            if stripped == '""' or stripped == '[]' or stripped == '0' or stripped == '0.0':
                issues.append(f"  EMPTY: {field}")
            elif stripped.startswith('"') and len(stripped) <= 2:
                issues.append(f"  EMPTY_STRING: {field}")
            elif stripped.startswith('[') and stripped == '[]':
                issues.append(f"  EMPTY_ARRAY: {field}")
            # Check for placeholders in string fields
            if stripped.startswith('"'):
                content = stripped[1:-1] if len(stripped) > 2 else ""
                for ph in PLACEHOLDER_PATTERNS:
                    if ph.lower() in content.lower():
                        issues.append(f"  PLACEHOLDER: {field} => {content[:60]}")
                        break

    # Check optional but important fields
    for field in OPTIONAL_BUT_IMPORTANT:
        val = extract_field(block, field)
        if val is None:
            issues.append(f"  MISSING_OPTIONAL: {field}")
        else:
            stripped = val.strip()
            if stripped == '""' or stripped == '[]' or stripped == '{}':
                issues.append(f"  EMPTY_OPTIONAL: {field}")

    # Check external_ratings count (multiple scoring metrics)
    val = extract_field(block, "external_ratings")
    if val and val.strip().startswith('['):
        # Count objects in array
        count = len(re.findall(r'\{\s*source', val))
        if count == 0:
            issues.append("  NO_EXTERNAL_RATINGS")
        elif count == 1:
            issues.append(f"  SINGLE_RATING (only 1 source)")
        else:
            issues.append(f"  OK: {count} external ratings")
    else:
        issues.append("  MISSING: external_ratings")

    # Check expert_verdict specifically for placeholder
    val = extract_field(block, "expert_verdict")
    if val:
        content = val.strip()
        if content.startswith('"'):
            text = content[1:-1] if len(content) > 2 else ""
            if len(text) < 20:
                issues.append(f"  SHORT_VERDICT: ({len(text)} chars) {text[:80]}")
            for ph in PLACEHOLDER_PATTERNS:
                if ph.lower() in text.lower():
                    issues.append(f"  PLACEHOLDER_VERDICT: {text[:80]}")
                    break
    else:
        issues.append("  MISSING: expert_verdict")

    # Check description length
    val = extract_field(block, "description")
    if val:
        content = val.strip()
        if content.startswith('"'):
            text = content[1:-1] if len(content) > 2 else ""
            if len(text) < 30:
                issues.append(f"  SHORT_DESCRIPTION: ({len(text)} chars)")
    else:
        issues.append("  MISSING: description")

    return {
        "id": tool_id,
        "slug": slug,
        "name": name,
        "issues": issues,
        "has_issues": len(issues) > 0
    }

def main():
    report_lines = []
    report_lines.append("=" * 80)
    report_lines.append("CONTENT COMPLETENESS AUDIT REPORT")
    report_lines.append("=" * 80)
    report_lines.append("")

    total_tools = 0
    total_issues = 0
    tools_with_issues = 0
    category_stats = {}

    for i in range(1, 8):
        file_path = DATA_DIR / f"c{i}.ts"
        if not file_path.exists():
            report_lines.append(f"WARNING: {file_path} not found")
            continue

        text = file_path.read_text(encoding="utf-8")
        tools = find_tool_blocks(text)

        category_name = "Unknown"
        cat_match = re.search(r'Category\s+c\d+\s+—\s+(.+)', text)
        if cat_match:
            category_name = cat_match.group(1).strip()

        report_lines.append(f"\n{'='*60}")
        report_lines.append(f"CATEGORY c{i}: {category_name} ({len(tools)} tools)")
        report_lines.append(f"{'='*60}")

        category_issues = 0
        category_tools_with_issues = 0

        for idx, block in enumerate(tools):
            result = check_completeness(block, f"tool_{idx}")
            total_tools += 1

            if result["has_issues"]:
                tools_with_issues += 1
                category_tools_with_issues += 1
                issue_count = len(result["issues"])
                total_issues += issue_count
                category_issues += issue_count

                report_lines.append(f"\n  [{result['id']}] {result['name']} (slug: {result['slug']})")
                report_lines.append(f"  Issues found: {issue_count}")
                for issue in result["issues"]:
                    report_lines.append(f"    {issue}")
            else:
                report_lines.append(f"  [{result['id']}] {result['name']} — COMPLETE ✓")

        category_stats[f"c{i}"] = {
            "tools": len(tools),
            "tools_with_issues": category_tools_with_issues,
            "total_issues": category_issues
        }

    # Summary
    report_lines.append("\n" + "=" * 80)
    report_lines.append("SUMMARY")
    report_lines.append("=" * 80)
    report_lines.append(f"Total tools scanned: {total_tools}")
    report_lines.append(f"Tools with issues: {tools_with_issues}")
    report_lines.append(f"Total issues found: {total_issues}")
    report_lines.append(f"Completion rate: {((total_tools - tools_with_issues) / total_tools * 100):.1f}%")
    report_lines.append("")

    for cat, stats in category_stats.items():
        report_lines.append(f"  {cat}: {stats['tools']} tools, {stats['tools_with_issues']} with issues, {stats['total_issues']} total issues")

    report_lines.append("\n" + "=" * 80)
    report_lines.append("FIELD DEFINITIONS")
    report_lines.append("=" * 80)
    report_lines.append("REQUIRED_FIELDS:")
    for f in REQUIRED_FIELDS:
        report_lines.append(f"  - {f}")
    report_lines.append("\nOPTIONAL_BUT_IMPORTANT:")
    for f in OPTIONAL_BUT_IMPORTANT:
        report_lines.append(f"  - {f}")
    report_lines.append("\nPLACEHOLDER_PATTERNS:")
    for p in PLACEHOLDER_PATTERNS:
        report_lines.append(f"  - {p}")

    report_text = "\n".join(report_lines)
    OUTPUT_FILE.write_text(report_text, encoding="utf-8")
    print(f"Audit complete. Report written to: {OUTPUT_FILE}")
    print(f"Total tools: {total_tools}, Issues: {total_issues}, Tools with issues: {tools_with_issues}")

if __name__ == "__main__":
    main()
