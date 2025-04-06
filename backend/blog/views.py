from rest_framework import viewsets, views
from rest_framework.response import Response
from .models import Blog
from .serializers import BlogListSerializer, BlogRetrieveSerializer, BlogRecentSerializer
from .filters import BlogFilter
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny


class BlogViewSet(viewsets.ModelViewSet):
    http_method_names = ["get"]
    queryset = Blog.objects.prefetch_related(
        "topic", "tags", "author", "translations"
    ).order_by("slug")
    serializer_class = BlogRetrieveSerializer
    filterset_class = BlogFilter
    lookup_field = "slug"

    def get_queryset(self):
        if self.action == "retrieve":
            return self.queryset
        
        # Retrieve the most visited blog (if any) and exclude it from the recent blogs query
        most_visited = Blog.objects.filter(active=True).order_by("-visits").first()
        if most_visited:
            queryset = self.queryset.exclude(id=most_visited.id)

        filtered_queryset = BlogFilter(self.request.GET, queryset=queryset)
        if filtered_queryset.is_valid():
            return filtered_queryset.qs.distinct()
    
        return queryset

    def get_serializer_class(self):
        # Return different serializer depending on the action
        if self.action == "list":
            return BlogListSerializer  # Use list serializer for listing
        elif self.action == "retrieve":
            return BlogRetrieveSerializer  # Use retrieve serializer for single blog retrieval
        return (
            super().get_serializer_class()
        )  # Default serializer for other actions (e.g., create, update, delete)

    def get_permissions(self):
        if self.action in ["create", "update", "destroy"]:
            permission_classes = [
                IsAuthenticated,
                IsAdminUser,
            ]  # Admin only for Create, Update, Delete
        else:
            permission_classes = [AllowAny]  # Allow read (GET) for anyone
        return [permission() for permission in permission_classes]  # Everyone can read
    
    def retrieve(self, request, *args, **kwargs):
        """Override retrieve to increment views count when a blog is accessed."""
        blog = self.get_object()  # Get the blog instance based on the slug
        blog.increment_visits()  # Increment the visit count
        # Proceed with the normal retrieve behavior
        return super().retrieve(request, *args, **kwargs)


class RecentBlogsView(views.APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        # Retrieve the most visited blog (if any) and exclude it from the recent blogs query
        most_visited = Blog.objects.filter(active=True).order_by("-visits").first()
        queryset = Blog.objects.filter(active=True).order_by("-published_at")
        if most_visited:
            queryset = queryset.exclude(id=most_visited.id)
        recent_blogs = queryset[:5]
        serializer = BlogRecentSerializer(recent_blogs, many=True, context={"request": request})
        return Response(serializer.data)
    
class FeaturedBlogView(views.APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        most_visited = (
            Blog.objects.filter(active=True)
            .order_by("-visits").first()
        )
        serializer = BlogListSerializer(most_visited, context={"request": request})
        return Response(serializer.data)