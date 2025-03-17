import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { DotIcon, ChevronRight } from "lucide-react"

export default function WelcomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <header className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <DotIcon className="h-5 w-5 text-pink-500 fill-pink-500" />
          <span className="font-semibold text-pink-500">Dottie</span>
        </div>
        <Link href="#" className="text-gray-500">
          X
        </Link>
      </header>

      <main className="flex-1 flex flex-col items-center p-6 max-w-md mx-auto w-full">
        <DotIcon className="h-16 w-16 text-pink-500 fill-pink-500 mb-6" />

        <h1 className="text-2xl font-bold text-center mb-2">Welcome to Dottie</h1>
        <p className="text-center text-gray-600 mb-8">Your AI-powered menstrual health companion</p>

        <Card className="w-full mb-8">
          <CardContent className="pt-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <span className="inline-flex items-center justify-center rounded-full bg-pink-100 h-6 w-6 mr-2 text-pink-500 text-sm">
                ⓘ
              </span>
              About This Assessment
            </h2>

            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="inline-flex items-center justify-center rounded-full bg-pink-100 h-5 w-5 mr-2 text-pink-500 text-xs mt-0.5">
                  ✓
                </span>
                <span>Quick assessment of your menstrual health patterns</span>
              </li>
              <li className="flex items-start">
                <span className="inline-flex items-center justify-center rounded-full bg-pink-100 h-5 w-5 mr-2 text-pink-500 text-xs mt-0.5">
                  ✓
                </span>
                <span>Personalized insights based on your responses</span>
              </li>
              <li className="flex items-start">
                <span className="inline-flex items-center justify-center rounded-full bg-pink-100 h-5 w-5 mr-2 text-pink-500 text-xs mt-0.5">
                  ✓
                </span>
                <span>Evidence-based recommendations for your well-being</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <p className="text-sm text-center text-gray-500 mb-8">
          This tool helps identify potential menstrual health concerns based on your symptoms. It is not a substitute
          for professional medical advice.
        </p>

        <Link href="/assessment/age-verification" className="w-full">
          <Button className="w-full bg-pink-500 hover:bg-pink-600 text-white">
            Start Assessment
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </Link>
      </main>
    </div>
  )
}

