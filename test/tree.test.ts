import { describe, expect, it } from 'vitest';

import type { TreeNode } from '../src/tree';
import { source2tree, tree2source, treeEach, treeFilter } from '../src/tree';

describe('source2tree', () => {
  it('should convert a flat source array to a tree structure', () => {
    const source = [
      { id: '1', pid: undefined, name: 'Node 1' },
      { id: '2', pid: '1', name: 'Node 2' },
      { id: '3', pid: '1', name: 'Node 3' },
      { id: '4', pid: '2', name: 'Node 4' },
    ];

    expect(source2tree(source)).toEqual([
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

  it('should convert when the parent node exists', () => {
    const source = [
      { id: '1', pid: '4', name: 'Node 1' },
      { id: '2', pid: '4', name: 'Node 2' },
      { id: '3', pid: '1', name: 'Node 3' },
      { id: '4', pid: null, name: 'Node 4' },
    ];

    expect(source2tree(source)).toEqual([
      {
        id: '4',
        pid: null,
        name: 'Node 4',
        children: [
          {
            id: '1',
            pid: '4',
            name: 'Node 1',
            children: [
              {
                id: '3',
                pid: '1',
                name: 'Node 3',
                children: [],
              },
            ],
          },
          {
            id: '2',
            pid: '4',
            name: 'Node 2',
            children: [],
          },
        ],
      },
    ]);
  });

  it('should convert when define names', () => {
    const source = [
      { key: '1', parent: undefined },
      { key: '2', parent: '1' },
      { key: '3', parent: '1' },
    ];

    expect(
      source2tree(source, {
        names: {
          _id: 'key',
          _parent: 'parent',
        },
      })
    ).toEqual([
      {
        key: '1',
        parent: undefined,
        children: [
          {
            key: '2',
            parent: '1',
            children: [],
          },
          {
            key: '3',
            parent: '1',
            children: [],
          },
        ],
      },
    ]);
  });
});

describe('treeEach', () => {
  it('should iterate over each node in the tree structure', () => {
    const tree: TreeNode<
      {
        id: string;
        pid?: string;
        name?: string;
      },
      'child'
    >[] = [
      {
        id: '1',
        pid: undefined,
        name: 'Node 1',
        child: [
          {
            id: '2',
            pid: '1',
            name: 'Node 2',
            child: [
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

    treeEach(
      tree,
      (item) => {
        delete item.child;
      },
      { names: { _children: 'child' } }
    );

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
    const tree: TreeNode<
      {
        id: string;
        pid?: string;
        name?: string;
      },
      'children'
    >[] = [
      {
        id: '1',
        pid: undefined,
        name: 'Node 1',
        children: [
          {
            id: '2',
            pid: '1',
            name: 'Node 2',
          },
        ],
      },
    ];

    expect(tree2source(tree)).toEqual([
      { id: '1', pid: undefined, name: 'Node 1' },
      { id: '2', pid: '1', name: 'Node 2' },
    ]);
  });

  it('should convert a tree structure to a flat source array', () => {
    const tree: TreeNode<
      {
        id: string;
        pid?: string;
        name?: string;
      },
      'child'
    >[] = [
      {
        id: '1',
        pid: undefined,
        name: 'Node 1',
        child: [
          {
            id: '2',
            pid: '1',
            name: 'Node 2',
            child: [
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

    const result = tree2source(tree, { names: { _children: 'child' } });

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
    const tree: TreeNode<
      {
        id: string;
        pid?: string;
        name?: string;
      },
      'children'
    >[] = [
      {
        id: '1',
        pid: undefined,
        name: 'Node 1',
        children: [
          {
            id: '2',
            pid: '1',
            name: 'Node 2',
          },
        ],
      },
    ];

    expect(treeFilter(tree, ({ id }) => id === '2')).toEqual([
      {
        id: '1',
        pid: undefined,
        name: 'Node 1',
        children: [
          {
            id: '2',
            pid: '1',
            name: 'Node 2',
          },
        ],
      },
    ]);
  });

  it('should filter the tree structure based on the given predicate', () => {
    const tree: TreeNode<
      {
        id: string;
        pid?: string;
        name?: string;
      },
      'child'
    >[] = [
      {
        id: '1',
        pid: undefined,
        name: 'Node 1',
        child: [
          {
            id: '2',
            pid: '1',
            name: 'Node 2',
            child: [
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

    const result = treeFilter(tree, ({ id }) => id === '2', {
      names: { _children: 'child' },
    });

    expect(result).toEqual([
      {
        id: '1',
        pid: undefined,
        name: 'Node 1',
        child: [
          {
            id: '2',
            pid: '1',
            name: 'Node 2',
            child: [],
          },
        ],
      },
    ]);
  });
});
