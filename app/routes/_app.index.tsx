import { json } from "@remix-run/node";
import type { DataFunctionArgs } from "@remix-run/node";
import { Link } from "@remix-run/react";

export async function loader({ request }: DataFunctionArgs) {
  return json({});
}

export default function AppIndex() {
  return (
    <div className="py-10 bg-ui-light min-h-screen">
      <header>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center">
            <img 
              src="/images/qstn-logo.png" 
              alt="QSTN" 
              className="h-12 w-auto object-contain mb-4" 
            />
            <p className="text-lg font-serif text-ui-dark/60 italic mt-2">reveal your story</p>
          </div>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="px-4 py-8 sm:px-0">
            <div className="border-2 border-primary/20 rounded-lg p-8 bg-white">
              <div className="text-center">
                <h3 className="mt-2 text-lg font-serif text-dark">No documents</h3>
                <p className="mt-1 text-base font-serif text-ui-dark/80">Get started by creating a new document.</p>
                <div className="mt-6">
                  <Link
                    to="new"
                    className="inline-flex items-center px-6 py-3 border border-transparent shadow-sm text-base font-serif rounded-md text-white bg-primary hover:bg-secondary transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent"
                  >
                    New Document
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 