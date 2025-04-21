export interface Asset {
  id: string
  ticker: string
  name: string
  weight: number
  sector: string
  risk: number // 0-100 scale
}
