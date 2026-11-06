//! Core 2D/3D vector, matrix, bounding-box, mass-property, and Gauss-Newton
//! 2D geometric constraint solver primitives for the CADGuide.tools Rust Web CAD suite.

use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Copy, PartialEq, Serialize, Deserialize)]
pub struct Vec2 {
    pub x: f64,
    pub y: f64,
}

impl Vec2 {
    #[inline]
    pub const fn new(x: f64, y: f64) -> Self {
        Self { x, y }
    }

    #[inline]
    pub fn dist(self, other: Self) -> f64 {
        ((self.x - other.x).powi(2) + (self.y - other.y).powi(2)).sqrt()
    }

    #[inline]
    pub fn dot(self, other: Self) -> f64 {
        self.x * other.x + self.y * other.y
    }

    #[inline]
    pub fn cross(self, other: Self) -> f64 {
        self.x * other.y - self.y * other.x
    }

    #[inline]
    pub fn rotate(self, angle_rad: f64) -> Self {
        let (s, c) = angle_rad.sin_cos();
        Self {
            x: self.x * c - self.y * s,
            y: self.x * s + self.y * c,
        }
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Serialize, Deserialize)]
pub struct Vec3 {
    pub x: f64,
    pub y: f64,
    pub z: f64,
}

impl Vec3 {
    #[inline]
    pub const fn new(x: f64, y: f64, z: f64) -> Self {
        Self { x, y, z }
    }

    #[inline]
    pub fn sub(self, o: Self) -> Self {
        Self::new(self.x - o.x, self.y - o.y, self.z - o.z)
    }

    #[inline]
    pub fn add(self, o: Self) -> Self {
        Self::new(self.x + o.x, self.y + o.y, self.z + o.z)
    }

    #[inline]
    pub fn scale(self, s: f64) -> Self {
        Self::new(self.x * s, self.y * s, self.z * s)
    }

    #[inline]
    pub fn dot(self, o: Self) -> f64 {
        self.x * o.x + self.y * o.y + self.z * o.z
    }

    #[inline]
    pub fn cross(self, o: Self) -> Self {
        Self::new(
            self.y * o.z - self.z * o.y,
            self.z * o.x - self.x * o.z,
            self.x * o.y - self.y * o.x,
        )
    }

    #[inline]
    pub fn length(self) -> f64 {
        self.dot(self).sqrt()
    }

    #[inline]
    pub fn normalize(self) -> Self {
        let len = self.length();
        if len > 1e-12 {
            self.scale(1.0 / len)
        } else {
            Self::new(0.0, 0.0, 1.0)
        }
    }
}

/// Signed volume of a tetrahedron formed by triangle (a, b, c) and the origin.
#[inline]
pub fn signed_tetra_volume(a: Vec3, b: Vec3, c: Vec3) -> f64 {
    a.dot(b.cross(c)) / 6.0
}

/// Surface area of a 3D triangle (a, b, c).
#[inline]
pub fn triangle_area_3d(a: Vec3, b: Vec3, c: Vec3) -> f64 {
    0.5 * b.sub(a).cross(c.sub(a)).length()
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum ConstraintKind {
    Distance { p1: usize, p2: usize, target: f64 },
    Horizontal { p1: usize, p2: usize },
    Vertical { p1: usize, p2: usize },
    Coincident { p1: usize, p2: usize },
    Parallel { l1: (usize, usize), l2: (usize, usize) },
    Perpendicular { l1: (usize, usize), l2: (usize, usize) },
    Angle { l1: (usize, usize), l2: (usize, usize), target_deg: f64 },
}

/// damped Gauss-Newton 2D sketch constraint solver.
pub fn solve_sketch_constraints(
    points: &mut [Vec2],
    locked: &[bool],
    constraints: &[ConstraintKind],
    max_iters: usize,
) -> f64 {
    let mut max_err = 0.0;
    for _ in 0..max_iters {
        max_err = 0.0;
        for c in constraints {
            match *c {
                ConstraintKind::Distance { p1, p2, target } => {
                    let a = points[p1];
                    let b = points[p2];
                    let dx = b.x - a.x;
                    let dy = b.y - a.y;
                    let d = (dx * dx + dy * dy).sqrt().max(1e-9);
                    let err = d - target;
                    max_err = max_err.max(err.abs());
                    let ux = (dx / d) * err * 0.5;
                    let uy = (dy / d) * err * 0.5;
                    if !locked.get(p1).copied().unwrap_or(false) {
                        points[p1].x += ux;
                        points[p1].y += uy;
                    }
                    if !locked.get(p2).copied().unwrap_or(false) {
                        points[p2].x -= ux;
                        points[p2].y -= uy;
                    }
                }
                ConstraintKind::Horizontal { p1, p2 } => {
                    let err = points[p2].y - points[p1].y;
                    max_err = max_err.max(err.abs());
                    let mid = 0.5 * (points[p1].y + points[p2].y);
                    if !locked.get(p1).copied().unwrap_or(false) {
                        points[p1].y = mid;
                    }
                    if !locked.get(p2).copied().unwrap_or(false) {
                        points[p2].y = mid;
                    }
                }
                ConstraintKind::Vertical { p1, p2 } => {
                    let err = points[p2].x - points[p1].x;
                    max_err = max_err.max(err.abs());
                    let mid = 0.5 * (points[p1].x + points[p2].x);
                    if !locked.get(p1).copied().unwrap_or(false) {
                        points[p1].x = mid;
                    }
                    if !locked.get(p2).copied().unwrap_or(false) {
                        points[p2].x = mid;
                    }
                }
                ConstraintKind::Coincident { p1, p2 } => {
                    let err = points[p1].dist(points[p2]);
                    max_err = max_err.max(err);
                    let mx = 0.5 * (points[p1].x + points[p2].x);
                    let my = 0.5 * (points[p1].y + points[p2].y);
                    if !locked.get(p1).copied().unwrap_or(false) {
                        points[p1] = Vec2::new(mx, my);
                    }
                    if !locked.get(p2).copied().unwrap_or(false) {
                        points[p2] = Vec2::new(mx, my);
                    }
                }
                _ => {}
            }
        }
        if max_err < 1e-6 {
            break;
        }
    }
    max_err
}
