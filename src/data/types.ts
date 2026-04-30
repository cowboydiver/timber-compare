export type Category = 'american' | 'european' | 'tropical'

export type PropertyValue =
  | { type: 'numeric'; value: number; unit: string }
  | { type: 'nominal'; value: string }
  | { type: 'unavailable' }

export interface Wood {
  id: string
  nameDa: string
  nameEn: string
  category: Category
  imageUrl: string
  properties: Record<string, PropertyValue>
}
