// Temporary re-exports to keep existing import paths working during feature folder migration.
// TODO: After updating all imports to `@/features/follow`, remove this proxy file.

export { default as FollowButton } from '@/features/profile/components/FollowButton'
export { FollowModal } from '@/features/profile/components/FollowModal'
export { FollowStats } from '@/features/profile/components/FollowStats'

// Local profile components (temporary barrel until feature modules are migrated)
export { default as MessageButton } from '@/features/profile/components/MessageButton'
export { ProfileHeader } from '@/features/profile/components/ProfileHeader'
export { ProfileTabs } from '@/features/profile/components/ProfileTabs'
export { PublicProfileHeader } from '@/features/profile/components/PublicProfileHeader'
export { PublicProfileTabs } from '@/features/profile/components/PublicProfileTabs'
export { ShareProfileButton } from '@/features/profile/components/ShareProfileButton'
