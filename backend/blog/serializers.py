import math
import re
import markdown
from bs4 import BeautifulSoup
from rest_framework import serializers
from .models import Blog, BlogTranslation
from .topic.serializers import TopicSerializer
from .tag.serializers import TagSerializer
from user.type.instructor_user.serializers import InstructorSerializer

class BlogNavSerializer(serializers.ModelSerializer):
    translated_name = serializers.SerializerMethodField()
    image = serializers.ImageField(
        read_only=True
    )

    class Meta:
        model = Blog
        fields = [
            "slug",
            "translated_name",
            "image",
       
        ]

    def _get_translation(self, obj, field):
        lang = self.context.get("request").LANGUAGE_CODE
        translation = obj.translations.filter(language=lang).first()
        return getattr(translation, field, None) if translation else None

    def get_translated_name(self, obj):
        return self._get_translation(obj, "name")
    
    def get_duration(self, obj):
        content = self._get_translation(obj, "content")
        html = markdown.markdown(content)

        # Strip HTML tags
        soup = BeautifulSoup(html, features="html.parser")
        plain_text = soup.get_text()

        # Count words
        words = re.findall(r'\w+', plain_text)
        return math.ceil(len(words) / 200)  # Assuming 200 words per minute

class BaseBlogSerializer(serializers.ModelSerializer):
    name = serializers.CharField(write_only=True)
    language = serializers.CharField(write_only=True)
    translated_name = serializers.SerializerMethodField()
    topic = TopicSerializer(read_only=True)
    duration = serializers.SerializerMethodField()
    image = serializers.ImageField(
        read_only=True
    )

    class Meta:
        model = Blog
        fields = [
            "slug",
            "name",
            "language",
            "translated_name",
            "topic",
            "image",
            "published_at",
            "duration",           
        ]

    def _get_translation(self, obj, field):
        lang = self.context.get("request").LANGUAGE_CODE
        translation = obj.translations.filter(language=lang).first()
        return getattr(translation, field, None) if translation else None

    def get_translated_name(self, obj):
        return self._get_translation(obj, "name")
    
    def get_duration(self, obj):
        content = self._get_translation(obj, "content")
        html = markdown.markdown(content)

        # Strip HTML tags
        soup = BeautifulSoup(html, features="html.parser")
        plain_text = soup.get_text()

        # Count words
        words = re.findall(r'\w+', plain_text)
        return math.ceil(len(words) / 200)  # Assuming 200 words per minute


class BlogRecentSerializer(BaseBlogSerializer):
    pass


class BlogListSerializer(BaseBlogSerializer):
    translated_description = serializers.SerializerMethodField()
    author = InstructorSerializer(read_only=True)

    class Meta(BaseBlogSerializer.Meta):
        fields = BaseBlogSerializer.Meta.fields + [
            "translated_description",
            "author",
        ]

    def get_translated_description(self, obj):
        return self._get_translation(obj, "description")


class BlogRetrieveSerializer(BaseBlogSerializer):
    translated_description = serializers.SerializerMethodField()
    translated_content = serializers.SerializerMethodField()
    author = InstructorSerializer(read_only=True)
    tags = TagSerializer(many=True, read_only=True)
    prev = serializers.SerializerMethodField()
    next = serializers.SerializerMethodField()

    class Meta(BaseBlogSerializer.Meta):
        fields = BaseBlogSerializer.Meta.fields + [
            "translated_description",
            "translated_content",
            "author",
            "tags",
            "prev",
            "next",
        ]

    def get_translated_description(self, obj):
        return self._get_translation(obj, "description")
    
    def get_translated_content(self, obj):
        return self._get_translation(obj, "content")
    
    def _blog_nav_data(self, blog):
        if not blog:
            return None

        return BlogNavSerializer(blog, context=self.context).data    
    def get_prev(self, obj):
        previous = (
            Blog.objects.filter(published_at__lt=obj.published_at, active=True)
            .order_by("-published_at")
            .first()
        )
        return self._blog_nav_data(previous)

    def get_next(self, obj):
        next_post = (
            Blog.objects.filter(published_at__gt=obj.published_at, active=True)
            .order_by("published_at")
            .first()
        )
        return self._blog_nav_data(next_post)
    
    def create(self, validated_data):
        blog, _ = Blog.objects.get_or_create(slug=validated_data["slug"])
        BlogTranslation.objects.update_or_create(
            blog=blog,
            language=validated_data["language"],
            defaults={"name": validated_data["name"]},
        )
        return blog

    def update(self, instance, validated_data):
        if "language" in validated_data and "name" in validated_data:
            Blog.objects.update_or_create(
                blog=instance,
                language=validated_data["language"],
                defaults={"name": validated_data["name"]},
            )
        return instance