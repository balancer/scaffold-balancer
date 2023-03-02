import { RawPool, RawPoolToken } from '@balancer/sdk';
import { uniqBy } from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import { Graph } from 'react-d3-graph';

const onClickNode = function (nodeId: string) {
  window.alert(`Clicked node ${nodeId}`);
};

const onClickLink = function (source: string, target: string) {
  window.alert(`Clicked link between ${source} and ${target}`);
};

interface Props {
  tokens: RawPoolToken[];
  pools: RawPool[];
}

export function SorNetworkGraph({ tokens, pools }: Props) {
  console.log('num pools', pools.length);
  const [width, setWidth] = useState(0);
  const containerRef = useRef(null);
  const graphRef = useRef(null);
  const links = uniqBy(
    pools
      .map((pool) =>
        pool.tokens
          .slice(0, pool.tokens.length - 2)
          .map((token, idx) => ({ poolId: pool.id, source: token.address, target: pool.tokens[idx + 1].address }))
      )
      .flat(),
    ({ source, target }) => `${source}${target}`
  );
  const nodes = tokens
    .filter((token) => links.find((link) => link.target === token.address || link.source === token.address))
    .map((token) => ({
      id: token.address,
      label: token.symbol || `${token.address.slice(0, 4)}...${token.address.slice(-4)}`,
    }));

  const data = { nodes, links };

  useEffect(() => {
    if (containerRef.current) {
      // @ts-ignore
      setWidth(containerRef.current.offsetWidth);
    }
  }, [containerRef.current]);

  useEffect(() => {
    if (graphRef.current) {
      console.log(graphRef.current);
    }
  }, [graphRef.current]);

  return (
    <div>
      <div
        ref={containerRef}
        style={{ border: '1px solid lightGray', borderRadius: 8, overflow: 'hidden', height: '700px' }}>
        {width !== 0 && tokens.length > 0 && (
          <Graph
            id="sor-network-graph"
            ref={graphRef}
            data={data}
            config={{
              automaticRearrangeAfterDropNode: false,
              collapsible: false,
              directed: false,
              focusAnimationDuration: 2,
              // focusZoom: 0.01,
              // freezeAllDragEvents: false,
              height: 800,
              highlightDegree: 1,
              highlightOpacity: 0.2,
              linkHighlightBehavior: true,
              maxZoom: 8,
              minZoom: 0.01,
              initialZoom: 0.5,
              nodeHighlightBehavior: true,
              panAndZoom: false,
              staticGraph: false,
              staticGraphWithDragAndDrop: false,
              width,
              d3: {
                alphaTarget: 0.05,
                gravity: -400,
                linkLength: 300,
                linkStrength: 1,
                disableLinkForce: false,
              },
              node: {
                color: '#d3d3d3',
                fontColor: 'black',
                fontSize: 20,
                fontWeight: 'normal',
                highlightColor: 'red',
                highlightFontSize: 20,
                highlightFontWeight: 'bold',
                highlightStrokeColor: 'SAME',
                highlightStrokeWidth: 1.5,
                labelProperty: 'label',
                mouseCursor: 'pointer',
                opacity: 1,
                renderLabel: true,
                size: 250,
                strokeColor: 'none',
                strokeWidth: 1.5,
                svg: '',
                symbolType: 'circle',
              },
              link: {
                color: '#d3d3d3',
                fontColor: 'red',
                fontSize: 10,
                fontWeight: 'normal',
                highlightColor: 'blue',
                highlightFontSize: 8,
                highlightFontWeight: 'bold',
                mouseCursor: 'pointer',
                opacity: 1,
                renderLabel: false,
                semanticStrokeWidth: false,
                strokeWidth: 4,
                markerHeight: 6,
                markerWidth: 6,
                // strokeDasharray: 0,
                // strokeDashoffset: 0,
                // strokeLinecap: 'butt',
              },
            }}
            /* config={{
            automaticRearrangeAfterDropNode: false,
            collapsible: false,
            directed: false,
            focusAnimationDuration: 0.75,
            focusZoom: 1,
            freezeAllDragEvents: false,
            height: 600,
            highlightDegree: 1,
            highlightOpacity: 1,
            linkHighlightBehavior: false,
            maxZoom: 8,
            minZoom: 0.1,
            nodeHighlightBehavior: false,
            panAndZoom: false,
            staticGraph: false,
            staticGraphWithDragAndDrop: false,
            width,
            d3: {
              alphaTarget: 0.05,
              gravity: -100,
              linkLength: 100,
              linkStrength: 1,
              disableLinkForce: false,
            },
            node: {
              color: '#d3d3d3',
              fontColor: 'black',
              fontSize: 8,
              fontWeight: 'normal',
              highlightColor: 'SAME',
              highlightFontSize: 8,
              highlightFontWeight: 'normal',
              highlightStrokeColor: 'SAME',
              highlightStrokeWidth: 'SAME',
              labelProperty: 'label',
              mouseCursor: 'pointer',
              opacity: 1,
              renderLabel: true,
              size: 200,
              strokeColor: 'none',
              strokeWidth: 1.5,
              svg: '',
              symbolType: 'circle',
            },
            link: {
              color: '#d3d3d3',
              fontColor: 'black',
              fontSize: 8,
              fontWeight: 'normal',
              highlightColor: 'SAME',
              highlightFontSize: 8,
              highlightFontWeight: 'normal',
              labelProperty: 'label',
              mouseCursor: 'pointer',
              opacity: 1,
              renderLabel: false,
              semanticStrokeWidth: false,
              strokeWidth: 1.5,
              markerHeight: 6,
              markerWidth: 6,
              strokeDasharray: 0,
              strokeDashoffset: 0,
              strokeLinecap: 'butt',
            },
          }}*/
            onClickNode={onClickNode}
            onClickLink={onClickLink}
          />
        )}
      </div>
    </div>
  );
}
