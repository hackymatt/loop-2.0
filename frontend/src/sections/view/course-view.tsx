"use client";

import { useSetState } from "minimal-shared/hooks";

import Grid from "@mui/material/Grid2";
import Divider from "@mui/material/Divider";
import Container from "@mui/material/Container";

import { _courses } from "src/_mock";
import { useReviews } from "src/api/review/reviews";
import { useSimilarCourses } from "src/api/course/similar";

import { ReviewList } from "../review/review-list";
import { NotFoundView } from "../error/not-found-view";
import { ReviewSummary } from "../review/review-summary";
import { CourseDetailsHero } from "../courses/course-details-hero";
import { CourseListSimilar } from "../courses/course-list-similar";
import { CourseDetailsSummary } from "../courses/course-details-summary";
import { CourseChatDetailsInfo } from "../courses/course-chat-details-info";
import { CourseDetailsTeachers } from "../courses/course-details-teachers-info";
import { CourseDetailsPrerequisites } from "../courses/course-prerequisites-info";
import { CourseCertificateDetailsInfo } from "../courses/course-certificate-details-info";

// ----------------------------------------------------------------------

export function CourseView({ slug }: { slug: string }) {
  const query = useSetState({
    page: "1",
  });

  // const { data: course, isError } = useCourse(slug);
  const course = _courses[0];
  const isError = false;
  const { data: reviews, count } = useReviews(slug);
  const { data: similarCourses } = useSimilarCourses(slug);

  const renderReview = () => (
    <>
      <ReviewSummary
        slug={slug}
        ratingNumber={course.ratingNumber}
        reviewNumber={course.totalReviews}
      />

      <Container>
        <ReviewList
          reviews={reviews || []}
          count={count ?? 0}
          page={Number(query.state.page) || 1}
          onPageChange={(selectedPage: number) => query.setField("page", String(selectedPage))}
        />
      </Container>
    </>
  );

  if (isError) {
    return <NotFoundView />;
  }

  return (
    <>
      <CourseDetailsHero
        slug={slug}
        name={course.name}
        level={course.level}
        teachers={course.teachers}
        category={course.category}
        technology={course.technology}
        totalPoints={course.totalPoints}
        totalHours={course.totalHours}
        description={course.description}
        ratingNumber={course.ratingNumber}
        totalReviews={course.totalReviews}
        totalExercises={course.totalExercises}
        totalVideos={course.totalVideos}
        totalQuizzes={course.totalQuizzes}
        totalLessons={course.totalLessons}
        totalStudents={course.totalStudents}
        progress={course.progress}
      />

      <Container sx={{ py: { xs: 5, md: 10 } }}>
        <Grid container spacing={{ xs: 5, md: 8 }}>
          <Grid size={{ xs: 12, md: 7, lg: 8 }}>
            {course && <CourseDetailsSummary course={course} />}
          </Grid>

          <Grid size={{ xs: 12, md: 5, lg: 4 }}>
            <CourseDetailsPrerequisites courses={course.prerequisites} sx={{ mb: 3 }} />

            <CourseDetailsTeachers teachers={course.teachers} sx={{ mb: 3 }} />

            <CourseCertificateDetailsInfo
              slug={slug}
              name={course.name}
              chapters={course.chapters}
              sx={{ mb: 3 }}
            />

            <CourseChatDetailsInfo slug={slug} chatUrl={course.chatUrl} />
          </Grid>
        </Grid>
      </Container>

      <Divider />

      {renderReview()}

      {!!similarCourses?.length && <CourseListSimilar courses={similarCourses} />}
    </>
  );
}
