"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  forceSimulation,
  forceLink,
  forceManyBody,
  forceCenter,
  forceCollide,
  type SimulationNodeDatum,
  type SimulationLinkDatum,
} from "d3-force";
import { getCategoryEmoji } from "@/lib/constants";

interface Correlacion {
  a: string;
  b: string;
  nombre_a: string;
  nombre_b: string;
  cat_a: string;
  cat_b: string;
  count: number;
}

interface GraphNode extends SimulationNodeDatum {
  id: string;
  name: string;
  category: string;
  emoji: string;
  totalCount: number;
}

interface GraphLink extends SimulationLinkDatum<GraphNode> {
  source: string | GraphNode;
  target: string | GraphNode;
  count: number;
}

interface TooltipData {
  node: GraphNode;
  x: number;
  y: number;
  connections: { name: string; count: number }[];
}

function buildGraph(correlaciones: Correlacion[]) {
  const nodeMap = new Map<string, GraphNode>();
  const links: GraphLink[] = [];

  for (const corr of correlaciones) {
    if (!nodeMap.has(corr.a)) {
      nodeMap.set(corr.a, {
        id: corr.a,
        name: corr.nombre_a,
        category: corr.cat_a,
        emoji: getCategoryEmoji(corr.cat_a),
        totalCount: 0,
      });
    }
    if (!nodeMap.has(corr.b)) {
      nodeMap.set(corr.b, {
        id: corr.b,
        name: corr.nombre_b,
        category: corr.cat_b,
        emoji: getCategoryEmoji(corr.cat_b),
        totalCount: 0,
      });
    }
    nodeMap.get(corr.a)!.totalCount += corr.count;
    nodeMap.get(corr.b)!.totalCount += corr.count;
    links.push({ source: corr.a, target: corr.b, count: corr.count });
  }

  return { nodes: Array.from(nodeMap.values()), links };
}

function truncate(s: string, max: number) {
  return s.length > max ? s.slice(0, max - 1) + "…" : s;
}

export default function CorrelacionGraph({
  correlaciones,
}: {
  correlaciones: Correlacion[];
}) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const simRef = useRef<ReturnType<typeof forceSimulation<GraphNode>> | null>(null);
  const [positions, setPositions] = useState<Map<string, { x: number; y: number }>>(new Map());
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 400 });

  // Observe container width
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const { width } = entries[0].contentRect;
      if (width > 0) setDimensions({ width, height: 400 });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Run simulation
  useEffect(() => {
    if (correlaciones.length === 0) return;

    const { nodes, links } = buildGraph(correlaciones);
    const maxCount = Math.max(...links.map((l) => l.count), 1);
    const { width, height } = dimensions;

    // Stop previous simulation
    simRef.current?.stop();

    const sim = forceSimulation<GraphNode>(nodes)
      .force(
        "link",
        forceLink<GraphNode, GraphLink>(links)
          .id((d) => d.id)
          .distance((d) => {
            const normalized = (d as GraphLink).count / maxCount;
            return 60 + (140 - 60) * (1 - normalized);
          })
          .strength(0.8)
      )
      .force("charge", forceManyBody().strength(-150))
      .force("center", forceCenter(width / 2, height / 2))
      .force("collide", forceCollide<GraphNode>().radius((d) => getRadius(d.totalCount, maxCount) + 28))
      .alpha(1)
      .alphaDecay(0.03);

    sim.on("tick", () => {
      const pos = new Map<string, { x: number; y: number }>();
      for (const node of nodes) {
        // Constrain to bounds
        const r = getRadius(node.totalCount, maxCount) + 10;
        node.x = Math.max(r, Math.min(width - r, node.x ?? width / 2));
        node.y = Math.max(r, Math.min(height - r, node.y ?? height / 2));
        pos.set(node.id, { x: node.x, y: node.y });
      }
      setPositions(new Map(pos));
    });

    simRef.current = sim;

    return () => {
      sim.stop();
    };
  }, [correlaciones, dimensions]);

  const { nodes, links } = buildGraph(correlaciones);
  const maxCount = Math.max(...links.map((l) => l.count), 1);
  const maxTotalCount = Math.max(...nodes.map((n) => n.totalCount), 1);

  const handleNodeHover = useCallback(
    (node: GraphNode | null, svgX?: number, svgY?: number) => {
      if (!node) {
        setHoveredNode(null);
        setTooltip(null);
        return;
      }
      setHoveredNode(node.id);
      const connections = links
        .filter(
          (l) =>
            (typeof l.source === "string" ? l.source : l.source.id) === node.id ||
            (typeof l.target === "string" ? l.target : l.target.id) === node.id
        )
        .map((l) => {
          const otherId =
            (typeof l.source === "string" ? l.source : l.source.id) === node.id
              ? typeof l.target === "string"
                ? l.target
                : l.target.id
              : typeof l.source === "string"
                ? l.source
                : l.source.id;
          const otherNode = nodes.find((n) => n.id === otherId);
          return { name: otherNode?.name || "", count: l.count };
        })
        .sort((a, b) => b.count - a.count);
      setTooltip({ node, x: svgX ?? 0, y: svgY ?? 0, connections });
    },
    [links, nodes]
  );

  const isConnected = useCallback(
    (nodeId: string) => {
      if (!hoveredNode) return true;
      if (nodeId === hoveredNode) return true;
      return links.some((l) => {
        const srcId = typeof l.source === "string" ? l.source : l.source.id;
        const tgtId = typeof l.target === "string" ? l.target : l.target.id;
        return (
          (srcId === hoveredNode && tgtId === nodeId) ||
          (tgtId === hoveredNode && srcId === nodeId)
        );
      });
    },
    [hoveredNode, links]
  );

  const isEdgeConnected = useCallback(
    (srcId: string, tgtId: string) => {
      if (!hoveredNode) return false;
      return hoveredNode === srcId || hoveredNode === tgtId;
    },
    [hoveredNode]
  );

  return (
    <div
      ref={containerRef}
      className="relative rounded-xl border border-[#eeece7] bg-white overflow-hidden"
      style={{ height: 400 }}
    >
      <svg
        width={dimensions.width}
        height={dimensions.height}
        style={{ display: "block" }}
        onMouseLeave={() => handleNodeHover(null)}
      >
        {/* Edges */}
        {links.map((link) => {
          const srcId = typeof link.source === "string" ? link.source : link.source.id;
          const tgtId = typeof link.target === "string" ? link.target : link.target.id;
          const srcPos = positions.get(srcId);
          const tgtPos = positions.get(tgtId);
          if (!srcPos || !tgtPos) return null;
          const normalized = link.count / maxCount;
          const width = 1 + normalized * 3;
          const highlighted = isEdgeConnected(srcId, tgtId);
          return (
            <line
              key={`${srcId}-${tgtId}`}
              x1={srcPos.x}
              y1={srcPos.y}
              x2={tgtPos.x}
              y2={tgtPos.y}
              stroke={highlighted ? "#37352f" : "#e6e3db"}
              strokeWidth={highlighted ? width + 1 : width}
              opacity={hoveredNode ? (highlighted ? 1 : 0.2) : 0.7}
              style={{ transition: "opacity 0.2s, stroke 0.2s" }}
            />
          );
        })}

        {/* Edge count badges (on hover) */}
        {hoveredNode &&
          links.map((link) => {
            const srcId = typeof link.source === "string" ? link.source : link.source.id;
            const tgtId = typeof link.target === "string" ? link.target : link.target.id;
            if (!isEdgeConnected(srcId, tgtId)) return null;
            const srcPos = positions.get(srcId);
            const tgtPos = positions.get(tgtId);
            if (!srcPos || !tgtPos) return null;
            const mx = (srcPos.x + tgtPos.x) / 2;
            const my = (srcPos.y + tgtPos.y) / 2;
            return (
              <g key={`badge-${srcId}-${tgtId}`}>
                <rect
                  x={mx - 12}
                  y={my - 10}
                  width={24}
                  height={20}
                  rx={6}
                  fill="#37352f"
                />
                <text
                  x={mx}
                  y={my + 4}
                  textAnchor="middle"
                  fill="#fff"
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    fontFamily:
                      "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                  }}
                >
                  {link.count}
                </text>
              </g>
            );
          })}

        {/* Nodes */}
        {nodes.map((node) => {
          const pos = positions.get(node.id);
          if (!pos) return null;
          const r = getRadius(node.totalCount, maxTotalCount);
          const connected = isConnected(node.id);
          const isHovered = hoveredNode === node.id;
          return (
            <g
              key={node.id}
              style={{
                cursor: "pointer",
                opacity: connected ? 1 : 0.25,
                transition: "opacity 0.2s",
              }}
              onMouseEnter={() => handleNodeHover(node, pos.x, pos.y)}
              onClick={() => router.push(`/admin/inventario/${node.id}`)}
            >
              <circle
                cx={pos.x}
                cy={pos.y}
                r={r}
                fill={isHovered ? "#fff" : "#f8f7f4"}
                stroke={isHovered ? "#37352f" : "#eeece7"}
                strokeWidth={isHovered ? 2 : 1.5}
                style={{ transition: "fill 0.2s, stroke 0.2s" }}
              />
              {/* Emoji inside node */}
              <text
                x={pos.x}
                y={pos.y + 5}
                textAnchor="middle"
                style={{ fontSize: r > 22 ? 16 : 13, pointerEvents: "none" }}
              >
                {node.emoji}
              </text>
              {/* Label below node */}
              <text
                x={pos.x}
                y={pos.y + r + 14}
                textAnchor="middle"
                fill="#6b6760"
                style={{
                  fontSize: 11,
                  fontFamily:
                    "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                  pointerEvents: "none",
                }}
              >
                {truncate(node.name, 16)}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Tooltip */}
      {tooltip && (
        <div
          style={{
            position: "absolute",
            left: Math.min(tooltip.x + 16, dimensions.width - 220),
            top: Math.max(tooltip.y - 20, 8),
            backgroundColor: "#fff",
            border: "1px solid #eeece7",
            borderRadius: 12,
            padding: "12px 16px",
            minWidth: 180,
            maxWidth: 240,
            boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
            fontFamily:
              "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
            pointerEvents: "none",
            zIndex: 10,
          }}
        >
          <div
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: "#37352f",
              marginBottom: 2,
            }}
          >
            {tooltip.node.emoji} {tooltip.node.name}
          </div>
          <div style={{ fontSize: 12, color: "#9b968c", marginBottom: 8 }}>
            {tooltip.node.category}
          </div>
          {tooltip.connections.length > 0 && (
            <>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  color: "#b3ada1",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginBottom: 6,
                }}
              >
                Se compra con
              </div>
              {tooltip.connections.map((c) => (
                <div
                  key={c.name}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontSize: 12,
                    color: "#37352f",
                    marginBottom: 3,
                  }}
                >
                  <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>
                    {c.name}
                  </span>
                  <span
                    style={{
                      fontSize: 11,
                      color: "#9b968c",
                      marginLeft: 8,
                      flexShrink: 0,
                    }}
                  >
                    {c.count}×
                  </span>
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}

function getRadius(totalCount: number, maxTotalCount: number): number {
  const normalized = maxTotalCount > 0 ? totalCount / maxTotalCount : 0;
  return 18 + normalized * 12;
}
