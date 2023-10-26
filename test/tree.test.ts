import {
  source2tree,
  treeEach,
  tree2source,
  treeFilter,
  TreeNode,
} from '../src/tree';
import { describe, expect, it } from 'vitest';

describe('source2tree', () => {
  it('should convert a flat source array to a tree structure', () => {
    const source = [
      { id: '1', pid: undefined, name: 'Node 1' },
      { id: '2', pid: '1', name: 'Node 2' },
      { id: '3', pid: '1', name: 'Node 3' },
      { id: '4', pid: '2', name: 'Node 4' },
    ];

    const result = source2tree(source);

    expect(result).toEqual([
      {
        id: '1',
        pid: undefined,
        name: 'Node 1',
        children: [
          {
            id: '2',
            pid: '1',
            name: 'Node 2',
            children: [
              {
                id: '4',
                pid: '2',
                name: 'Node 4',
                children: [],
              },
            ],
          },
          {
            id: '3',
            pid: '1',
            name: 'Node 3',
            children: [],
          },
        ],
      },
    ]);
  });
});

describe('treeEach', () => {
  it('should iterate over each node in the tree structure', () => {
    const tree: TreeNode<{
      id: string;
      pid?: string
      name?: string;
    }, 'children'>[] = [
      {
        id: '1',
        pid: undefined,
        name: 'Node 1',
        children: [
          {
            id: '2',
            pid: '1',
            name: 'Node 2',
            children: [
              {
                id: '4',
                pid: '2',
                name: 'Node 4',
              },
            ],
          },
          {
            id: '3',
            pid: '1',
            name: 'Node 3',
          },
        ],
      },
    ];

    treeEach(tree, (item) => {
      delete item.children;
    });

    expect(tree).toEqual([
      {
        id: '1',
        pid: undefined,
        name: 'Node 1',
      },
    ]);
  });
});

describe('tree2source', () => {
  it('should convert a tree structure to a flat source array', () => {
    const tree: TreeNode<{
      id: string;
      pid?: string
      name?: string;
    }, 'children'>[] = [
      {
        id: '1',
        pid: undefined,
        name: 'Node 1',
        children: [
          {
            id: '2',
            pid: '1',
            name: 'Node 2',
            children: [
              {
                id: '4',
                pid: '2',
                name: 'Node 4',
              },
            ],
          },
          {
            id: '3',
            pid: '1',
            name: 'Node 3',
          },
        ],
      },
    ];

    const result = tree2source(tree);

    expect(result).toEqual([
      { id: '1', pid: undefined, name: 'Node 1' },
      { id: '2', pid: '1', name: 'Node 2' },
      { id: '3', pid: '1', name: 'Node 3' },
      { id: '4', pid: '2', name: 'Node 4' },
    ]);
  });
});

describe('treeFilter', () => {
  it('should filter the tree structure based on the given predicate', () => {
    const tree: TreeNode<{
      id: string;
      pid?: string
      name?: string;
    }, 'children'>[] = [
      {
        id: '1',
        pid: undefined,
        name: 'Node 1',
        children: [
          {
            id: '2',
            pid: '1',
            name: 'Node 2',
            children: [
              {
                id: '4',
                pid: '2',
                name: 'Node 4',
              },
            ],
          },
          {
            id: '3',
            pid: '1',
            name: 'Node 3',
          },
        ],
      },
    ];

    const result = treeFilter(tree, (item) => item.id === '2');

    expect(result).toEqual([
      {
        id: '1',
        pid: undefined,
        name: 'Node 1',
        children: [
          {
            id: '2',
            pid: '1',
            name: 'Node 2',
            children: [],
          },
        ],
      },
    ]);
  });
});