package com.mlbb2g209.healthinsurance.exception;

import com.mlbb2g209.healthinsurance.common.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.NoHandlerFoundException;

import java.time.LocalDateTime;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@ControllerAdvice
public class GlobalExceptionHandler {

    // Bean Validation failures (e.g. @NotNull, @Positive on a request DTO)
    // that a controller hasn't already handled locally.
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<ErrorDetails>> handleValidation(
            MethodArgumentNotValidException ex, WebRequest request) {

        String message = ex.getBindingResult().getFieldErrors().stream()
                .map(err -> err.getField() + ": " + err.getDefaultMessage())
                .collect(Collectors.joining("; "));

        return buildResponse(
                message.isEmpty() ? "Validation failed" : message,
                request,
                HttpStatus.BAD_REQUEST
        );
    }

    // Malformed JSON / unreadable request body.
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ApiResponse<ErrorDetails>> handleUnreadableBody(
            HttpMessageNotReadableException ex, WebRequest request) {
        return buildResponse("Malformed request body", request, HttpStatus.BAD_REQUEST);
    }

    // A generic fallback for "not found" style exceptions, in case a
    // teammate throws java.util.NoSuchElementException directly instead
    // of a custom exception class.
    @ExceptionHandler(NoSuchElementException.class)
    public ResponseEntity<ApiResponse<ErrorDetails>> handleNotFound(
            NoSuchElementException ex, WebRequest request) {
        return buildResponse(ex.getMessage(), request, HttpStatus.NOT_FOUND);
    }

    // Unknown URL / unsupported endpoint.
    @ExceptionHandler(NoHandlerFoundException.class)
    public ResponseEntity<ApiResponse<ErrorDetails>> handleNoHandler(
            NoHandlerFoundException ex, WebRequest request) {
        return buildResponse("No endpoint found for this request", request, HttpStatus.NOT_FOUND);
    }

    // True catch-all: anything genuinely unexpected still returns 500,
    // same as before.
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<ErrorDetails>> handleGlobalException(
            Exception ex, WebRequest request) {
        return buildResponse(
                "An internal error occurred: " + ex.getMessage(),
                request,
                HttpStatus.INTERNAL_SERVER_ERROR
        );
    }

    private ResponseEntity<ApiResponse<ErrorDetails>> buildResponse(
            String message, WebRequest request, HttpStatus status) {

        ErrorDetails errorDetails = new ErrorDetails(
                LocalDateTime.now(),
                message,
                request.getDescription(false),
                status.value()
        );

        ApiResponse<ErrorDetails> response = new ApiResponse<>(
                false,
                message,
                errorDetails,
                LocalDateTime.now()
        );

        return new ResponseEntity<>(response, status);
    }
}