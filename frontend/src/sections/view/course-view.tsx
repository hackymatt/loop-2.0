"use client";

import Grid from "@mui/material/Grid2";
import Divider from "@mui/material/Divider";
import Container from "@mui/material/Container";

import { _courses, _reviews } from "src/_mock";

import { ReviewList } from "../review/review-list";
import { ReviewSummary } from "../review/review-summary";
import { CourseDetailsHero } from "../courses/course-details-hero";
import { CourseDetailsInfo } from "../courses/course-details-info";
import { CourseListSimilar } from "../courses/course-list-similar";
import { CourseDetailsSummary } from "../courses/course-details-summary";
import { CourseDetailsTeachers } from "../courses/course-details-teachers-info";

// ----------------------------------------------------------------------

const course = _courses[0];
const relatedCourses = _courses.slice(0, 3);
export function CourseView() {
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
        level={course?.level || ""}
        teachers={course?.teachers || []}
        category={course?.category || ""}
        technology={course?.technology || ""}
        coverUrl={course?.coverUrl || ""}
        languages={course?.languages || []}
        isBestSeller={course?.isBestSeller || false}
        totalPoints={course?.totalPoints || 0}
        totalHours={course?.totalHours || 0}
        description={course?.description || ""}
        ratingNumber={course?.ratingNumber || 0}
        totalReviews={course?.totalReviews || 0}
        totalExercises={course?.totalExercises || 0}
        totalVideos={course?.totalVideos || 0}
        totalQuizzes={course?.totalQuizzes || 0}
        totalLessons={course?.lessons.length || 0}
        totalStudents={course?.totalStudents || 0}
      />

      <Container sx={{ py: { xs: 5, md: 10 } }}>
        <Grid container spacing={{ xs: 5, md: 8 }}>
          <Grid size={{ xs: 12, md: 7, lg: 8 }}>
            <CourseDetailsSummary lessons={course?.lessons || []} />
          </Grid>

          <Grid size={{ xs: 12, md: 5, lg: 4 }}>
            <CourseDetailsTeachers teachers={course?.teachers || []} sx={{ mb: 3 }} />

            <CourseDetailsInfo
              price={course?.price || 0}
              priceSale={course?.priceSale || 0}
              resources={course?.resources || 0}
              totalLessons={course?.lessons.length || 0}
            />
          </Grid>
        </Grid>
      </Container>
      <Divider />

      {renderReview()}

      {!!relatedCourses?.length && <CourseListSimilar courses={relatedCourses} />}
    </>
  );
}
