"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  DemandHeatmapCell,
  DatasetDemandMetrics,
  HeatmapDimension,
  buildHeatmapData,
  getHeatmapLabels,
  getGapColor,
} from "@/lib/analytics-helpers"

export type HeatmapStyle = "grid" | "bubble" | "treemap" | "radial"

interface DemandHeatmapProps {
  metrics: DatasetDemandMetrics[]
  rowDimension: HeatmapDimension
  colDimension: HeatmapDimension
  style: HeatmapStyle
}

export function DemandHeatmap({
  metrics,
  rowDimension,
  colDimension,
  style,
}: DemandHeatmapProps) {
  const router = useRouter()
  const [hoveredCell, setHoveredCell] = useState<string | null>(null)

  const grid = useMemo(
    () => buildHeatmapData(metrics, rowDimension, colDimension),
    [metrics, rowDimension, colDimension]
  )

  const { rows, cols } = useMemo(
    () => getHeatmapLabels(metrics, rowDimension, colDimension),
    [metrics, rowDimension, colDimension]
  )

  const handleCellClick = (cell: DemandHeatmapCell) => {
    if (cell.datasetCount === 0) return

    const params = new URLSearchParams()

    if (rowDimension === "therapeuticArea" || colDimension === "therapeuticArea") {
      const ta = rowDimension === "therapeuticArea" ? cell.rowKey : cell.colKey
      params.set("ta", ta)
    }

    if (rowDimension === "dataType" || colDimension === "dataType") {
      const type = rowDimension === "dataType" ? cell.rowKey : cell.colKey
      params.set("type", type)
    }

    if (rowDimension === "intent" || colDimension === "intent") {
      const intent = rowDimension === "intent" ? cell.rowKey : cell.colKey
      params.set("intent", intent)
    }

    params.set("source", "analytics")
    router.push(`/collectoid/dcm/create?${params.toString()}`)
  }

  if (grid.length === 0 || cols.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-neutral-400 font-light">
        No data available for selected dimensions
      </div>
    )
  }

  // Flatten grid for non-grid views
  const flatCells = grid.flatMap(row => row).filter(cell => cell.datasetCount > 0)
  const maxRequests = Math.max(...flatCells.map(c => c.totalRequests), 1)
  const maxDatasets = Math.max(...flatCells.map(c => c.datasetCount), 1)

  if (style === "bubble") {
    return (
      <BubbleHeatmap
        cells={flatCells}
        maxRequests={maxRequests}
        maxDatasets={maxDatasets}
        hoveredCell={hoveredCell}
        setHoveredCell={setHoveredCell}
        onCellClick={handleCellClick}
      />
    )
  }

  if (style === "treemap") {
    return (
      <TreemapHeatmap
        cells={flatCells}
        maxRequests={maxRequests}
        hoveredCell={hoveredCell}
        setHoveredCell={setHoveredCell}
        onCellClick={handleCellClick}
      />
    )
  }

  if (style === "radial") {
    return (
      <RadialHeatmap
        cells={flatCells}
        rows={rows}
        cols={cols}
        grid={grid}
        hoveredCell={hoveredCell}
        setHoveredCell={setHoveredCell}
        onCellClick={handleCellClick}
      />
    )
  }

  // Default: Grid view
  return (
    <GridHeatmap
      grid={grid}
      rows={rows}
      cols={cols}
      hoveredCell={hoveredCell}
      setHoveredCell={setHoveredCell}
      onCellClick={handleCellClick}
    />
  )
}

// =============================================================================
// GRID HEATMAP (Enhanced)
// =============================================================================

function GridHeatmap({
  grid,
  rows,
  cols,
  hoveredCell,
  setHoveredCell,
  onCellClick,
}: {
  grid: DemandHeatmapCell[][]
  rows: string[]
  cols: string[]
  hoveredCell: string | null
  setHoveredCell: (id: string | null) => void
  onCellClick: (cell: DemandHeatmapCell) => void
}) {
  // Calculate cell size based on grid dimensions
  const cellMinHeight = Math.max(70, Math.min(100, 320 / rows.length))

  return (
    <TooltipProvider delayDuration={50}>
      <div className="w-full flex flex-col">
        {/* Column Headers */}
        <div className="flex pl-32 pr-4 mb-3">
          {cols.map((col) => (
            <div
              key={col}
              className="flex-1 text-center px-2"
            >
              <span className="text-xs font-medium text-neutral-600 truncate block">
                {col}
              </span>
            </div>
          ))}
        </div>

        {/* Grid Body */}
        <div className="flex flex-col gap-3">
          {grid.map((row, rowIndex) => (
            <div key={rows[rowIndex]} className="flex gap-3" style={{ minHeight: cellMinHeight }}>
              {/* Row Header */}
              <div className="w-28 shrink-0 flex items-center justify-end pr-4">
                <span className="text-xs font-medium text-neutral-600 truncate text-right">
                  {rows[rowIndex]}
                </span>
              </div>

              {/* Cells */}
              {row.map((cell, colIndex) => {
                const cellId = `${rowIndex}-${colIndex}`
                const color = getGapColor(cell.avgGapScore)
                const isHovered = hoveredCell === cellId
                const hasData = cell.datasetCount > 0

                return (
                  <Tooltip key={cellId}>
                    <TooltipTrigger asChild>
                      <motion.button
                        onClick={() => onCellClick(cell)}
                        onMouseEnter={() => setHoveredCell(cellId)}
                        onMouseLeave={() => setHoveredCell(null)}
                        disabled={!hasData}
                        className={cn(
                          "flex-1 rounded-xl transition-all duration-200 relative overflow-hidden",
                          hasData ? "cursor-pointer" : "cursor-default"
                        )}
                        style={{
                          backgroundColor: hasData ? color.bg : "#f9fafb",
                          minHeight: cellMinHeight,
                        }}
                        whileHover={hasData ? { scale: 1.03, zIndex: 10 } : {}}
                        whileTap={hasData ? { scale: 0.98 } : {}}
                        animate={{
                          boxShadow: isHovered && hasData
                            ? "0 8px 30px rgba(0,0,0,0.15)"
                            : "0 2px 8px rgba(0,0,0,0.06)",
                        }}
                      >
                        {hasData && (
                          <div className="absolute inset-0 flex flex-col items-center justify-center p-2">
                            <motion.span
                              className="text-3xl font-light"
                              style={{ color: color.text }}
                              animate={{ scale: isHovered ? 1.1 : 1 }}
                            >
                              {cell.datasetCount}
                            </motion.span>
                            <span
                              className="text-xs font-light opacity-70 mt-1"
                              style={{ color: color.text }}
                            >
                              {cell.totalRequests} requests
                            </span>
                          </div>
                        )}
                        {/* Hover overlay */}
                        <AnimatePresence>
                          {isHovered && hasData && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="absolute inset-0 bg-black/5 rounded-xl"
                            />
                          )}
                        </AnimatePresence>
                      </motion.button>
                    </TooltipTrigger>
                    {hasData && (
                      <TooltipContent
                        side="top"
                        className="bg-neutral-900 text-white border-0 p-3 max-w-xs z-50"
                      >
                        <CellTooltip cell={cell} color={color} />
                      </TooltipContent>
                    )}
                  </Tooltip>
                )
              })}
            </div>
          ))}
        </div>

        {/* Legend */}
        <HeatmapLegend />
      </div>
    </TooltipProvider>
  )
}

// =============================================================================
// BUBBLE HEATMAP
// =============================================================================

function BubbleHeatmap({
  cells,
  maxRequests,
  hoveredCell,
  setHoveredCell,
  onCellClick,
}: {
  cells: DemandHeatmapCell[]
  maxRequests: number
  maxDatasets: number
  hoveredCell: string | null
  setHoveredCell: (id: string | null) => void
  onCellClick: (cell: DemandHeatmapCell) => void
}) {
  // Sort by gap score for visual hierarchy
  const sortedCells = [...cells].sort((a, b) => b.avgGapScore - a.avgGapScore)

  if (sortedCells.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-neutral-400 font-light">
        No data available
      </div>
    )
  }

  return (
    <TooltipProvider delayDuration={50}>
      <div className="w-full flex flex-col">
        <div className="p-6" style={{ minHeight: 360 }}>
          <div className="flex flex-wrap gap-4 content-start justify-center items-center">
            {sortedCells.map((cell, index) => {
              const cellId = `bubble-${index}`
              const color = getGapColor(cell.avgGapScore)
              const isHovered = hoveredCell === cellId
              // Size based on requests (min 80px, max 160px)
              const size = 80 + (cell.totalRequests / maxRequests) * 80
              const isLarge = size > 100

              return (
                <Tooltip key={cellId}>
                  <TooltipTrigger asChild>
                    <motion.button
                      onClick={() => onCellClick(cell)}
                      onMouseEnter={() => setHoveredCell(cellId)}
                      onMouseLeave={() => setHoveredCell(null)}
                      className="rounded-full flex flex-col items-center justify-center cursor-pointer relative shrink-0"
                      style={{
                        width: size,
                        height: size,
                        backgroundColor: color.bg,
                      }}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{
                        scale: 1,
                        opacity: 1,
                        boxShadow: isHovered
                          ? "0 12px 40px rgba(0,0,0,0.25)"
                          : "0 4px 20px rgba(0,0,0,0.1)",
                      }}
                      whileHover={{ scale: 1.08, zIndex: 20 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ delay: index * 0.03 }}
                    >
                      <span
                        className={cn(
                          "font-semibold",
                          isLarge ? "text-2xl" : "text-lg"
                        )}
                        style={{ color: color.text }}
                      >
                        {cell.datasetCount}
                      </span>
                      <span
                        className={cn(
                          "font-medium opacity-80 text-center px-2 truncate max-w-full",
                          isLarge ? "text-xs" : "text-[9px]"
                        )}
                        style={{ color: color.text }}
                      >
                        {cell.rowKey}
                      </span>
                      {isLarge && (
                        <span
                          className="text-[10px] opacity-60 truncate max-w-full px-2"
                          style={{ color: color.text }}
                        >
                          {cell.colKey}
                        </span>
                      )}
                    </motion.button>
                  </TooltipTrigger>
                  <TooltipContent
                    side="top"
                    className="bg-neutral-900 text-white border-0 p-3 max-w-xs z-50"
                  >
                    <CellTooltip cell={cell} color={color} />
                  </TooltipContent>
                </Tooltip>
              )
            })}
          </div>
        </div>
        <HeatmapLegend />
      </div>
    </TooltipProvider>
  )
}

// =============================================================================
// TREEMAP HEATMAP
// =============================================================================

function TreemapHeatmap({
  cells,
  hoveredCell,
  setHoveredCell,
  onCellClick,
}: {
  cells: DemandHeatmapCell[]
  maxRequests: number
  hoveredCell: string | null
  setHoveredCell: (id: string | null) => void
  onCellClick: (cell: DemandHeatmapCell) => void
}) {
  // Sort by total requests descending
  const sortedCells = [...cells].sort((a, b) => b.totalRequests - a.totalRequests)
  const totalRequests = sortedCells.reduce((sum, c) => sum + c.totalRequests, 0)

  if (sortedCells.length === 0 || totalRequests === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-neutral-400 font-light">
        No data available
      </div>
    )
  }

  // Improved squarified treemap layout
  interface LayoutItem {
    cell: DemandHeatmapCell
    x: number
    y: number
    width: number
    height: number
  }

  // Squarify algorithm - tries to make rectangles as square as possible
  function squarify(
    items: { cell: DemandHeatmapCell; value: number }[],
    x: number,
    y: number,
    width: number,
    height: number
  ): LayoutItem[] {
    if (items.length === 0) return []
    if (items.length === 1) {
      return [{ cell: items[0].cell, x, y, width, height }]
    }

    const total = items.reduce((sum, i) => sum + i.value, 0)
    const results: LayoutItem[] = []

    // Decide split direction based on aspect ratio
    const isHorizontal = width >= height

    // Find best split point
    let currentSum = 0
    let splitIndex = 0
    const targetSum = total / 2

    for (let i = 0; i < items.length; i++) {
      if (currentSum + items[i].value > targetSum && i > 0) {
        splitIndex = i
        break
      }
      currentSum += items[i].value
      splitIndex = i + 1
    }

    if (splitIndex === 0) splitIndex = 1
    if (splitIndex >= items.length) splitIndex = items.length - 1

    const firstGroup = items.slice(0, splitIndex)
    const secondGroup = items.slice(splitIndex)

    const firstSum = firstGroup.reduce((sum, i) => sum + i.value, 0)
    const ratio = firstSum / total

    if (isHorizontal) {
      const splitWidth = width * ratio
      results.push(...squarify(firstGroup, x, y, splitWidth, height))
      results.push(...squarify(secondGroup, x + splitWidth, y, width - splitWidth, height))
    } else {
      const splitHeight = height * ratio
      results.push(...squarify(firstGroup, x, y, width, splitHeight))
      results.push(...squarify(secondGroup, x, y + splitHeight, width, height - splitHeight))
    }

    return results
  }

  const itemsWithValues = sortedCells.map(cell => ({
    cell,
    value: cell.totalRequests,
  }))

  const layoutItems = squarify(itemsWithValues, 0, 0, 100, 100)

  return (
    <TooltipProvider delayDuration={50}>
      <div className="w-full flex flex-col">
        <div className="relative rounded-2xl overflow-hidden" style={{ height: 360 }}>
          {layoutItems.map(({ cell, x, y, width, height }, index) => {
            const cellId = `tree-${index}`
            const color = getGapColor(cell.avgGapScore)
            const isHovered = hoveredCell === cellId
            // Determine if cell is large enough for full labels
            const isLarge = width > 15 && height > 20

            return (
              <Tooltip key={cellId}>
                <TooltipTrigger asChild>
                  <motion.button
                    onClick={() => onCellClick(cell)}
                    onMouseEnter={() => setHoveredCell(cellId)}
                    onMouseLeave={() => setHoveredCell(null)}
                    className="absolute flex flex-col items-center justify-center cursor-pointer overflow-hidden border-2 border-white/40"
                    style={{
                      left: `${x}%`,
                      top: `${y}%`,
                      width: `${width}%`,
                      height: `${height}%`,
                      backgroundColor: color.bg,
                      borderRadius: 12,
                    }}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{
                      scale: 1,
                      opacity: 1,
                      filter: isHovered ? "brightness(1.1)" : "brightness(1)",
                    }}
                    whileHover={{ zIndex: 10 }}
                    transition={{ delay: index * 0.02, duration: 0.3 }}
                  >
                    <span
                      className={cn(
                        "font-light",
                        isLarge ? "text-3xl" : "text-xl"
                      )}
                      style={{ color: color.text }}
                    >
                      {cell.datasetCount}
                    </span>
                    {isLarge && (
                      <>
                        <span
                          className="text-xs font-medium opacity-90 text-center px-2 truncate max-w-full mt-1"
                          style={{ color: color.text }}
                        >
                          {cell.rowKey}
                        </span>
                        <span
                          className="text-[10px] opacity-70 text-center"
                          style={{ color: color.text }}
                        >
                          {cell.totalRequests} requests
                        </span>
                      </>
                    )}
                  </motion.button>
                </TooltipTrigger>
                <TooltipContent
                  side="top"
                  className="bg-neutral-900 text-white border-0 p-3 max-w-xs z-50"
                >
                  <CellTooltip cell={cell} color={color} />
                </TooltipContent>
              </Tooltip>
            )
          })}
        </div>
        <HeatmapLegend />
      </div>
    </TooltipProvider>
  )
}

// =============================================================================
// RADIAL HEATMAP
// =============================================================================

function RadialHeatmap({
  cells,
  rows,
  cols,
  grid,
  hoveredCell,
  setHoveredCell,
  onCellClick,
}: {
  cells: DemandHeatmapCell[]
  rows: string[]
  cols: string[]
  grid: DemandHeatmapCell[][]
  hoveredCell: string | null
  setHoveredCell: (id: string | null) => void
  onCellClick: (cell: DemandHeatmapCell) => void
}) {
  const centerX = 50 // percentage
  const centerY = 50
  const maxRadius = 42 // percentage

  // Each row is a ring, each col is a segment
  const numRings = rows.length
  const numSegments = cols.length
  const ringWidth = maxRadius / numRings

  return (
    <TooltipProvider delayDuration={50}>
      <div className="w-full flex flex-col">
        <div className="relative p-4 flex items-center justify-center" style={{ height: 380 }}>
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full max-w-[380px]"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Background circles for reference */}
            {rows.map((_, ringIndex) => (
              <circle
                key={`ring-${ringIndex}`}
                cx={centerX}
                cy={centerY}
                r={(ringIndex + 1) * ringWidth}
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="0.2"
              />
            ))}

            {/* Segments */}
            {grid.map((row, rowIndex) =>
              row.map((cell, colIndex) => {
                const cellId = `radial-${rowIndex}-${colIndex}`
                const color = getGapColor(cell.avgGapScore)
                const isHovered = hoveredCell === cellId
                const hasData = cell.datasetCount > 0

                // Calculate arc
                const innerRadius = rowIndex * ringWidth
                const outerRadius = (rowIndex + 1) * ringWidth
                const startAngle = (colIndex / numSegments) * 360 - 90
                const endAngle = ((colIndex + 1) / numSegments) * 360 - 90
                const path = describeArc(
                  centerX,
                  centerY,
                  innerRadius,
                  outerRadius,
                  startAngle,
                  endAngle
                )

                return (
                  <Tooltip key={cellId}>
                    <TooltipTrigger asChild>
                      <motion.path
                        d={path}
                        fill={hasData ? color.bg : "#f9fafb"}
                        stroke="#fff"
                        strokeWidth="0.3"
                        style={{ cursor: hasData ? "pointer" : "default" }}
                        onClick={() => hasData && onCellClick(cell)}
                        onMouseEnter={() => setHoveredCell(cellId)}
                        onMouseLeave={() => setHoveredCell(null)}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{
                          scale: 1,
                          opacity: isHovered ? 0.9 : 1,
                          filter: isHovered ? "brightness(1.15)" : "brightness(1)",
                        }}
                        whileHover={hasData ? { scale: 1.05 } : {}}
                        transition={{ delay: (rowIndex * numSegments + colIndex) * 0.02 }}
                      />
                    </TooltipTrigger>
                    {hasData && (
                      <TooltipContent
                        side="top"
                        className="bg-neutral-900 text-white border-0 p-3 max-w-xs z-50"
                      >
                        <CellTooltip cell={cell} color={color} />
                      </TooltipContent>
                    )}
                  </Tooltip>
                )
              })
            )}

            {/* Center label */}
            <circle cx={centerX} cy={centerY} r="8" fill="white" />
            <text
              x={centerX}
              y={centerY}
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-[3px] font-medium fill-neutral-700"
            >
              {cells.reduce((sum, c) => sum + c.datasetCount, 0)}
            </text>
            <text
              x={centerX}
              y={centerY + 3}
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-[1.8px] fill-neutral-400"
            >
              datasets
            </text>

            {/* Column labels around the outside */}
            {cols.map((col, i) => {
              const angle = ((i + 0.5) / numSegments) * 360 - 90
              const labelRadius = maxRadius + 4
              const x = centerX + labelRadius * Math.cos((angle * Math.PI) / 180)
              const y = centerY + labelRadius * Math.sin((angle * Math.PI) / 180)

              return (
                <text
                  key={`label-${col}`}
                  x={x}
                  y={y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-[2.5px] fill-neutral-500 font-medium"
                  transform={`rotate(${angle + 90}, ${x}, ${y})`}
                >
                  {col.length > 8 ? col.slice(0, 8) + "…" : col}
                </text>
              )
            })}
          </svg>
        </div>
        <HeatmapLegend />
      </div>
    </TooltipProvider>
  )
}

// Helper function to describe SVG arc
function describeArc(
  cx: number,
  cy: number,
  innerRadius: number,
  outerRadius: number,
  startAngle: number,
  endAngle: number
): string {
  const startOuter = polarToCartesian(cx, cy, outerRadius, endAngle)
  const endOuter = polarToCartesian(cx, cy, outerRadius, startAngle)
  const startInner = polarToCartesian(cx, cy, innerRadius, endAngle)
  const endInner = polarToCartesian(cx, cy, innerRadius, startAngle)

  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1"

  return [
    "M", startOuter.x, startOuter.y,
    "A", outerRadius, outerRadius, 0, largeArcFlag, 0, endOuter.x, endOuter.y,
    "L", endInner.x, endInner.y,
    "A", innerRadius, innerRadius, 0, largeArcFlag, 1, startInner.x, startInner.y,
    "Z"
  ].join(" ")
}

function polarToCartesian(cx: number, cy: number, r: number, angle: number) {
  const rad = (angle * Math.PI) / 180
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  }
}

// =============================================================================
// SHARED COMPONENTS
// =============================================================================

function CellTooltip({
  cell,
  color,
}: {
  cell: DemandHeatmapCell
  color: ReturnType<typeof getGapColor>
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-4">
        <span className="text-xs font-light text-neutral-400">
          {cell.rowKey} × {cell.colKey}
        </span>
        <span
          className="text-xs px-2 py-0.5 rounded-full"
          style={{
            backgroundColor: color.bg,
            color: color.text,
          }}
        >
          {color.label}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
        <span className="text-neutral-400">Datasets</span>
        <span className="text-white font-medium">{cell.datasetCount}</span>
        <span className="text-neutral-400">Requests</span>
        <span className="text-white font-medium">{cell.totalRequests}</span>
        <span className="text-neutral-400">Gap Score</span>
        <span className="text-white font-medium">{cell.avgGapScore}%</span>
      </div>
      <p className="text-[10px] text-neutral-400 pt-1 border-t border-neutral-700">
        Click to create collection with these filters
      </p>
    </div>
  )
}

function HeatmapLegend() {
  return (
    <div className="flex items-center justify-center gap-6 pt-4 border-t border-neutral-100 mt-4">
      {[
        { score: 60, label: "Hot" },
        { score: 40, label: "Warm" },
        { score: 25, label: "Moderate" },
        { score: 15, label: "Covered" },
        { score: 0, label: "Cold" },
      ].map((item) => {
        const color = getGapColor(item.score)
        return (
          <div key={item.label} className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded-md shadow-sm"
              style={{ backgroundColor: color.bg }}
            />
            <span className="text-xs font-light text-neutral-500">
              {item.label}
            </span>
          </div>
        )
      })}
    </div>
  )
}
