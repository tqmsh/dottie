import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/src/components/ui/!to-migrate/button";
import { Card, CardContent } from "@/src/components/ui/!to-migrate/card";
import { MessageCircle, Heart, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { ChatModal } from "@/src/pages/chat/page";
import { toast } from "sonner";
import { Assessment } from "@/src/api/assessment/types";
import { postSend } from "@/src/api/assessment/requests/postSend/Request"; // Add this import

// Define the types of menstrual patterns as per LogicTree.md
type MenstrualPattern =
  | "regular"
  | "irregular"
  | "heavy"
  | "pain"
  | "developing";

interface PatternInfo {
  title: string;
  description: string;
  recommendations: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
}

const patternData: Record<MenstrualPattern, PatternInfo> = {
  regular: {
    title: "Regular Menstrual Cycles",
    description:
      "Your menstrual cycles follow a normal, healthy pattern according to ACOG guidelines.",
    recommendations: [
      {
        icon: "📅",
        title: "Track Your Cycle",
        description:
          "Regular tracking will help you understand your patterns better and predict your next period.",
      },
      {
        icon: "🏃‍♀️",
        title: "Exercise Regularly",
        description:
          "Light to moderate exercise can help reduce menstrual pain and improve mood.",
      },
      {
        icon: "❤️",
        title: "Maintain a Balanced Diet",
        description:
          "Foods rich in iron, calcium, and omega-3 fatty acids can help manage period symptoms.",
      },
      {
        icon: "🌙",
        title: "Prioritize Sleep",
        description:
          "Aim for 8-10 hours of sleep, especially during your period when fatigue is common.",
      },
    ],
  },
  irregular: {
    title: "Irregular Timing Pattern",
    description:
      "Your cycle length is outside the typical range, which may indicate hormonal fluctuations.",
    recommendations: [
      {
        icon: "📅",
        title: "Track Your Cycle",
        description:
          "Keeping a detailed record can help identify patterns and share with healthcare providers.",
      },
      {
        icon: "👩‍⚕️",
        title: "Consult a Healthcare Provider",
        description:
          "If your cycles are consistently irregular, consider discussing with a healthcare provider.",
      },
      {
        icon: "🥗",
        title: "Focus on Nutrition",
        description:
          "A balanced diet can help support hormonal balance and regulate cycles.",
      },
      {
        icon: "🧘‍♀️",
        title: "Stress Management",
        description:
          "High stress can affect your cycle. Consider yoga, meditation, or other relaxation techniques.",
      },
    ],
  },
  heavy: {
    title: "Heavy or Prolonged Flow Pattern",
    description:
      "Your flow is heavier or longer than typical, which could impact your daily activities.",
    recommendations: [
      {
        icon: "🍳",
        title: "Iron-rich Foods",
        description:
          "Include lean red meat, spinach, beans, and fortified cereals to prevent iron deficiency.",
      },
      {
        icon: "💧",
        title: "Stay Hydrated",
        description:
          "Drink plenty of water to help replace fluids lost during your period.",
      },
      {
        icon: "👩‍⚕️",
        title: "Medical Evaluation",
        description:
          "If your flow regularly soaks through pads/tampons hourly, consult a healthcare provider.",
      },
      {
        icon: "⏰",
        title: "Plan Ahead",
        description:
          "Keep extra supplies and a change of clothes available during heavy flow days.",
      },
    ],
  },
  pain: {
    title: "Pain-Predominant Pattern",
    description:
      "Your menstrual pain is higher than typical and may interfere with daily activities.",
    recommendations: [
      {
        icon: "🔥",
        title: "Heat Therapy",
        description:
          "Apply a heating pad to your lower abdomen to help relieve menstrual cramps.",
      },
      {
        icon: "💊",
        title: "Pain Management",
        description:
          "Over-the-counter pain relievers like ibuprofen can help reduce pain and inflammation.",
      },
      {
        icon: "🧘‍♀️",
        title: "Gentle Exercise",
        description:
          "Light activities like walking or stretching can help alleviate menstrual pain.",
      },
      {
        icon: "👩‍⚕️",
        title: "Medical Support",
        description:
          "If pain is severe, talk to a healthcare provider about additional treatment options.",
      },
    ],
  },
  developing: {
    title: "Developing Pattern",
    description:
      "Your cycles are still establishing a regular pattern, which is normal during adolescence.",
    recommendations: [
      {
        icon: "⏱️",
        title: "Be Patient",
        description:
          "It's normal for your cycle to be irregular during adolescence. It can take 2-3 years to establish a regular pattern.",
      },
      {
        icon: "📅",
        title: "Track Your Cycle",
        description:
          "Start keeping a record of your periods to observe patterns as they develop.",
      },
      {
        icon: "🧠",
        title: "Learn About Your Body",
        description:
          "Understanding menstrual health can help you recognize what's normal for you.",
      },
      {
        icon: "👩‍👧",
        title: "Talk to Someone You Trust",
        description:
          "Discuss concerns with a parent, school nurse, or healthcare provider.",
      },
    ],
  },
};

export default function ResultsPage() {
  const navigate = useNavigate();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [pattern, setPattern] = useState<MenstrualPattern>("developing");
  const [age, setAge] = useState<string>("");
  const [cycleLength, setCycleLength] = useState<string>("");
  const [periodDuration, setPeriodDuration] = useState<string>("");
  const [flowLevel, setFlowLevel] = useState<string>("");
  const [painLevel, setPainLevel] = useState<string>("");
  const [symptoms, setSymptoms] = useState<string[]>([]);

  useEffect(() => {
    // Get data from session storage
    const storedAge = sessionStorage.getItem("age");
    const storedCycleLength = sessionStorage.getItem("cycleLength");
    const storedPeriodDuration = sessionStorage.getItem("periodDuration");
    const storedFlowLevel = sessionStorage.getItem("flowLevel");
    const storedPainLevel = sessionStorage.getItem("painLevel");
    const storedSymptoms = sessionStorage.getItem("symptoms");

    console.log("Stored values:", {
      age: storedAge,
      cycleLength: storedCycleLength,
      periodDuration: storedPeriodDuration,
      flowLevel: storedFlowLevel,
      painLevel: storedPainLevel,
      symptoms: storedSymptoms,
    });

    if (storedAge) setAge(storedAge);
    if (storedCycleLength) setCycleLength(storedCycleLength);
    if (storedPeriodDuration) setPeriodDuration(storedPeriodDuration);
    if (storedFlowLevel) setFlowLevel(storedFlowLevel);
    if (storedPainLevel) setPainLevel(storedPainLevel);
    if (storedSymptoms) {
      try {
        setSymptoms(JSON.parse(storedSymptoms));
      } catch (e) {
        console.error("Error parsing symptoms:", e);
      }
    }

    // Determine the pattern based on LogicTree logic
    let determinedPattern: MenstrualPattern = "developing";

    // Check for irregular timing (O1)
    if (
      storedCycleLength === "Irregular" ||
      storedCycleLength === "Less than 21 days" ||
      storedCycleLength === "More than 45 days"
    ) {
      determinedPattern = "irregular";
    }
    // Check for heavy flow (O2)
    else if (
      storedPeriodDuration === "More than 7 days" ||
      storedPeriodDuration === "8+ days" ||
      storedFlowLevel === "Heavy"
    ) {
      determinedPattern = "heavy";
    }
    // Check for pain-predominant (O3)
    else if (storedPainLevel === "Severe") {
      determinedPattern = "pain";
    }
    // Check for regular cycles (O4)
    else if (
      storedCycleLength &&
      storedCycleLength.includes("days") &&
      storedPeriodDuration &&
      storedPeriodDuration.includes("days") &&
      storedFlowLevel !== "Heavy" &&
      storedPainLevel !== "Severe"
    ) {
      determinedPattern = "regular";
    }
    // Default to developing pattern (O5)
    else if (storedAge && storedAge.includes("13-17")) {
      determinedPattern = "developing";
    }

    setPattern(determinedPattern);
  }, []);

  const patternInfo = patternData[pattern];

  // Calculate progress bar widths based on values
  const getProgressWidth = (value: string): string => {
    if (!value) return "0%";

    // Make sure value is a string for consistent handling
    const val = String(value).trim().toLowerCase();

    // Age handling
    if (val === "13-17") return "25%";
    if (val === "18-24") return "35%";
    if (val.includes("25")) return "45%"; // Handle "25+", "25-plus", etc.
    if (val.includes("35")) return "65%"; // Handle "35+", "35-plus", etc.
    if (val.includes("45")) return "85%"; // Handle "45+", "45-plus", etc.

    // Cycle length handling
    if (val.includes("less than 21")) return "20%";
    if (val.includes("21-25") || val === "21-25 days") return "30%";
    if (val.includes("26-30")) return "45%";
    if (val.includes("31-35")) return "60%";
    if (val.includes("36-40")) return "75%";
    if (val.includes("more than 45") || val.includes("45+")) return "100%";
    if (val.includes("irregular")) return "50%";

    // Period duration handling
    if (val.includes("1-2")) return "20%";
    if (val.includes("3-4")) return "40%";
    if (val.includes("5-7")) return "60%";
    if (
      val.includes("8+") ||
      val.includes("8-plus") ||
      val.includes("more than 7")
    )
      return "100%";

    // Flow level handling
    if (val === "light" || val.includes("light")) return "25%";
    if (val === "moderate" || val.includes("moderate")) return "50%";
    if (val === "heavy" || val.includes("heavy")) return "75%";
    if (val.includes("very heavy") || val === "very-heavy") return "100%";

    // Pain level handling
    if (val === "mild" || val.includes("mild")) return "25%";
    if (val === "moderate" || val.includes("moderate")) return "50%";
    if (val === "severe" || val.includes("severe")) return "75%";
    if (val === "debilitating" || val.includes("debilitating")) return "100%";

    // If we couldn't match anything specific, use sensible defaults
    if (val.includes("less than")) return "20%";
    if (val.includes("more than")) return "80%";

    console.log("Using default width for value:", val);
    return "50%"; // Default value
  };

  // Force progress bars to update when values change
  useEffect(() => {
    // Debug logging
    console.log("Calculated widths:", {
      age: getProgressWidth(age),
      cycleLength: getProgressWidth(cycleLength),
      periodDuration: getProgressWidth(periodDuration),
      flowLevel: getProgressWidth(flowLevel),
      painLevel: getProgressWidth(painLevel),
    });

    // Trigger a re-render when these values change
    const progressElements = document.querySelectorAll(
      ".bg-pink-500.h-2.rounded-full"
    );
    if (progressElements.length > 0) {
      // This forces a style recalculation
      progressElements.forEach((el) => {
        el.classList.remove("bg-pink-500");
        setTimeout(() => el.classList.add("bg-pink-500"), 0);
      });
    }
  }, [age, cycleLength, periodDuration, flowLevel, painLevel]);

  // Function to handle saving assessment results
  const handleSaveResults = async () => {
    setIsSaving(true);

    try {
      // Make sure all required fields have values
      if (!pattern || !age || !cycleLength) {
        toast.error("Missing required assessment data");
        setIsSaving(false);
        return;
      }

      // Create assessment data object according to the Assessment interface structure
      const assessment: Omit<Assessment, "id"> = {
        userId: "", // This will be set by the backend
        createdAt: new Date().toISOString(),
        assessmentData: {
          userId: "", // This will be set by the backend
          createdAt: new Date().toISOString(),
          assessmentData: {
            date: new Date().toISOString(),
            pattern,
            age,
            cycleLength,
            periodDuration: periodDuration || "Not provided",
            flowHeaviness: flowLevel,
            painLevel: painLevel || "Not provided",
            symptoms: {
              physical: symptoms || [],
              emotional: [],
            },
            recommendations:
              patternInfo?.recommendations?.map((rec) => ({
                title: rec.title,
                description: rec.description,
              })) || [],
          },
        },
      };

      console.log("Sending assessment data:", assessment);

      // Use the postSend function
      const savedAssessment = await postSend(assessment);

      toast.success("Assessment saved successfully!");
      navigate(`/assessment/history/${savedAssessment.id}`);
    } catch (error) {
      console.error("Failed to save assessment:", error);
      toast.error("Failed to save assessment. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <header className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <img src="/chatb.png" alt="Dottie Logo" width={32} height={32} />
          <span className="font-semibold text-pink-500">Dottie</span>
        </div>
        <UserIcon />
      </header>

      <main className="flex-1 flex flex-col p-6 max-w-md mx-auto w-full">
        <Card className="w-full mb-6">
          <CardContent className="pt-6">
            <div className="text-center mb-4">
              <h1 className="text-xl font-bold mb-2">
                Your Menstrual Pattern is {patternInfo.title}
              </h1>
              <p className="text-sm text-gray-600">{patternInfo.description}</p>
            </div>

            <div className="flex gap-3 mb-4">
              <Button
                className="flex-1 bg-pink-500 hover:bg-pink-600"
                onClick={() => setIsChatOpen(true)}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Ask Dottie
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleSaveResults}
                disabled={isSaving}
              >
                <Heart className="w-4 h-4 mr-2" />
                {isSaving ? "Saving..." : "Save Results"}
              </Button>
            </div>

            <p className="text-xs text-center text-gray-500">
              *According to the American College of Obstetricians and
              Gynecologists
            </p>
          </CardContent>
        </Card>

        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4">Your Cycle Summary</h2>

          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Age</span>
                <span className="text-sm text-gray-500">
                  {age || "Not provided"}
                </span>
              </div>
              <div className="w-full bg-gray-200 h-2 rounded-full">
                <div
                  key={`age-${age}`}
                  className="bg-pink-500 h-2 rounded-full"
                  style={{ width: getProgressWidth(age) }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Cycle Length</span>
                <span className="text-sm text-gray-500">
                  {cycleLength || "Not provided"}
                </span>
              </div>
              <div className="w-full bg-gray-200 h-2 rounded-full">
                <div
                  key={`cycle-${cycleLength}`}
                  className="bg-pink-500 h-2 rounded-full"
                  style={{ width: getProgressWidth(cycleLength) }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Period Duration</span>
                <span className="text-sm text-gray-500">
                  {periodDuration || "Not provided"}
                </span>
              </div>
              <div className="w-full bg-gray-200 h-2 rounded-full">
                <div
                  key={`period-${periodDuration}`}
                  className="bg-pink-500 h-2 rounded-full"
                  style={{ width: getProgressWidth(periodDuration) }}
                ></div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2">Symptoms</h3>
              <div className="grid grid-cols-2 gap-2">
                {symptoms.length > 0 ? (
                  symptoms.map((symptom, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="h-4 w-4 rounded-sm bg-pink-100 flex items-center justify-center">
                        <span className="text-pink-500 text-xs">✓</span>
                      </div>
                      <span className="text-sm">{symptom}</span>
                    </div>
                  ))
                ) : (
                  <span className="text-sm text-gray-500">
                    No symptoms selected
                  </span>
                )}
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Pain Level</span>
                <span className="text-sm text-gray-500">
                  {painLevel || "Not provided"}
                </span>
              </div>
              <div className="w-full bg-gray-200 h-2 rounded-full">
                <div
                  key={`pain-${painLevel}`}
                  className="bg-pink-500 h-2 rounded-full"
                  style={{ width: getProgressWidth(painLevel) }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Flow Heaviness</span>
                <span className="text-sm text-gray-500">
                  {flowLevel || "Not provided"}
                </span>
              </div>
              <div className="w-full bg-gray-200 h-2 rounded-full">
                <div
                  key={`flow-${flowLevel}`}
                  className="bg-pink-500 h-2 rounded-full"
                  style={{ width: getProgressWidth(flowLevel) }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4">
            Personalized Recommendations
          </h2>

          <div className="space-y-4">
            {patternInfo.recommendations.map((rec, index) => (
              <div key={index} className="flex gap-3">
                <div className="bg-pink-100 h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-pink-500">{rec.icon}</span>
                </div>
                <div>
                  <h3 className="font-medium">{rec.title}</h3>
                  <p className="text-sm text-gray-600">{rec.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Link to="/assessment/resources">
          <Button className="w-full bg-pink-500 hover:bg-pink-600 text-white">
            View Resources & Next Steps
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </Link>
      </main>
      <ChatModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        userData={{
          age,
          cycleLength,
          periodDuration,
          flowHeaviness: flowLevel,
          painLevel,
          symptoms,
        }}
      />
    </div>
  );
}
