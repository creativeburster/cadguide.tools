use cad_math::{signed_tetra_volume, triangle_area_3d, Vec3};
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn wasm_kernel_version() -> u32 {
    101
}

#[wasm_bindgen]
pub fn solve_2d_distance(x1: f64, y1: f64, x2: f64, y2: f64) -> f64 {
    ((x2 - x1).powi(2) + (y2 - y1).powi(2)).sqrt()
}

#[wasm_bindgen]
pub fn compute_triangle_volume(
    ax: f64, ay: f64, az: f64,
    bx: f64, by: f64, bz: f64,
    cx: f64, cy: f64, cz: f64,
) -> f64 {
    signed_tetra_volume(
        Vec3::new(ax, ay, az),
        Vec3::new(bx, by, bz),
        Vec3::new(cx, cy, cz),
    )
}

#[wasm_bindgen]
pub fn compute_triangle_area(
    ax: f64, ay: f64, az: f64,
    bx: f64, by: f64, bz: f64,
    cx: f64, cy: f64, cz: f64,
) -> f64 {
    triangle_area_3d(
        Vec3::new(ax, ay, az),
        Vec3::new(bx, by, bz),
        Vec3::new(cx, cy, cz),
    )
}
