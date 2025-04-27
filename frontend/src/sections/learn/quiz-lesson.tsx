import type { IQuizLessonProps } from "src/types/lesson";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

import {
  Box,
  Radio,
  Button,
  Divider,
  Checkbox,
  FormGroup,
  FormLabel,
  RadioGroup,
  Typography,
  FormControl,
  FormControlLabel,
} from "@mui/material";

import { QUIZ_TYPE } from "src/consts/lesson";
import { useAnalytics } from "src/app/analytics-provider";

// ----------------------------------------------------------------------

type QuizLessonProps = {
  lesson: IQuizLessonProps;
  onSubmit: (answer: boolean[]) => void;
  onShowAnswer: () => void;
  error?: string;
};

// ----------------------------------------------------------------------

export function QuizLesson({ lesson, onSubmit, onShowAnswer, error }: QuizLessonProps) {
  const { t } = useTranslation("learn");
  const { trackEvent } = useAnalytics();

  const { name, quizType, question, answer: userAnswer } = lesson;

  const isMultiple = quizType === QUIZ_TYPE.MULTI;
  const isCompleted = !!userAnswer;

  // Form state
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);

  useEffect(() => {
    const userOption = (userAnswer || [])
      .map((value, index) => (value ? index : -1))
      .filter((index) => index !== -1);

    setSelectedOption(userOption.length === 0 ? null : userOption[0]);
    setSelectedOptions(userOption);
  }, [userAnswer]);

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedOption(Number(event.target.value));
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const index = Number(event.target.value);
    const checked = event.target.checked;

    setSelectedOptions((prev) => (checked ? [...prev, index] : prev.filter((v) => v !== index)));
  };

  const handleSubmit = () => {
    const answer = question.options.map((_, index) =>
      isMultiple ? selectedOptions.includes(index) : selectedOption === index
    );
    onSubmit(answer);
  };

  const renderOptions = () =>
    isMultiple ? (
      <FormGroup>
        {question.options.map((option, index) => (
          <FormControlLabel
            key={index}
            control={
              <Checkbox
                value={index}
                checked={selectedOptions.includes(index)}
                onChange={handleCheckboxChange}
              />
            }
            label={option.text}
          />
        ))}
      </FormGroup>
    ) : (
      <RadioGroup
        value={selectedOption !== null ? selectedOption.toString() : ""}
        onChange={handleRadioChange}
      >
        {question.options.map((option, index) => (
          <FormControlLabel key={index} value={index} control={<Radio />} label={option.text} />
        ))}
      </RadioGroup>
    );

  const renderHeader = () => (
    <Box>
      <Typography variant="h4" gutterBottom>
        {name}
      </Typography>
      <Typography variant="subtitle2" color="text.secondary">
        🧠 {t("quiz.type.label")}: {isMultiple ? t("quiz.type.multi") : t("quiz.type.single")}
      </Typography>
    </Box>
  );

  const renderContent = () => (
    <Box sx={{ py: 2 }}>
      <FormControl>
        <FormLabel
          sx={{
            fontSize: "1.25rem",
            fontWeight: "bold",
            color: "primary.main",
            mb: 2,
          }}
        >
          {question.text}
        </FormLabel>
        {renderOptions()}
      </FormControl>
      {error && (
        <Typography variant="body2" color="error" sx={{ width: 1 }}>
          {error}
        </Typography>
      )}
    </Box>
  );

  const renderSubmitButton = () => (
    <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
      <Button
        variant="contained"
        color="primary"
        size="large"
        onClick={handleSubmit}
        disabled={isMultiple ? selectedOptions.length === 0 : selectedOption === null}
        sx={{ px: 2 }}
      >
        {t("quiz.submit")}
      </Button>
    </Box>
  );

  const renderAnswerButton = () => (
    <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
      <Button
        variant="text"
        color="inherit"
        size="large"
        onClick={() => {
          onShowAnswer();
          trackEvent({ category: "learn", label: "quiz", action: "showAnswer" });
        }}
        disabled={isCompleted}
        sx={{ px: 2 }}
      >
        {t("quiz.answer")}
      </Button>
    </Box>
  );

  const renderButtons = () => (
    <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
      {renderAnswerButton()}
      {renderSubmitButton()}
    </Box>
  );

  return (
    <>
      {renderHeader()}
      <Divider />
      {renderContent()}
      <Divider sx={{ mt: "auto" }} />
      {renderButtons()}
    </>
  );
}
