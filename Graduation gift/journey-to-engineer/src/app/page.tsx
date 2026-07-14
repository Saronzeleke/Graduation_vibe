import Hero from '@/components/sections/Hero'
import Timeline from '@/components/sections/Timeline'
import Gallery from '@/components/sections/Gallery'
import { getGraduate } from '@/lib/supabase/queries'

export default async function HomePage() {
  const graduate = await getGraduate()

  return (
    <>
      <Hero graduate={graduate} />
      <Timeline />
      <Gallery />
    </>
  )
}
