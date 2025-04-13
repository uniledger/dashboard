// Simple placeholder for a compiled React app
document.addEventListener('DOMContentLoaded', function() {
    const root = document.getElementById('root');
    
    root.innerHTML = `
    <div class="min-h-screen bg-gray-50">
      <header class="bg-white shadow-sm">
        <div class="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center">
            <h1 class="text-2xl font-bold text-gray-900">LedgerRocket Banking API Demo</h1>
            <div class="flex space-x-4">
              <a 
                href="https://ledger.dev.ledgerrocket.com/openapi.json" 
                target="_blank" 
                rel="noopener noreferrer"
                class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                API Documentation
              </a>
              <button class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                Get API Key
              </button>
            </div>
          </div>
        </div>
      </header>

      <main class="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div class="bg-white shadow-lg rounded-lg p-6">
          <h2 class="text-xl font-semibold text-gray-800 mb-4">Welcome to LedgerRocket Dashboard</h2>
          <p class="text-gray-600 mb-4">
            This is a placeholder for the LedgerRocket Banking API Dashboard. 
            The full React application will be deployed via GitHub Actions.
          </p>
          <div class="bg-blue-50 p-4 rounded-md border border-blue-200">
            <p class="text-blue-700">
              <strong>Status:</strong> Connected to API at https://ledger.dev.ledgerrocket.com
            </p>
          </div>
        </div>
      </main>

      <footer class="bg-white mt-12 border-t border-gray-200">
        <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center">
            <p class="text-gray-500 text-sm">© 2025 LedgerRocket. All rights reserved.</p>
            <div class="flex space-x-6">
              <a href="#" class="text-gray-500 hover:text-gray-700 text-sm">Documentation</a>
              <a href="#" class="text-gray-500 hover:text-gray-700 text-sm">API Reference</a>
              <a href="#" class="text-gray-500 hover:text-gray-700 text-sm">Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
    `;
});
