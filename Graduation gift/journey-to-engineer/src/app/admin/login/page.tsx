import Container from '@/components/ui/Container'
import Section from '@/components/ui/Section'
import LoginForm from '@/components/admin/LoginForm'

export const metadata = {
  title: 'Admin Login - Journey to Engineer',
}

export default function LoginPage() {
  return (
    <Section className="py-20">
      <Container>
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">Admin Login</h1>
          <LoginForm />
        </div>
      </Container>
    </Section>
  )
}
