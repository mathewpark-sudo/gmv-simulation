import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
    title: 'GMV 시뮬레이션',
    description: 'GMV Target Simulation',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="ko">
            <body>{children}</body>
        </html>
    )
}
