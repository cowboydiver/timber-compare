export type Category = 'american' | 'european' | 'tropical'

export type Application = 'sawn_lumber' | 'deck_planks' | 'cladding'

export type PropertyValue =
  | { type: 'numeric'; value: number; unit: string }
  | { type: 'nominal'; value: string }
  | { type: 'unavailable' }

export interface Wood {
  id: string
  nameDa: string | null
  nameEn: string | null
  category: Category
  applications: Application[]
  imageUrl: string
  properties: Record<string, PropertyValue>
}
