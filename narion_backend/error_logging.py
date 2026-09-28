import logging

from django.utils.deprecation import MiddlewareMixin


logger = logging.getLogger("narion.errors")


class ExceptionLoggingMiddleware(MiddlewareMixin):
    def process_exception(self, request, exception):
        logger.exception(
            "Unhandled exception on %s %s",
            request.method,
            request.path,
            exc_info=(type(exception), exception, exception.__traceback__),
        )
        return None
