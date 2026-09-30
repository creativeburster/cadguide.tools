# @willsunagency/k-factor-calc

> Precision sheet metal K-Factor, Bend Allowance (BA), Outside Setback (OSSB), and Bend Deduction (BD) calculation engine for mechanical engineers and CAD designers.
>
> 🌐 **Interactive Online Tool**: [CADGuide.tools K-Factor Calculator](https://cadguide.tools/toolbox/k-factor-calculator)

---

## What is K-Factor in Sheet Metal Fabrication?

When a flat sheet of metal is bent, the inner surface is compressed and the outer surface is placed under tension. Between these two zones lies the **Neutral Axis**, where the material experiences zero deformation (no tension, no compression).

The **K-Factor** is the mathematical ratio between the location of the neutral axis ($t$) and the total material thickness ($T$):

$$K = \frac{t}{T}$$

Accurate K-Factor calculations prevent costly re-fabrications and scrap by predicting the exact unbent flat blank length required before placing a part on a press brake.

For visual interactive calculations with material lookup tables, use the [CADGuide.tools K-Factor Online Calculator](https://cadguide.tools/toolbox/k-factor-calculator).

---

## Installation

```bash
npm install @willsunagency/k-factor-calc
```

Or run via CLI:

```bash
npm install -g @willsunagency/k-factor-calc
k-factor-calc 2.0 2.0 90 0.44
```

---

## Mathematical Equations Used

1. **Bend Allowance (BA)**:
   $$\text{BA} = \frac{\pi}{180} \times \text{Angle} \times (R + K \times T)$$

2. **Outside Setback (OSSB)**:
   $$\text{OSSB} = \tan\left(\frac{\text{Angle}}{2}\right) \times (R + T)$$

3. **Bend Deduction (BD)**:
   $$\text{BD} = 2 \times \text{OSSB} - \text{BA}$$

---

## API Usage

```javascript
const { calculateSheetMetalBend } = require('@willsunagency/k-factor-calc');

const result = calculateSheetMetalBend({
  thickness: 2.0,       // Material thickness in mm (T)
  insideRadius: 2.0,    // Inside bend radius in mm (R)
  angleDegrees: 90,     // Bend angle in degrees
  kFactor: 0.44         // K-Factor (typical for mild steel air bending)
});

console.log(result);
// Output:
// {
//   thickness: 2,
//   insideRadius: 2,
//   angleDegrees: 90,
//   kFactor: 0.44,
//   bendAllowance: 4.5239,
//   outsideSetback: 4,
//   bendDeduction: 3.4761,
//   neutralAxisOffset: 0.88
// }
```

---

## Typical K-Factor Reference Values

| Material | Bending Process | Typical K-Factor |
| :--- | :--- | :--- |
| **Mild Steel / Cold Rolled Steel** | Air Bending | 0.40 - 0.45 |
| **Mild Steel** | Bottom Bending | 0.45 - 0.48 |
| **Stainless Steel 304 / 316** | Air Bending | 0.42 - 0.46 |
| **Aluminum (Soft 3003 / 5052)** | Air Bending | 0.38 - 0.42 |
| **Aluminum (Hard 6061-T6)** | Air Bending | 0.40 - 0.44 |
| **Brass & Copper** | Air Bending | 0.35 - 0.40 |

For comprehensive CAD guides, design rules, and CNC press brake bend compensation tables, visit [CADGuide.tools Guides](https://cadguide.tools/guides).

---

## License

MIT © [CADGuide.tools](https://cadguide.tools)
