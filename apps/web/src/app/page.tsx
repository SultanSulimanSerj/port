export default function Home() {
  return (
    <main className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">SaaS Project Portal</h1>
      <div className="space-y-4">
        <p>Welcome to the project management platform</p>
        <div>
          <a href="/objects" className="text-blue-600 hover:underline">
            View Objects →
          </a>
        </div>
      </div>
    </main>
  );
}