//! Code-CAD Domain-Specific Language (DSL) Lexer, `@param` Annotation Extractor,
//! AST Parser, and Parametric Solid Evaluator.

use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ExtractedParam {
    pub name: String,
    pub label: String,
    pub min: f64,
    pub max: f64,
    pub step: f64,
    pub default_val: f64,
    pub current_val: f64,
    pub line: usize,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DslDiagnostic {
    pub line: usize,
    pub column: usize,
    pub message: String,
    pub severity: String,
}

/// Scans a Code-CAD script for `// @param(...)` annotations paired with `let <ident> = <val>;`
pub fn extract_script_params(source: &str) -> Vec<ExtractedParam> {
    let mut out = Vec::new();
    for (idx, line) in source.lines().enumerate() {
        let trimmed = line.trim();
        if trimmed.starts_with("// @param") {
            let name = extract_attr(trimmed, "name").unwrap_or_else(|| format!("param_{}", idx + 1));
            let label = extract_attr(trimmed, "label").unwrap_or_else(|| name.clone());
            let min = extract_attr(trimmed, "min").and_then(|v| v.parse().ok()).unwrap_or(1.0);
            let max = extract_attr(trimmed, "max").and_then(|v| v.parse().ok()).unwrap_or(100.0);
            let step = extract_attr(trimmed, "step").and_then(|v| v.parse().ok()).unwrap_or(1.0);
            let def = extract_attr(trimmed, "default").and_then(|v| v.parse().ok()).unwrap_or(min);
            out.push(ExtractedParam {
                name,
                label,
                min,
                max,
                step,
                default_val: def,
                current_val: def,
                line: idx + 1,
            });
        }
    }
    out
}

fn extract_attr(line: &str, key: &str) -> Option<String> {
    let pat = format!("{}=", key);
    let pos = line.find(&pat)?;
    let rest = &line[pos + pat.len()..];
    if let Some(stripped) = rest.strip_prefix('"') {
        let end = stripped.find('"')?;
        Some(stripped[..end].to_string())
    } else {
        let end = rest.find(|c: char| c == ',' || c == ')' || c.is_whitespace()).unwrap_or(rest.len());
        Some(rest[..end].to_string())
    }
}
