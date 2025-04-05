"use client";

import { _faqs, _coursePosts } from "src/_mock";
import { useFeaturedReviews } from "src/api/review/featured";

import { Faqs } from "../faqs";
import { Testimonial } from "../testimonial";
import { AboutHero } from "../about/about-hero";
import { LatestPosts } from "../posts/latest-posts";
import { AboutCoreValues } from "../about/about-core-values";
import { AboutOurMission } from "../about/about-our-mission";

// ----------------------------------------------------------------------

const latestPosts = _coursePosts.slice(0, 5);

export function AboutView() {
  const { data: featuredReviews } = useFeaturedReviews();
  return (
    <>
      <AboutHero />

      <AboutOurMission />

      <AboutCoreValues sx={{ bgcolor: "background.neutral" }} />

      {!!featuredReviews?.length && <Testimonial testimonials={featuredReviews ?? []} />}

      <Faqs data={_faqs} />

      <LatestPosts
        largePost={latestPosts[0]}
        smallPosts={latestPosts.slice(1, 5)}
        sx={{ bgcolor: "background.neutral" }}
      />
    </>
  );
}
