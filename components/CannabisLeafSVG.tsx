import React from 'react';

interface CannabisLeafSVGProps {
  type: 'Indica' | 'Sativa' | 'Hybrid';
  className?: string;
}

/**
 * Premium Cannabis Leaf SVG with detailed serrated edges
 * Based on realistic cannabis leaf morphology
 */
const CannabisLeafSVG: React.FC<CannabisLeafSVGProps> = ({ type, className }) => {
  // Color schemes based on strain type
  const getColors = () => {
    switch (type) {
      case 'Indica':
        return {
          dark: '#2d5016',
          medium: '#4a7c2c',
          light: '#6b9d4a',
          highlight: '#8bc34a'
        };
      case 'Sativa':
        return {
          dark: '#1b5e20',
          medium: '#2e7d32',
          light: '#43a047',
          highlight: '#66bb6a'
        };
      case 'Hybrid':
        return {
          dark: '#33691e',
          medium: '#558b2f',
          light: '#689f38',
          highlight: '#8bc34a'
        };
    }
  };

  const colors = getColors();

  return (
    <svg 
      viewBox="0 0 200 200" 
      className={className} 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Gradients for realistic leaf appearance */}
        <linearGradient id={`leafGrad-${type}-1`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={colors.light} />
          <stop offset="50%" stopColor={colors.medium} />
          <stop offset="100%" stopColor={colors.dark} />
        </linearGradient>
        
        <linearGradient id={`leafGrad-${type}-2`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={colors.highlight} />
          <stop offset="100%" stopColor={colors.light} />
        </linearGradient>

        <linearGradient id={`leafGrad-${type}-3`} x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={colors.light} />
          <stop offset="50%" stopColor={colors.medium} />
          <stop offset="100%" stopColor={colors.dark} />
        </linearGradient>

        {/* Shadow filter */}
        <filter id={`shadow-${type}`}>
          <feGaussianBlur in="SourceAlpha" stdDeviation="2"/>
          <feOffset dx="1" dy="2" result="offsetblur"/>
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.3"/>
          </feComponentTransfer>
          <feMerge>
            <feMergeNode/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Center stem */}
      <path
        d="M100 180 Q98 140 100 100 Q102 60 100 20"
        stroke={colors.dark}
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
      />

      {/* Center leaf (largest) */}
      <path
        d="M100 20 
           L105 25 L108 30 L110 35 L111 40 L112 45 L112 50 L111 55 L110 60 L108 65 L106 70 L104 75 L102 80 L100 85
           L98 80 L96 75 L94 70 L92 65 L90 60 L89 55 L88 50 L88 45 L89 40 L90 35 L92 30 L95 25 Z"
        fill={`url(#leafGrad-${type}-1)`}
        stroke={colors.dark}
        strokeWidth="2"
        filter={`url(#shadow-${type})`}
      />

      {/* Center leaf veins */}
      <path
        d="M100 20 L100 85 M95 35 L100 40 M105 35 L100 40 M93 50 L100 55 M107 50 L100 55 M95 65 L100 70 M105 65 L100 70"
        stroke={colors.dark}
        strokeWidth="1"
        opacity="0.4"
      />

      {/* Left upper leaf */}
      <path
        d="M95 40
           L88 42 L82 45 L77 49 L73 54 L70 60 L68 66 L67 72 L67 78 L68 84 L70 90
           L72 88 L74 85 L76 82 L78 78 L80 74 L82 70 L84 66 L86 62 L88 58 L90 54 L92 50 L94 46 Z"
        fill={`url(#leafGrad-${type}-2)`}
        stroke={colors.dark}
        strokeWidth="2"
        filter={`url(#shadow-${type})`}
      />

      {/* Left upper leaf veins */}
      <path
        d="M95 40 L70 90 M85 50 L75 70 M80 60 L72 78"
        stroke={colors.dark}
        strokeWidth="0.8"
        opacity="0.3"
      />

      {/* Right upper leaf */}
      <path
        d="M105 40
           L112 42 L118 45 L123 49 L127 54 L130 60 L132 66 L133 72 L133 78 L132 84 L130 90
           L128 88 L126 85 L124 82 L122 78 L120 74 L118 70 L116 66 L114 62 L112 58 L110 54 L108 50 L106 46 Z"
        fill={`url(#leafGrad-${type}-3)`}
        stroke={colors.dark}
        strokeWidth="2"
        filter={`url(#shadow-${type})`}
      />

      {/* Right upper leaf veins */}
      <path
        d="M105 40 L130 90 M115 50 L125 70 M120 60 L128 78"
        stroke={colors.dark}
        strokeWidth="0.8"
        opacity="0.3"
      />

      {/* Left middle leaf */}
      <path
        d="M90 65
           L82 68 L75 72 L69 77 L64 83 L60 90 L57 97 L55 104 L54 111 L54 118
           L56 116 L58 113 L60 110 L62 107 L65 103 L68 99 L71 95 L74 91 L77 87 L80 83 L83 79 L86 75 Z"
        fill={`url(#leafGrad-${type}-2)`}
        stroke={colors.dark}
        strokeWidth="2"
        filter={`url(#shadow-${type})`}
      />

      {/* Left middle leaf veins */}
      <path
        d="M90 65 L54 118 M80 75 L62 105 M70 90 L58 112"
        stroke={colors.dark}
        strokeWidth="0.8"
        opacity="0.3"
      />

      {/* Right middle leaf */}
      <path
        d="M110 65
           L118 68 L125 72 L131 77 L136 83 L140 90 L143 97 L145 104 L146 111 L146 118
           L144 116 L142 113 L140 110 L138 107 L135 103 L132 99 L129 95 L126 91 L123 87 L120 83 L117 79 L114 75 Z"
        fill={`url(#leafGrad-${type}-3)`}
        stroke={colors.dark}
        strokeWidth="2"
        filter={`url(#shadow-${type})`}
      />

      {/* Right middle leaf veins */}
      <path
        d="M110 65 L146 118 M120 75 L138 105 M130 90 L142 112"
        stroke={colors.dark}
        strokeWidth="0.8"
        opacity="0.3"
      />

      {/* Left lower leaf */}
      <path
        d="M85 95
           L76 99 L68 104 L61 110 L55 117 L50 125 L46 133 L43 141 L41 149
           L43 147 L46 144 L49 141 L52 138 L56 134 L60 130 L64 126 L68 122 L72 118 L76 114 L80 110 Z"
        fill={`url(#leafGrad-${type}-2)`}
        stroke={colors.dark}
        strokeWidth="2"
        filter={`url(#shadow-${type})`}
      />

      {/* Left lower leaf veins */}
      <path
        d="M85 95 L41 149 M75 105 L50 135 M65 120 L45 145"
        stroke={colors.dark}
        strokeWidth="0.8"
        opacity="0.3"
      />

      {/* Right lower leaf */}
      <path
        d="M115 95
           L124 99 L132 104 L139 110 L145 117 L150 125 L154 133 L157 141 L159 149
           L157 147 L154 144 L151 141 L148 138 L144 134 L140 130 L136 126 L132 122 L128 118 L124 114 L120 110 Z"
        fill={`url(#leafGrad-${type}-3)`}
        stroke={colors.dark}
        strokeWidth="2"
        filter={`url(#shadow-${type})`}
      />

      {/* Right lower leaf veins */}
      <path
        d="M115 95 L159 149 M125 105 L150 135 M135 120 L155 145"
        stroke={colors.dark}
        strokeWidth="0.8"
        opacity="0.3"
      />

      {/* Serrated edges on all leaves */}
      <path
        d="M105 25 L106 26 L105 27 L106 28 L105 29 L106 30
           M95 25 L94 26 L95 27 L94 28 L95 29 L94 30
           M88 45 L87 46 L88 47 L87 48
           M112 45 L113 46 L112 47 L113 48
           M82 70 L81 71 L82 72 L81 73
           M118 70 L119 71 L118 72 L119 73
           M75 95 L74 96 L75 97 L74 98
           M125 95 L126 96 L125 97 L126 98
           M68 120 L67 121 L68 122 L67 123
           M132 120 L133 121 L132 122 L133 123"
        stroke={colors.dark}
        strokeWidth="1.5"
        fill="none"
      />
    </svg>
  );
};

export default CannabisLeafSVG;
