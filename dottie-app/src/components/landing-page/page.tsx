import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { DotIcon } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <header className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <DotIcon className="h-5 w-5 text-pink-500 fill-pink-500" />
          <img src="/chatb.png" alt="Dottie Logo" className="w-8 h-8" />
          <span className="font-semibold text-pink-500">Dottie</span>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <Card className="w-full max-w-2xl">
          <CardContent className="pt-6">
            <div className="text-center space-y-6">
              <h1 className="text-4xl font-bold text-gray-900">
                Welcome to Dottie
              </h1>
              <p className="text-xl text-gray-600">
                Your personal menstrual health companion. Track, understand, and take control of your menstrual health journey.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                <Link to="/auth/signup">
                  <Button className="w-full sm:w-auto bg-pink-500 hover:bg-pink-600 text-white">
                    Get Started
                  </Button>
                </Link>
                <Link to="/auth/signin">
                  <Button variant="outline" className="w-full sm:w-auto">
                    Sign In
                  </Button>
                </Link>
              </div>

              <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2">Track Your Cycle</h3>
                  <p className="text-gray-600">Monitor your menstrual patterns and predict your next period.</p>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2">Get Insights</h3>
                  <p className="text-gray-600">Receive personalized recommendations based on your unique patterns.</p>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2">Stay Informed</h3>
                  <p className="text-gray-600">Access educational resources and expert advice about menstrual health.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
} 