export function trackById<T extends { id?: number | string }>(index: number, item: T): number | string | undefined {
  return item?.id;
}

export function trackByIndex(index: number, item: any): number {
  return index;
}
