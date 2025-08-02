export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-8">
      <header className="w-full text-center py-4 bg-blue-600 text-white text-2xl font-bold">
        <h1>MindMirror</h1>
      </header>
      <main className="flex flex-col items-center justify-center flex-grow container mx-auto mt-8 p-4 bg-white rounded-lg shadow-lg">
        {/* This div will hold the AI-generated UI components */}
        <div id="ai-ui-container" className="w-full h-full flex flex-col items-center justify-center">
          <p className="text-gray-500">AI-generated UI will appear here.</p>
        </div>
      </main>
    </div>
  );
}