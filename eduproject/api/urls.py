from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView,TokenObtainPairView
from .views import *

# Initialize Router
router = DefaultRouter()
router.register(r'register', RegisterViewSet, basename='register')
router.register(r'message', MessageViewSet, basename='message')

urlpatterns = [

    path("", include(router.urls)), 

    path("login/", TokenObtainPairView.as_view(), name="login"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("resume/", ResumeListCreateView.as_view(), name="resume-list"),
    path("resume/<int:pk>/", ResumeDetailView.as_view(), name="resume-detail"),

    path("reviews/", ReviewListView.as_view(), name="reviews"),

    # Rewards & Achievements
    path("reward/", RewardListView.as_view(), name="reward"),
    path("reward/<int:pk>/", RewardDetailView.as_view(), name="reward-detail"),
    path("achievements/", AchievementListView.as_view(), name="achievements"),
    path("achievements/<int:pk>/", AchievementDetailView.as_view(), name="achievements-detail"),

    # Courses
    path("courses/", CourseListView.as_view(), name="courses"),
]
