from django.shortcuts import render
from django.conf import settings

# Create your views here.
def index(request):
    # View code here... 
    if settings.DEBUG and request.META.get('HTTP_X_BS_SERVE') == 'angu':
        indexHtml = 'angu/.tmp/index.html'
    else:
        indexHtml = 'angu/index.html'
    return render(request, indexHtml, {"foo": "bar"})