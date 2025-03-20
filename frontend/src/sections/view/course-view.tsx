"use client";

import { useMemo } from "react";

import Grid from "@mui/material/Grid2";
import Divider from "@mui/material/Divider";
import Container from "@mui/material/Container";

import { _courses, _reviews } from "src/_mock";

import { ReviewList } from "../review/review-list";
import { ReviewSummary } from "../review/review-summary";
import { CourseDetailsHero } from "../courses/course-details-hero";
import { CourseListSimilar } from "../courses/course-list-similar";
import { CourseDetailsSummary } from "../courses/course-details-summary";
import { CourseChatDetailsInfo } from "../courses/course-chat-details-info";
import { CourseDetailsTeachers } from "../courses/course-details-teachers-info";
import { CourseCertificateDetailsInfo } from "../courses/course-certificate-details-info";

// ----------------------------------------------------------------------

const course = _courses[0];
const relatedCourses = _courses.slice(0, 3);
export function CourseView() {
  const totalLessons = useMemo(
    () => course.chapters.reduce((total, chapter) => total + chapter.lessons.length, 0),
    []
  );

  const renderReview = () => (
    <>
      <ReviewSummary ratingNumber={4.1} reviewNumber={123456} />

      <Container>
        <ReviewList reviews={_reviews} />
      </Container>
    </>
  );

  return (
    <>
      <CourseDetailsHero
        slug={course?.slug || ""}
        title={course?.title || ""}
        level={course?.level || ""}
        teachers={course?.teachers || []}
        category={course?.category || ""}
        technology={course?.technology || ""}
        totalPoints={course?.totalPoints || 0}
        totalHours={course?.totalHours || 0}
        description={course?.description || ""}
        ratingNumber={course?.ratingNumber || 0}
        totalReviews={course?.totalReviews || 0}
        totalExercises={course?.totalExercises || 0}
        totalVideos={course?.totalVideos || 0}
        totalQuizzes={course?.totalQuizzes || 0}
        totalLessons={totalLessons}
        totalStudents={course?.totalStudents || 0}
      />

      <Container sx={{ py: { xs: 5, md: 10 } }}>
        <Grid container spacing={{ xs: 5, md: 8 }}>
          <Grid size={{ xs: 12, md: 7, lg: 8 }}>
            <CourseDetailsSummary course={course} />
          </Grid>

          <Grid size={{ xs: 12, md: 5, lg: 4 }}>
            <CourseDetailsTeachers teachers={course?.teachers || []} sx={{ mb: 3 }} />

            <CourseCertificateDetailsInfo
              slug={course?.slug || ""}
              title={course?.title || ""}
              sx={{ mb: 3 }}
            />

            <CourseChatDetailsInfo slug={course?.slug || ""} />
          </Grid>
        </Grid>
      </Container>
      <Divider />

      {renderReview()}

      {!!relatedCourses?.length && <CourseListSimilar courses={relatedCourses} />}
    </>
  );
}
