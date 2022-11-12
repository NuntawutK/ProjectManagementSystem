package service

import (
	"time"

	jwt "github.com/golang-jwt/jwt/v4"
)

// JwtWrapper wraps the signing key and the issuer
type JwtWrapper struct {
	SecretKey       string
	Issuer          string
	ExpirationHours int64
}

// JwtClaim adds user code as a claim to the token
type JwtClaim struct {
	UserPID string
	jwt.RegisteredClaims
}

// Generate Token generates a jwt token
func (j *JwtWrapper) GenerateToken(userPID string) (signedToken string, err error) {
	claims := &JwtClaim{
		UserPID: userPID,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Local().Add(time.Hour * time.Duration(j.ExpirationHours))),
			Issuer:    j.Issuer,
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	signedToken, err = token.SignedString([]byte(j.SecretKey))
	return signedToken, err
}

// Validate Token validates the jwt token
func (j *JwtWrapper) ValidateToken(signedToken string) (claims *JwtClaim, err error) {
	token, err := jwt.ParseWithClaims(
		signedToken,
		&JwtClaim{},
		func(token *jwt.Token) (interface{}, error) {
			return []byte(j.SecretKey), nil
		},
	)

	if err != nil {
		return nil, err
	}

	claims, ok := token.Claims.(*JwtClaim)

	if !ok || !token.Valid {
		return nil, err
	}

	return claims, nil
}
