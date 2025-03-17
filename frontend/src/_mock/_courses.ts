import type { ICourseLessonType } from "src/types/course";

import dayjs from "dayjs";

import { _mock } from "./_mock";
import { _tags } from "./assets";

// ----------------------------------------------------------------------

const TEACHERS = Array.from({ length: 8 }, (_, index) => ({
  id: _mock.id(index),
  totalCourses: 48,
  totalReviews: 3458,
  totalStudents: 18000,
  role: _mock.role(index),
  name: _mock.fullName(index),
  avatarUrl: _mock.image.avatar(index),
  ratingNumber: _mock.number.rating(index),
}));

function slugify(text: string): string {
  return text
    .toLowerCase() // Zamiana na małe litery
    .normalize("NFD") // Normalizacja znaków diakrytycznych
    .replace(/[\u0300-\u036f]/g, "") // Usunięcie akcentów
    .replace(/[^a-z0-9\s-]/g, "") // Usunięcie znaków specjalnych
    .replace(/\s+/g, "-") // Zamiana spacji na myślniki
    .replace(/-+/g, "-") // Usunięcie wielokrotnych myślników
    .trim(); // Usunięcie zbędnych spacji na początku i końcu
}

const getType = (index: number): ICourseLessonType => {
  const types = ["article", "video", "exercise", "test"];
  return types[index % types.length] as ICourseLessonType;
};

const LESSONS = Array.from({ length: 9 }, (_, index) => ({
  id: _mock.id(index),
  totalPoints: 60 - index,
  slug: slugify(`Lesson ${index + 1}`),
  title: `Lesson ${index + 1}`,
  description: _mock.sentence(index),
  type: getType(index),
}));

const CHAPTERS = Array.from({ length: 9 }, (_, index) => ({
  id: _mock.id(index),
  title: `Chapter ${index + 1}`,
  slug: slugify(`Chapter ${index + 1}`),
  description: _mock.sentence(index),
  lessons: LESSONS,
}));

const getPrice = (index: number) => (index % 2 ? 159.99 : 269.99);

const getPriceSale = (index: number) => {
  if (index === 2) return 89.99;
  if (index === 5) return 69.99;
  return 0;
};

const getTeachers = (index: number) => {
  if (index === 0) return TEACHERS.slice(0, 5);
  if (index === 1) return TEACHERS.slice(3, 7);
  if (index === 2) return TEACHERS.slice(5, 7);
  return [TEACHERS[4]];
};

const getLevel = (index: number) => {
  if (index % 2) return "Intermediate";
  if (index % 4) return "Advanced";
  if (index % 5) return "All levels";
  return "Beginner";
};

const getLearnList = () => [
  "A fermentum in morbi pretium aliquam adipiscing donec tempus.",
  "Vulputate placerat amet pulvinar lorem nisl.",
  "Consequat feugiat habitant gravida quisque elit bibendum id adipiscing sed.",
  "Etiam duis lobortis in fames ultrices commodo nibh.",
  "Fusce neque. Nulla neque dolor, sagittis eget, iaculis quis, molestie non, velit.",
  "Curabitur a felis in nunc fringilla tristique. Praesent congue erat at massa.",
];

// ----------------------------------------------------------------------

export const _courses = Array.from({ length: 12 }, (_, index) => ({
  id: _mock.id(index),
  chatUrl: "https://loop.edu.pl",
  totalHours: 100,
  totalPoints: 3459,
  chapters: CHAPTERS,
  totalQuizzes: 4,
  totalExercises: 10,
  totalVideos: 6,
  totalReviews: 3458,
  totalStudents: 180000,
  level: getLevel(index),
  technology: "Python",
  category: _tags[index],
  teachers: getTeachers(index),
  title: _mock.courseNames(index),
  slug: slugify(_mock.courseNames(index)),
  coverUrl: _mock.image.course(index),
  createdAt: dayjs(new Date()).format(),
  description: _mock.description(index),
  overview: _mock.description(index),
  ratingNumber: _mock.number.rating(index),
}));

export const _coursesByCategories = Array.from({ length: 9 }, (_, index) => ({
  id: _mock.id(index),
  name: _tags[index],
  totalStudents: _mock.number.nativeM(index),
}));
