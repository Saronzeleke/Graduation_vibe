'use client'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-dark-500 text-white py-16">
      <div className="container mx-auto px-6">
        <div className="text-center">
          <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-celebration-gold via-celebration-pink to-celebration-gold bg-clip-text text-transparent animate-shimmer">
            🎓 The Journey to Engineer ✨
          </h3>
          <p className="text-gray-400 mb-6 text-lg">
            Celebrating the transformation from student to Software Engineer 🚀
          </p>
          <div className="border-t border-gray-700/50 pt-8 mt-8">
            <p className="text-sm text-gray-500">
              © {currentYear} Created with love and pride
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
