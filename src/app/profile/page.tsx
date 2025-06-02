import { Suspense } from 'react'
import { AuthenticatedLayout } from '@/components/layout/AuthenticatedLayout'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import ProfileContent from './profile-content'

function ProfileLoadingFallback() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">プロフィールを読み込んでいます...</p>
      </div>
    </div>
  )
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <AuthenticatedLayout>
        <Suspense fallback={<ProfileLoadingFallback />}>
          <ProfileContent />
        </Suspense>
      </AuthenticatedLayout>
    </ProtectedRoute>
  )
} 