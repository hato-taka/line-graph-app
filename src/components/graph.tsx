'use client';

import CytoscapeComponent from 'react-cytoscapejs';
import cytoscape from 'cytoscape';

const Graph = ({ elements }: { elements: cytoscape.ElementDefinition[] }) => {
  return (
    <div className="w-full h-[500px] overflow-x-auto border rounded shadow-sm">
      <CytoscapeComponent
        elements={elements}
        style={{ width: '100%', height: '100%' }}
        layout={{ name: 'cose' }}
        stylesheet={[
          {
            selector: 'node',
            style: {
              'background-color': '#f43f5e',
              label: 'data(id)',
              color: '#fff',
              'text-valign': 'center',
              'font-size': 10,
              width: 40,
              height: 40,
            },
          },
          {
            selector: 'edge',
            style: {
              width: 2,
              'line-color': '#bbb',
              'curve-style': 'bezier',
            },
          },
        ]}
      />
    </div>
  );
};

export default Graph;
