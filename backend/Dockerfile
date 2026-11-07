# ---------- build stage ----------
FROM maven:3.9-eclipse-temurin-25 AS build
WORKDIR /app

# cache dependencies first
COPY pom.xml .
RUN mvn -B -q dependency:go-offline

# build the jar
COPY src ./src
RUN mvn -B -q clean package -DskipTests

# ---------- runtime stage ----------
FROM eclipse-temurin:25-jre
WORKDIR /app

# run as non-root user
RUN groupadd --system app && useradd --system --gid app app

COPY --from=build /app/target/*.jar app.jar
USER app

ENV APP_PORT=8080 \
    JAVA_OPTS="-Xms256m -Xmx512m"

EXPOSE 8080

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]