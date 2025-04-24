"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CareerForm from "@/components/main/careers/career-form";
import TrendingCareers from "@/components/main/careers/trending-careers";
import CareerResults from "@/components/main/careers/career-results";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface CareerFormData {
  age: string;
  educationLevel: string;
  careerPreference: string;
  skills: string[];
  interests: string[];
}

interface CareerResult {
  title: string;
  matchScore: number;
  description: string;
  requiredSkills: string[];
  industryType: string;
}

export default function CareerPage() {
  const [showResults, setShowResults] = useState(false);
  const [careerResults, setCareerResults] = useState<CareerResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFormSubmit = async (formData: CareerFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      console.log("Submitting form data:", formData);

      // Call the API route to submit the form data to the backend
      const response = await fetch("https://backend-cdie.onrender.com/api/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const responseData = await response.json();
      console.log("API response:", responseData);

      const recommendations = responseData.recommendations;

      // Check if results is an array
      if (!Array.isArray(recommendations)) {
        console.error("Expected array of results but got:", responseData);
        setError("Received invalid data format from server");
        setCareerResults([]);
      } else {
        setCareerResults(recommendations);
        setShowResults(true);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setError("Failed to get career matches. Please try again later.");
      setCareerResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const resetResults = () => {
    setShowResults(false);
    setError(null);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">Career Matching Portal</h1>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {!showResults ? (
        <Tabs defaultValue="matching" className="w-full">
          <TabsList className="mb-8 grid w-full grid-cols-2">
            <TabsTrigger value="matching">Career Matching</TabsTrigger>
            <TabsTrigger value="trending">Trending Careers</TabsTrigger>
          </TabsList>

          <TabsContent value="matching">
            <CareerForm onSubmit={handleFormSubmit} isLoading={isLoading} />
          </TabsContent>

          <TabsContent value="trending">
            <TrendingCareers />
          </TabsContent>
        </Tabs>
      ) : (
        <div>
          <button
            onClick={resetResults}
            className="mb-6 flex items-center text-sm font-medium text-muted-foreground hover:text-primary"
          >
            ← Back to form
          </button>
          <CareerResults results={careerResults} />
        </div>
      )}
    </div>
  );
}
