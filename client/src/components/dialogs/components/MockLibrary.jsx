import { useState } from 'react';
import { TreeItem, TreeView } from '@mui/lab';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const MockLibrary = () => {
  const [expandedNodes, setExpandedNodes] = useState(['root']);

  const mockLibrary = {
    id: 'root',
    name: 'Audiobook Library',
    children: [
      {
        id: '1',
        name: 'Book Title 1',
        children: [
          { id: '2', name: 'Chapter 1' },
          { id: '3', name: 'Chapter 2' },
          { id: '4', name: 'Chapter 3' },
        ],
      },
      {
        id: '5',
        name: 'Book Title 2',
        children: [
          { id: '6', name: 'Chapter 1' },
          { id: '7', name: 'Chapter 2' },
          { id: '8', name: 'Chapter 3' },
        ],
      },
      {
        id: '9',
        name: 'Book Title 3',
        children: [
          { id: '10', name: 'Chapter 1' },
          { id: '11', name: 'Chapter 2' },
          { id: '12', name: 'Chapter 3' },
        ],
      },
    ],
  };

  const setExpanded = (nodeId) => {
    if (expandedNodes.includes(nodeId)) {
      setExpandedNodes((prevState) =>
        prevState.filter((item) => item !== nodeId)
      );
    } else {
      setExpandedNodes((prevState) => [...prevState, nodeId]);
    }
  };

  const renderTree = (nodes) => (
    <TreeItem
      key={nodes.id}
      nodeId={nodes.id}
      label={nodes.name}
      onClick={() => {
        setExpanded(nodes.id);
      }}
    >
      {Array.isArray(nodes.children)
        ? nodes.children.map((node) => renderTree(node))
        : null}
    </TreeItem>
  );

  return (
    <TreeView
      aria-label="tree"
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
      multiSelect
      expanded={expandedNodes}
    >
      {renderTree(mockLibrary)}
    </TreeView>
  );
};

export default MockLibrary;
