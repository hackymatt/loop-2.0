import type { BoxProps } from "@mui/material";
import type { IQuizLessonProps } from "src/types/lesson";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

import {
  Box,
  Radio,
  Button,
  Checkbox,
  FormGroup,
  FormLabel,
  RadioGroup,
  Typography,
  FormControl,
  FormControlLabel,
} from "@mui/material";

import { QUIZ_TYPE } from "src/consts/lesson";

import { ComponentBox } from "./component-box";

// ----------------------------------------------------------------------

type QuizLessonProps = BoxProps & {
  lesson: IQuizLessonProps;
  onSubmit: (answer: boolean[]) => void;
  onShowAnswer: () => void;
  error?: string;
};

// ----------------------------------------------------------------------

export function QuizLesson({
  lesson,
  onSubmit,
  onShowAnswer,
  error,
  sx,
  ...other
}: QuizLessonProps) {
  const { t } = useTranslation("learn");
  const { quizType, question, answer: userAnswer } = lesson;

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

  const renderContent = () => (
    <ComponentBox sx={{ py: 2 }}>
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
    </ComponentBox>
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
        onClick={onShowAnswer}
        disabled={isCompleted}
        sx={{ px: 2 }}
      >
        {t("quiz.answer")}
      </Button>
    </Box>
  );

  return (
    <Box
      component="section"
      sx={[
        { overflow: "hidden", gap: 3, p: 1, display: "flex", flexDirection: "column" },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      {renderContent()}

      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
        {renderAnswerButton()}
        {renderSubmitButton()}
      </Box>
    </Box>
  );
}
