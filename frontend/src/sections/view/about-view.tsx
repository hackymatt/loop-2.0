"use client";

import { _coursePosts, _testimonials } from "src/_mock";

import { Testimonial } from "../testimonial";
import { AboutHero } from "../about/about-hero";
import { AboutFaqs } from "../about/about-faqs";
import { LatestPosts } from "../posts/latest-posts";
import { AboutCoreValues } from "../about/core-values";
import { AboutOurVision } from "../about/about-our-mission";

// ----------------------------------------------------------------------

const latestPosts = _coursePosts.slice(0, 5);

export function AboutView() {
  return (
    <>
      <AboutHero />

      <AboutOurVision />

      <AboutCoreValues />

      <Testimonial testimonials={_testimonials} />

      <AboutFaqs />

      <LatestPosts largePost={latestPosts[0]} smallPosts={latestPosts.slice(1, 5)} />
    </>
  );
}
