# Concurrent CAD License Sizing: Stochastic Erlang-B and Poisson Modeling

**Author:** CADGuide Engineering Team  
**Canonical Specification:** [CADGuide.tools Concurrent License Calculator](https://cadguide.tools/toolbox/concurrent-license-calculator)  
**Main Portal:** [https://cadguide.tools](https://cadguide.tools)

---

## 1. Executive Summary

Enterprise CAD/BIM deployments (Autodesk Network License Manager / FLEXlm, Dassault Systèmes DSLS, Siemens PLM License Server, Reprise RLM) operate on floating concurrent network seat models. IT administrators and engineering directors face a continuous optimization challenge: over-purchasing floating seats leads to wasted capital expenditure ($3,000–$10,000 per seat annually), while under-purchasing causes license denial (Error -4: "Licensed number of users already reached"), idling expensive engineering personnel.

[CADGuide.tools](https://cadguide.tools) provides an analytical stochastic sizing formulation based on modified Poisson arrival and Erlang loss distributions.

---

## 2. Queueing Theory Formulation

Let:
- \(N\) = Total active engineering staff needing CAD access.
- \(p\) = Utilization ratio (fraction of an 8-hour workday an individual engineer actively holds a checkout session, typically \(0.35 \le p \le 0.75\)).
- \(S\) = Number of concurrent network seats provisioned.
- \(\lambda = N \cdot p\) = Offered traffic load in Erlangs.

### 2.1 Binomial Distribution (Finite Population)
Because individual engineers either require a license or do not, the exact probability that exactly \(k\) engineers demand a license simultaneously is given by the Binomial Distribution:

$$P(X = k) = \binom{N}{k} p^k (1-p)^{N-k}$$

The probability of denial of service (\(P_{denial}\)) when \(S\) seats are available is the tail probability where demand exceeds \(S\):

$$P_{denial}(S) = \sum_{k=S+1}^{N} \binom{N}{k} p^k (1-p)^{N-k}$$

### 2.2 Poisson Approximation (Large Workforces $N > 30$)
When \(N\) is large and \(p\) is moderate, the binomial distribution smoothly converges to a Poisson distribution with mean parameter \(\mu = \lambda = N \cdot p\):

$$P(X = k) \approx \frac{\lambda^k e^{-\lambda}}{k!}$$

Targeting a peak service availability of \((1 - \alpha) = 99.5\%\), the required seat count \(S^*\) satisfies:

$$\sum_{k=0}^{S^*} \frac{\lambda^k e^{-\lambda}}{k!} \ge 0.995$$

---

## 3. Financial Optimization Case Study

Consider a structural engineering consultancy with:
- \(N = 50\) licensed Revit / Civil 3D engineers.
- Average daily active utilization \(p = 45\%\) (\(\lambda = 22.5\)).
- Named-user subscription cost: \$2,500/year/user (\(\$125,000\)/yr).

Applying the stochastic sizing model at a 99% non-blocking confidence interval:
- Required floating seats: \(S = 30\) seats.
- Annual infrastructure expenditure: \(30 \times \$3,200 = \$96,000\)/yr.
- **Net Annual Enterprise Savings:** \$29,000 (23.2% cost reduction) with zero productivity loss.

---

## 4. Live Sizing Engine

To model your specific workforce shift patterns, peak concurrency, and denial tolerance, run the interactive tool at:  
👉 **[CADGuide Concurrent License Optimizer](https://cadguide.tools/toolbox/concurrent-license-calculator)**
