package com.findspot.haroon.exceptions;

public class AuthenticationCredentialsNotFoundException extends RuntimeException {
    public AuthenticationCredentialsNotFoundException(String message) {
        super(message);
    }
}
