import React from 'react';
import styles from './Chart.module.css';

interface BreakdownData {
  transportation: number;
  diet: number;
  energy: number;
  travel: number;
  shopping: number;
}

interface AccessiblePieProps {
  breakdown: BreakdownData;
  total: number;
}

export const AccessiblePie: React.FC<AccessiblePieProps> = ({ breakdown, total }) => {
  const safeTotal = total <= 0 ? 1 : total;

  const pct = {
    transportation: (breakdown.transportation / safeTotal) * 100,
    diet: (breakdown.diet / safeTotal) * 100,
    energy: (breakdown.energy / safeTotal) * 100,
    travel: (breakdown.travel / safeTotal) * 100,
    shopping: (breakdown.shopping / safeTotal) * 100,
  };

  // Compute angles for conic gradient
  const tEnd = pct.transportation;
  const dEnd = tEnd + pct.diet;
  const eEnd = dEnd + pct.energy;
  const trEnd = eEnd + pct.travel;

  // Colors mapping for category legend
  const categories = [
    { key: 'transportation', label: 'Transportation', value: breakdown.transportation, pct: pct.transportation, color: '#3b82f6' }, // blue
    { key: 'diet', label: 'Diet & Food', value: breakdown.diet, pct: pct.diet, color: '#10b981' }, // green
    { key: 'energy', label: 'Home Energy', value: breakdown.energy, pct: pct.energy, color: '#f59e0b' }, // amber
    { key: 'travel', label: 'Flights & Travel', value: breakdown.travel, pct: pct.travel, color: '#8b5cf6' }, // purple
    { key: 'shopping', label: 'Goods & Shopping', value: breakdown.shopping, pct: pct.shopping, color: '#ec4899' }, // pink
  ];

  // Dynamic style for conic gradient
  const conicStyle = {
    background: `conic-gradient(
      #3b82f6 0% ${tEnd}%,
      #10b981 ${tEnd}% ${dEnd}%,
      #f59e0b ${dEnd}% ${eEnd}%,
      #8b5cf6 ${eEnd}% ${trEnd}%,
      #ec4899 ${trEnd}% 100%
    )`
  };

  return (
    <div className={styles.chartContainer}>
      <div className={styles.visualSection} aria-hidden="true">
        {/* CSS-Only Donut Chart */}
        <div className={styles.donut} style={conicStyle}>
          <div className={styles.donutHole}>
            <span className={styles.totalNumber}>{total.toFixed(1)}</span>
            <span className={styles.totalLabel}>Tons/Yr</span>
          </div>
        </div>

        {/* Legend */}
        <div className={styles.legend}>
          {categories.map(cat => (
            <div key={cat.key} className={styles.legendItem}>
              <span className={styles.colorBadge} style={{ backgroundColor: cat.color }} />
              <span className={styles.legendLabel}>{cat.label}</span>
              <span className={styles.legendValue}>
                {cat.value.toFixed(1)} t ({Math.round(cat.pct)}%)
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Screen Reader Table (Accessibility Landmark) */}
      <div className="sr-only">
        <h3>Emissions Detailed Breakdown Data Table</h3>
        <table>
          <thead>
            <tr>
              <th scope="col">Emissions Source Category</th>
              <th scope="col">Emissions Value (Metric Tons CO2/Year)</th>
              <th scope="col">Percentage of Total Footprint</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(cat => (
              <tr key={cat.key}>
                <td>{cat.label}</td>
                <td>{cat.value.toFixed(2)}</td>
                <td>{cat.pct.toFixed(1)}%</td>
              </tr>
            ))}
            <tr>
              <td>Total Footprint</td>
              <td>{total.toFixed(2)}</td>
              <td>100.0%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
