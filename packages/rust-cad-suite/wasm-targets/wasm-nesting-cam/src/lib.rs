use cad_geometry2d::unfold_sheet_metal_bend;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn wasm_kernel_version() -> u32 {
    201
}

#[wasm_bindgen]
pub fn sheet_metal_bend_allowance(thickness: f64, radius: f64, angle_deg: f64, k_factor: f64) -> f64 {
    unfold_sheet_metal_bend(thickness, radius, angle_deg, k_factor, 0.0, 0.0).bend_allowance_mm
}

#[wasm_bindgen]
pub fn sheet_metal_bend_deduction(thickness: f64, radius: f64, angle_deg: f64, k_factor: f64) -> f64 {
    unfold_sheet_metal_bend(thickness, radius, angle_deg, k_factor, 0.0, 0.0).bend_deduction_mm
}

#[wasm_bindgen]
pub fn sheet_metal_flat_length(
    thickness: f64,
    radius: f64,
    angle_deg: f64,
    k_factor: f64,
    leg1: f64,
    leg2: f64,
) -> f64 {
    unfold_sheet_metal_bend(thickness, radius, angle_deg, k_factor, leg1, leg2).flat_length_mm
}
