'use client'

import { Suspense } from 'react'
import { Header } from '@/components/layout/header'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import NewWorkForm from './NewWorkForm'

export default function NewWorkPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <Suspense fallback={<div>Loading...</div>}>
          <NewWorkForm />
        </Suspense>
      </div>
    </ProtectedRoute>
  )
} 