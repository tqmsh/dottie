import { useParams, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { ArrowLeft, Calendar, Activity, Droplet, Heart, Brain, AlertCircle } from 'lucide-react';

// In a real app, this would come from an API
const getAssessmentDetails = (id: string) => {
  // Simulate API call that might return null
  if (id === 'not-found') return null;
  
  return {
    id,
    date: new Date(),
    pattern: 'regular',
    age: '18_24',
    cycleLength: '26_30',
    periodDuration: '4_5',
    flowHeaviness: 'moderate',
    painLevel: 'mild',
    symptoms: {
      physical: ['Bloating', 'Headaches', 'Fatigue'],
      emotional: ['Mood swings', 'Irritability', 'Anxiety'],
    },
    recommendations: [
      {
        title: 'Track Your Cycle',
        description: 'Keep a record of when your period starts and stops to identify patterns.',
      },
      {
        title: 'Exercise Regularly',
        description: 'Regular physical activity can help manage symptoms and improve overall well-being.',
      },
      {
        title: 'Maintain a Balanced Diet',
        description: 'Focus on nutrient-rich foods and stay hydrated throughout your cycle.',
      },
    ],
  };
};

export default function DetailsPage() {
  const { id } = useParams();
  const assessment = getAssessmentDetails(id || '');

  const formatValue = (value: string) => {
    return value.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  // Fallback state when no assessment is found
  if (!assessment) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Link
            to="/assessment/history"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to History
          </Link>

          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="flex flex-col items-center justify-center py-12">
              <AlertCircle className="h-12 w-12 text-gray-400 mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Assessment Not Found
              </h2>
              <p className="text-gray-600 mb-6">
                The assessment you're looking for doesn't exist or has been removed.
              </p>
              <Link
                to="/assessment/history"
                className="inline-flex items-center px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
              >
                Return to History
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link
          to="/assessment/history"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to History
        </Link>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Assessment Details</h1>
              <p className="text-sm text-gray-500">
                {format(assessment.date, 'MMMM d, yyyy')}
              </p>
            </div>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-pink-100 text-pink-800">
              {formatValue(assessment.pattern)}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-gray-400" />
                <span className="text-sm font-medium text-gray-900">Cycle Information</span>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Age:</span> {formatValue(assessment.age)} years
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Cycle Length:</span> {formatValue(assessment.cycleLength)} days
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Period Duration:</span> {formatValue(assessment.periodDuration)} days
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-gray-400" />
                <span className="text-sm font-medium text-gray-900">Flow & Pain</span>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Flow Level:</span> {formatValue(assessment.flowHeaviness)}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Pain Level:</span> {formatValue(assessment.painLevel)}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Droplet className="h-5 w-5 text-gray-400" />
                <h2 className="text-lg font-medium text-gray-900">Physical Symptoms</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {assessment.symptoms.physical.map((symptom, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                  >
                    {symptom}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-4">
                <Brain className="h-5 w-5 text-gray-400" />
                <h2 className="text-lg font-medium text-gray-900">Emotional Symptoms</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {assessment.symptoms.emotional.map((symptom, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                  >
                    {symptom}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-4">
                <Heart className="h-5 w-5 text-gray-400" />
                <h2 className="text-lg font-medium text-gray-900">Recommendations</h2>
              </div>
              <div className="space-y-4">
                {assessment.recommendations.map((rec, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-medium text-gray-900">{rec.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{rec.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 