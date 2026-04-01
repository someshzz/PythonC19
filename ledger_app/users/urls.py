from rest_framework.routers import DefaultRouter

from .views import AccountViewSet, UserViewSet

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')
router.register(r'accounts', AccountViewSet, basename='account')

urlpatterns = router.urls
