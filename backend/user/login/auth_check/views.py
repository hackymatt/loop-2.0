from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView


class AuthCheckView(APIView):
    def get(self, request):
        authenticated = request.user.is_authenticated
        return Response({"authenticated": authenticated}, status=status.HTTP_200_OK)
