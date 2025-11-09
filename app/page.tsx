import Link from 'next/link'

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="biblical-card text-center mb-12">
          <h2 className="text-4xl font-biblical mb-4 biblical-heading">
            Welcome to Our Biblical Blog
          </h2>
          <p className="text-lg text-biblical-olive mb-6">
            Explore timeless wisdom and spiritual insights through our carefully curated blog posts.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/blog" className="biblical-button">
              Read Posts
            </Link>
            <Link href="/admin" className="bg-biblical-olive text-white px-6 py-3 rounded-md hover:bg-opacity-90 transition-all font-semibold">
              Admin Dashboard
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="biblical-card">
            <h3 className="text-2xl biblical-heading mb-3">Featured Content</h3>
            <p className="text-biblical-deepBrown">
              Discover our latest biblical teachings and reflections, updated regularly with new insights from Scripture.
            </p>
          </div>
          <div className="biblical-card">
            <h3 className="text-2xl biblical-heading mb-3">Archived Wisdom</h3>
            <p className="text-biblical-deepBrown">
              Browse through our collection of past teachings and find spiritual guidance for your journey.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
