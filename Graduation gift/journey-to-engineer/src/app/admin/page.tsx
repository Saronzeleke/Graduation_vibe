import { redirect } from 'next/navigation'
import { isAdmin } from '@/lib/auth/authorization'
import Container from '@/components/ui/Container'
import Section from '@/components/ui/Section'
import AdminDashboard from '@/components/admin/AdminDashboard'

export const metadata = {
  title: 'Admin Dashboard - Journey to Engineer',
}

export default async function AdminPage() {
  // Check if user is authenticated AND has admin role
  const userIsAdmin = await isAdmin()
  
  if (!userIsAdmin) {
    redirect('/admin/login')
  }

  return (
    <Section className="py-12">
      <Container>
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        <AdminDashboard />
      </Container>
    </Section>
  )
}
