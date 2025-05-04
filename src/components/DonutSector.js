import React from 'react';

const polarToCartesian = (cx, cy, r, angleInDegrees) => {
  const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
  return {
    x: cx + r * Math.cos(angleInRadians),
    y: cy + r * Math.sin(angleInRadians),
  };
};

const DonutSector = ({ innerRadius, outerRadius, angle, fill = '#a67c52', stroke = 'black' }) => {
  const startOuter = polarToCartesian(0, 0, outerRadius, 0);
  const endOuter = polarToCartesian(0, 0, outerRadius, angle);
  const startInner = polarToCartesian(0, 0, innerRadius, angle);
  const endInner = polarToCartesian(0, 0, innerRadius, 0);

  const largeArcFlag = angle > 180 ? 1 : 0;

  const pathData = [
    `M ${startOuter.x} ${startOuter.y}`,
    `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${endOuter.x} ${endOuter.y}`,
    `L ${startInner.x} ${startInner.y}`,
    `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${endInner.x} ${endInner.y}`,
    'Z',
  ].join(' ');

  const size = outerRadius * 2;

  return (
    <svg width={size} height={size} viewBox={`${-outerRadius} ${-outerRadius} ${size} ${size}`}>
      <path d={pathData} fill={fill} stroke={stroke} />
    </svg>
  );
};

export default DonutSector;