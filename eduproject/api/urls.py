from django.urls import path
from . import views

urlpatterns = [

    path('', views.api_root, name='api_root'),

    path('resume/', views.CreateResumeView.as_view(), name='create_resume'),
    path('chat/', views.ChatMessageListView.as_view(), name='chat'),
    path('assessments/', views.AssessmentListView.as_view(), name='assessments'),
    path('quizzes/', views.QuizListView.as_view(), name='quizzes'),
    path('reviews/', views.ReviewListView.as_view(), name='reviews'),
    path('reward/<int:pk>/', views.RewardDetailView.as_view(), name='reward'),
    path('redeem-reward/', views.RedeemRewardView.as_view(), name='redeem_reward'),
    path('achievements/', views.AchievementListView.as_view(), name='achievements'),
    path('courses/', views.CourseListView.as_view(), name='courses'),
]
