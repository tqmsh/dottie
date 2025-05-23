"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { DotIcon, ChevronRight, ChevronLeft, InfoIcon } from "lucide-react"

export default function PeriodDurationPage() {
  const [selectedDuration, setSelectedDuration] = useState<string | null>(null)

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <header className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <Image src="/chatb.png" alt="Dottie Logo" width={32} height={32} />
          <span className="font-semibold text-pink-500">Dottie</span>
        </div>
        <Link href="/" className="text-gray-500">
          X
        </Link>
      </header>

      <main className="flex-1 flex flex-col p-6 max-w-md mx-auto w-full">
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-gray-500">50% Complete</div>
        </div>

        <div className="w-full bg-gray-200 h-2 rounded-full mb-6">
          <div className="bg-pink-500 h-2 rounded-full w-[50%]"></div>
        </div>

        <h1 className="text-xl font-bold mb-2">Question 3 of 6</h1>
        <h2 className="text-lg font-semibold mb-1">How many days does your period typically last?</h2>
        <p className="text-sm text-gray-500 mb-6">Count the days from when bleeding starts until it completely stops</p>

        <RadioGroup value={selectedDuration || ""} onValueChange={setSelectedDuration} className="mb-6">
          <div className="space-y-3">
            <div className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-gray-50">
              <RadioGroupItem value="1-3" id="1-3" />
              <Label htmlFor="1-3" className="flex-1 cursor-pointer">
                <div className="font-medium">1-3 days</div>
                <p className="text-sm text-gray-500">Shorter duration</p>
              </Label>
            </div>

            <div className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-gray-50">
              <RadioGroupItem value="4-5" id="4-5" />
              <Label htmlFor="4-5" className="flex-1 cursor-pointer">
                <div className="font-medium">4-5 days</div>
                <p className="text-sm text-gray-500">Average duration</p>
              </Label>
            </div>

            <div className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-gray-50">
              <RadioGroupItem value="6-7" id="6-7" />
              <Label htmlFor="6-7" className="flex-1 cursor-pointer">
                <div className="font-medium">6-7 days</div>
                <p className="text-sm text-gray-500">Longer duration</p>
              </Label>
            </div>

            <div className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-gray-50">
              <RadioGroupItem value="8-plus" id="8-plus" />
              <Label htmlFor="8-plus" className="flex-1 cursor-pointer">
                <div className="font-medium">8+ days</div>
                <p className="text-sm text-gray-500">Extended duration</p>
              </Label>
            </div>

            <div className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-gray-50">
              <RadioGroupItem value="varies" id="varies" />
              <Label htmlFor="varies" className="flex-1 cursor-pointer">
                <div className="font-medium">It varies</div>
                <p className="text-sm text-gray-500">Changes from cycle to cycle</p>
              </Label>
            </div>

            <div className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-gray-50">
              <RadioGroupItem value="not-sure" id="not-sure" />
              <Label htmlFor="not-sure" className="flex-1 cursor-pointer">
                <div className="font-medium">I'm not sure</div>
                <p className="text-sm text-gray-500">Need help tracking</p>
              </Label>
            </div>

            <div className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-gray-50">
              <RadioGroupItem value="other" id="other" />
              <Label htmlFor="other" className="flex-1 cursor-pointer">
                <div className="font-medium">Other</div>
                <p className="text-sm text-gray-500">Specify your own period duration</p>
              </Label>
            </div>
          </div>
        </RadioGroup>

        <Card className="w-full mb-8 bg-pink-50 border-pink-100">
          <CardContent className="pt-6">
            <div className="flex gap-2">
              <InfoIcon className="h-5 w-5 text-pink-500 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">About Period Duration</h3>
                <p className="text-sm text-gray-600">
                  A typical period lasts between 3-7 days. Periods lasting longer than 7 days may indicate hormonal
                  imbalances or other health conditions.
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  Spotting before or after your period is common but should be noted separately from your main flow.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <p className="text-xs text-center text-gray-500 mb-4">
          Your data is private and secure. Dottie does not store your personal health information.
        </p>

        <div className="flex justify-between w-full mt-auto">
          <Link href="/assessment/cycle-length">
            <Button variant="outline" className="flex items-center">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>

          <Link href={selectedDuration ? "/assessment/flow" : "#"}>
            <Button className="bg-pink-500 hover:bg-pink-600 text-white" disabled={!selectedDuration}>
              Continue
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
      </main>
    </div>
  )
}

