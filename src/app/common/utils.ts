

export function groupByKey<T>(list: T[], key: keyof T): Map<string, T[]> {
    return list.reduce((groupedT, listItem) => {
      const groupValue = String(listItem[key]); // Convert to string
  
      // If the group is not in the map, create an entry with an empty array
      if (!groupedT.has(groupValue)) {
        groupedT.set(groupValue, []);
      }
  
      // Add the item to the corresponding group
      groupedT.get(groupValue)?.push(listItem);
  
      return groupedT;
    }, new Map<string, T[]>());
}


export function sortByKey<T>(list: T[], key: keyof T): T[] {
  return list.sort((a, b) => {
    const propA = (a as any)[key];
    const propB = (b as any)[key];

    if (typeof propA === 'number' && typeof propB === 'number') {
      return propA - propB;
    }

    if (typeof propA === 'string' && typeof propB === 'string') {
      return propA.localeCompare(propB);
    }

    if (propA instanceof Date && propB instanceof Date) {
      return propB.getTime() - propA.getTime();
    }

    // Handle other data types or customize as needed
    return 0;
  });
}

export function capitalizeWords(str: string): string {
    return str.replace(/\b\w/g, match => match.toUpperCase())
}

export function getLastOrder<T>(list: T[]): number {
  if (list.length === 0) {
    return 0;
  }
  return Math.max(...list.map(item => (item as any)['order'])) + 1
}

export function getLastItem<T>(list: T[]): T | undefined {
  if (list.length === 0) {
    return undefined;
  }

  return list[list.length - 1];
}

export function swapItems<T>(list: T[], index1: number, index2: number): T[] {
  const newList = [...list];

  const temp = newList[index1];
  newList[index1] = newList[index2];
  newList[index2] = temp;

  const tempOrder = (newList[index1] as any)['order'];
  (newList[index1] as any)['order'] = (newList[index2] as any)['order'];
  (newList[index2] as any)['order'] = tempOrder;

  return newList;
}

export function getContrastColor(hexColor: string) {
  // Convert hex color to RGB
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);
  // Calculate relative luminance
  const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;

  // Choose white or black text color based on contrast
  return luminance > 0.5 ? '#000000' : '#ffffff';
}