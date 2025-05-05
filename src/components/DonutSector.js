import React from 'react';

const polarToCartesian = (cx, cy, r, angleInDegrees) => {
  const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
  return {
    x: cx + r * Math.cos(angleInRadians),
    y: cy + r * Math.sin(angleInRadians),
  };
};

const DonutSector = ({
  innerRadius,
  outerRadius,
  sweepAngle,
  startAngle = 0,
  fill = '#6e6e6e',
  stroke = 'black',
  stroke_width = 3.5,
  onMouseDown,
  onMouseEnter,
  onMouseLeave,
  className
}) => {
  const endAngle = startAngle + sweepAngle;

  const startOuter = polarToCartesian(0, 0, outerRadius, startAngle);
  const endOuter = polarToCartesian(0, 0, outerRadius, endAngle);
  const startInner = polarToCartesian(0, 0, innerRadius, endAngle);
  const endInner = polarToCartesian(0, 0, innerRadius, startAngle);

  const largeArcFlag = sweepAngle > 180 ? 1 : 0;

  const pathData = [
    `M ${startOuter.x} ${startOuter.y}`,
    `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${endOuter.x} ${endOuter.y}`,
    `L ${startInner.x} ${startInner.y}`,
    `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${endInner.x} ${endInner.y}`,
    'Z',
  ].join(' ');

  return (
      <path d={pathData} fill={fill} stroke={stroke} strokeWidth={stroke_width*2} paintOrder={"stroke"} strokeLinejoin='round'
      onMouseDown={onMouseDown} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} className={className}/>
  );
};

export default DonutSector;