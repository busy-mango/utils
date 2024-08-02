import { isArray, isNil, isNonEmptyArray } from '@busymango/is-esm';

import type { ExtractKey } from './types';

type Key = string | number | bigint;

/**
 * Defines the fields for a node in the tree structure.
 */
type NodeFields<T, C> = {
  _children?: C;
  _id?: Extract<ExtractKey<T, Key>, string>;
  _parent?: Extract<ExtractKey<T, Key | undefined>, string>;
};

/**
 * Represents a tree node with its children.
 */
export type TreeNode<T, C extends string> = T & {
  [X in C]?: TreeNode<T, C>[];
};

/**
 * Default field names for the tree structure.
 */
const defs = {
  _id: 'id',
  _parentid: 'pid',
  _children: 'children',
};

/**
 * Converts a flat source array to a tree structure.
 * @param source The source array to convert.
 * @param params Additional parameters for customizing the conversion.
 * @returns The converted tree structure.
 */
export function source2tree<
  T,
  const C extends string = (typeof defs)['_children'],
>(
  source: T[],
  params: {
    names?: NodeFields<T, C>;
  } = {}
) {
  const { names } = params;

  // Define the current node type based on the provided children field.
  type CurrentNode = T & {
    [X in C]: TreeNode<T, C>[];
  };

  // Get the field names or use defaults.
  const _id = names?._id ?? (defs?._id as keyof T);
  const _parentid = names?._parent ?? (defs?._parentid as keyof T);

  const _children = names?._children ?? (defs?._children as C);

  // Initialize the tree structure and helper maps.
  const tree: CurrentNode[] = [];

  const map = new Map<string, CurrentNode>();

  const temp = new Map<string, CurrentNode[]>();

  // Iterate over the source array to build the tree structure.
  for (const iterator of source) {
    const id = iterator[_id] as string;
    const parentid = iterator[_parentid] as string | undefined;

    const children = temp.get(id) ?? [];
    const current = { ...iterator, [_children]: children } as CurrentNode;

    map.set(id, current);

    // If the parent ID is undefined, add the current node to the root level.
    if (isNil(parentid)) {
      tree.push(current);
      continue;
    }

    // If the parent node exists, add the current node as its child.
    const parent = map.get(parentid);

    if (isNil(parent)) {
      const temporary = temp.get(parentid);

      if (isNil(temporary)) {
        temp.set(parentid, [current]);
        continue;
      }

      temporary.push(current);
      continue;
    }

    parent[_children].push(current);
  }

  // Clear the temporary maps.
  temp.clear();
  map.clear();

  // Return the converted tree structure.
  return tree;
}

/**
 * Iterates over each node in the tree structure.
 * @param tree The tree structure to iterate over.
 * @param callback The callback function to invoke for each node.
 * @param params Additional parameters for customizing the iteration.
 */
export function treeEach<T, C extends string = (typeof defs)['_children']>(
  tree: TreeNode<T, C>[],
  callback: (item: TreeNode<T, C>, depth: number) => void,
  params: {
    names?: NodeFields<T, C>;
  } = {}
) {
  const { names } = params;

  type CurrentNode = TreeNode<T, C>;

  const queue: CurrentNode[] = tree.map((item) => item);

  const _children = names?._children ?? (defs?._children as C);

  function run() {
    const first = queue.shift();
    if (first) {
      const children = first[_children];
      isArray(children) && queue.push(...children);
      callback(first, 0);
      run();
    }
  }

  run();
}

/**
 * Converts a tree structure to a flat source array.
 * @param tree The tree structure to convert.
 * @param params Additional parameters for customizing the conversion.
 * @returns The converted flat source array.
 */
export function tree2source<T, C extends string = (typeof defs)['_children']>(
  tree: TreeNode<T, C>[],
  params: {
    names?: NodeFields<T, C>;
  } = {}
) {
  const source: T[] = [];

  const { names } = params;

  const _children = names?._children ?? (defs?._children as C);

  treeEach(
    tree,
    (item) => {
      const { [_children]: children, ...others } = item;
      source.push(others as T);
    },
    params
  );

  return source;
}

/**
 * Filters the tree structure based on the given predicate.
 * @param tree The tree structure to filter.
 * @param predicate The predicate function used to filter the nodes.
 * @param params Additional parameters for customizing the filtering.
 * @returns The filtered tree structure.
 */
export function treeFilter<T, C extends string = (typeof defs)['_children']>(
  tree: TreeNode<T, C>[],
  predicate: (val: TreeNode<T, C>, parent?: TreeNode<T, C>) => unknown,
  params: {
    names?: NodeFields<T, C>;
    parent?: TreeNode<T, C>;
  } = {}
): TreeNode<T, C>[] {
  const { names, parent } = params;

  const iChildren = names?._children ?? (defs?._children as C);

  return tree
    .map((item) => ({ ...item }))
    .filter((item) => {
      const children = item[iChildren];
      if (isArray(children) && children.length > 0) {
        const params = { names, parent: item };
        const current = treeFilter(children, predicate, params);
        item[iChildren] = current as TreeNode<T, C>[C];
        if (isNonEmptyArray(current)) return true;
      }

      return predicate(item, parent);
    });
}
