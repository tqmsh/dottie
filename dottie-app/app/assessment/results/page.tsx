import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { DotIcon, MessageCircle, Heart, ChevronRight } from "lucide-react"

export default function ResultsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <header className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <DotIcon className="h-5 w-5 text-pink-500 fill-pink-500" />
          <span className="font-semibold text-pink-500">Dottie</span>
        </div>
        <Link to="/" className="text-gray-500">
          X
        </Link>
      </header>

      <main className="flex-1 flex flex-col p-6 max-w-md mx-auto w-full">
        <Card className="w-full mb-6">
          <CardContent className="pt-6">
            <div className="text-center mb-4">
              <h1 className="text-xl font-bold mb-2">Your Menstrual Pattern is Developing Normally</h1>
              <p className="text-sm text-gray-600">
                Based on your responses, your cycle is within the normal range for your age according to ACOG
                guidelines.
              </p>
            </div>

            <div className="flex gap-3 mb-4">
              <Button className="flex-1 bg-pink-500 hover:bg-pink-600">
                <MessageCircle className="w-4 h-4 mr-2" />
                Ask Dottie
              </Button>
              <Button variant="outline" className="flex-1">
                <Heart className="w-4 h-4 mr-2" />
                Save Results
              </Button>
            </div>

            <p className="text-xs text-center text-gray-500">
              *According to the American College of Obstetricians and Gynecologists
            </p>
          </CardContent>
        </Card>

        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4">Your Cycle Summary</h2>

          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Age</span>
                <span className="text-sm text-gray-500">14 years (Early to Late Adolescence)</span>
              </div>
              <div className="w-full bg-gray-200 h-2 rounded-full">
                <div className="bg-pink-500 h-2 rounded-full w-[30%]"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Cycle Length</span>
                <span className="text-sm text-gray-500">21-32 days</span>
              </div>
              <div className="w-full bg-gray-200 h-2 rounded-full">
                <div className="bg-pink-500 h-2 rounded-full w-[60%]"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Period Duration</span>
                <span className="text-sm text-gray-500">2-6 days</span>
              </div>
              <div className="w-full bg-gray-200 h-2 rounded-full">
                <div className="bg-pink-500 h-2 rounded-full w-[50%]"></div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2">Symptoms</h3>
              <div className="grid grid-cols-2 gap-2">
                {["Bloating", "Headaches", "Fatigue", "Acne", "Mood swings", "Irritability"].map((symptom, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded-sm bg-pink-100 flex items-center justify-center">
                      <span className="text-pink-500 text-xs">✓</span>
                    </div>
                    <span className="text-sm">{symptom}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Pain Level</span>
                <span className="text-sm text-gray-500">Moderate</span>
              </div>
              <div className="w-full bg-gray-200 h-2 rounded-full">
                <div className="bg-pink-500 h-2 rounded-full w-[50%]"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Flow Heaviness</span>
                <span className="text-sm text-gray-500">Moderate</span>
              </div>
              <div className="w-full bg-gray-200 h-2 rounded-full">
                <div className="bg-pink-500 h-2 rounded-full w-[50%]"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4">Personalized Recommendations</h2>

          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="bg-pink-100 h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-pink-500">📅</span>
              </div>
              <div>
                <h3 className="font-medium">Track Your Cycle</h3>
                <p className="text-sm text-gray-600">
                  Regular tracking will help you understand your patterns better and predict your next period.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="bg-pink-100 h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-pink-500">⏱️</span>
              </div>
              <div>
                <h3 className="font-medium">Be Patient</h3>
                <p className="text-sm text-gray-600">
                  It's normal for your cycle to be irregular during adolescence. It can take 2-3 years to establish a
                  regular pattern.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="bg-pink-100 h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-pink-500">🏃‍♀️</span>
              </div>
              <div>
                <h3 className="font-medium">Exercise Regularly</h3>
                <p className="text-sm text-gray-600">
                  Light to moderate exercise can help reduce menstrual pain and improve mood.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="bg-pink-100 h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-pink-500">❤️</span>
              </div>
              <div>
                <h3 className="font-medium">Maintain a Balanced Diet</h3>
                <p className="text-sm text-gray-600">
                  Foods rich in iron, calcium, and omega-3 fatty acids can help manage period symptoms.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="bg-pink-100 h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-pink-500">🌙</span>
              </div>
              <div>
                <h3 className="font-medium">Prioritize Sleep</h3>
                <p className="text-sm text-gray-600">
                  Aim for 8-10 hours of sleep, especially during your period when fatigue is common.
                </p>
              </div>
            </div>
          </div>
        </div>

        <Link to="/assessment/resources">
          <Button className="w-full bg-pink-500 hover:bg-pink-600 text-white">
            View Resources & Next Steps
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </Link>
      </main>
    </div>
  )
}

