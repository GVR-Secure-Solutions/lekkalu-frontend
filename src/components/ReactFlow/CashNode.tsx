// Define the custom BaseKPI node component with default node styling
import { Handle, Node, Position } from '@xyflow/react'
import React from 'react'

const CashNode = ({ data }: { data: { label: string } }) => {
  return (
    <div className="react-flow__node-default">
      <Handle type="source" position={Position.Right} />
      <div>{data.label}</div>
    </div>
  )
}
// Define the function to add a new BaseKPI node to the flow
export const addCashNode = (
  nodes: Node[],
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>,
) => {
  const newNode: Node = {
    id: `cash_${nodes.length + 1}`,
    position: { x: 0, y: 0 },
    data: { label: 'Cash' },
    type: 'baseKpiNode',
  }
  setNodes((nds: Node[]) => nds.concat(newNode))
}
export default CashNode