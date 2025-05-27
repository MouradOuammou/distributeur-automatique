import type { PanierItem } from './PanierItem'

export interface Transaction {
  produits: PanierItem[]
  monnaieRendue: number
}
