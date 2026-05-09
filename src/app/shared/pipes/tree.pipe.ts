import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tree'
})
export class TreePipe implements PipeTransform {

  //transform(value: unknown, ...args: unknown[]): unknown {
  transform(arr: any[], groupKey?: string): any {
    return tree(arr, groupKey);
  }

}

function tree(items: any[], groupKey = 'group') {
  if (!items) return [];

  const arr: { name: any; children: any[] }[] = [];
  const groups: number[] = [];
  let groupIndex = 0;

  items.forEach((item, i) => {
    const withIndex = {
      ...item,
      index: i,
    };
    const groupName = item[groupKey];

    if (!groups.hasOwnProperty(groupName)) {
      groups[groupName] = groupIndex++;

      arr.push({
        name: groupName,
        children: [withIndex],
      });
    } else {
      arr[groups[groupName]].children.push(withIndex);
    }
  });

  return arr;
}