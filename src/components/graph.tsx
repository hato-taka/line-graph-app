'use client';

import React, { useEffect, useRef } from 'react';
import cytoscape from 'cytoscape';

type Props = {
  elements: cytoscape.ElementDefinition[];
};

const Graph = ({ elements }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const cy = cytoscape({
      container: containerRef.current,
      elements,
      style: [
        {
          selector: 'node',
          style: {
            'background-color': '#f43f5e',
            'label': 'data(id)',
            'color': '#fff',
            'font-size': 10,
            'text-valign': 'center',
            'text-halign': 'center',
            'width': 'mapData(freq, 1, 20, 30, 70)',
            'height': 'mapData(freq, 1, 20, 30, 70)',
            'text-wrap': 'wrap',
          },
        },
        {
          selector: 'edge',
          style: {
            'width': 'mapData(weight, 1, 10, 1, 6)',
            'line-color': '#888',
            'target-arrow-color': '#888',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
            'arrow-scale': 1,
            'opacity': 0.8,
            'label': 'data(label)',
            'font-size': 6,
            'color': '#333',
            'text-rotation': 'autorotate',
          },
        },
      ],
      layout: {
        name: 'cose',
        animate: true,
        animationDuration: 500,
        fit: true,
        padding: 30,
      },
    });

    return () => cy.destroy();
  }, [elements]);

  return (
    <div className="w-full h-[500px] bg-white rounded shadow border" ref={containerRef} />
  );
};

export default Graph;
