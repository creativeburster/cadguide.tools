//! 2D Contour Topology Repair, DIN 6935 Sheet Metal Unfolding (K-Factor, BA, BD),
//! NFP True-Shape Polygon Nesting, and Laser/Plasma G-Code Post-Processor.

use cad_math::Vec2;
use serde::{Deserialize, Serialize};
use std::f64::consts::PI;

#[derive(Debug, Clone, Copy, Serialize, Deserialize)]
pub struct SheetMetalUnfoldResult {
    pub bend_allowance_mm: f64,
    pub outside_setback_mm: f64,
    pub bend_deduction_mm: f64,
    pub neutral_axis_offset_mm: f64,
    pub flat_length_mm: f64,
}

/// Computes sheet metal flat pattern metrics according to DIN 6935 & Machinery's Handbook:
/// - BA = (pi / 180) * angle_deg * (inside_radius + k_factor * thickness)
/// - OSSB = tan(angle_rad / 2) * (inside_radius + thickness)
/// - BD = 2 * OSSB - BA
/// - FlatLength = leg1 + leg2 - BD
pub fn unfold_sheet_metal_bend(
    thickness_mm: f64,
    inside_radius_mm: f64,
    bend_angle_deg: f64,
    k_factor: f64,
    leg1_mm: f64,
    leg2_mm: f64,
) -> SheetMetalUnfoldResult {
    let rad = bend_angle_deg * PI / 180.0;
    let ba = rad * (inside_radius_mm + k_factor * thickness_mm);
    let ossb = (rad * 0.5).tan() * (inside_radius_mm + thickness_mm);
    let bd = 2.0 * ossb - ba;
    let flat_len = (leg1_mm + leg2_mm - bd).max(0.0);
    SheetMetalUnfoldResult {
        bend_allowance_mm: ba,
        outside_setback_mm: ossb,
        bend_deduction_mm: bd,
        neutral_axis_offset_mm: k_factor * thickness_mm,
        flat_length_mm: flat_len,
    }
}

/// Signed area of a 2D polygon using the Shoelace theorem.
pub fn polygon_signed_area(poly: &[Vec2]) -> f64 {
    if poly.len() < 3 {
        return 0.0;
    }
    let mut sum = 0.0;
    for i in 0..poly.len() {
        let a = poly[i];
        let b = poly[(i + 1) % poly.len()];
        sum += a.x * b.y - b.x * a.y;
    }
    0.5 * sum
}

/// Point-in-polygon ray-casting test (used for hole-in-hole nesting and NFP collision).
pub fn point_in_polygon(pt: Vec2, poly: &[Vec2]) -> bool {
    let mut inside = false;
    let n = poly.len();
    if n < 3 {
        return false;
    }
    let mut j = n - 1;
    for i in 0..n {
        let pi = poly[i];
        let pj = poly[j];
        if ((pi.y > pt.y) != (pj.y > pt.y))
            && (pt.x < (pj.x - pi.x) * (pt.y - pi.y) / ((pj.y - pi.y) + 1e-15) + pi.x)
        {
            inside = !inside;
        }
        j = i;
    }
    inside
}
