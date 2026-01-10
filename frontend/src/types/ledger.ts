import { ReactNode } from 'react'

export type IncomeRecord = {
    id: string
    label: string
    amount: number
    timeAgo: string
}

export type IncomeSection = {
    id: string
    title: string
    total: number
    icon?: ReactNode
    records: IncomeRecord[]
}

export type ItemSale = {
    id: string
    name: string
    price: number
    timeAgo: string
    date: string
    icon?: ReactNode
}

export type LedgerCharacter = {
    id: string
    name: string
    job: string
    income: number
    server?: string
    level?: number
    race?: string
}
