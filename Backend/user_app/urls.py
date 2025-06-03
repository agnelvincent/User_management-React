from django.urls import path
from .views import *
urlpatterns = [
    path('signup/', SignupView.as_view(), name='signup'),
    path('login/', LoginView.as_view(), name='login'),
    path('admin/token/', AdminTokenObtainView.as_view(), name='admin_token'),
    path('admin/dashboard/', AdminDashboardView.as_view(), name='admin_dashboard'),
    path('user-profile/', UserProfileView.as_view(), name='user_profile'),
    path('admin/deleteUser/<int:user_id>/', delete_user, name='toggle_user_status'),
    path('admin/create-user/', admin_create_user, name='admin_create_user'),
    path('admin/updateUser/<int:user_id>/', admin_update_user, name='admin_update_user'),
  
]