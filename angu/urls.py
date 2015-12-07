from django.conf.urls import patterns, include, url

from angu.views import index

urlpatterns = patterns('angu',
    # Examples:
    # url(r'^$', 'mysite.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),
    url(r'^$', index),
)
