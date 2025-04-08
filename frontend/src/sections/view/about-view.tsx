"use client";

import { _faqs } from "src/_mock";
import { useRecentPosts } from "src/api/blog/recent";
import { useFeaturedPost } from "src/api/blog/featured";
import { useFeaturedReviews } from "src/api/review/featured";

import { Faqs } from "../faqs";
import { Testimonial } from "../testimonial";
import { AboutHero } from "../about/about-hero";
import { LatestPosts } from "../posts/latest-posts";
import { AboutCoreValues } from "../about/about-core-values";
import { AboutOurMission } from "../about/about-our-mission";

// ----------------------------------------------------------------------

export function AboutView() {
  const { data: featuredReviews } = useFeaturedReviews();
  const { data: featuredPost } = useFeaturedPost();
  const { data: recentPosts } = useRecentPosts();

  return (
    <>
      <AboutHero />

      <AboutOurMission />

      <AboutCoreValues sx={{ bgcolor: "background.neutral" }} />

      {!!featuredReviews?.length && <Testimonial testimonials={featuredReviews || []} />}

      <Faqs data={_faqs} />

      {featuredPost && !!recentPosts?.length && (
        <LatestPosts
          largePost={featuredPost}
          smallPosts={recentPosts}
          sx={{ bgcolor: "background.neutral" }}
        />
      )}
    </>
  );
}
