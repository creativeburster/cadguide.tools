use std::f64::consts::PI;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn wasm_kernel_version() -> u32 {
    301
}

#[wasm_bindgen]
pub fn eval_gear_pitch_diameter(module_mm: f64, teeth: f64) -> f64 {
    module_mm * teeth
}

#[wasm_bindgen]
pub fn eval_gear_base_radius(module_mm: f64, teeth: f64, pressure_angle_deg: f64) -> f64 {
    0.5 * module_mm * teeth * (pressure_angle_deg * PI / 180.0).cos()
}

#[wasm_bindgen]
pub fn eval_cylinder_volume(radius: f64, height: f64) -> f64 {
    PI * radius * radius * height
}
