"use client";

import type { IProductItemProps } from "src/types/product";

import { useBoolean } from "minimal-shared/hooks";

import Grid from "@mui/material/Grid2";
import Container from "@mui/material/Container";

import { _reviews } from "src/_mock";

import { CustomBreadcrumbs } from "src/components/custom-breadcrumbs";

import { EcommerceReviewList } from "../review/ecommerce-review-list";
import { EcommerceReviewSummary } from "../review/ecommerce-review-summary";
import { EcommerceProductDetailsInfo } from "../product/details/ecommerce-product-details-info";
import { EcommerceProductDetailsCarousel } from "../product/details/ecommerce-product-details-carousel";

// ----------------------------------------------------------------------

type ViewProps = {
  product?: IProductItemProps;
};

export function EcommerceProductView({ product }: ViewProps) {
  const openReviewForm = useBoolean();

  const renderReview = () => (
    <>
      <EcommerceReviewSummary
        ratingNumber={4.1}
        reviewNumber={123456}
        onOpenForm={openReviewForm.onTrue}
      />

      <Container>
        <EcommerceReviewList reviews={_reviews} />
      </Container>
    </>
  );

  return (
    <>
      <Container sx={{ overflow: "hidden" }}>
        <CustomBreadcrumbs
          links={[{ name: "Home" }, { name: "Mobile Phones" }, { name: "Apple iPhone 14" }]}
          sx={{ my: 5 }}
        />

        <Grid container spacing={{ xs: 5, md: 8 }}>
          <Grid size={{ xs: 12, md: 6, lg: 7 }}>
            <EcommerceProductDetailsCarousel images={product?.images || []} />
          </Grid>

          <Grid size={{ xs: 12, md: 6, lg: 5 }}>
            <EcommerceProductDetailsInfo
              name={product?.name || ""}
              price={product?.price || 0}
              caption={product?.caption || ""}
              priceSale={product?.priceSale || 0}
              ratingNumber={product?.ratingNumber || 0}
              totalReviews={product?.totalReviews || 0}
            />
          </Grid>
        </Grid>
      </Container>
      {renderReview()}
    </>
  );
}
