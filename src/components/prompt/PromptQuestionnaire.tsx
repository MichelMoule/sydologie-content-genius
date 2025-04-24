
import React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import type { Question, QuestionAnswer } from "./types";

interface PromptQuestionnaireProps {
  question: Question;
  onAnswer: (answer: string) => void;
  isLastQuestion: boolean;
}

export function PromptQuestionnaire({ question, onAnswer, isLastQuestion }: PromptQuestionnaireProps) {
  const [answer, setAnswer] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (answer.trim()) {
      onAnswer(answer);
      setAnswer("");
    }
  };

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle className="text-lg font-medium">{question.text}</CardTitle>
        </CardHeader>
        <CardContent>
          {question.type === 'choice' && question.choices ? (
            <RadioGroup onValueChange={setAnswer} className="space-y-2">
              {question.choices.map((choice) => (
                <div key={choice} className="flex items-center space-x-2">
                  <RadioGroupItem value={choice} id={choice} />
                  <Label htmlFor={choice}>{choice}</Label>
                </div>
              ))}
            </RadioGroup>
          ) : (
            <Textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Votre réponse..."
              className="min-h-[100px]"
            />
          )}
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button type="submit" disabled={!answer.trim()}>
            {isLastQuestion ? "Générer le prompt" : "Question suivante"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
