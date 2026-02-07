# ---------- build stage ----------
FROM eclipse-temurin:21-jdk AS build
WORKDIR /app

# Copy only files needed to resolve deps first (better caching)
COPY gradlew gradlew.bat settings.gradle build.gradle ./
COPY gradle ./gradle

# Pre-download dependencies (will be cached if build files don't change)
RUN chmod +x ./gradlew && ./gradlew --no-daemon dependencies || true

# Copy source
COPY src ./src

# Build fat jar
RUN ./gradlew --no-daemon clean bootJar

# ---------- runtime stage ----------
FROM eclipse-temurin:21-jre
WORKDIR /app

# (Optional) run as non-root
RUN useradd -m appuser
USER appuser

# Copy jar from build stage
COPY --from=build /app/build/libs/*.jar app.jar

# Spring Boot default port for your app
EXPOSE 6000

# JVM options are tweakable via JAVA_OPTS env var
ENV JAVA_OPTS=""

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
