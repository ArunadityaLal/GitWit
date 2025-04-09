"use client"

import type React from "react"

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  RadialBar,
  RadialBarChart,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Sector,
  Tooltip,
  Treemap,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts"

export {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  RadialBar,
  RadialBarChart,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Sector,
  Tooltip,
  Treemap,
  XAxis,
  YAxis,
  ZAxis,
}

export interface ChartTooltipProps {
  active?: boolean
  payload?: any[]
  label?: string
  formatter?: (value: number, name: string, props: any) => [string, string]
  labelFormatter?: (label: string) => string
  itemStyle?: React.CSSProperties
  contentStyle?: React.CSSProperties
  labelStyle?: React.CSSProperties
  wrapperStyle?: React.CSSProperties
}

export function ChartTooltip({
  active,
  payload,
  label,
  formatter,
  labelFormatter,
  itemStyle,
  contentStyle,
  labelStyle,
  wrapperStyle,
}: ChartTooltipProps) {
  if (!active || !payload?.length) {
    return null
  }

  const formattedLabel = labelFormatter ? labelFormatter(label as string) : label

  return (
    <div className="rounded-lg border bg-background p-2 shadow-sm" style={wrapperStyle}>
      <div className="grid gap-2">
        {formattedLabel ? (
          <div className="text-sm font-medium" style={labelStyle}>
            {formattedLabel}
          </div>
        ) : null}
        <div className="grid gap-1" style={contentStyle}>
          {payload.map((item, index) => {
            const formattedValue = formatter ? formatter(item.value, item.name, item) : item.value

            return (
              <div key={`item-${index}`} className="flex items-center gap-2 text-xs" style={itemStyle}>
                <div className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                <div className="font-medium">{item.name}</div>
                <div>{formattedValue}</div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

