from rest_framework import generics
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Resume, ChatMessage, Assessment, Quiz, Review, Reward, Achievement, Course
from .serializers import (
    ResumeSerializer, ChatMessageSerializer, AssessmentSerializer,
    QuizSerializer, ReviewSerializer, RewardSerializer, AchievementSerializer, CourseSerializer
)

from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.reverse import reverse

@api_view(['GET'])
def api_root(request, format=None):
    return Response({
        'resume': reverse('resume-list', request=request, format=format),
        'chat': reverse('chat', request=request, format=format),
        'assessments': reverse('assessments', request=request, format=format),
        'quizzes': reverse('quizzes', request=request, format=format),
        'reviews': reverse('reviews', request=request, format=format),
        'reward': reverse('reward', args=[1], request=request, format=format), 
        'redeem-reward': reverse('redeem_reward', request=request, format=format),
        'achievements': reverse('achievements', request=request, format=format),
        'courses': reverse('courses', request=request, format=format),
    })

class ResumeListCreateView(generics.ListCreateAPIView):
    queryset = Resume.objects.all()
    serializer_class = ResumeSerializer

class ResumeDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Resume.objects.all()
    serializer_class = ResumeSerializer

class ChatMessageListView(generics.ListCreateAPIView):
    queryset = ChatMessage.objects.all()
    serializer_class = ChatMessageSerializer

class AssessmentListView(generics.ListAPIView):
    queryset = Assessment.objects.all()
    serializer_class = AssessmentSerializer

class QuizListView(generics.ListAPIView):
    queryset = Quiz.objects.all()
    serializer_class = QuizSerializer

class ReviewListView(generics.ListCreateAPIView):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer

class RewardDetailView(generics.RetrieveUpdateAPIView):
    queryset = Reward.objects.all()
    serializer_class = RewardSerializer

class AchievementListView(generics.ListAPIView):
    queryset = Achievement.objects.all()
    serializer_class = AchievementSerializer

class CourseListView(generics.ListAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer

class RedeemRewardView(APIView):
    def post(self, request):
        return Response({'status': 'Reward redeemed!'})
