/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import type { CareerFormData } from "@/app/api/predict/route";

interface CareerFormProps {
  onSubmit: (formData: CareerFormData) => void;
  isLoading?: boolean;
}

export default function CareerForm({
  onSubmit,
  isLoading = false,
}: CareerFormProps) {
  const [age, setAge] = useState("");
  const [educationLevel, setEducationLevel] = useState("");
  const [careerPreference, setCareerPreference] = useState("");

  // Skills
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [customSkill, setCustomSkill] = useState("");
  const [customSkills, setCustomSkills] = useState<string[]>([]);

  // Interests
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [customInterest, setCustomInterest] = useState("");
  const [customInterests, setCustomInterests] = useState<string[]>([]);

  const predefinedSkills = [
    { id: "programming", label: "Programming" },
    { id: "design", label: "Design" },
    { id: "writing", label: "Writing" },
    { id: "data analysis", label: "Data Analysis" },
    { id: "communication", label: "Communication" },
    { id: "data entry", label: "Data Entry" },
    { id: "leadership", label: "Leadership" },
    { id: "diagnosis", label: "Diagnosis" },
    { id: "curriculum development", label: "Curriculum Development" },
    { id: "creativity", label: "creativity" },
    { id: "public speaking", label: "Public Speaking" },
    { id: "leagal compliance", label: "Legal Compliance" },
  ];

  const predefinedInterests = [
    { id: "technology", label: "Technology" },
    { id: "medicine", label: "Medicine" },
    { id: "finance", label: "Finance" },
    { id: "education planning", label: "Education" },
    { id: "arts", label: "Arts & Entertainment" },
    { id: "science", label: "Science" },
    { id: "public health", label: "Public Health" },
    { id: "Mental health", label: "Mental Health" },
    { id: "surgery", label: "Surgery" },
    { id: "fashion", label: "Fashion" },
    { id: "research", label: "Research" },
    { id: "academic writing", label: "Academic writing" },
    { id: "art exhibitions", label: "Art Exibitions" },
    { id: "advertising", label: "Advertising" },
    { id: "content creation", label: "Content Creation" },
    { id: "public service", label: "Public Service" },
  ];

  const addCustomSkill = () => {
    const skillsToAdd = customSkill
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .filter((s) => s && !customSkills.includes(s));

    if (skillsToAdd.length > 0) {
      setCustomSkills([...customSkills, ...skillsToAdd]);
    }
  };

  const removeCustomSkill = (skill: string) => {
    setCustomSkills(customSkills.filter((s) => s !== skill));
  };

  const addCustomInterest = () => {
    const interestsToAdd = customInterest
      .split(",")
      .map((i) => i.trim().toLowerCase())
      .filter((i) => i && !customInterests.includes(i));

    if (interestsToAdd.length > 0) {
      setCustomInterests([...customInterests, ...interestsToAdd]);
    }
  };

  const removeCustomInterest = (interest: string) => {
    setCustomInterests(customInterests.filter((i) => i !== interest));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const formData: CareerFormData = {
      age,
      educationLevel,
      careerPreference,
      skills: [...selectedSkills, ...customSkills],
      interests: [...selectedInterests, ...customInterests],
    };

    onSubmit(formData);
  };

  const handleReset = () => {
    setAge("");
    setEducationLevel("");
    setCareerPreference("");
    setSelectedSkills([]);
    setCustomSkill("");
    setCustomSkills([]);
    setSelectedInterests([]);
    setCustomInterest("");
    setCustomInterests([]);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Career Matching Form</CardTitle>
        <CardDescription>
          Fill in your details to find career matches
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Age Input */}
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                placeholder="Enter your age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                required
              />
            </div>

            {/* Education Level Dropdown */}
            <div className="space-y-2">
              <Label htmlFor="education">Educational Level</Label>
              <Select
                value={educationLevel}
                onValueChange={setEducationLevel}
                required
              >
                <SelectTrigger id="education">
                  <SelectValue placeholder="Select your education level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bachelor">Bachelor's</SelectItem>
                  <SelectItem value="master">Master's</SelectItem>
                  <SelectItem value="phd">Phd</SelectItem>
                  <SelectItem value="UACE certificate">
                    UACE certificate
                  </SelectItem>
                  <SelectItem value="UCE certificate">
                    UCE certificate
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Skills Section */}
          <div className="space-y-4">
            <Label>Skills</Label>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {predefinedSkills.map((skill) => (
                <div key={skill.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`skill-${skill.id}`}
                    checked={selectedSkills.includes(skill.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedSkills([...selectedSkills, skill.id]);
                      } else {
                        setSelectedSkills(
                          selectedSkills.filter((s) => s !== skill.id),
                        );
                      }
                    }}
                  />
                  <Label htmlFor={`skill-${skill.id}`}>{skill.label}</Label>
                </div>
              ))}
            </div>

            {/* Custom Skills */}
            <div className="flex flex-col space-y-2">
              <Label htmlFor="custom-skill">Add Custom Skills</Label>
              <div className="flex space-x-2">
                <Input
                  id="custom-skill"
                  placeholder="Enter skills not listed above(separate with commas)"
                  value={customSkill}
                  onChange={(e) => setCustomSkill(e.target.value)}
                />
                <Button
                  type="button"
                  onClick={addCustomSkill}
                  variant="outline"
                >
                  Add
                </Button>
              </div>

              {customSkills.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {customSkills.map((skill, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {skill}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => removeCustomSkill(skill)}
                      />
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Interests Section */}
          <div className="space-y-4">
            <Label>Interests</Label>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {predefinedInterests.map((interest) => (
                <div key={interest.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`interest-${interest.id}`}
                    checked={selectedInterests.includes(interest.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedInterests([
                          ...selectedInterests,
                          interest.id,
                        ]);
                      } else {
                        setSelectedInterests(
                          selectedInterests.filter((i) => i !== interest.id),
                        );
                      }
                    }}
                  />
                  <Label htmlFor={`interest-${interest.id}`}>
                    {interest.label}
                  </Label>
                </div>
              ))}
            </div>

            {/* Custom Interests */}
            <div className="flex flex-col space-y-2">
              <Label htmlFor="custom-interest">Add Custom Interests</Label>
              <div className="flex space-x-2">
                <Input
                  id="custom-interest"
                  placeholder="Enter interests not listed above(separate with commas)"
                  value={customInterest}
                  onChange={(e) => setCustomInterest(e.target.value)}
                />
                <Button
                  type="button"
                  onClick={addCustomInterest}
                  variant="outline"
                >
                  Add
                </Button>
              </div>

              {customInterests.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {customInterests.map((interest, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {interest}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => removeCustomInterest(interest)}
                      />
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" onClick={handleReset}>
              Reset
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Processing..." : "Find Career Matches"}
            </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
}
