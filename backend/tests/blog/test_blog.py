from django.test import TestCase
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from blog.models import Blog, BlogTranslation
from blog.tag.models import Tag, TagTranslation
from blog.topic.models import Topic, TopicTranslation
from user.type.instructor_user.models import Instructor
from user.utils import get_unique_username
from rest_framework import status
from datetime import timedelta
from django.utils import timezone
from const import Urls, UserType


class BlogViewSetTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.url = f"/{Urls.API}/{Urls.POST}"

        # Create topic and its translation
        self.topic = Topic.objects.create(slug="tech")
        TopicTranslation.objects.create(
            topic=self.topic, language="en", name="Technology"
        )

        # Create tag and its translation
        self.tag = Tag.objects.create(slug="python")
        TagTranslation.objects.create(tag=self.tag, language="en", name="Python")

        # Create instructor
        self.instructor = Instructor.objects.create(
            user=get_user_model().objects.create_user(
                email="test@instructor.com",
                password="password",
                username="test",
                user_type=UserType.INSTRUCTOR,
                is_active=True,
            ),
        )

        # First blog post
        self.blog1 = Blog.objects.create(
            slug="introduction-to-python",
            topic=self.topic,
            author=self.instructor,
            published_at=timezone.now() + timedelta(weeks=1),
            active=True,
            visits=5,
        )
        self.blog1.tags.add(self.tag)

        self.blog1_translation = BlogTranslation.objects.create(
            blog=self.blog1,
            language="en",
            name="Introduction to Python",
            description="A beginner's guide to Python",
            content="Python content here.",
        )

        # Second blog post
        self.blog2 = Blog.objects.create(
            slug="advanced-python-tricks",
            topic=self.topic,
            author=self.instructor,
            published_at=timezone.now(),
            active=True,
            visits=10,  # This one has higher visit count
        )
        self.blog2.tags.add(self.tag)

        self.blog2_translation = BlogTranslation.objects.create(
            blog=self.blog2,
            language="en",
            name="Advanced Python Tricks",
            description="Advanced tips and tricks in Python",
            content="Advanced content here.",
        )

        self.admin_data = {"email": "admin@example.com", "password": "admin123"}
        self.admin_user = get_user_model().objects.create_user(
            username=get_unique_username(self.admin_data["email"]),
            email=self.admin_data["email"],
            password=self.admin_data["password"],
            user_type=UserType.ADMIN,
            is_active=True,
        )

        # Create regular user
        self.regular_user_data = {"email": "user@example.com", "password": "user123"}
        self.regular_user = get_user_model().objects.create_user(
            username=get_unique_username(self.regular_user_data["email"]),
            email=self.regular_user_data["email"],
            password=self.regular_user_data["password"],
            is_active=True,
        )

    def test_blog_list(self):
        # Test the list view of BlogViewSet
        response = self.client.get(self.url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 1)
        self.assertEqual(response.data["results"][0]["slug"], self.blog1.slug)

    def test_blog_list_with_no_most_visited(self):
        # Deactivate all blogs to simulate no most_visited blog
        Blog.objects.all().update(active=False)

        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["results"], [])

    def test_blog_detail(self):
        # Test the detail view of BlogViewSet
        response = self.client.get(f"{self.url}/{self.blog1.slug}")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["slug"], self.blog1.slug)
        self.assertEqual(response.data["translated_name"], self.blog1_translation.name)
        self.assertEqual(
            response.data["translated_description"], self.blog1_translation.description
        )

    def test_blog_filter_by_category(self):
        # Test filtering blogs by category (topic)
        response = self.client.get(f"{self.url}?category={self.topic.slug}")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 1)

    def test_blog_filter_by_tags(self):
        # Test filtering blogs by tags
        response = self.client.get(f"{self.url}?tags={self.tag.slug}")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 1)

    def test_blog_list_with_invalid_filter(self):
        # Use an invalid filter parameter, e.g., "invalid_param"
        response = self.client.get(f"{self.url}?invalid_param=value")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Ensure the original queryset is returned despite the invalid filter
        self.assertEqual(len(response.data["results"]), 1)
        self.assertEqual(response.data["results"][0]["slug"], self.blog1.slug)

    def test_blog_most_visited(self):
        # Test to see if the most visited blog is excluded from the recent blogs list
        self.blog1.visits = 10
        self.blog1.save()

        # Add another blog with fewer visits
        another_blog = Blog.objects.create(
            slug="another-blog",
            topic=self.topic,
            author=self.instructor,
            published_at=timezone.now(),
            active=True,
            visits=5,
        )
        another_blog.tags.add(self.tag)
        BlogTranslation.objects.create(
            blog=another_blog,
            language="en",
            name="Introduction to Python",
            description="A beginner's guide to Python",
            content="Python content here.",
        )

        response = self.client.get(self.url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            len(response.data["results"]), 2
        )  # The most visited blog should be excluded
        self.assertEqual(response.data["results"][0]["slug"], another_blog.slug)


class RecentBlogsViewTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.url = f"/{Urls.API}/{Urls.RECENT_POST}"  # adjust to your actual RecentBlogsView URL

        # Topic and tag
        self.topic = Topic.objects.create(slug="tech")
        TopicTranslation.objects.create(
            topic=self.topic, language="en", name="Technology"
        )

        self.tag = Tag.objects.create(slug="python")
        TagTranslation.objects.create(tag=self.tag, language="en", name="Python")

        # Instructor
        self.instructor = Instructor.objects.create(
            user=get_user_model().objects.create_user(
                email="test@instructor.com",
                password="password",
                username="test",
                user_type=UserType.INSTRUCTOR,
                is_active=True,
            )
        )

        # Blog 1 (higher visits)
        self.blog1 = Blog.objects.create(
            slug="most-visited-blog",
            topic=self.topic,
            author=self.instructor,
            published_at=timezone.now(),
            active=True,
            visits=20,
        )
        self.blog1.tags.add(self.tag)
        BlogTranslation.objects.create(
            blog=self.blog1,
            language="en",
            name="Most Visited Blog",
            description="This is the most visited blog.",
            content="Content of the most visited blog.",
        )

        # Blog 2
        self.blog2 = Blog.objects.create(
            slug="recent-blog-1",
            topic=self.topic,
            author=self.instructor,
            published_at=timezone.now() - timezone.timedelta(days=1),
            active=True,
            visits=5,
        )
        self.blog2.tags.add(self.tag)
        BlogTranslation.objects.create(
            blog=self.blog2,
            language="en",
            name="Recent Blog 1",
            description="A recent blog post.",
            content="Some content here.",
        )

        # Blog 3
        self.blog3 = Blog.objects.create(
            slug="recent-blog-2",
            topic=self.topic,
            author=self.instructor,
            published_at=timezone.now() - timezone.timedelta(days=2),
            active=True,
            visits=7,
        )
        self.blog3.tags.add(self.tag)
        BlogTranslation.objects.create(
            blog=self.blog3,
            language="en",
            name="Recent Blog 2",
            description="Another recent blog post.",
            content="More content here.",
        )

    def test_recent_blogs_excludes_most_visited(self):
        response = self.client.get(self.url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        returned_slugs = [blog["slug"] for blog in response.data]
        self.assertNotIn(self.blog1.slug, returned_slugs)
        self.assertIn(self.blog2.slug, returned_slugs)
        self.assertIn(self.blog3.slug, returned_slugs)

    def test_recent_blogs_returns_up_to_five(self):
        # Create 4 more recent blogs to reach 6 total (1 will be excluded)
        for i in range(4):
            blog = Blog.objects.create(
                slug=f"recent-blog-{i+4}",
                topic=self.topic,
                author=self.instructor,
                published_at=timezone.now() - timezone.timedelta(days=i + 3),
                active=True,
                visits=1,
            )
            blog.tags.add(self.tag)
            BlogTranslation.objects.create(
                blog=blog,
                language="en",
                name=f"Recent Blog {i+4}",
                description="Desc",
                content="Content",
            )

        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 5)  # limited to 5, most visited excluded

    def test_recent_blogs_when_no_active_blogs(self):
        Blog.objects.all().update(active=False)

        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, [])  # no active blogs means empty list


class FeaturedBlogViewTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.url = f"/{Urls.API}/{Urls.FEATURED_POST}"  # replace with your actual featured blog endpoint

        # Topic and tag
        self.topic = Topic.objects.create(slug="tech")
        TopicTranslation.objects.create(
            topic=self.topic, language="en", name="Technology"
        )

        self.tag = Tag.objects.create(slug="python")
        TagTranslation.objects.create(tag=self.tag, language="en", name="Python")

        # Instructor
        self.instructor = Instructor.objects.create(
            user=get_user_model().objects.create_user(
                email="test@instructor.com",
                password="password",
                username="test",
                user_type=UserType.INSTRUCTOR,
                is_active=True,
            )
        )

        # Blog 1 (lower visits)
        self.blog1 = Blog.objects.create(
            slug="python-basics",
            topic=self.topic,
            author=self.instructor,
            published_at=timezone.now(),
            active=True,
            visits=5,
        )
        self.blog1.tags.add(self.tag)
        BlogTranslation.objects.create(
            blog=self.blog1,
            language="en",
            name="Python Basics",
            description="Basics of Python",
            content="Some content",
        )

        # Blog 2 (higher visits — should be featured)
        self.blog2 = Blog.objects.create(
            slug="deep-dive-python",
            topic=self.topic,
            author=self.instructor,
            published_at=timezone.now(),
            active=True,
            visits=20,
        )
        self.blog2.tags.add(self.tag)
        BlogTranslation.objects.create(
            blog=self.blog2,
            language="en",
            name="Deep Dive into Python",
            description="Advanced topics",
            content="Advanced content",
        )

    def test_featured_blog_is_most_visited(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["slug"], self.blog2.slug)
        self.assertEqual(response.data["translated_name"], "Deep Dive into Python")

    def test_featured_blog_when_no_blogs(self):
        Blog.objects.all().delete()

        response = self.client.get(self.url)
        # Adjust this part depending on your API's actual behavior
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response.data,
            {"slug": "", "name": "", "language": "", "published_at": None},
        )
