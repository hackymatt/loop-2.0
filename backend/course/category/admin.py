from django.contrib import admin
from .models import CourseCategory, CourseCategoryTranslation

admin.site.register(CourseCategory)
admin.site.register(CourseCategoryTranslation)
