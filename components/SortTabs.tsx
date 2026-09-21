import React from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export type StartupSort = 'recent' | 'votes'

const SORT_OPTIONS: { value: StartupSort; label: string }[] = [
    { value: 'recent', label: 'Most recent' },
    { value: 'votes', label: 'Most voted' },
]

const SortTabs = ({ sort, query }: { sort: StartupSort; query?: string }) => {
  return (
    <nav className='sort-tabs' aria-label='Sort startups'>
        {SORT_OPTIONS.map(({ value, label }) => {
            const params = new URLSearchParams()
            if(query) params.set('query', query)
            if(value !== 'recent') params.set('sort', value)
            const search = params.toString()
            const href = search ? `/?${search}` : '/'

            return (
                <Link
                    key={value}
                    href={href}
                    scroll={false}
                    aria-current={sort === value ? 'page' : undefined}
                    className={cn('sort-tab', sort === value && 'sort-tab_active')}
                >
                    {label}
                </Link>
            )
        })}
    </nav>
  )
}

export default SortTabs
