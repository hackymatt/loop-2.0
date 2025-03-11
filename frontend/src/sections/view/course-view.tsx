"use client";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Container from "@mui/material/Container";

import { _mock, _courses, _socials } from "src/_mock";
import { TwitterIcon, FacebookIcon, LinkedinIcon, InstagramIcon } from "src/assets/icons";

import { Advertisement } from "../advertisement";
// import { ReviewSummary } from "../../review/review-summary";
// import { ReviewNewForm } from "../../review/review-new-form";
// import { ReviewList } from "../review/elearning-review-list";
import { CourseDetailsHero } from "../courses/course-details-hero";
import { CourseDetailsInfo } from "../courses/course-details-info";
// import { ReviewToolbar } from "../review/elearning-review-toolbar";
import { CourseListSimilar } from "../courses/course-list-similar";
import { CourseDetailsSummary } from "../courses/course-details-summary";
import { CourseDetailsTeachers } from "../courses/course-details-teachers-info";

// ----------------------------------------------------------------------

const course = _courses[0];
const relatedCourses = _courses.slice(0, 3);
export function CourseView() {
  const renderSocials = () => (
    <Box sx={{ gap: 1.5, display: "flex", mt: 5 }}>
      <Box component="span" sx={{ lineHeight: "30px", typography: "subtitle2" }}>
        Share:
      </Box>

      <Box sx={{ gap: 1, display: "flex", alignItems: "center", flexWrap: "wrap" }}>
        {_socials.map((social) => (
          <Button
            key={social.value}
            size="small"
            variant="outlined"
            startIcon={
              <>
                {social.value === "twitter" && <TwitterIcon />}
                {social.value === "facebook" && <FacebookIcon />}
                {social.value === "instagram" && <InstagramIcon />}
                {social.value === "linkedin" && <LinkedinIcon />}
              </>
            }
          >
            {social.label}
          </Button>
        ))}
      </Box>
    </Box>
  );

  const renderReviews = () => (
    <>
      <Container sx={{ overflow: "hidden", pt: 10 }}>
        <Grid size={{ xs: 12, md: 7, lg: 8 }}>
          {/* <ReviewToolbar sort={sort} onChangeSort={handleChangeSort} /> */}
        </Grid>

        <Grid container spacing={8} direction="row-reverse">
          <Grid size={{ xs: 12, md: 5, lg: 4 }}>
            {/* <ReviewSummary
              ratingNumber={4.1}
              reviewNumber={123456}
              onOpenForm={openReviewForm.onTrue}
            /> */}
          </Grid>

          <Grid size={{ xs: 12, md: 7, lg: 8 }}>{/* <ReviewList reviews={_reviews} /> */}</Grid>
        </Grid>
      </Container>

      {/* <ReviewNewForm open={openReviewForm.value} onClose={openReviewForm.onFalse} /> */}
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
        totalHours={course?.totalHours || 0}
        description={course?.description || ""}
        ratingNumber={course?.ratingNumber || 0}
        totalReviews={course?.totalReviews || 0}
        totalExercises={course?.totalExercises || 0}
        totalArticles={course?.totalArticles || 0}
        totalVideos={course?.totalVideos || 0}
        totalQuizzes={course?.totalQuizzes || 0}
        totalLessons={course?.lessons.length || 0}
        totalStudents={course?.totalStudents || 0}
      />

      <Container sx={{ py: { xs: 5, md: 10 } }}>
        <Grid container spacing={{ xs: 5, md: 8 }}>
          <Grid size={{ xs: 12, md: 7, lg: 8 }}>
            <CourseDetailsSummary
              lessons={course?.lessons || []}
              learnList={course?.learnList || []}
              skills={course?.skills || []}
            />

            {renderSocials()}

            <Divider sx={{ my: 5 }} />

            <CourseDetailsTeachers teachers={course?.teachers || []} />
          </Grid>

          <Grid size={{ xs: 12, md: 5, lg: 4 }}>
            <CourseDetailsInfo
              price={course?.price || 0}
              priceSale={course?.priceSale || 0}
              resources={course?.resources || 0}
              totalLessons={course?.lessons.length || 0}
              sx={{ mb: 5 }}
            />

            <Advertisement
              title="Advertisement"
              description="Duis leo. Donec orci lectus, aliquam ut, faucibus non"
              imageUrl={_mock.image.course(9)}
              action={
                <Button variant="contained" color="primary">
                  Go now
                </Button>
              }
            />
          </Grid>
        </Grid>
      </Container>
      <Divider />

      {renderReviews()}

      {!!relatedCourses?.length && <CourseListSimilar courses={relatedCourses} />}
    </>
  );
}
